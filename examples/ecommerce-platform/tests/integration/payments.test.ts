import request from 'supertest';
import Stripe from 'stripe';
import { app } from '../../src/index';
import { database } from '../../src/config/database';
import { redis } from '../../src/config/redis';

// Mock Stripe
jest.mock('stripe');
const mockStripe = Stripe as jest.MockedClass<typeof Stripe>;

describe('Payment Integration Tests', () => {
  let server: any;
  let userToken: string;
  let userId: string;
  let orderId: string;
  let mockStripeInstance: jest.Mocked<Stripe>;

  beforeAll(async () => {
    // Setup test database
    await database.migrate.latest();
    await database.seed.run();

    // Create test user and get token
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });

    userToken = userResponse.body.token;
    userId = userResponse.body.user.id;

    // Create test order
    const orderResponse = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        items: [
          { productId: '123e4567-e89b-12d3-a456-426614174001', quantity: 2 }
        ]
      });

    orderId = orderResponse.body.order.id;

    // Mock Stripe instance
    mockStripeInstance = {
      paymentIntents: {
        create: jest.fn(),
        retrieve: jest.fn(),
      },
      webhooks: {
        constructEvent: jest.fn(),
      },
    } as any;

    mockStripe.mockImplementation(() => mockStripeInstance);
  });

  afterAll(async () => {
    await database.destroy();
    await redis.quit();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/payments/create-intent', () => {
    it('should create a payment intent successfully', async () => {
      const mockPaymentIntent = {
        id: 'pi_test_1234',
        client_secret: 'pi_test_1234_secret',
        amount: 2158, // $20.00 + tax + fees
        currency: 'usd',
        status: 'requires_payment_method',
        metadata: {
          orderId,
          userId,
          originalAmount: '2000',
          taxAmount: '160',
          processingFee: '88'
        }
      };

      mockStripeInstance.paymentIntents.create.mockResolvedValue(mockPaymentIntent as any);

      const response = await request(app)
        .post('/api/payments/create-intent')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          amount: 2000, // $20.00 in cents
          currency: 'usd',
          orderId,
          customerId: 'cus_test_customer'
        });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        clientSecret: 'pi_test_1234_secret',
        paymentIntentId: 'pi_test_1234',
        amount: 2158,
        currency: 'usd',
        breakdown: {
          subtotal: 2000,
          tax: 160,
          processingFee: 88,
          total: 2158
        }
      });

      // Verify Stripe was called correctly
      expect(mockStripeInstance.paymentIntents.create).toHaveBeenCalledWith({
        amount: 2158,
        currency: 'usd',
        customer: 'cus_test_customer',
        metadata: {
          orderId,
          userId,
          originalAmount: '2000',
          taxAmount: '160',
          processingFee: '88'
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Verify database record
      const paymentIntent = await database('payment_intents')
        .where({ id: 'pi_test_1234' })
        .first();

      expect(paymentIntent).toBeDefined();
      expect(paymentIntent.order_id).toBe(orderId);
      expect(paymentIntent.user_id).toBe(userId);
      expect(paymentIntent.amount).toBe(2158);

      // Verify Redis cache
      const cached = await redis.get('payment_intent:pi_test_1234');
      expect(JSON.parse(cached!)).toMatchObject({
        orderId,
        userId,
        amount: 2158,
        status: 'requires_payment_method'
      });
    });

    it('should reject invalid order', async () => {
      const response = await request(app)
        .post('/api/payments/create-intent')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          amount: 2000,
          currency: 'usd',
          orderId: '123e4567-e89b-12d3-a456-426614174999', // Non-existent order
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Order not found');
    });

    it('should validate minimum amount', async () => {
      const response = await request(app)
        .post('/api/payments/create-intent')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          amount: 25, // Below minimum
          currency: 'usd',
          orderId,
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toContain(
        expect.objectContaining({
          msg: 'Amount must be at least 50 cents'
        })
      );
    });

    it('should handle Stripe API errors', async () => {
      mockStripeInstance.paymentIntents.create.mockRejectedValue(
        new Error('Your card was declined.')
      );

      const response = await request(app)
        .post('/api/payments/create-intent')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          amount: 2000,
          currency: 'usd',
          orderId,
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to create payment intent');
      expect(response.body.message).toBe('Your card was declined.');
    });
  });

  describe('POST /api/payments/confirm/:paymentIntentId', () => {
    it('should confirm payment successfully', async () => {
      const paymentIntentId = 'pi_test_confirm_1234';
      
      // Setup database record
      await database('payment_intents').insert({
        id: paymentIntentId,
        order_id: orderId,
        user_id: userId,
        amount: 2158,
        currency: 'usd',
        status: 'requires_confirmation',
        client_secret: 'pi_test_confirm_1234_secret',
        created_at: new Date(),
        updated_at: new Date()
      });

      const mockConfirmedPayment = {
        id: paymentIntentId,
        amount: 2158,
        currency: 'usd',
        status: 'succeeded',
        payment_method: 'pm_test_card',
        metadata: {
          orderId,
          userId,
          originalAmount: '2000',
          taxAmount: '160',
          processingFee: '88'
        }
      };

      mockStripeInstance.paymentIntents.retrieve.mockResolvedValue(mockConfirmedPayment as any);

      const response = await request(app)
        .post(`/api/payments/confirm/${paymentIntentId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        paymentIntentId,
        status: 'succeeded',
        orderId
      });

      // Verify order was updated
      const order = await database('orders')
        .where({ id: orderId })
        .first();

      expect(order.status).toBe('paid');
      expect(order.paid_at).toBeDefined();

      // Verify payment record was created
      const payment = await database('payments')
        .where({ id: paymentIntentId })
        .first();

      expect(payment).toBeDefined();
      expect(payment.status).toBe('completed');
      expect(payment.amount).toBe(2158);
    });

    it('should reject unauthorized payment confirmation', async () => {
      const paymentIntentId = 'pi_test_unauthorized';
      
      const mockPayment = {
        id: paymentIntentId,
        status: 'succeeded',
        metadata: {
          orderId,
          userId: 'different-user-id',
        }
      };

      mockStripeInstance.paymentIntents.retrieve.mockResolvedValue(mockPayment as any);

      const response = await request(app)
        .post(`/api/payments/confirm/${paymentIntentId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Unauthorized access to payment intent');
    });
  });

  describe('POST /api/payments/webhook', () => {
    it('should handle payment_intent.succeeded webhook', async () => {
      const webhookPayload = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_webhook_test',
            status: 'succeeded',
            metadata: {
              orderId,
              userId
            }
          }
        }
      };

      mockStripeInstance.webhooks.constructEvent.mockReturnValue(webhookPayload as any);

      const response = await request(app)
        .post('/api/payments/webhook')
        .set('stripe-signature', 'test_signature')
        .send(JSON.stringify(webhookPayload));

      expect(response.status).toBe(200);
      expect(response.body.received).toBe(true);
    });

    it('should reject webhook with invalid signature', async () => {
      mockStripeInstance.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const response = await request(app)
        .post('/api/payments/webhook')
        .set('stripe-signature', 'invalid_signature')
        .send(JSON.stringify({}));

      expect(response.status).toBe(400);
      expect(response.text).toBe('Webhook signature verification failed');
    });
  });

  describe('GET /api/payments/history', () => {
    it('should return user payment history', async () => {
      // Create test payment records
      await database('payments').insert([
        {
          id: 'pi_history_1',
          order_id: orderId,
          user_id: userId,
          amount: 2158,
          currency: 'usd',
          status: 'completed',
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-01')
        },
        {
          id: 'pi_history_2',
          order_id: orderId,
          user_id: userId,
          amount: 1500,
          currency: 'usd',
          status: 'completed',
          created_at: new Date('2023-01-02'),
          updated_at: new Date('2023-01-02')
        }
      ]);

      const response = await request(app)
        .get('/api/payments/history')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.payments).toHaveLength(2);
      expect(response.body.pagination).toMatchObject({
        page: 1,
        limit: 20,
        total: 2,
        pages: 1
      });

      // Should be ordered by created_at desc
      expect(new Date(response.body.payments[0].created_at))
        .toBeAfter(new Date(response.body.payments[1].created_at));
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/payments/history?page=2&limit=1')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.pagination.page).toBe(2);
      expect(response.body.pagination.limit).toBe(1);
    });
  });

  describe('Performance Tests', () => {
    it('should handle concurrent payment intent creation', async () => {
      const concurrentRequests = 10;
      const promises = [];

      // Mock multiple successful responses
      mockStripeInstance.paymentIntents.create.mockImplementation(() => {
        return Promise.resolve({
          id: `pi_concurrent_${Date.now()}_${Math.random()}`,
          client_secret: 'test_secret',
          amount: 2158,
          currency: 'usd',
          status: 'requires_payment_method',
          metadata: { orderId, userId }
        } as any);
      });

      for (let i = 0; i < concurrentRequests; i++) {
        promises.push(
          request(app)
            .post('/api/payments/create-intent')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
              amount: 2000,
              currency: 'usd',
              orderId,
            })
        );
      }

      const startTime = Date.now();
      const responses = await Promise.all(promises);
      const endTime = Date.now();

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      // Should complete within reasonable time (5 seconds for 10 requests)
      expect(endTime - startTime).toBeLessThan(5000);
    });

    it('should maintain performance under load', async () => {
      const requestsPerSecond = 5;
      const durationSeconds = 5;
      const totalRequests = requestsPerSecond * durationSeconds;
      
      mockStripeInstance.paymentIntents.create.mockResolvedValue({
        id: 'pi_load_test',
        client_secret: 'test_secret',
        amount: 2158,
        currency: 'usd',
        status: 'requires_payment_method',
        metadata: { orderId, userId }
      } as any);

      let successCount = 0;
      const startTime = Date.now();

      for (let second = 0; second < durationSeconds; second++) {
        const secondStart = Date.now();
        const promises = [];

        for (let req = 0; req < requestsPerSecond; req++) {
          promises.push(
            request(app)
              .post('/api/payments/create-intent')
              .set('Authorization', `Bearer ${userToken}`)
              .send({
                amount: 2000,
                currency: 'usd',
                orderId,
              })
              .then(res => res.status === 200 ? 1 : 0)
              .catch(() => 0)
          );
        }

        const results = await Promise.all(promises);
        successCount += results.reduce((sum, result) => sum + result, 0);

        // Wait for next second
        const elapsed = Date.now() - secondStart;
        if (elapsed < 1000) {
          await new Promise(resolve => setTimeout(resolve, 1000 - elapsed));
        }
      }

      const successRate = successCount / totalRequests;
      expect(successRate).toBeGreaterThan(0.95); // 95% success rate

      const totalTime = Date.now() - startTime;
      expect(totalTime).toBeLessThan((durationSeconds + 1) * 1000); // Allow 1 second buffer
    });
  });
});