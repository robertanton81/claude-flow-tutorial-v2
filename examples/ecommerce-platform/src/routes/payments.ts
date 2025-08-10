import express from 'express';
import Stripe from 'stripe';
import { body, param, validationResult } from 'express-validator';
import { logger } from '../config/logger';
import { database } from '../config/database';
import { redis } from '../config/redis';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Create Payment Intent
router.post('/create-intent',
  [
    body('amount').isInt({ min: 50 }).withMessage('Amount must be at least 50 cents'),
    body('currency').isIn(['usd', 'eur', 'gbp']).withMessage('Invalid currency'),
    body('orderId').isUUID().withMessage('Invalid order ID'),
    body('customerId').optional().isUUID().withMessage('Invalid customer ID')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { amount, currency, orderId, customerId } = req.body;
      const userId = req.user?.id;

      // Verify order exists and belongs to user
      const order = await database('orders')
        .where({ id: orderId, user_id: userId })
        .first();

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.status !== 'pending') {
        return res.status(400).json({ error: 'Order is not in pending status' });
      }

      // Calculate tax and fees
      const taxRate = parseFloat(process.env.TAX_RATE || '0.08');
      const processingFee = Math.round(amount * 0.029) + 30; // Stripe fee
      const taxAmount = Math.round(amount * taxRate);
      const totalAmount = amount + taxAmount + processingFee;

      // Create Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency,
        customer: customerId,
        metadata: {
          orderId,
          userId: userId!,
          originalAmount: amount.toString(),
          taxAmount: taxAmount.toString(),
          processingFee: processingFee.toString()
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Store payment intent in database
      await database('payment_intents').insert({
        id: paymentIntent.id,
        order_id: orderId,
        user_id: userId,
        amount: totalAmount,
        currency,
        status: paymentIntent.status,
        client_secret: paymentIntent.client_secret,
        created_at: new Date(),
        updated_at: new Date()
      });

      // Cache payment intent for quick access
      await redis.setex(
        `payment_intent:${paymentIntent.id}`,
        3600,
        JSON.stringify({
          orderId,
          userId,
          amount: totalAmount,
          status: paymentIntent.status
        })
      );

      logger.info(`Payment intent created: ${paymentIntent.id} for order: ${orderId}`);

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: totalAmount,
        currency,
        breakdown: {
          subtotal: amount,
          tax: taxAmount,
          processingFee,
          total: totalAmount
        }
      });

    } catch (error) {
      logger.error('Error creating payment intent:', error);
      res.status(500).json({
        error: 'Failed to create payment intent',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Confirm Payment
router.post('/confirm/:paymentIntentId',
  [
    param('paymentIntentId').notEmpty().withMessage('Payment Intent ID is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { paymentIntentId } = req.params;
      const userId = req.user?.id;

      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.metadata.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized access to payment intent' });
      }

      // Update payment intent status in database
      await database('payment_intents')
        .where({ id: paymentIntentId })
        .update({
          status: paymentIntent.status,
          updated_at: new Date()
        });

      if (paymentIntent.status === 'succeeded') {
        const orderId = paymentIntent.metadata.orderId;

        // Update order status
        await database('orders')
          .where({ id: orderId })
          .update({
            status: 'paid',
            paid_at: new Date(),
            updated_at: new Date()
          });

        // Create payment record
        await database('payments').insert({
          id: paymentIntent.id,
          order_id: orderId,
          user_id: userId,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          payment_method: paymentIntent.payment_method,
          status: 'completed',
          stripe_payment_intent_id: paymentIntent.id,
          created_at: new Date(),
          updated_at: new Date()
        });

        // Update inventory
        const orderItems = await database('order_items')
          .where({ order_id: orderId });

        for (const item of orderItems) {
          await database('products')
            .where({ id: item.product_id })
            .decrement('inventory_count', item.quantity);

          // Emit real-time inventory update
          const io = req.app.get('io');
          io.to(`inventory:${item.product_id}`).emit('inventory_updated', {
            productId: item.product_id,
            quantityReduced: item.quantity
          });
        }

        // Send order confirmation email (implement email service)
        // await emailService.sendOrderConfirmation(userId, orderId);

        logger.info(`Payment confirmed for order: ${orderId}, amount: ${paymentIntent.amount}`);
      }

      // Update cache
      await redis.setex(
        `payment_intent:${paymentIntentId}`,
        3600,
        JSON.stringify({
          orderId: paymentIntent.metadata.orderId,
          userId,
          amount: paymentIntent.amount,
          status: paymentIntent.status
        })
      );

      res.json({
        paymentIntentId,
        status: paymentIntent.status,
        orderId: paymentIntent.metadata.orderId
      });

    } catch (error) {
      logger.error('Error confirming payment:', error);
      res.status(500).json({
        error: 'Failed to confirm payment',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Webhook endpoint for Stripe events
router.post('/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !endpointSecret) {
      return res.status(400).send('Missing signature or endpoint secret');
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      logger.error('Webhook signature verification failed:', err);
      return res.status(400).send('Webhook signature verification failed');
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(failedPayment);
        break;

      case 'charge.dispute.created':
        const dispute = event.data.object as Stripe.Dispute;
        await handleDispute(dispute);
        break;

      default:
        logger.info(`Unhandled webhook event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);

// Helper functions
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;
    
    // Update order status if not already updated
    await database('orders')
      .where({ id: orderId, status: 'pending' })
      .update({
        status: 'paid',
        paid_at: new Date(),
        updated_at: new Date()
      });

    logger.info(`Webhook: Payment succeeded for order ${orderId}`);
  } catch (error) {
    logger.error('Error handling payment success webhook:', error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;
    
    await database('orders')
      .where({ id: orderId })
      .update({
        status: 'payment_failed',
        updated_at: new Date()
      });

    logger.info(`Webhook: Payment failed for order ${orderId}`);
  } catch (error) {
    logger.error('Error handling payment failure webhook:', error);
  }
}

async function handleDispute(dispute: Stripe.Dispute) {
  try {
    const chargeId = dispute.charge;
    
    // Log dispute for manual review
    await database('disputes').insert({
      id: dispute.id,
      charge_id: chargeId,
      amount: dispute.amount,
      reason: dispute.reason,
      status: dispute.status,
      created_at: new Date()
    });

    logger.warn(`Webhook: Dispute created for charge ${chargeId}`);
  } catch (error) {
    logger.error('Error handling dispute webhook:', error);
  }
}

// Get payment history
router.get('/history',
  async (req, res) => {
    try {
      const userId = req.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = (page - 1) * limit;

      const payments = await database('payments')
        .join('orders', 'payments.order_id', 'orders.id')
        .where('payments.user_id', userId)
        .select(
          'payments.id',
          'payments.amount',
          'payments.currency',
          'payments.status',
          'payments.created_at',
          'orders.order_number',
          'orders.total_amount'
        )
        .orderBy('payments.created_at', 'desc')
        .limit(limit)
        .offset(offset);

      const total = await database('payments')
        .where('user_id', userId)
        .count('id as count')
        .first();

      res.json({
        payments,
        pagination: {
          page,
          limit,
          total: parseInt(total?.count as string || '0'),
          pages: Math.ceil(parseInt(total?.count as string || '0') / limit)
        }
      });

    } catch (error) {
      logger.error('Error fetching payment history:', error);
      res.status(500).json({ error: 'Failed to fetch payment history' });
    }
  }
);

export default router;