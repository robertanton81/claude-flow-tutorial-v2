# Walkthrough Scenario 5: Microservices Architecture

## 🎯 Project Overview
Build a complete microservices architecture using SPARC methodology with service orchestration, API gateways, and distributed system patterns.

---

## 📝 Fill-in Template

### Your Microservices Platform Details
```
PLATFORM_NAME: ________________
BUSINESS_DOMAIN: ________________ (e.g., "e-commerce", "fintech", "healthcare", "logistics")
PRIMARY_SERVICES: ________________ (e.g., "user, product, order, payment", "auth, content, analytics")
EXPECTED_SCALE: ________________ (e.g., "startup", "medium enterprise", "large scale", "global")
TEAM_SIZE: ________________ (e.g., "solo", "small team", "multiple teams", "large organization")
DEPLOYMENT_MODEL: ________________ (e.g., "cloud-native", "hybrid", "on-premises", "edge computing")
```

### Architecture Specifications
```
SERVICE_COUNT: ________________ (e.g., "3-5 services", "6-10 services", "10+ services")
COMMUNICATION_PATTERN: ________________ (e.g., "REST APIs", "GraphQL", "gRPC", "event-driven")
DATA_STRATEGY: ________________ (e.g., "database per service", "shared database", "event sourcing")
ORCHESTRATION: ________________ (e.g., "Kubernetes", "Docker Swarm", "AWS ECS", "serverless")
SERVICE_MESH: ________________ (e.g., "Istio", "Linkerd", "Consul Connect", "none")
MESSAGE_BROKER: ________________ (e.g., "RabbitMQ", "Apache Kafka", "AWS SQS", "Redis")
```

### Infrastructure & DevOps
```
CLOUD_PROVIDER: ________________ (e.g., "AWS", "Azure", "GCP", "multi-cloud", "on-premises")
MONITORING_STACK: ________________ (e.g., "Prometheus + Grafana", "ELK Stack", "Datadog", "New Relic")
CI_CD_PLATFORM: ________________ (e.g., "GitHub Actions", "GitLab CI", "Jenkins", "Azure DevOps")
SECURITY_MODEL: ________________ (e.g., "OAuth2 + JWT", "mTLS", "Zero Trust", "API Gateway security")
```

---

## 🚀 Generated Commands

### Basic Microservices (Beginner)
```bash
# For: Simple microservices with basic orchestration
npx claude-flow@alpha sparc tdd "Build ${PLATFORM_NAME} microservices platform for ${BUSINESS_DOMAIN} with ${SERVICE_COUNT} using ${COMMUNICATION_PATTERN} communication, ${DATA_STRATEGY} data architecture, ${ORCHESTRATION} orchestration, basic service discovery, health checks, centralized logging, and ${CLOUD_PROVIDER} deployment"

# Example:
npx claude-flow@alpha sparc tdd "Build ShopMicro microservices platform for e-commerce with 3-5 services using REST APIs communication, database per service data architecture, Docker Swarm orchestration, basic service discovery, health checks, centralized logging, and AWS deployment"
```

### Production Microservices (Intermediate)
```bash
# For: Production-ready microservices with comprehensive features
npx claude-flow@alpha sparc tdd "Build ${PLATFORM_NAME} microservices platform for ${BUSINESS_DOMAIN} with ${SERVICE_COUNT} using ${COMMUNICATION_PATTERN} communication, ${DATA_STRATEGY} data architecture, ${ORCHESTRATION} orchestration, ${SERVICE_MESH} service mesh, ${MESSAGE_BROKER} messaging, API gateway, circuit breakers, distributed tracing, comprehensive monitoring with ${MONITORING_STACK}, automated testing, CI/CD with ${CI_CD_PLATFORM}, and ${CLOUD_PROVIDER} deployment"

# Example:
npx claude-flow@alpha sparc tdd "Build FinancePlatform microservices platform for fintech with 6-10 services using gRPC communication, event sourcing data architecture, Kubernetes orchestration, Istio service mesh, Apache Kafka messaging, API gateway, circuit breakers, distributed tracing, comprehensive monitoring with Prometheus + Grafana, automated testing, CI/CD with GitHub Actions, and AWS deployment"
```

### Enterprise Microservices Platform (Advanced)
```bash
# For: Large-scale enterprise microservices with full observability
npx claude-flow@alpha sparc tdd "Build ${PLATFORM_NAME} enterprise microservices platform for ${BUSINESS_DOMAIN} with ${SERVICE_COUNT} using polyglot ${COMMUNICATION_PATTERN} communication, ${DATA_STRATEGY} with CQRS data architecture, ${ORCHESTRATION} with auto-scaling orchestration, ${SERVICE_MESH} service mesh with mTLS, ${MESSAGE_BROKER} with event streaming, API gateway with rate limiting, advanced circuit breakers, distributed tracing with Jaeger, comprehensive observability with ${MONITORING_STACK}, security scanning, chaos engineering, automated testing pipeline, GitOps CI/CD with ${CI_CD_PLATFORM}, disaster recovery, multi-region ${CLOUD_PROVIDER} deployment, and enterprise governance"

# Example:
npx claude-flow@alpha sparc tdd "Build GlobalTrade enterprise microservices platform for logistics with 10+ services using polyglot GraphQL + gRPC communication, event sourcing with CQRS data architecture, Kubernetes with auto-scaling orchestration, Istio service mesh with mTLS, Apache Kafka with event streaming, API gateway with rate limiting, advanced circuit breakers, distributed tracing with Jaeger, comprehensive observability with ELK Stack + Prometheus, security scanning, chaos engineering, automated testing pipeline, GitOps CI/CD with GitLab CI, disaster recovery, multi-region AWS deployment, and enterprise governance"
```

---

## 🏗️ Architecture Breakdown

### Microservices Platform Structure
```
/services
  /user-service              # User management microservice
    /src                     # Source code
    /tests                   # Service tests
    /docs                    # Service documentation
    Dockerfile               # Container configuration
    docker-compose.yml       # Local development
    k8s/                     # Kubernetes manifests
  /product-service           # Product catalog microservice
  /order-service             # Order processing microservice
  /payment-service           # Payment processing microservice
  /notification-service      # Notification microservice

/infrastructure
  /api-gateway              # API Gateway configuration
  /service-mesh             # Service mesh configuration
  /monitoring               # Monitoring stack
  /security                 # Security policies
  /deployment               # Deployment scripts

/shared
  /libraries                # Shared libraries
  /schemas                  # API schemas
  /configs                  # Shared configurations
  /utils                    # Common utilities

/tools
  /scripts                  # Automation scripts
  /ci-cd                    # CI/CD pipelines
  /testing                  # Integration tests
```

### Core Microservice Components
- **API Gateway** (`/infrastructure/api-gateway/`)
- **Service Discovery** (`/infrastructure/discovery/`)
- **Configuration Server** (`/infrastructure/config/`)
- **Message Broker** (`/infrastructure/messaging/`)
- **Monitoring Stack** (`/infrastructure/monitoring/`)
- **Security Services** (`/infrastructure/security/`)

---

## 🎮 Step-by-Step Execution

### Phase 1: Specification (30 minutes)
Distributed system requirements and service boundaries.

**Expected Output:**
- Service boundary definitions
- API contracts and schemas
- Data flow diagrams
- Infrastructure requirements
- Security specifications
- Scalability requirements

### Phase 2: Pseudocode (40 minutes)
Microservice interactions and business logic.

**Expected Output:**
- Service interaction patterns
- Event flow pseudocode
- Data consistency strategies
- Error handling patterns
- Service discovery logic
- Load balancing algorithms

### Phase 3: Architecture (50 minutes)
Distributed system architecture with service design.

**Expected Output:**
- Service architecture diagrams
- Database design per service
- API gateway configuration
- Service mesh topology
- Monitoring architecture
- Deployment architecture

### Phase 4: Refinement (180-360 minutes)
Microservices-focused TDD with integration testing.

**Expected Output:**
- Complete service implementations
- API Gateway setup
- Service mesh configuration
- Message broker integration
- Monitoring and logging
- CI/CD pipeline setup

### Phase 5: Completion (60 minutes)
Orchestration, monitoring, and production deployment.

**Expected Output:**
- Container orchestration
- Service mesh deployment
- Monitoring dashboards
- Alerting configuration
- Production deployment
- Documentation and runbooks

---

## 🔧 Service Implementation Patterns

### API Gateway Configuration
```yaml
# Kong API Gateway example
apiVersion: configuration.konghq.com/v1
kind: KongIngress
metadata:
  name: api-gateway
spec:
  upstream:
    healthchecks:
      active:
        healthy:
          interval: 10
        unhealthy:
          interval: 5
  proxy:
    connect_timeout: 10000
    read_timeout: 10000
    write_timeout: 10000
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: microservices-ingress
  annotations:
    kubernetes.io/ingress.class: kong
    konghq.com/plugins: rate-limiting, cors, jwt-auth
spec:
  rules:
  - host: api.${PLATFORM_NAME}.com
    http:
      paths:
      - path: /users
        pathType: Prefix
        backend:
          service:
            name: user-service
            port:
              number: 80
      - path: /products
        pathType: Prefix
        backend:
          service:
            name: product-service
            port:
              number: 80
```

### Service Mesh Configuration (Istio)
```yaml
# Istio service mesh configuration
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: ${PLATFORM_NAME}-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "*"
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: ${PLATFORM_NAME}-tls
    hosts:
    - "*"
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ${PLATFORM_NAME}-routing
spec:
  http:
  - match:
    - uri:
        prefix: /users
    route:
    - destination:
        host: user-service
        port:
          number: 80
    fault:
      delay:
        percentage:
          value: 0.1
        fixedDelay: 5s
  - match:
    - uri:
        prefix: /products
    route:
    - destination:
        host: product-service
        port:
          number: 80
    retries:
      attempts: 3
      perTryTimeout: 2s
```

### Circuit Breaker Pattern
```javascript
// Circuit breaker implementation
const CircuitBreaker = require('opossum');

class ServiceClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.setupCircuitBreaker();
  }

  setupCircuitBreaker() {
    const options = {
      timeout: 3000,
      errorThresholdPercentage: 50,
      resetTimeout: 30000,
      rollingCountTimeout: 10000,
      rollingCountBuckets: 10
    };

    this.breaker = new CircuitBreaker(this.makeRequest.bind(this), options);
    
    this.breaker.on('open', () => {
      console.log('Circuit breaker opened');
    });

    this.breaker.on('halfOpen', () => {
      console.log('Circuit breaker half-open');
    });

    this.breaker.fallback(() => {
      return { error: 'Service temporarily unavailable' };
    });
  }

  async makeRequest(path, options) {
    const response = await fetch(`${this.baseURL}${path}`, options);
    if (!response.ok) {
      throw new Error(`Service error: ${response.status}`);
    }
    return response.json();
  }

  async get(path) {
    return this.breaker.fire(path, { method: 'GET' });
  }

  async post(path, data) {
    return this.breaker.fire(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
}
```

---

## 📨 Message-Driven Architecture

### Apache Kafka Integration
```javascript
// Kafka producer service
const { Kafka } = require('kafkajs');

class EventPublisher {
  constructor() {
    this.kafka = Kafka({
      clientId: '${PLATFORM_NAME}-producer',
      brokers: process.env.KAFKA_BROKERS.split(',')
    });
    this.producer = this.kafka.producer();
  }

  async connect() {
    await this.producer.connect();
  }

  async publishEvent(topic, event) {
    try {
      await this.producer.send({
        topic,
        messages: [{
          key: event.aggregateId,
          value: JSON.stringify({
            ...event,
            timestamp: new Date().toISOString(),
            version: '1.0'
          }),
          headers: {
            eventType: event.type,
            source: process.env.SERVICE_NAME
          }
        }]
      });
      console.log(`Event published: ${event.type}`);
    } catch (error) {
      console.error('Failed to publish event:', error);
      throw error;
    }
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}

// Kafka consumer service
class EventConsumer {
  constructor(groupId) {
    this.kafka = Kafka({
      clientId: '${PLATFORM_NAME}-consumer',
      brokers: process.env.KAFKA_BROKERS.split(',')
    });
    this.consumer = this.kafka.consumer({ groupId });
    this.handlers = new Map();
  }

  async connect() {
    await this.consumer.connect();
  }

  async subscribe(topics) {
    await this.consumer.subscribe({ topics });
  }

  registerHandler(eventType, handler) {
    this.handlers.set(eventType, handler);
  }

  async start() {
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const event = JSON.parse(message.value.toString());
        const eventType = message.headers.eventType.toString();
        
        const handler = this.handlers.get(eventType);
        if (handler) {
          try {
            await handler(event);
          } catch (error) {
            console.error(`Error handling event ${eventType}:`, error);
            // Implement dead letter queue logic
          }
        }
      }
    });
  }
}
```

### Event Sourcing Implementation
```javascript
// Event store implementation
class EventStore {
  constructor(database) {
    this.db = database;
  }

  async saveEvents(streamId, expectedVersion, events) {
    const transaction = await this.db.transaction();
    
    try {
      // Check optimistic concurrency
      const currentVersion = await this.getCurrentVersion(streamId);
      if (currentVersion !== expectedVersion) {
        throw new Error('Concurrency conflict');
      }

      // Save events
      for (const event of events) {
        await transaction.query(`
          INSERT INTO events (stream_id, version, event_type, event_data, timestamp)
          VALUES ($1, $2, $3, $4, $5)
        `, [
          streamId,
          expectedVersion + 1,
          event.type,
          JSON.stringify(event.data),
          new Date()
        ]);
        expectedVersion++;
      }

      await transaction.commit();
      
      // Publish events to message broker
      for (const event of events) {
        await this.eventPublisher.publishEvent(event.type, {
          streamId,
          ...event
        });
      }
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getEvents(streamId, fromVersion = 0) {
    const result = await this.db.query(`
      SELECT version, event_type, event_data, timestamp
      FROM events 
      WHERE stream_id = $1 AND version > $2
      ORDER BY version
    `, [streamId, fromVersion]);

    return result.rows.map(row => ({
      version: row.version,
      type: row.event_type,
      data: JSON.parse(row.event_data),
      timestamp: row.timestamp
    }));
  }
}
```

---

## 🔍 Observability & Monitoring

### Distributed Tracing with Jaeger
```javascript
// Distributed tracing setup
const { initTracer } = require('jaeger-client');
const opentracing = require('opentracing');

class TracingService {
  constructor(serviceName) {
    const config = {
      serviceName: serviceName,
      sampler: {
        type: 'const',
        param: 1
      },
      reporter: {
        logSpans: true,
        agentHost: process.env.JAEGER_AGENT_HOST,
        agentPort: process.env.JAEGER_AGENT_PORT
      }
    };

    this.tracer = initTracer(config);
    opentracing.initGlobalTracer(this.tracer);
  }

  startSpan(operationName, parentSpan = null) {
    const spanOptions = {};
    if (parentSpan) {
      spanOptions.childOf = parentSpan;
    }
    
    return this.tracer.startSpan(operationName, spanOptions);
  }

  injectHeaders(span, headers = {}) {
    this.tracer.inject(
      span.context(),
      opentracing.FORMAT_HTTP_HEADERS,
      headers
    );
    return headers;
  }

  extractSpan(headers) {
    return this.tracer.extract(
      opentracing.FORMAT_HTTP_HEADERS,
      headers
    );
  }
}

// Express middleware for tracing
const tracingMiddleware = (req, res, next) => {
  const parentSpanContext = tracer.extract(
    opentracing.FORMAT_HTTP_HEADERS,
    req.headers
  );

  const span = tracer.startSpan(`${req.method} ${req.path}`, {
    childOf: parentSpanContext
  });

  span.setTag('http.method', req.method);
  span.setTag('http.url', req.url);
  span.setTag('http.user_agent', req.get('User-Agent'));

  req.span = span;

  res.on('finish', () => {
    span.setTag('http.status_code', res.statusCode);
    if (res.statusCode >= 400) {
      span.setTag('error', true);
    }
    span.finish();
  });

  next();
};
```

### Prometheus Metrics
```javascript
// Prometheus metrics collection
const prometheus = require('prom-client');

class MetricsCollector {
  constructor(serviceName) {
    this.register = new prometheus.Register();
    this.serviceName = serviceName;
    
    // Default metrics
    prometheus.collectDefaultMetrics({ register: this.register });
    
    // Custom metrics
    this.httpRequestDuration = new prometheus.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.5, 1, 2, 5, 10]
    });

    this.httpRequestsTotal = new prometheus.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code']
    });

    this.activeConnections = new prometheus.Gauge({
      name: 'active_connections',
      help: 'Number of active connections'
    });

    this.register.registerMetric(this.httpRequestDuration);
    this.register.registerMetric(this.httpRequestsTotal);
    this.register.registerMetric(this.activeConnections);
  }

  recordHttpRequest(method, route, statusCode, duration) {
    this.httpRequestDuration
      .labels(method, route, statusCode.toString())
      .observe(duration);

    this.httpRequestsTotal
      .labels(method, route, statusCode.toString())
      .inc();
  }

  setActiveConnections(count) {
    this.activeConnections.set(count);
  }

  getMetrics() {
    return this.register.metrics();
  }
}
```

---

## 🧪 Testing Microservices

### Contract Testing with Pact
```javascript
// Consumer contract test
const { Pact } = require('@pact-foundation/pact');
const { like, eachLike } = require('@pact-foundation/pact/dsl/matchers');

describe('User Service Contract', () => {
  const provider = new Pact({
    consumer: 'order-service',
    provider: 'user-service',
    port: 1234
  });

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  test('should get user by ID', async () => {
    // Define expected interaction
    await provider.addInteraction({
      state: 'user with ID 123 exists',
      uponReceiving: 'a request for user 123',
      withRequest: {
        method: 'GET',
        path: '/users/123',
        headers: {
          'Accept': 'application/json',
          'Authorization': like('Bearer token')
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          id: '123',
          name: like('John Doe'),
          email: like('john@example.com'),
          createdAt: like('2023-01-01T00:00:00Z')
        }
      }
    });

    // Test the consumer
    const userClient = new UserClient('http://localhost:1234');
    const user = await userClient.getUser('123');
    
    expect(user.id).toBe('123');
    expect(user.name).toBeDefined();
    expect(user.email).toBeDefined();
  });
});
```

### Integration Testing
```javascript
// Integration test with testcontainers
const { GenericContainer, Wait } = require('testcontainers');
const request = require('supertest');

describe('Microservices Integration', () => {
  let containers;
  let apiGateway;

  beforeAll(async () => {
    // Start dependencies
    const postgresContainer = await new GenericContainer('postgres:13')
      .withEnvironment({
        POSTGRES_DB: 'testdb',
        POSTGRES_USER: 'test',
        POSTGRES_PASSWORD: 'test'
      })
      .withExposedPorts(5432)
      .withWaitStrategy(Wait.forLogMessage('database system is ready'))
      .start();

    const redisContainer = await new GenericContainer('redis:6')
      .withExposedPorts(6379)
      .withWaitStrategy(Wait.forLogMessage('Ready to accept connections'))
      .start();

    // Start microservices
    const userService = await new GenericContainer('user-service:test')
      .withEnvironment({
        DATABASE_URL: `postgres://test:test@${postgresContainer.getHost()}:${postgresContainer.getMappedPort(5432)}/testdb`,
        REDIS_URL: `redis://${redisContainer.getHost()}:${redisContainer.getMappedPort(6379)}`
      })
      .withExposedPorts(3001)
      .start();

    const productService = await new GenericContainer('product-service:test')
      .withEnvironment({
        DATABASE_URL: `postgres://test:test@${postgresContainer.getHost()}:${postgresContainer.getMappedPort(5432)}/testdb`
      })
      .withExposedPorts(3002)
      .start();

    containers = [postgresContainer, redisContainer, userService, productService];
    
    // Configure API Gateway
    process.env.USER_SERVICE_URL = `http://${userService.getHost()}:${userService.getMappedPort(3001)}`;
    process.env.PRODUCT_SERVICE_URL = `http://${productService.getHost()}:${productService.getMappedPort(3002)}`;
    
    apiGateway = require('../src/api-gateway/app');
  }, 60000);

  afterAll(async () => {
    for (const container of containers) {
      await container.stop();
    }
  });

  test('should create user and retrieve products', async () => {
    // Create user
    const userResponse = await request(apiGateway)
      .post('/users')
      .send({
        name: 'Test User',
        email: 'test@example.com'
      })
      .expect(201);

    const userId = userResponse.body.id;

    // Retrieve products
    const productsResponse = await request(apiGateway)
      .get('/products')
      .set('Authorization', `Bearer ${userResponse.body.token}`)
      .expect(200);

    expect(productsResponse.body).toHaveProperty('products');
    expect(Array.isArray(productsResponse.body.products)).toBe(true);
  });
});
```

---

## 🚀 DevOps & Deployment

### Kubernetes Deployment
```yaml
# User service deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  labels:
    app: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: ${PLATFORM_NAME}/user-service:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: redis-url
        resources:
          limits:
            memory: "256Mi"
            cpu: "250m"
          requests:
            memory: "128Mi"
            cpu: "100m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP
```

### GitOps CI/CD Pipeline
```yaml
# GitHub Actions workflow
name: Microservices CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      services: ${{ steps.changes.outputs.changes }}
    steps:
      - uses: actions/checkout@v3
      - uses: dorny/paths-filter@v2
        id: changes
        with:
          filters: |
            user-service:
              - 'services/user-service/**'
            product-service:
              - 'services/product-service/**'
            order-service:
              - 'services/order-service/**'

  test:
    needs: changes
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: ${{ fromJSON(needs.changes.outputs.services) }}
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: services/${{ matrix.service }}/package-lock.json
      
      - name: Install dependencies
        run: npm ci
        working-directory: services/${{ matrix.service }}
      
      - name: Run tests
        run: npm test
        working-directory: services/${{ matrix.service }}
      
      - name: Run integration tests
        run: npm run test:integration
        working-directory: services/${{ matrix.service }}

  security:
    needs: [changes, test]
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: ${{ fromJSON(needs.changes.outputs.services) }}
    steps:
      - uses: actions/checkout@v3
      - name: Run security scan
        uses: securecodewarrior/github-action-add-sarif@v1
        with:
          sarif-file: security-scan-results.sarif

  build:
    needs: [changes, test]
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: ${{ fromJSON(needs.changes.outputs.services) }}
    steps:
      - uses: actions/checkout@v3
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: services/${{ matrix.service }}
          push: true
          tags: ghcr.io/${{ github.repository }}/${{ matrix.service }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: [changes, build]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    strategy:
      matrix:
        service: ${{ fromJSON(needs.changes.outputs.services) }}
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to staging
        run: |
          kubectl set image deployment/${{ matrix.service }} \
            ${{ matrix.service }}=ghcr.io/${{ github.repository }}/${{ matrix.service }}:${{ github.sha }} \
            --namespace=staging
      
      - name: Wait for rollout
        run: |
          kubectl rollout status deployment/${{ matrix.service }} --namespace=staging --timeout=300s
```

---

## 🎯 Success Metrics

### System Architecture Metrics
- [ ] Services are properly decoupled and independently deployable
- [ ] API contracts are well-defined and versioned
- [ ] Service mesh provides secure communication
- [ ] Message broker handles event streaming reliably
- [ ] Circuit breakers prevent cascade failures
- [ ] Load balancing distributes traffic effectively

### Operational Metrics
- [ ] Services can handle expected load (RPS/TPS)
- [ ] Response times meet SLA requirements (< 200ms P95)
- [ ] System availability meets target (99.9% uptime)
- [ ] Auto-scaling responds to load changes
- [ ] Monitoring provides comprehensive observability
- [ ] Alerts trigger appropriately for issues

### Development Metrics
- [ ] CI/CD pipeline deploys changes safely
- [ ] Tests provide adequate coverage (>80%)
- [ ] Services can be developed independently
- [ ] Documentation supports development teams
- [ ] Security scans pass without critical issues
- [ ] Performance testing validates system capacity

---

## 💡 Pro Tips for Microservices

1. **Domain-Driven Design**: Align service boundaries with business domains
2. **Database Per Service**: Avoid sharing databases between services
3. **API Versioning**: Version your APIs from the beginning
4. **Circuit Breakers**: Implement circuit breakers for external dependencies
5. **Observability First**: Build monitoring and logging from day one
6. **Security**: Implement security at every layer (API Gateway, Service Mesh)
7. **Testing Strategy**: Use contract testing to verify service integrations
8. **Gradual Migration**: Migrate to microservices incrementally

---

## 🔗 Next Steps

1. **Complete Platform**: Run through the entire SPARC microservices development
2. **Add Advanced Patterns**: Implement CQRS, Event Sourcing, Saga patterns
3. **Optimize Performance**: Fine-tune for production load and scaling
4. **Enhance Security**: Add advanced security features and compliance
5. **Scale Operations**: Implement advanced monitoring and automation

---

## 📚 Learning Outcomes

After completing this scenario, you'll understand:

- Microservices architecture patterns and principles
- Service decomposition and boundary design
- API gateway and service mesh implementation
- Message-driven architecture and event streaming
- Distributed system testing strategies
- Container orchestration with Kubernetes
- Observability and monitoring in distributed systems
- DevOps practices for microservices
- Security considerations in distributed architectures
- Performance optimization and scaling strategies