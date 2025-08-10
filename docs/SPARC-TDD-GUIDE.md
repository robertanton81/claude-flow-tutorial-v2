# SPARC Test-Driven Development (TDD) Guide

## Table of Contents

1. [Introduction to TDD with SPARC](#introduction-to-tdd-with-sparc)
2. [Red-Green-Refactor in Detail](#red-green-refactor-in-detail)
3. [London School vs Classic TDD Approaches](#london-school-vs-classic-tdd-approaches)
4. [Mock-Driven Development with SPARC](#mock-driven-development-with-sparc)
5. [Test Patterns and Anti-Patterns](#test-patterns-and-anti-patterns)
6. [Parallel Test Execution Strategies](#parallel-test-execution-strategies)
7. [Integration with CI/CD](#integration-with-cicd)
8. [Real-World TDD Examples](#real-world-tdd-examples)
9. [Common TDD Mistakes and Solutions](#common-tdd-mistakes-and-solutions)
10. [Performance Testing with TDD](#performance-testing-with-tdd)

## Introduction to TDD with SPARC

Test-Driven Development within the SPARC methodology emphasizes **test-first design** during the Refinement phase, but its principles influence every stage of the development process.

### SPARC-TDD Integration

```mermaid
graph TD
    A[Specification] --> B[Pseudocode]
    B --> C[Architecture]
    C --> D[Refinement - TDD]
    D --> E[Completion]
    
    D --> D1[Red: Write Failing Test]
    D1 --> D2[Green: Make Test Pass]
    D2 --> D3[Refactor: Improve Code]
    D3 --> D1
```

### Core TDD Principles in SPARC

1. **Write tests before code** (Red phase)
2. **Write minimal code to pass tests** (Green phase)
3. **Refactor with confidence** (Refactor phase)
4. **Design through tests** (Architecture influence)
5. **Document behavior through tests** (Living specification)

### SPARC Command Integration

```bash
# Complete TDD workflow
npx claude-flow sparc tdd "user authentication system"

# Specific TDD phases
npx claude-flow sparc run tdd-red "login validation"
npx claude-flow sparc run tdd-green "login validation"
npx claude-flow sparc run tdd-refactor "login validation"

# Batch TDD operations
npx claude-flow sparc batch "tdd-red,tdd-green,tdd-refactor" "payment processing"
```

## Red-Green-Refactor in Detail

### The Red Phase: Failing Tests First

The Red phase is about **defining behavior before implementation**. This phase should fail for the right reasons.

#### Red Phase Checklist

```typescript
// ❌ Test should fail because method doesn't exist
describe('UserService', () => {
  it('should create user with valid data', async () => {
    // Arrange
    const userData = {
      email: 'test@example.com',
      password: 'SecurePass123!'
    };
    const userService = new UserService();
    
    // Act & Assert - This should fail because createUser doesn't exist
    const result = await userService.createUser(userData);
    expect(result.success).toBe(true);
    expect(result.user.id).toBeDefined();
  });
});
```

#### Red Phase Best Practices

1. **Write the test you wish you had**
2. **Focus on the API you want to use**
3. **Don't worry about implementation details**
4. **Ensure tests fail for the right reason**

```typescript
// Good Red Phase Example
describe('PaymentProcessor', () => {
  it('should process credit card payment successfully', async () => {
    const processor = new PaymentProcessor();
    const paymentData = {
      amount: 100.00,
      currency: 'USD',
      card: {
        number: '4111111111111111',
        expiry: '12/25',
        cvv: '123'
      }
    };
    
    // This defines the interface we want
    const result = await processor.processPayment(paymentData);
    
    expect(result.success).toBe(true);
    expect(result.transactionId).toBeDefined();
    expect(result.amount).toBe(100.00);
  });
});
```

### The Green Phase: Minimal Implementation

The Green phase focuses on **making the test pass with the simplest possible solution**.

#### Green Phase Implementation

```typescript
// Minimal implementation to make the test pass
class PaymentProcessor {
  async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    // Hardcoded response to make test green
    return {
      success: true,
      transactionId: 'txn_123456789',
      amount: paymentData.amount
    };
  }
}
```

#### Green Phase Principles

1. **Write only enough code to pass the test**
2. **Hardcode values if necessary**
3. **Don't add features not covered by tests**
4. **Focus on making tests green, not perfect code**

#### Evolutionary Green Phase

```typescript
// Test 1: Basic success case (already passing)

// Test 2: Add validation
it('should reject invalid card numbers', async () => {
  const processor = new PaymentProcessor();
  const invalidPaymentData = {
    amount: 100.00,
    currency: 'USD',
    card: {
      number: '1234', // Invalid card
      expiry: '12/25',
      cvv: '123'
    }
  };
  
  const result = await processor.processPayment(invalidPaymentData);
  
  expect(result.success).toBe(false);
  expect(result.error).toBe('Invalid card number');
});

// Updated implementation to pass both tests
class PaymentProcessor {
  async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    // Add minimal validation
    if (paymentData.card.number.length < 13) {
      return {
        success: false,
        error: 'Invalid card number'
      };
    }
    
    return {
      success: true,
      transactionId: 'txn_123456789',
      amount: paymentData.amount
    };
  }
}
```

### The Refactor Phase: Improving Code Quality

The Refactor phase is about **improving code quality without changing behavior**.

#### Refactor Phase Goals

1. **Remove duplication**
2. **Improve readability**
3. **Extract methods/classes**
4. **Improve performance**
5. **Maintain all passing tests**

#### Before Refactoring

```typescript
class PaymentProcessor {
  async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    // Validation logic mixed with processing logic
    if (paymentData.card.number.length < 13) {
      return { success: false, error: 'Invalid card number' };
    }
    if (paymentData.card.number.length > 19) {
      return { success: false, error: 'Invalid card number' };
    }
    if (!/^\d+$/.test(paymentData.card.number)) {
      return { success: false, error: 'Invalid card number' };
    }
    if (paymentData.amount <= 0) {
      return { success: false, error: 'Invalid amount' };
    }
    if (!paymentData.currency || paymentData.currency.length !== 3) {
      return { success: false, error: 'Invalid currency' };
    }
    
    // Processing logic
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      transactionId,
      amount: paymentData.amount
    };
  }
}
```

#### After Refactoring

```typescript
class PaymentProcessor {
  private validator: PaymentValidator;
  private transactionGenerator: TransactionGenerator;
  
  constructor() {
    this.validator = new PaymentValidator();
    this.transactionGenerator = new TransactionGenerator();
  }
  
  async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    // Separated concerns
    const validationResult = this.validator.validate(paymentData);
    if (!validationResult.isValid) {
      return { success: false, error: validationResult.error };
    }
    
    const transactionId = this.transactionGenerator.generate();
    
    return {
      success: true,
      transactionId,
      amount: paymentData.amount
    };
  }
}

class PaymentValidator {
  validate(paymentData: PaymentData): ValidationResult {
    if (!this.isValidCardNumber(paymentData.card.number)) {
      return { isValid: false, error: 'Invalid card number' };
    }
    
    if (!this.isValidAmount(paymentData.amount)) {
      return { isValid: false, error: 'Invalid amount' };
    }
    
    if (!this.isValidCurrency(paymentData.currency)) {
      return { isValid: false, error: 'Invalid currency' };
    }
    
    return { isValid: true };
  }
  
  private isValidCardNumber(cardNumber: string): boolean {
    return cardNumber.length >= 13 && 
           cardNumber.length <= 19 && 
           /^\d+$/.test(cardNumber);
  }
  
  private isValidAmount(amount: number): boolean {
    return amount > 0;
  }
  
  private isValidCurrency(currency: string): boolean {
    return currency && currency.length === 3;
  }
}
```

## London School vs Classic TDD Approaches

### Classic TDD (Detroit School)

The Classic approach focuses on **state verification** and **real objects**.

#### Classic TDD Characteristics

1. **State-based testing**
2. **Minimal mocking**
3. **Real objects when possible**
4. **Bottom-up approach**

```typescript
// Classic TDD Example
describe('BankAccount (Classic)', () => {
  it('should increase balance when depositing money', () => {
    // Arrange
    const account = new BankAccount(100); // Real object
    
    // Act
    account.deposit(50);
    
    // Assert - State verification
    expect(account.getBalance()).toBe(150);
  });
  
  it('should decrease balance when withdrawing money', () => {
    const account = new BankAccount(100);
    
    account.withdraw(30);
    
    expect(account.getBalance()).toBe(70);
  });
  
  it('should prevent overdraft', () => {
    const account = new BankAccount(50);
    
    expect(() => account.withdraw(100)).toThrow('Insufficient funds');
    expect(account.getBalance()).toBe(50);
  });
});
```

### London School (Mockist)

The London approach focuses on **behavior verification** and **mocked dependencies**.

#### London School Characteristics

1. **Interaction-based testing**
2. **Mock all dependencies**
3. **Focus on object collaboration**
4. **Outside-in approach**

```typescript
// London School Example
describe('PaymentService (London)', () => {
  let mockPaymentGateway: jest.Mocked<PaymentGateway>;
  let mockNotificationService: jest.Mocked<NotificationService>;
  let mockAuditLogger: jest.Mocked<AuditLogger>;
  let paymentService: PaymentService;
  
  beforeEach(() => {
    mockPaymentGateway = createMock<PaymentGateway>();
    mockNotificationService = createMock<NotificationService>();
    mockAuditLogger = createMock<AuditLogger>();
    
    paymentService = new PaymentService(
      mockPaymentGateway,
      mockNotificationService,
      mockAuditLogger
    );
  });
  
  it('should coordinate payment processing workflow', async () => {
    // Arrange
    const paymentRequest = createPaymentRequest();
    const expectedGatewayResponse = { success: true, transactionId: 'txn_123' };
    
    mockPaymentGateway.processPayment.mockResolvedValue(expectedGatewayResponse);
    
    // Act
    await paymentService.processPayment(paymentRequest);
    
    // Assert - Behavior verification
    expect(mockPaymentGateway.processPayment).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: paymentRequest.amount,
        currency: paymentRequest.currency
      })
    );
    
    expect(mockNotificationService.sendConfirmation).toHaveBeenCalledWith(
      paymentRequest.customerId,
      'txn_123'
    );
    
    expect(mockAuditLogger.logTransaction).toHaveBeenCalledWith({
      type: 'payment_processed',
      transactionId: 'txn_123',
      amount: paymentRequest.amount
    });
  });
});
```

### Choosing the Right Approach

| Aspect | Classic TDD | London TDD |
|--------|-------------|------------|
| **Focus** | State changes | Object interactions |
| **Mocking** | Minimal | Extensive |
| **Design** | Bottom-up | Outside-in |
| **Feedback** | Slower | Faster |
| **Refactoring** | Easier | Requires mock updates |
| **Best for** | Algorithms, calculations | Workflows, orchestration |

### SPARC Integration Recommendations

```typescript
// Use Classic TDD for algorithms and business logic
describe('PasswordStrengthCalculator', () => {
  it('should calculate strength based on complexity', () => {
    const calculator = new PasswordStrengthCalculator();
    
    expect(calculator.calculate('weak')).toBe(1);
    expect(calculator.calculate('Str0ng!')).toBe(4);
  });
});

// Use London TDD for service orchestration
describe('UserRegistrationService', () => {
  it('should orchestrate user registration workflow', async () => {
    const service = new UserRegistrationService(
      mockUserRepository,
      mockEmailService,
      mockAuditLogger
    );
    
    await service.register(userData);
    
    expect(mockUserRepository.save).toHaveBeenCalledWith(userData);
    expect(mockEmailService.sendWelcome).toHaveBeenCalledWith(userData.email);
    expect(mockAuditLogger.log).toHaveBeenCalledWith('user_registered');
  });
});
```

## Mock-Driven Development with SPARC

Mock-driven development in SPARC focuses on **designing interfaces through mocks** and **driving implementation from contracts**.

### Mock Strategy in SPARC

```typescript
// 1. Start with the interface you want
interface PaymentGateway {
  processPayment(request: PaymentRequest): Promise<PaymentResponse>;
  refundPayment(transactionId: string): Promise<RefundResponse>;
}

// 2. Create comprehensive mocks
const createPaymentGatewayMock = (): jest.Mocked<PaymentGateway> => ({
  processPayment: jest.fn(),
  refundPayment: jest.fn()
});

// 3. Design through mock expectations
describe('PaymentService', () => {
  it('should handle successful payment flow', async () => {
    const mockGateway = createPaymentGatewayMock();
    const service = new PaymentService(mockGateway);
    
    // Define the contract through expectations
    mockGateway.processPayment.mockResolvedValue({
      success: true,
      transactionId: 'txn_123',
      amount: 100.00
    });
    
    const result = await service.processPayment(paymentRequest);
    
    expect(mockGateway.processPayment).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 100.00,
        currency: 'USD',
        merchantId: 'merchant_123'
      })
    );
    
    expect(result.success).toBe(true);
  });
});
```

### Advanced Mocking Patterns

#### 1. Mock Builders for Complex Objects

```typescript
class PaymentRequestBuilder {
  private request: Partial<PaymentRequest> = {};
  
  withAmount(amount: number): PaymentRequestBuilder {
    this.request.amount = amount;
    return this;
  }
  
  withCurrency(currency: string): PaymentRequestBuilder {
    this.request.currency = currency;
    return this;
  }
  
  withCard(card: CreditCard): PaymentRequestBuilder {
    this.request.card = card;
    return this;
  }
  
  build(): PaymentRequest {
    return {
      amount: 0,
      currency: 'USD',
      card: createDefaultCard(),
      ...this.request
    } as PaymentRequest;
  }
}

// Usage in tests
const paymentRequest = new PaymentRequestBuilder()
  .withAmount(250.00)
  .withCurrency('EUR')
  .withCard(createPremiumCard())
  .build();
```

#### 2. Smart Mocks with Realistic Behavior

```typescript
class SmartPaymentGatewayMock {
  private transactionCounter = 1000;
  
  processPayment = jest.fn().mockImplementation((request: PaymentRequest) => {
    // Simulate realistic behavior
    if (request.amount > 10000) {
      return Promise.resolve({
        success: false,
        error: 'Amount exceeds limit',
        errorCode: 'AMOUNT_LIMIT_EXCEEDED'
      });
    }
    
    if (request.card.number === '4000000000000002') {
      return Promise.resolve({
        success: false,
        error: 'Card declined',
        errorCode: 'CARD_DECLINED'
      });
    }
    
    return Promise.resolve({
      success: true,
      transactionId: `txn_${this.transactionCounter++}`,
      amount: request.amount,
      processingTime: Math.random() * 1000 + 500 // 500-1500ms
    });
  });
}
```

#### 3. Contract Testing with Mocks

```typescript
// Define contracts that real implementations must satisfy
const PaymentGatewayContract = {
  processPayment: {
    description: 'Process a payment request',
    input: PaymentRequestSchema,
    output: PaymentResponseSchema,
    errors: ['INVALID_CARD', 'INSUFFICIENT_FUNDS', 'GATEWAY_ERROR']
  }
};

// Test contract compliance
describe('PaymentGateway Contract', () => {
  const testCases = [
    {
      name: 'Stripe Gateway',
      implementation: () => new StripePaymentGateway()
    },
    {
      name: 'PayPal Gateway', 
      implementation: () => new PayPalPaymentGateway()
    },
    {
      name: 'Mock Gateway',
      implementation: () => new SmartPaymentGatewayMock()
    }
  ];
  
  testCases.forEach(testCase => {
    describe(testCase.name, () => {
      let gateway: PaymentGateway;
      
      beforeEach(() => {
        gateway = testCase.implementation();
      });
      
      it('should satisfy payment processing contract', async () => {
        const request = createValidPaymentRequest();
        const response = await gateway.processPayment(request);
        
        expect(response).toMatchSchema(PaymentResponseSchema);
        expect(typeof response.success).toBe('boolean');
        
        if (response.success) {
          expect(response.transactionId).toBeDefined();
          expect(response.amount).toBe(request.amount);
        } else {
          expect(response.error).toBeDefined();
          expect(PaymentGatewayContract.processPayment.errors)
            .toContain(response.errorCode);
        }
      });
    });
  });
});
```

### Mock Lifecycle Management

```typescript
describe('OrderService', () => {
  let mockInventory: jest.Mocked<InventoryService>;
  let mockPayment: jest.Mocked<PaymentService>;
  let mockShipping: jest.Mocked<ShippingService>;
  let orderService: OrderService;
  
  beforeEach(() => {
    // Fresh mocks for each test
    mockInventory = createMock<InventoryService>();
    mockPayment = createMock<PaymentService>();
    mockShipping = createMock<ShippingService>();
    
    orderService = new OrderService(mockInventory, mockPayment, mockShipping);
  });
  
  afterEach(() => {
    // Verify all expected interactions occurred
    jest.clearAllMocks();
  });
  
  it('should coordinate order fulfillment', async () => {
    // Setup mock chain
    mockInventory.checkAvailability.mockResolvedValue(true);
    mockInventory.reserve.mockResolvedValue('reservation_123');
    mockPayment.processPayment.mockResolvedValue({ 
      success: true, 
      transactionId: 'txn_456' 
    });
    mockShipping.scheduleDelivery.mockResolvedValue('shipment_789');
    
    const order = createTestOrder();
    
    const result = await orderService.fulfillOrder(order);
    
    // Verify interaction order
    expect(mockInventory.checkAvailability).toHaveBeenCalledBefore(
      mockInventory.reserve
    );
    expect(mockInventory.reserve).toHaveBeenCalledBefore(
      mockPayment.processPayment
    );
    expect(mockPayment.processPayment).toHaveBeenCalledBefore(
      mockShipping.scheduleDelivery
    );
    
    expect(result.success).toBe(true);
  });
});
```

## Test Patterns and Anti-Patterns

### Essential Test Patterns

#### 1. Arrange-Act-Assert (AAA) Pattern

```typescript
describe('UserService', () => {
  it('should create user with valid data', async () => {
    // Arrange - Set up test conditions
    const userData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe'
    };
    const mockRepository = createMock<UserRepository>();
    const service = new UserService(mockRepository);
    
    mockRepository.save.mockResolvedValue({
      id: 'user_123',
      ...userData,
      createdAt: new Date()
    });
    
    // Act - Execute the behavior under test
    const result = await service.createUser(userData);
    
    // Assert - Verify the outcomes
    expect(result.success).toBe(true);
    expect(result.user.id).toBe('user_123');
    expect(mockRepository.save).toHaveBeenCalledWith(userData);
  });
});
```

#### 2. Given-When-Then Pattern (BDD Style)

```typescript
describe('Password Reset Feature', () => {
  describe('Given a user with valid email', () => {
    let userService: UserService;
    let mockEmailService: jest.Mocked<EmailService>;
    let mockUserRepository: jest.Mocked<UserRepository>;
    
    beforeEach(() => {
      mockEmailService = createMock<EmailService>();
      mockUserRepository = createMock<UserRepository>();
      userService = new UserService(mockUserRepository, mockEmailService);
      
      // Given
      mockUserRepository.findByEmail.mockResolvedValue({
        id: 'user_123',
        email: 'test@example.com',
        verified: true
      });
    });
    
    describe('When requesting password reset', () => {
      let result: PasswordResetResult;
      
      beforeEach(async () => {
        // When
        result = await userService.requestPasswordReset('test@example.com');
      });
      
      it('Then should send reset email', () => {
        expect(mockEmailService.sendPasswordReset).toHaveBeenCalledWith(
          'test@example.com',
          expect.any(String) // reset token
        );
      });
      
      it('Then should return success response', () => {
        expect(result.success).toBe(true);
        expect(result.message).toBe('Password reset email sent');
      });
    });
  });
});
```

#### 3. Test Data Builders Pattern

```typescript
class OrderBuilder {
  private order: Partial<Order> = {
    items: [],
    status: 'pending'
  };
  
  withCustomer(customerId: string): OrderBuilder {
    this.order.customerId = customerId;
    return this;
  }
  
  withItem(productId: string, quantity: number, price: number): OrderBuilder {
    this.order.items!.push({ productId, quantity, price });
    return this;
  }
  
  withShippingAddress(address: Address): OrderBuilder {
    this.order.shippingAddress = address;
    return this;
  }
  
  withTotal(total: number): OrderBuilder {
    this.order.total = total;
    return this;
  }
  
  build(): Order {
    return {
      id: `order_${Date.now()}`,
      customerId: 'customer_123',
      items: [],
      total: 0,
      status: 'pending',
      createdAt: new Date(),
      ...this.order
    } as Order;
  }
}

// Usage
const order = new OrderBuilder()
  .withCustomer('premium_customer_456')
  .withItem('product_1', 2, 49.99)
  .withItem('product_2', 1, 99.99)
  .withTotal(199.97)
  .build();
```

#### 4. Page Object Pattern for Integration Tests

```typescript
class LoginPage {
  constructor(private page: Page) {}
  
  async enterEmail(email: string): Promise<void> {
    await this.page.fill('[data-testid=email-input]', email);
  }
  
  async enterPassword(password: string): Promise<void> {
    await this.page.fill('[data-testid=password-input]', password);
  }
  
  async clickLogin(): Promise<void> {
    await this.page.click('[data-testid=login-button]');
  }
  
  async getErrorMessage(): Promise<string> {
    return await this.page.textContent('[data-testid=error-message]') || '';
  }
  
  async login(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLogin();
  }
}

// Usage in tests
describe('Login Integration', () => {
  let page: Page;
  let loginPage: LoginPage;
  
  beforeEach(async () => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    await page.goto('/login');
  });
  
  it('should display error for invalid credentials', async () => {
    await loginPage.login('invalid@example.com', 'wrongpassword');
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe('Invalid email or password');
  });
});
```

### Common Anti-Patterns to Avoid

#### 1. ❌ Testing Implementation Details

```typescript
// BAD - Testing internal implementation
it('should call private validation method', () => {
  const service = new UserService();
  const spy = jest.spyOn(service as any, '_validateEmail');
  
  service.createUser({ email: 'test@example.com' });
  
  expect(spy).toHaveBeenCalled(); // Testing implementation, not behavior
});

// GOOD - Testing public behavior
it('should reject user creation with invalid email', async () => {
  const service = new UserService();
  
  const result = await service.createUser({ email: 'invalid-email' });
  
  expect(result.success).toBe(false);
  expect(result.error).toBe('Invalid email format');
});
```

#### 2. ❌ Brittle Tests Due to Over-Mocking

```typescript
// BAD - Mocking everything makes tests brittle
it('should process order', async () => {
  const mockDate = jest.spyOn(Date, 'now').mockReturnValue(1234567890);
  const mockMath = jest.spyOn(Math, 'random').mockReturnValue(0.5);
  const mockConsole = jest.spyOn(console, 'log').mockImplementation();
  
  // Test becomes fragile to any internal changes
});

// GOOD - Mock only external dependencies
it('should process order', async () => {
  const mockPaymentService = createMock<PaymentService>();
  const orderService = new OrderService(mockPaymentService);
  
  mockPaymentService.processPayment.mockResolvedValue({ success: true });
  
  const result = await orderService.processOrder(validOrder);
  expect(result.success).toBe(true);
});
```

#### 3. ❌ Mystery Guest Anti-Pattern

```typescript
// BAD - Unclear where test data comes from
describe('UserService', () => {
  it('should create user', async () => {
    const result = await userService.createUser(globalTestUser);
    expect(result.success).toBe(true);
  });
});

// GOOD - Clear test data setup
describe('UserService', () => {
  it('should create user with valid data', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe'
    };
    
    const result = await userService.createUser(userData);
    expect(result.success).toBe(true);
  });
});
```

#### 4. ❌ Assertion Roulette

```typescript
// BAD - Multiple unrelated assertions
it('should handle user operations', async () => {
  const user = await createUser();
  const order = await createOrder();
  const payment = await processPayment();
  
  expect(user.id).toBeDefined();
  expect(order.total).toBe(100);
  expect(payment.success).toBe(true); // Which assertion failed?
});

// GOOD - One logical assertion per test
it('should create user with generated ID', async () => {
  const user = await createUser();
  expect(user.id).toBeDefined();
});

it('should calculate correct order total', async () => {
  const order = await createOrder();
  expect(order.total).toBe(100);
});

it('should process payment successfully', async () => {
  const payment = await processPayment();
  expect(payment.success).toBe(true);
});
```

## Parallel Test Execution Strategies

### Jest Parallel Configuration

```javascript
// jest.config.js
module.exports = {
  // Run tests in parallel across multiple workers
  maxWorkers: '50%', // Use 50% of available CPU cores
  
  // Test runner optimizations
  testRunner: 'jest-circus/runner',
  
  // File organization for parallel execution
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.{js,ts}',
    '<rootDir>/tests/integration/**/*.test.{js,ts}',
    '<rootDir>/tests/e2e/**/*.test.{js,ts}'
  ],
  
  // Separate configurations for different test types
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/unit/**/*.test.{js,ts}'],
      maxWorkers: '100%' // Unit tests can use all cores
    },
    {
      displayName: 'integration', 
      testMatch: ['<rootDir>/tests/integration/**/*.test.{js,ts}'],
      maxWorkers: 2, // Limit integration tests due to resource usage
      setupFilesAfterEnv: ['<rootDir>/tests/setup/integration.ts']
    },
    {
      displayName: 'e2e',
      testMatch: ['<rootDir>/tests/e2e/**/*.test.{js,ts}'],
      maxWorkers: 1, // E2E tests run sequentially
      setupFilesAfterEnv: ['<rootDir>/tests/setup/e2e.ts']
    }
  ]
};
```

### Test Isolation for Parallel Execution

```typescript
// Database isolation for parallel tests
describe('UserRepository', () => {
  let database: Database;
  let testSchema: string;
  
  beforeAll(async () => {
    // Create isolated schema for this test suite
    testSchema = `test_${Date.now()}_${Math.random().toString(36)}`;
    database = await createDatabase(testSchema);
  });
  
  afterAll(async () => {
    // Clean up isolated schema
    await database.dropSchema(testSchema);
    await database.close();
  });
  
  beforeEach(async () => {
    // Reset schema state for each test
    await database.truncateAllTables();
  });
  
  it('should save user to database', async () => {
    const repository = new UserRepository(database);
    const user = await repository.save(createTestUser());
    
    expect(user.id).toBeDefined();
  });
});
```

### Resource Pool Management

```typescript
// Shared resource pool for parallel tests
class TestResourcePool {
  private static instance: TestResourcePool;
  private availablePorts: number[] = [];
  private usedPorts: Set<number> = new Set();
  
  static getInstance(): TestResourcePool {
    if (!TestResourcePool.instance) {
      TestResourcePool.instance = new TestResourcePool();
    }
    return TestResourcePool.instance;
  }
  
  constructor() {
    // Initialize pool of available ports
    for (let port = 3001; port <= 3100; port++) {
      this.availablePorts.push(port);
    }
  }
  
  acquirePort(): number {
    const port = this.availablePorts.pop();
    if (!port) throw new Error('No available ports');
    
    this.usedPorts.add(port);
    return port;
  }
  
  releasePort(port: number): void {
    if (this.usedPorts.has(port)) {
      this.usedPorts.delete(port);
      this.availablePorts.push(port);
    }
  }
}

// Usage in tests
describe('API Server', () => {
  let server: Server;
  let port: number;
  
  beforeAll(async () => {
    port = TestResourcePool.getInstance().acquirePort();
    server = await startServer(port);
  });
  
  afterAll(async () => {
    await server.close();
    TestResourcePool.getInstance().releasePort(port);
  });
  
  it('should respond to health check', async () => {
    const response = await fetch(`http://localhost:${port}/health`);
    expect(response.status).toBe(200);
  });
});
```

### Parallel Test Orchestration with SPARC

```typescript
// Custom test orchestrator
class SPARCTestOrchestrator {
  private testGroups: TestGroup[] = [];
  
  addTestGroup(name: string, tests: string[], dependencies: string[] = []): void {
    this.testGroups.push({
      name,
      tests,
      dependencies,
      status: 'pending'
    });
  }
  
  async executeTests(): Promise<TestResults> {
    const results: TestResults = {};
    const executionPlan = this.createExecutionPlan();
    
    for (const phase of executionPlan) {
      // Execute tests in parallel within each phase
      const phasePromises = phase.map(group => 
        this.executeTestGroup(group)
      );
      
      const phaseResults = await Promise.all(phasePromises);
      
      phaseResults.forEach((result, index) => {
        results[phase[index].name] = result;
      });
      
      // Check if any tests failed and should stop execution
      if (phaseResults.some(result => result.failed > 0)) {
        console.log('Tests failed in phase, stopping execution');
        break;
      }
    }
    
    return results;
  }
  
  private createExecutionPlan(): TestGroup[][] {
    // Create phases based on dependencies
    const phases: TestGroup[][] = [];
    const processed = new Set<string>();
    
    while (processed.size < this.testGroups.length) {
      const currentPhase = this.testGroups.filter(group => 
        !processed.has(group.name) &&
        group.dependencies.every(dep => processed.has(dep))
      );
      
      if (currentPhase.length === 0) {
        throw new Error('Circular dependency detected in test groups');
      }
      
      phases.push(currentPhase);
      currentPhase.forEach(group => processed.add(group.name));
    }
    
    return phases;
  }
  
  private async executeTestGroup(group: TestGroup): Promise<TestGroupResult> {
    console.log(`Executing test group: ${group.name}`);
    
    // Use Jest programmatically
    const jest = require('jest');
    const results = await jest.runCLI(
      {
        testPathPattern: group.tests.join('|'),
        maxWorkers: group.name === 'unit' ? '100%' : 2
      },
      [process.cwd()]
    );
    
    return {
      name: group.name,
      passed: results.results.numPassedTests,
      failed: results.results.numFailedTests,
      duration: results.results.testResults.reduce(
        (acc, result) => acc + (result.perfStats?.end ?? 0) - (result.perfStats?.start ?? 0), 
        0
      )
    };
  }
}

// Usage
const orchestrator = new SPARCTestOrchestrator();

orchestrator.addTestGroup('unit', [
  'tests/unit/**/*.test.ts'
]);

orchestrator.addTestGroup('integration', [
  'tests/integration/**/*.test.ts'  
], ['unit']);

orchestrator.addTestGroup('e2e', [
  'tests/e2e/**/*.test.ts'
], ['unit', 'integration']);

const results = await orchestrator.executeTests();
```

## Integration with CI/CD

### GitHub Actions Pipeline

```yaml
# .github/workflows/tdd-pipeline.yml
name: SPARC TDD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-matrix:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        test-type: [unit, integration, e2e]
        node-version: [16, 18, 20]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run ${{ matrix.test-type }} tests
      run: npm run test:${{ matrix.test-type }}
      env:
        NODE_ENV: test
        DATABASE_URL: postgres://test:test@localhost:5432/test_${{ github.run_id }}
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: test-results-${{ matrix.test-type }}-node${{ matrix.node-version }}
        path: |
          coverage/
          test-results/
  
  tdd-quality-gates:
    needs: test-matrix
    runs-on: ubuntu-latest
    
    steps:
    - name: Download test artifacts
      uses: actions/download-artifact@v3
    
    - name: Analyze test results
      run: |
        # Custom script to analyze TDD metrics
        node scripts/analyze-tdd-metrics.js
        
        # Check coverage thresholds
        npx nyc check-coverage \
          --lines 90 \
          --functions 90 \
          --branches 80 \
          --statements 90
    
    - name: Comment PR with TDD metrics
      if: github.event_name == 'pull_request'
      uses: actions/github-script@v6
      with:
        script: |
          const fs = require('fs');
          const metrics = JSON.parse(fs.readFileSync('tdd-metrics.json', 'utf8'));
          
          const comment = `
          ## TDD Quality Report
          
          | Metric | Value | Status |
          |--------|-------|--------|
          | Test Coverage | ${metrics.coverage}% | ${metrics.coverage >= 90 ? '✅' : '❌'} |
          | Tests Added | ${metrics.testsAdded} | ${metrics.testsAdded > 0 ? '✅' : '⚠️'} |
          | Red-Green-Refactor Cycles | ${metrics.tddCycles} | ${metrics.tddCycles > 0 ? '✅' : '⚠️'} |
          | Mock Coverage | ${metrics.mockCoverage}% | ${metrics.mockCoverage >= 80 ? '✅' : '❌'} |
          
          ${metrics.coverage < 90 ? '⚠️ Coverage below 90% threshold' : ''}
          ${metrics.testsAdded === 0 ? '⚠️ No new tests added' : ''}
          `;
          
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: comment
          });
```

### Package.json Scripts for TDD Workflow

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --selectProjects unit",
    "test:integration": "jest --selectProjects integration",
    "test:e2e": "jest --selectProjects e2e",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:parallel": "jest --maxWorkers=50%",
    
    "tdd:red": "jest --bail --verbose",
    "tdd:green": "jest --bail",
    "tdd:refactor": "jest && npm run lint:fix && npm run format",
    
    "sparc:tdd": "npx claude-flow sparc tdd",
    "sparc:test": "npx claude-flow sparc run tdd-complete",
    
    "pre-commit": "npm run test:unit && npm run lint",
    "pre-push": "npm run test && npm run build"
  }
}
```

### TDD Metrics Collection

```typescript
// scripts/tdd-metrics-collector.ts
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

interface TDDMetrics {
  coverage: number;
  testsAdded: number;
  testsModified: number;
  tddCycles: number;
  mockCoverage: number;
  testToCodeRatio: number;
  commitMessages: string[];
}

class TDDMetricsCollector {
  async collect(): Promise<TDDMetrics> {
    const coverage = this.getCoverageMetrics();
    const gitMetrics = this.getGitMetrics();
    const testMetrics = this.getTestMetrics();
    
    return {
      coverage: coverage.lines,
      testsAdded: gitMetrics.testsAdded,
      testsModified: gitMetrics.testsModified,
      tddCycles: this.detectTDDCycles(gitMetrics.commitMessages),
      mockCoverage: testMetrics.mockCoverage,
      testToCodeRatio: testMetrics.testToCodeRatio,
      commitMessages: gitMetrics.commitMessages
    };
  }
  
  private getCoverageMetrics() {
    const output = execSync('npx nyc report --reporter=json', { encoding: 'utf8' });
    const coverage = JSON.parse(output);
    
    return {
      lines: coverage.total.lines.pct,
      functions: coverage.total.functions.pct,
      branches: coverage.total.branches.pct,
      statements: coverage.total.statements.pct
    };
  }
  
  private getGitMetrics() {
    const commitRange = process.env.COMMIT_RANGE || 'HEAD~10..HEAD';
    const commits = execSync(
      `git log ${commitRange} --pretty=format:"%s"`, 
      { encoding: 'utf8' }
    ).split('\n');
    
    const diffStat = execSync(
      `git diff ${commitRange} --stat`, 
      { encoding: 'utf8' }
    );
    
    const testsAdded = (diffStat.match(/\d+\s+[\w\/]*\.test\./g) || []).length;
    const testsModified = commits.filter(msg => 
      msg.toLowerCase().includes('test') || 
      msg.toLowerCase().includes('spec')
    ).length;
    
    return {
      testsAdded,
      testsModified,
      commitMessages: commits
    };
  }
  
  private detectTDDCycles(commits: string[]): number {
    const redPattern = /red|fail|broke/i;
    const greenPattern = /green|pass|fix/i;
    const refactorPattern = /refactor|clean|improve/i;
    
    let cycles = 0;
    let state = 'none';
    
    for (const commit of commits) {
      if (redPattern.test(commit) && state !== 'red') {
        state = 'red';
      } else if (greenPattern.test(commit) && state === 'red') {
        state = 'green';
      } else if (refactorPattern.test(commit) && state === 'green') {
        state = 'refactor';
        cycles++;
        state = 'none';
      }
    }
    
    return cycles;
  }
  
  private getTestMetrics() {
    // Analyze test files for mock usage
    const testFiles = execSync(
      'find . -name "*.test.ts" -o -name "*.test.js" -o -name "*.spec.ts" -o -name "*.spec.js"',
      { encoding: 'utf8' }
    ).split('\n').filter(Boolean);
    
    let totalTests = 0;
    let testsWithMocks = 0;
    
    for (const file of testFiles) {
      const content = require('fs').readFileSync(file, 'utf8');
      const testCount = (content.match(/it\s*\(/g) || []).length;
      const mockCount = (content.match(/mock|stub|spy/gi) || []).length;
      
      totalTests += testCount;
      if (mockCount > 0) testsWithMocks++;
    }
    
    const sourceFiles = execSync(
      'find ./src -name "*.ts" -o -name "*.js" | wc -l',
      { encoding: 'utf8' }
    );
    
    return {
      mockCoverage: totalTests > 0 ? (testsWithMocks / totalTests) * 100 : 0,
      testToCodeRatio: testFiles.length / parseInt(sourceFiles)
    };
  }
}

// Export metrics for CI/CD
async function main() {
  const collector = new TDDMetricsCollector();
  const metrics = await collector.collect();
  
  writeFileSync('tdd-metrics.json', JSON.stringify(metrics, null, 2));
  console.log('TDD Metrics collected:', metrics);
}

if (require.main === module) {
  main().catch(console.error);
}
```

## Real-World TDD Examples

### Example 1: E-commerce Order Processing System

Let's build a complete order processing system using TDD and SPARC methodology.

#### Specification Phase

```typescript
// tests/specs/order-processing.spec.ts

/**
 * Order Processing System Requirements:
 * 
 * 1. Accept orders with items, customer info, and payment details
 * 2. Validate order data (items exist, customer valid, payment valid)
 * 3. Calculate totals including tax and shipping
 * 4. Process payment through external gateway
 * 5. Reserve inventory for ordered items
 * 6. Create shipping label and schedule delivery
 * 7. Send confirmation email to customer
 * 8. Handle failures gracefully with compensation actions
 */

describe('Order Processing System Specification', () => {
  it('should process a complete order successfully', async () => {
    // This test defines our complete workflow
    const orderRequest: OrderRequest = {
      customerId: 'customer_123',
      items: [
        { productId: 'product_1', quantity: 2, price: 29.99 },
        { productId: 'product_2', quantity: 1, price: 49.99 }
      ],
      shippingAddress: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'NY',
        zipCode: '12345'
      },
      paymentMethod: {
        type: 'credit_card',
        cardNumber: '4111111111111111',
        expiryMonth: 12,
        expiryYear: 2025,
        cvv: '123'
      }
    };

    const orderProcessor = new OrderProcessor(
      mockInventoryService,
      mockPaymentService,
      mockShippingService,
      mockEmailService,
      mockCustomerService
    );

    const result = await orderProcessor.processOrder(orderRequest);

    expect(result.success).toBe(true);
    expect(result.orderId).toBeDefined();
    expect(result.total).toBe(109.97); // 2 * 29.99 + 49.99
    expect(result.confirmationNumber).toBeDefined();
  });
});
```

#### TDD Implementation: Red Phase

```typescript
// tests/unit/order-processor.test.ts

describe('OrderProcessor', () => {
  let orderProcessor: OrderProcessor;
  let mockInventoryService: jest.Mocked<InventoryService>;
  let mockPaymentService: jest.Mocked<PaymentService>;
  let mockShippingService: jest.Mocked<ShippingService>;
  let mockEmailService: jest.Mocked<EmailService>;
  let mockCustomerService: jest.Mocked<CustomerService>;

  beforeEach(() => {
    mockInventoryService = createMock<InventoryService>();
    mockPaymentService = createMock<PaymentService>();
    mockShippingService = createMock<ShippingService>();
    mockEmailService = createMock<EmailService>();
    mockCustomerService = createMock<CustomerService>();

    orderProcessor = new OrderProcessor(
      mockInventoryService,
      mockPaymentService,
      mockShippingService,
      mockEmailService,
      mockCustomerService
    );
  });

  describe('Order Validation', () => {
    it('should validate customer exists', async () => {
      // Red: This will fail because OrderProcessor doesn't exist yet
      mockCustomerService.getCustomer.mockResolvedValue(null);

      const orderRequest = createValidOrderRequest();
      const result = await orderProcessor.processOrder(orderRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Customer not found');
    });

    it('should validate all items are available', async () => {
      mockCustomerService.getCustomer.mockResolvedValue(createValidCustomer());
      mockInventoryService.checkAvailability.mockResolvedValue(false);

      const orderRequest = createValidOrderRequest();
      const result = await orderProcessor.processOrder(orderRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Items not available');
    });

    it('should calculate correct order total', async () => {
      const orderRequest = createOrderRequestWithKnownTotal();
      mockCustomerService.getCustomer.mockResolvedValue(createValidCustomer());
      mockInventoryService.checkAvailability.mockResolvedValue(true);

      const result = await orderProcessor.processOrder(orderRequest);

      expect(result.total).toBe(109.97);
    });
  });

  describe('Payment Processing', () => {
    it('should process payment with correct amount', async () => {
      setupValidMocks();
      mockPaymentService.processPayment.mockResolvedValue({
        success: true,
        transactionId: 'txn_123'
      });

      const orderRequest = createValidOrderRequest();
      await orderProcessor.processOrder(orderRequest);

      expect(mockPaymentService.processPayment).toHaveBeenCalledWith({
        amount: 109.97,
        currency: 'USD',
        paymentMethod: orderRequest.paymentMethod,
        customerId: orderRequest.customerId
      });
    });

    it('should handle payment failure gracefully', async () => {
      setupValidMocks();
      mockPaymentService.processPayment.mockResolvedValue({
        success: false,
        error: 'Card declined'
      });

      const orderRequest = createValidOrderRequest();
      const result = await orderProcessor.processOrder(orderRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Payment failed: Card declined');
    });
  });
});
```

#### TDD Implementation: Green Phase

```typescript
// src/order-processor.ts

export class OrderProcessor {
  constructor(
    private inventoryService: InventoryService,
    private paymentService: PaymentService,
    private shippingService: ShippingService,
    private emailService: EmailService,
    private customerService: CustomerService
  ) {}

  async processOrder(orderRequest: OrderRequest): Promise<OrderResult> {
    try {
      // Step 1: Validate customer
      const customer = await this.customerService.getCustomer(orderRequest.customerId);
      if (!customer) {
        return { success: false, error: 'Customer not found' };
      }

      // Step 2: Check inventory availability
      const itemsAvailable = await this.inventoryService.checkAvailability(
        orderRequest.items.map(item => ({ 
          productId: item.productId, 
          quantity: item.quantity 
        }))
      );
      
      if (!itemsAvailable) {
        return { success: false, error: 'Items not available' };
      }

      // Step 3: Calculate total
      const total = this.calculateTotal(orderRequest.items);

      // Step 4: Process payment
      const paymentResult = await this.paymentService.processPayment({
        amount: total,
        currency: 'USD',
        paymentMethod: orderRequest.paymentMethod,
        customerId: orderRequest.customerId
      });

      if (!paymentResult.success) {
        return { 
          success: false, 
          error: `Payment failed: ${paymentResult.error}` 
        };
      }

      // Step 5: Reserve inventory
      await this.inventoryService.reserveItems(orderRequest.items);

      // Step 6: Create shipping label
      const shippingLabel = await this.shippingService.createLabel({
        address: orderRequest.shippingAddress,
        items: orderRequest.items
      });

      // Step 7: Send confirmation email
      await this.emailService.sendOrderConfirmation({
        customerId: orderRequest.customerId,
        orderId: paymentResult.transactionId,
        total,
        items: orderRequest.items
      });

      return {
        success: true,
        orderId: paymentResult.transactionId,
        total,
        confirmationNumber: shippingLabel.trackingNumber
      };

    } catch (error) {
      console.error('Order processing failed:', error);
      return { 
        success: false, 
        error: 'Internal processing error' 
      };
    }
  }

  private calculateTotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
}
```

#### TDD Implementation: Refactor Phase

```typescript
// src/order-processor.ts (refactored)

export class OrderProcessor {
  constructor(
    private inventoryService: InventoryService,
    private paymentService: PaymentService,
    private shippingService: ShippingService,
    private emailService: EmailService,
    private customerService: CustomerService,
    private orderValidator: OrderValidator,
    private orderCalculator: OrderCalculator,
    private compensationHandler: CompensationHandler
  ) {}

  async processOrder(orderRequest: OrderRequest): Promise<OrderResult> {
    const compensationActions: CompensationAction[] = [];
    
    try {
      // Validation phase
      const validationResult = await this.orderValidator.validate(orderRequest);
      if (!validationResult.isValid) {
        return { success: false, error: validationResult.error };
      }

      // Calculation phase
      const orderTotal = this.orderCalculator.calculateTotal(orderRequest);

      // Processing phase
      const processingResult = await this.processOrderSteps(
        orderRequest, 
        orderTotal, 
        compensationActions
      );

      return processingResult;

    } catch (error) {
      // Compensation phase - rollback any completed actions
      await this.compensationHandler.compensate(compensationActions);
      
      console.error('Order processing failed:', error);
      return { success: false, error: 'Internal processing error' };
    }
  }

  private async processOrderSteps(
    orderRequest: OrderRequest,
    total: number,
    compensationActions: CompensationAction[]
  ): Promise<OrderResult> {
    // Process payment
    const paymentResult = await this.paymentService.processPayment({
      amount: total,
      currency: 'USD',
      paymentMethod: orderRequest.paymentMethod,
      customerId: orderRequest.customerId
    });

    if (!paymentResult.success) {
      return { success: false, error: `Payment failed: ${paymentResult.error}` };
    }

    compensationActions.push({
      type: 'refund_payment',
      transactionId: paymentResult.transactionId
    });

    // Reserve inventory
    await this.inventoryService.reserveItems(orderRequest.items);
    compensationActions.push({
      type: 'release_inventory',
      items: orderRequest.items
    });

    // Create shipping and send confirmation
    const [shippingLabel] = await Promise.all([
      this.shippingService.createLabel({
        address: orderRequest.shippingAddress,
        items: orderRequest.items
      }),
      this.emailService.sendOrderConfirmation({
        customerId: orderRequest.customerId,
        orderId: paymentResult.transactionId,
        total,
        items: orderRequest.items
      })
    ]);

    return {
      success: true,
      orderId: paymentResult.transactionId,
      total,
      confirmationNumber: shippingLabel.trackingNumber
    };
  }
}

// Extracted classes for better separation of concerns
export class OrderValidator {
  constructor(
    private customerService: CustomerService,
    private inventoryService: InventoryService
  ) {}

  async validate(orderRequest: OrderRequest): Promise<ValidationResult> {
    // Customer validation
    const customer = await this.customerService.getCustomer(orderRequest.customerId);
    if (!customer) {
      return { isValid: false, error: 'Customer not found' };
    }

    // Inventory validation
    const itemsAvailable = await this.inventoryService.checkAvailability(
      orderRequest.items.map(item => ({ 
        productId: item.productId, 
        quantity: item.quantity 
      }))
    );
    
    if (!itemsAvailable) {
      return { isValid: false, error: 'Items not available' };
    }

    return { isValid: true };
  }
}

export class OrderCalculator {
  calculateTotal(orderRequest: OrderRequest): number {
    const subtotal = orderRequest.items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );
    
    const tax = subtotal * 0.08; // 8% tax
    const shipping = this.calculateShipping(orderRequest.shippingAddress);
    
    return subtotal + tax + shipping;
  }

  private calculateShipping(address: ShippingAddress): number {
    // Simple shipping calculation
    return 9.99;
  }
}
```

### Example 2: Real-time Chat System

```typescript
// tests/integration/chat-system.test.ts

describe('Real-time Chat System', () => {
  let chatServer: ChatServer;
  let mockWebSocketServer: jest.Mocked<WebSocketServer>;
  let mockMessageStore: jest.Mocked<MessageStore>;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    mockWebSocketServer = createMock<WebSocketServer>();
    mockMessageStore = createMock<MessageStore>();
    mockUserService = createMock<UserService>();
    
    chatServer = new ChatServer(
      mockWebSocketServer,
      mockMessageStore,
      mockUserService
    );
  });

  describe('User Connection Management', () => {
    it('should authenticate user on connection', async () => {
      const mockSocket = createMockSocket();
      const authToken = 'valid_token_123';
      
      mockUserService.validateToken.mockResolvedValue({
        valid: true,
        userId: 'user_123',
        username: 'testuser'
      });

      await chatServer.handleConnection(mockSocket, authToken);

      expect(mockUserService.validateToken).toHaveBeenCalledWith(authToken);
      expect(mockSocket.emit).toHaveBeenCalledWith('authenticated', {
        userId: 'user_123',
        username: 'testuser'
      });
    });

    it('should reject invalid authentication', async () => {
      const mockSocket = createMockSocket();
      const invalidToken = 'invalid_token';
      
      mockUserService.validateToken.mockResolvedValue({
        valid: false,
        error: 'Invalid token'
      });

      await chatServer.handleConnection(mockSocket, invalidToken);

      expect(mockSocket.emit).toHaveBeenCalledWith('auth_error', {
        error: 'Invalid token'
      });
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });
  });

  describe('Message Handling', () => {
    it('should broadcast message to room participants', async () => {
      const message: ChatMessage = {
        id: 'msg_123',
        roomId: 'room_456',
        userId: 'user_123',
        content: 'Hello, world!',
        timestamp: new Date()
      };

      const roomParticipants = ['user_123', 'user_456', 'user_789'];
      mockUserService.getRoomParticipants.mockResolvedValue(roomParticipants);
      mockMessageStore.saveMessage.mockResolvedValue(message);

      await chatServer.handleMessage(message);

      expect(mockMessageStore.saveMessage).toHaveBeenCalledWith(message);
      expect(mockWebSocketServer.broadcast).toHaveBeenCalledWith(
        roomParticipants,
        'new_message',
        message
      );
    });

    it('should handle message persistence failure gracefully', async () => {
      const message = createTestMessage();
      mockMessageStore.saveMessage.mockRejectedValue(
        new Error('Database connection failed')
      );

      await chatServer.handleMessage(message);

      // Should not broadcast if persistence fails
      expect(mockWebSocketServer.broadcast).not.toHaveBeenCalled();
      
      // Should send error to sender
      expect(mockWebSocketServer.sendToUser).toHaveBeenCalledWith(
        message.userId,
        'message_error',
        { error: 'Failed to save message' }
      );
    });
  });

  describe('Real-time Features', () => {
    it('should handle typing indicators', async () => {
      const typingEvent = {
        userId: 'user_123',
        roomId: 'room_456',
        isTyping: true
      };

      const otherParticipants = ['user_456', 'user_789'];
      mockUserService.getRoomParticipants.mockResolvedValue([
        'user_123', ...otherParticipants
      ]);

      await chatServer.handleTyping(typingEvent);

      expect(mockWebSocketServer.broadcast).toHaveBeenCalledWith(
        otherParticipants, // Exclude the sender
        'user_typing',
        {
          userId: 'user_123',
          roomId: 'room_456',
          isTyping: true
        }
      );
    });

    it('should handle user presence updates', async () => {
      const presenceUpdate = {
        userId: 'user_123',
        status: 'online'
      };

      const userRooms = ['room_456', 'room_789'];
      mockUserService.getUserRooms.mockResolvedValue(userRooms);

      await chatServer.handlePresenceUpdate(presenceUpdate);

      for (const roomId of userRooms) {
        expect(mockWebSocketServer.broadcastToRoom).toHaveBeenCalledWith(
          roomId,
          'presence_update',
          presenceUpdate
        );
      }
    });
  });
});
```

## Common TDD Mistakes and Solutions

### Mistake 1: Writing Tests After Code

#### ❌ Wrong Approach
```typescript
// Code written first
class UserService {
  async createUser(userData: UserData): Promise<User> {
    // Implementation already exists
    const user = new User(userData);
    await this.repository.save(user);
    return user;
  }
}

// Test written after
it('should create user', async () => {
  // Test written to match existing implementation
  const service = new UserService();
  const result = await service.createUser(userData);
  expect(result).toBeInstanceOf(User);
});
```

#### ✅ Correct Approach
```typescript
// Test written first (Red)
it('should create user with generated ID and timestamp', async () => {
  const service = new UserService(mockRepository);
  const userData = { email: 'test@example.com', name: 'Test User' };
  
  const result = await service.createUser(userData);
  
  expect(result.id).toBeDefined();
  expect(result.createdAt).toBeInstanceOf(Date);
  expect(result.email).toBe('test@example.com');
  expect(mockRepository.save).toHaveBeenCalledWith(result);
});

// Minimal implementation (Green)
class UserService {
  async createUser(userData: UserData): Promise<User> {
    const user = {
      id: generateId(),
      createdAt: new Date(),
      ...userData
    };
    
    await this.repository.save(user);
    return user;
  }
}
```

### Mistake 2: Testing Too Much in One Test

#### ❌ Wrong Approach
```typescript
it('should handle complete user workflow', async () => {
  // Testing too many things at once
  const user = await service.createUser(userData);
  const updatedUser = await service.updateUser(user.id, updateData);
  const orders = await service.getUserOrders(user.id);
  const deleted = await service.deleteUser(user.id);
  
  expect(user.id).toBeDefined();
  expect(updatedUser.name).toBe('Updated Name');
  expect(orders).toHaveLength(0);
  expect(deleted).toBe(true);
});
```

#### ✅ Correct Approach
```typescript
describe('UserService', () => {
  it('should create user with generated ID', async () => {
    const user = await service.createUser(userData);
    
    expect(user.id).toBeDefined();
    expect(user.email).toBe(userData.email);
  });
  
  it('should update user information', async () => {
    const existingUser = await createTestUser();
    const updateData = { name: 'Updated Name' };
    
    const updatedUser = await service.updateUser(existingUser.id, updateData);
    
    expect(updatedUser.name).toBe('Updated Name');
    expect(updatedUser.id).toBe(existingUser.id);
  });
  
  it('should retrieve user orders', async () => {
    const user = await createTestUser();
    
    const orders = await service.getUserOrders(user.id);
    
    expect(orders).toHaveLength(0);
  });
});
```

### Mistake 3: Ignoring Test Maintenance

#### ❌ Wrong Approach
```typescript
// Test becomes brittle due to hardcoded values
it('should format user display name', () => {
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    title: 'Mr.',
    suffix: 'Jr.'
  };
  
  // Hardcoded expected result
  const result = formatDisplayName(user);
  expect(result).toBe('Mr. John Doe Jr.');
});

// When formatting logic changes, test breaks
function formatDisplayName(user: User): string {
  // New requirement: middle name support
  return `${user.title} ${user.firstName} ${user.middleName || ''} ${user.lastName} ${user.suffix}`.trim();
}
```

#### ✅ Correct Approach
```typescript
// Maintainable test with clear intent
describe('Display Name Formatting', () => {
  it('should format name with all components', () => {
    const user = {
      title: 'Dr.',
      firstName: 'Jane',
      lastName: 'Smith',
      suffix: 'PhD'
    };
    
    const result = formatDisplayName(user);
    
    expect(result).toContain(user.title);
    expect(result).toContain(user.firstName);
    expect(result).toContain(user.lastName);
    expect(result).toContain(user.suffix);
  });
  
  it('should format name without optional components', () => {
    const user = {
      firstName: 'John',
      lastName: 'Doe'
    };
    
    const result = formatDisplayName(user);
    
    expect(result).toBe('John Doe');
  });
  
  it('should handle middle names when present', () => {
    const user = {
      firstName: 'John',
      middleName: 'Michael',
      lastName: 'Doe'
    };
    
    const result = formatDisplayName(user);
    
    expect(result).toBe('John Michael Doe');
  });
});
```

### Mistake 4: Over-Mocking Internal Dependencies

#### ❌ Wrong Approach
```typescript
// Over-mocking makes tests brittle
it('should calculate order total', () => {
  const mockCalculator = jest.fn().mockReturnValue(100);
  const mockTaxCalculator = jest.fn().mockReturnValue(8);
  const mockShippingCalculator = jest.fn().mockReturnValue(15);
  
  // Mocking every internal calculation
  const service = new OrderService();
  service.calculateSubtotal = mockCalculator;
  service.calculateTax = mockTaxCalculator;
  service.calculateShipping = mockShippingCalculator;
  
  const total = service.calculateTotal(order);
  
  expect(total).toBe(123);
  expect(mockCalculator).toHaveBeenCalled();
  expect(mockTaxCalculator).toHaveBeenCalled();
  expect(mockShippingCalculator).toHaveBeenCalled();
});
```

#### ✅ Correct Approach
```typescript
// Test the public behavior, not internal implementation
describe('Order Total Calculation', () => {
  it('should calculate total including tax and shipping', () => {
    const order = {
      items: [
        { price: 25.00, quantity: 2 }, // 50.00
        { price: 30.00, quantity: 1 }  // 30.00
      ],
      shippingAddress: { state: 'NY' }, // 8% tax
      shippingMethod: 'standard' // $10 shipping
    };
    
    const service = new OrderService();
    const total = service.calculateTotal(order);
    
    // 80.00 subtotal + 6.40 tax + 10.00 shipping = 96.40
    expect(total).toBe(96.40);
  });
  
  it('should handle tax-exempt states', () => {
    const order = {
      items: [{ price: 100.00, quantity: 1 }],
      shippingAddress: { state: 'DE' }, // No sales tax
      shippingMethod: 'standard'
    };
    
    const service = new OrderService();
    const total = service.calculateTotal(order);
    
    // 100.00 subtotal + 0 tax + 10.00 shipping = 110.00
    expect(total).toBe(110.00);
  });
});
```

### Mistake 5: Not Testing Edge Cases

#### ❌ Wrong Approach
```typescript
// Only testing happy path
describe('EmailValidator', () => {
  it('should validate email', () => {
    const validator = new EmailValidator();
    
    expect(validator.isValid('test@example.com')).toBe(true);
  });
});
```

#### ✅ Correct Approach
```typescript
// Comprehensive edge case testing
describe('EmailValidator', () => {
  let validator: EmailValidator;
  
  beforeEach(() => {
    validator = new EmailValidator();
  });
  
  describe('Valid emails', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org',
      'user123@example-domain.com',
      'a@b.co'
    ];
    
    validEmails.forEach(email => {
      it(`should accept ${email}`, () => {
        expect(validator.isValid(email)).toBe(true);
      });
    });
  });
  
  describe('Invalid emails', () => {
    const invalidEmails = [
      '',
      'not-an-email',
      '@example.com',
      'test@',
      'test..test@example.com',
      'test@example',
      'test @example.com',
      'test@ex ample.com'
    ];
    
    invalidEmails.forEach(email => {
      it(`should reject "${email}"`, () => {
        expect(validator.isValid(email)).toBe(false);
      });
    });
  });
  
  describe('Edge cases', () => {
    it('should handle null input', () => {
      expect(validator.isValid(null)).toBe(false);
    });
    
    it('should handle undefined input', () => {
      expect(validator.isValid(undefined)).toBe(false);
    });
    
    it('should handle very long emails', () => {
      const longEmail = 'a'.repeat(100) + '@' + 'b'.repeat(100) + '.com';
      expect(validator.isValid(longEmail)).toBe(false);
    });
  });
});
```

## Performance Testing with TDD

### Performance Test Patterns

#### 1. Response Time Testing

```typescript
describe('API Performance', () => {
  it('should respond to user queries within 200ms', async () => {
    const userService = new UserService(realDatabase);
    const startTime = Date.now();
    
    const result = await userService.findUserById('user_123');
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(result).toBeDefined();
    expect(responseTime).toBeLessThan(200);
  });
  
  it('should handle concurrent requests efficiently', async () => {
    const userService = new UserService(realDatabase);
    const concurrentRequests = 50;
    
    const startTime = Date.now();
    
    const promises = Array.from({ length: concurrentRequests }, (_, i) => 
      userService.findUserById(`user_${i}`)
    );
    
    const results = await Promise.all(promises);
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / concurrentRequests;
    
    expect(results).toHaveLength(concurrentRequests);
    expect(averageTime).toBeLessThan(100); // Each request should average < 100ms
  });
});
```

#### 2. Memory Usage Testing

```typescript
describe('Memory Performance', () => {
  it('should not leak memory during bulk operations', async () => {
    const service = new DataProcessingService();
    const initialMemory = process.memoryUsage().heapUsed;
    
    // Process large dataset
    for (let i = 0; i < 10000; i++) {
      await service.processRecord(createTestRecord(i));
    }
    
    // Force garbage collection
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory should not increase by more than 50MB
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
  });
  
  it('should clean up resources after processing', async () => {
    const service = new FileProcessingService();
    const fileHandlesBefore = await getOpenFileHandles();
    
    await service.processFiles([
      'test1.txt', 'test2.txt', 'test3.txt'
    ]);
    
    const fileHandlesAfter = await getOpenFileHandles();
    
    expect(fileHandlesAfter).toBe(fileHandlesBefore);
  });
});
```

#### 3. Throughput Testing

```typescript
describe('Throughput Performance', () => {
  it('should process minimum 1000 orders per minute', async () => {
    const orderProcessor = new OrderProcessor(
      realInventoryService,
      realPaymentService,
      realShippingService
    );
    
    const testDuration = 60000; // 1 minute in milliseconds
    const startTime = Date.now();
    let processedOrders = 0;
    
    while (Date.now() - startTime < testDuration) {
      const orders = generateTestOrders(10); // Process in batches of 10
      
      await Promise.all(
        orders.map(order => orderProcessor.processOrder(order))
      );
      
      processedOrders += orders.length;
    }
    
    const ordersPerMinute = processedOrders;
    expect(ordersPerMinute).toBeGreaterThanOrEqual(1000);
  });
});
```

#### 4. Database Performance Testing

```typescript
describe('Database Performance', () => {
  let database: Database;
  
  beforeAll(async () => {
    database = await createTestDatabase();
    // Populate with realistic dataset
    await seedDatabase(database, 100000);
  });
  
  afterAll(async () => {
    await database.close();
  });
  
  it('should execute complex queries within performance SLA', async () => {
    const repository = new UserRepository(database);
    
    const startTime = process.hrtime.bigint();
    
    const result = await repository.findUsersWithOrdersAndPreferences({
      minOrderValue: 100,
      location: 'US',
      preferences: ['email_notifications', 'premium_features'],
      orderDateRange: { start: new Date('2023-01-01'), end: new Date('2023-12-31') }
    });
    
    const endTime = process.hrtime.bigint();
    const executionTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    
    expect(result.length).toBeGreaterThan(0);
    expect(executionTime).toBeLessThan(500); // Should complete within 500ms
  });
  
  it('should handle database connection pooling efficiently', async () => {
    const repository = new UserRepository(database);
    const concurrentQueries = 100;
    
    const queries = Array.from({ length: concurrentQueries }, () => 
      repository.findUserById(generateRandomUserId())
    );
    
    const startTime = Date.now();
    const results = await Promise.all(queries);
    const endTime = Date.now();
    
    const totalTime = endTime - startTime;
    
    expect(results).toHaveLength(concurrentQueries);
    expect(totalTime).toBeLessThan(2000); // Should complete within 2 seconds
    
    // Verify connection pool didn't exhaust
    expect(database.pool.activeConnections).toBeLessThanOrEqual(database.pool.maxConnections);
  });
});
```

### Performance Regression Testing

```typescript
// Performance baseline tracking
class PerformanceTracker {
  private baselines: Map<string, PerformanceBaseline> = new Map();
  
  async recordBaseline(testName: string, metric: PerformanceMetric): Promise<void> {
    const baseline = this.baselines.get(testName) || {
      testName,
      measurements: []
    };
    
    baseline.measurements.push({
      value: metric.value,
      timestamp: new Date(),
      environment: process.env.NODE_ENV
    });
    
    // Keep only last 10 measurements
    if (baseline.measurements.length > 10) {
      baseline.measurements = baseline.measurements.slice(-10);
    }
    
    this.baselines.set(testName, baseline);
    
    // Persist to file or database
    await this.saveBaselines();
  }
  
  checkRegression(testName: string, currentValue: number): RegressionResult {
    const baseline = this.baselines.get(testName);
    if (!baseline || baseline.measurements.length === 0) {
      return { hasRegression: false, message: 'No baseline available' };
    }
    
    const averageBaseline = baseline.measurements.reduce(
      (sum, m) => sum + m.value, 0
    ) / baseline.measurements.length;
    
    const regressionThreshold = averageBaseline * 1.2; // 20% increase threshold
    
    if (currentValue > regressionThreshold) {
      return {
        hasRegression: true,
        message: `Performance regression detected: ${currentValue}ms vs baseline ${averageBaseline}ms`,
        currentValue,
        baselineValue: averageBaseline,
        regressionPercentage: ((currentValue - averageBaseline) / averageBaseline) * 100
      };
    }
    
    return { hasRegression: false };
  }
}

// Usage in tests
describe('Performance Regression Tests', () => {
  let performanceTracker: PerformanceTracker;
  
  beforeAll(() => {
    performanceTracker = new PerformanceTracker();
  });
  
  it('should not regress on user search performance', async () => {
    const searchService = new UserSearchService();
    
    const startTime = Date.now();
    await searchService.search('john doe', { limit: 50 });
    const endTime = Date.now();
    
    const executionTime = endTime - startTime;
    
    // Check for regression
    const regressionResult = performanceTracker.checkRegression(
      'user_search_performance', 
      executionTime
    );
    
    expect(regressionResult.hasRegression).toBe(false);
    
    // Record new measurement
    await performanceTracker.recordBaseline(
      'user_search_performance', 
      { value: executionTime, unit: 'ms' }
    );
  });
});
```

### Load Testing Integration

```typescript
// Load testing with Artillery.js integration
describe('Load Testing', () => {
  it('should handle production load patterns', async () => {
    const loadTestConfig = {
      target: 'http://localhost:3000',
      phases: [
        { duration: 60, arrivalRate: 10 }, // Warm up
        { duration: 300, arrivalRate: 50 }, // Sustained load
        { duration: 120, arrivalRate: 100 }, // Peak load
        { duration: 60, arrivalRate: 10 } // Cool down
      ],
      scenarios: [
        {
          name: 'User workflow',
          weight: 70,
          flow: [
            { post: { url: '/api/auth/login', json: { username: 'test', password: 'test' } } },
            { get: { url: '/api/users/profile' } },
            { post: { url: '/api/orders', json: { items: [{ id: 1, qty: 2 }] } } }
          ]
        },
        {
          name: 'Browse products',
          weight: 30,
          flow: [
            { get: { url: '/api/products' } },
            { get: { url: '/api/products/category/electronics' } }
          ]
        }
      ]
    };
    
    const results = await runLoadTest(loadTestConfig);
    
    expect(results.aggregate.latency.p95).toBeLessThan(500);
    expect(results.aggregate.rate).toBeGreaterThan(45); // 45+ requests/second
    expect(results.aggregate.errors.rate).toBeLessThan(0.01); // < 1% error rate
  });
});
```

This comprehensive guide covers all aspects of TDD within the SPARC methodology, providing practical examples and real-world patterns that can be immediately applied to development projects. The guide emphasizes both the theoretical foundations and practical implementation details necessary for successful test-driven development.