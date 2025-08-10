# Walkthrough Scenario 2: API Service Development

## 🎯 Project Overview
Build a robust, scalable API service using SPARC methodology with comprehensive documentation, testing, and deployment automation.

---

## 📝 Fill-in Template

### Your API Details
```
SERVICE_NAME: ________________
API_PURPOSE: ________________ (e.g., "user management", "content delivery", "payment processing")
API_TYPE: ________________ (e.g., "REST", "GraphQL", "gRPC")
DATA_DOMAIN: ________________ (e.g., "users and profiles", "products and inventory", "orders and payments")
EXPECTED_USERS: ________________ (e.g., "mobile apps", "web applications", "third-party integrations")
TRAFFIC_SCALE: ________________ (e.g., "100 requests/day", "10k requests/hour", "1M requests/day")
```

### Technical Specifications
```
PROGRAMMING_LANGUAGE: ________________ (e.g., "Node.js", "Python", "Java", "Go", "C#")
FRAMEWORK: ________________ (e.g., "Express.js", "FastAPI", "Spring Boot", "Gin", ".NET Core")
DATABASE: ________________ (e.g., "PostgreSQL", "MongoDB", "MySQL", "Redis")
AUTHENTICATION: ________________ (e.g., "JWT", "OAuth2", "API Keys", "Basic Auth")
CACHING: ________________ (e.g., "Redis", "Memcached", "In-memory", "None")
DEPLOYMENT: ________________ (e.g., "Docker", "Kubernetes", "Serverless", "VPS")
```

---

## 🚀 Generated Commands

### Basic API (Beginner)
```bash
# For: Simple CRUD operations, basic authentication
npx claude-flow@alpha sparc run api "Create ${SERVICE_NAME} ${API_TYPE} service for ${DATA_DOMAIN} using ${FRAMEWORK} with basic CRUD endpoints, ${AUTHENTICATION} authentication, ${DATABASE} storage, input validation, error handling, and API documentation"

# Example:
npx claude-flow@alpha sparc run api "Create UserService REST service for users and profiles using FastAPI with basic CRUD endpoints, JWT authentication, PostgreSQL storage, input validation, error handling, and API documentation"
```

### Production-Ready API (Intermediate)
```bash
# For: Production features, monitoring, caching
npx claude-flow@alpha sparc run api "Create ${SERVICE_NAME} ${API_TYPE} service for ${DATA_DOMAIN} using ${FRAMEWORK} with comprehensive CRUD operations, ${AUTHENTICATION} authentication, ${DATABASE} database, ${CACHING} caching, rate limiting, request logging, health checks, metrics collection, automated testing, and OpenAPI documentation"

# Example:
npx claude-flow@alpha sparc run api "Create ProductAPI REST service for products and inventory using Express.js with comprehensive CRUD operations, OAuth2 authentication, MongoDB database, Redis caching, rate limiting, request logging, health checks, metrics collection, automated testing, and OpenAPI documentation"
```

### Enterprise API Platform (Advanced)
```bash
# For: Microservices, advanced features, full observability
npx claude-flow@alpha sparc run api "Create ${SERVICE_NAME} ${API_TYPE} microservice platform for ${DATA_DOMAIN} using ${FRAMEWORK} with advanced CRUD operations, multi-tenant ${AUTHENTICATION} authentication, ${DATABASE} with read replicas, ${CACHING} distributed caching, API gateway integration, circuit breakers, distributed tracing, comprehensive logging, prometheus metrics, automated testing pipeline, security scanning, performance benchmarks, CI/CD deployment to ${DEPLOYMENT}, and comprehensive documentation"

# Example:
npx claude-flow@alpha sparc run api "Create PaymentHub GraphQL microservice platform for orders and payments using Spring Boot with advanced CRUD operations, multi-tenant OAuth2 authentication, PostgreSQL with read replicas, Redis distributed caching, API gateway integration, circuit breakers, distributed tracing, comprehensive logging, prometheus metrics, automated testing pipeline, security scanning, performance benchmarks, CI/CD deployment to Kubernetes, and comprehensive documentation"
```

---

## 🏗️ Architecture Breakdown

### Core API Structure
```
/src
  /controllers     # Request handlers
  /services       # Business logic
  /models         # Data models
  /middleware     # Authentication, logging, etc.
  /routes         # API route definitions
  /utils          # Helper functions
  /config         # Configuration management
  /validators     # Input validation
  /tests          # Test suites
  /docs           # API documentation
```

### Key Components
- **Authentication Middleware** (`/src/middleware/auth.js`)
- **Rate Limiting** (`/src/middleware/rateLimit.js`)
- **Error Handling** (`/src/middleware/errorHandler.js`)
- **Request Logging** (`/src/middleware/logger.js`)
- **Input Validation** (`/src/validators/`)
- **Database Models** (`/src/models/`)
- **Business Services** (`/src/services/`)

### API Endpoints Structure
```
GET    /api/v1/health              # Health check
POST   /api/v1/auth/login          # Authentication
GET    /api/v1/auth/me             # User profile
GET    /api/v1/{resource}          # List resources
POST   /api/v1/{resource}          # Create resource
GET    /api/v1/{resource}/{id}     # Get specific resource
PUT    /api/v1/{resource}/{id}     # Update resource
DELETE /api/v1/{resource}/{id}     # Delete resource
```

---

## 🎮 Step-by-Step Execution

### Phase 1: Specification (10 minutes)
Detailed API requirements and documentation generation.

**Expected Output:**
- OpenAPI/Swagger specification
- Database schema design
- Authentication flow diagrams
- Error handling specifications
- Performance requirements

### Phase 2: Pseudocode (15 minutes)
Core API logic and algorithms.

**Expected Output:**
- Request/response flow pseudocode
- Authentication logic
- Data validation algorithms
- Error handling strategies
- Caching mechanisms

### Phase 3: Architecture (20 minutes)
System design and component architecture.

**Expected Output:**
- Service layer architecture
- Database design with relationships
- API route structure
- Middleware pipeline design
- Security architecture

### Phase 4: Refinement (60-120 minutes)
TDD implementation with comprehensive testing.

**Expected Output:**
- Complete test suite (unit + integration)
- Implemented API endpoints
- Authentication system
- Database layer with migrations
- Documentation generation

### Phase 5: Completion (20 minutes)
Deployment setup and monitoring.

**Expected Output:**
- Dockerized application
- CI/CD pipeline configuration
- Monitoring and logging setup
- Performance benchmarking
- Security scanning

---

## 🧪 Testing Strategy

### Unit Tests
```javascript
// Example test structure
describe('UserService', () => {
  test('should create user with valid data', async () => {
    // Test implementation
  });
  
  test('should validate email format', () => {
    // Validation test
  });
  
  test('should hash password before storing', () => {
    // Security test
  });
});
```

### Integration Tests
```javascript
describe('API Endpoints', () => {
  test('POST /api/v1/users should create user', async () => {
    // Full request/response test
  });
  
  test('GET /api/v1/users should require authentication', async () => {
    // Auth test
  });
});
```

### Performance Tests
```javascript
describe('Performance', () => {
  test('should handle 1000 concurrent requests', async () => {
    // Load testing
  });
  
  test('response time should be under 200ms', async () => {
    // Performance benchmarking
  });
});
```

---

## 📊 API Design Patterns

### RESTful Design
```yaml
# Example OpenAPI specification
openapi: 3.0.0
info:
  title: ${SERVICE_NAME} API
  version: 1.0.0
paths:
  /users:
    get:
      summary: List users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
        - name: limit
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: Users list
          content:
            application/json:
              schema:
                type: object
                properties:
                  users:
                    type: array
                  pagination:
                    type: object
```

### GraphQL Design
```graphql
# Example GraphQL schema
type User {
  id: ID!
  email: String!
  name: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Query {
  users(page: Int, limit: Int): UsersResponse!
  user(id: ID!): User
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}
```

---

## 🔒 Security Implementation

### Authentication Options

#### JWT Implementation
```javascript
// JWT middleware example
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
```

#### OAuth2 Implementation
```javascript
// OAuth2 configuration
const oauth2Config = {
  clientId: process.env.OAUTH2_CLIENT_ID,
  clientSecret: process.env.OAUTH2_CLIENT_SECRET,
  redirectUri: process.env.OAUTH2_REDIRECT_URI,
  tokenEndpoint: process.env.OAUTH2_TOKEN_ENDPOINT
};
```

### Input Validation
```javascript
// Joi validation example
const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(2).max(50).required()
});
```

---

## 📈 Performance Optimization

### Caching Strategy
```javascript
// Redis caching example
const redis = require('redis');
const client = redis.createClient();

const getCachedData = async (key) => {
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache error:', error);
    return null;
  }
};
```

### Database Optimization
```sql
-- Example indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

### Rate Limiting
```javascript
// Rate limiting middleware
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
```

---

## 🚀 Deployment Options

### Basic Deployment (Docker)
```dockerfile
# Generated Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Kubernetes Deployment
```yaml
# Generated k8s configuration
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${SERVICE_NAME}
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ${SERVICE_NAME}
  template:
    metadata:
      labels:
        app: ${SERVICE_NAME}
    spec:
      containers:
      - name: api
        image: ${SERVICE_NAME}:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
```

### Serverless Deployment
```yaml
# Generated serverless.yml
service: ${SERVICE_NAME}

provider:
  name: aws
  runtime: nodejs16.x
  stage: ${STAGE}
  region: ${AWS_REGION}

functions:
  api:
    handler: src/lambda.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
```

---

## 📊 Monitoring & Observability

### Health Checks
```javascript
// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    checks: {
      database: await checkDatabase(),
      cache: await checkCache(),
      memory: process.memoryUsage()
    }
  };
  
  res.status(200).json(health);
});
```

### Metrics Collection
```javascript
// Prometheus metrics
const prometheus = require('prom-client');

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

const httpRequestsTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});
```

### Logging Strategy
```javascript
// Structured logging with Winston
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

---

## 📚 Documentation Generation

### OpenAPI Documentation
The system automatically generates comprehensive API documentation including:
- Endpoint descriptions
- Request/response schemas
- Authentication requirements
- Example requests and responses
- Error codes and messages

### Developer Portal
```markdown
# Generated API Documentation

## Authentication
All API requests require authentication using JWT tokens.

## Endpoints
### Users
- `GET /api/v1/users` - List users
- `POST /api/v1/users` - Create user
- `GET /api/v1/users/{id}` - Get user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

## Rate Limits
- 100 requests per 15 minutes per IP address
- 1000 requests per hour for authenticated users

## Error Handling
All errors return JSON in the following format:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {...}
  }
}
```
```

---

## 🎯 Success Metrics

### Functional Requirements
- [ ] All CRUD operations work correctly
- [ ] Authentication system is secure
- [ ] Input validation prevents bad data
- [ ] Error handling is comprehensive
- [ ] API documentation is complete
- [ ] Rate limiting prevents abuse

### Performance Requirements
- [ ] Response time < 200ms for 95% of requests
- [ ] Can handle expected concurrent load
- [ ] Database queries are optimized
- [ ] Caching reduces response times
- [ ] Memory usage is stable

### Security Requirements
- [ ] Authentication is properly implemented
- [ ] Input validation prevents injection attacks
- [ ] Sensitive data is properly encrypted
- [ ] API keys/tokens are secure
- [ ] HTTPS is enforced
- [ ] Security headers are set

---

## 💡 Pro Tips for API Development

1. **API-First Design**: Design your API before implementing
2. **Version Your API**: Use versioning from day one (`/v1/`)
3. **Comprehensive Testing**: Unit, integration, and load tests
4. **Error Handling**: Consistent error responses across all endpoints
5. **Documentation**: Keep API docs updated automatically
6. **Performance**: Cache frequently requested data
7. **Security**: Never trust client input, validate everything
8. **Monitoring**: Track performance and errors in production

---

## 🔗 Next Steps

1. **Complete the API**: Run the full SPARC development process
2. **Add Business Logic**: Implement your specific domain requirements
3. **Integrate with Frontend**: Connect to web/mobile applications
4. **Scale the Service**: Learn about microservices and load balancing
5. **Production Deployment**: Set up monitoring, logging, and alerting

---

## 📚 Learning Outcomes

After completing this scenario, you'll understand:

- RESTful API design principles
- Authentication and authorization systems
- Database design and optimization
- Input validation and error handling
- API testing strategies
- Performance optimization techniques
- Security best practices
- Documentation generation
- Monitoring and observability
- Deployment and scaling patterns