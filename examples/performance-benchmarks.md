# Production Performance Benchmarking Suite

## Benchmarking Philosophy

### Real-World Performance Testing
- **No Synthetic Loads**: All benchmarks use realistic user behavior patterns
- **Production Parity**: Test environments mirror production infrastructure
- **Multi-Dimensional Metrics**: Measure latency, throughput, resource usage, and user experience
- **Continuous Validation**: Benchmarks run on every deployment and monitor performance regression

## Performance Testing Tools Matrix

| Tool | Use Case | Strengths | Integration |
|------|----------|-----------|-------------|
| **Artillery** | HTTP Load Testing | WebSocket support, scenarios | CI/CD pipelines |
| **k6** | API Performance | JavaScript scripting, cloud | GitHub Actions |
| **Playwright** | End-to-End Performance | Real browser metrics | User experience |
| **Apache Bench** | Simple HTTP testing | Quick validation | Smoke tests |
| **JMeter** | Complex scenarios | GUI, distributed testing | Enterprise |

---

## E-commerce Platform Benchmarks

### Load Testing Configuration
```yaml
# artillery-ecommerce.yml
config:
  target: 'https://api.yourapp.com'
  phases:
    # Warm-up phase
    - duration: 60
      arrivalRate: 10
      name: "Warm-up"
    
    # Normal load
    - duration: 300
      arrivalRate: 100
      name: "Normal Load"
    
    # Peak traffic (Black Friday simulation)
    - duration: 600
      arrivalRate: 1000
      name: "Peak Load"
      
    # Spike test
    - duration: 60
      arrivalRate: 2000
      name: "Spike Test"
      
    # Cool down
    - duration: 120
      arrivalRate: 50
      name: "Cool Down"

  defaults:
    headers:
      Content-Type: 'application/json'
      User-Agent: 'Artillery Load Test'

  plugins:
    metrics-by-endpoint: {}
    publish-metrics:
      - type: datadog
        apiKey: "{{ $processEnvironment.DATADOG_API_KEY }}"
        prefix: "artillery.ecommerce"

scenarios:
  - name: "Guest User Browse & Search"
    weight: 40
    flow:
      - get:
          url: "/api/products"
          capture:
            - json: "$.products[0].id"
              as: "productId"
      - get:
          url: "/api/products/{{ productId }}"
      - get:
          url: "/api/products/search?q=electronics"
      - think: 2

  - name: "Authenticated User Purchase Flow"
    weight: 35
    flow:
      # Login
      - post:
          url: "/api/auth/login"
          json:
            email: "user{{ $randomInt(1, 10000) }}@testdomain.com"
            password: "testpass123"
          capture:
            - json: "$.token"
              as: "authToken"
            - json: "$.user.id"
              as: "userId"
      
      # Browse products
      - get:
          url: "/api/products?category=electronics"
          headers:
            Authorization: "Bearer {{ authToken }}"
          capture:
            - json: "$.products[0].id"
              as: "productId"
      
      # Add to cart
      - post:
          url: "/api/cart/add"
          headers:
            Authorization: "Bearer {{ authToken }}"
          json:
            productId: "{{ productId }}"
            quantity: "{{ $randomInt(1, 3) }}"
      
      # View cart
      - get:
          url: "/api/cart"
          headers:
            Authorization: "Bearer {{ authToken }}"
          capture:
            - json: "$.total"
              as: "cartTotal"
      
      # Create order
      - post:
          url: "/api/orders"
          headers:
            Authorization: "Bearer {{ authToken }}"
          json:
            shippingAddress:
              street: "123 Test St"
              city: "Test City"
              state: "CA"
              zipCode: "90210"
          capture:
            - json: "$.order.id"
              as: "orderId"
      
      # Create payment intent
      - post:
          url: "/api/payments/create-intent"
          headers:
            Authorization: "Bearer {{ authToken }}"
          json:
            orderId: "{{ orderId }}"
            amount: "{{ cartTotal }}"
            currency: "usd"
          capture:
            - json: "$.paymentIntentId"
              as: "paymentIntentId"
      
      # Think time (user enters payment info)
      - think: 5
      
      # Complete payment (simulated)
      - post:
          url: "/api/payments/confirm/{{ paymentIntentId }}"
          headers:
            Authorization: "Bearer {{ authToken }}"

  - name: "Admin Operations"
    weight: 5
    flow:
      # Admin login
      - post:
          url: "/api/auth/login"
          json:
            email: "admin@testdomain.com"
            password: "adminpass123"
          capture:
            - json: "$.token"
              as: "adminToken"
      
      # View dashboard metrics
      - get:
          url: "/api/admin/dashboard"
          headers:
            Authorization: "Bearer {{ adminToken }}"
      
      # Manage inventory
      - get:
          url: "/api/admin/inventory"
          headers:
            Authorization: "Bearer {{ adminToken }}"
      
      # View orders
      - get:
          url: "/api/admin/orders?status=pending"
          headers:
            Authorization: "Bearer {{ adminToken }}"

  - name: "Real-time Features Test"
    weight: 20
    engine: ws
    flow:
      # Connect to WebSocket
      - connect:
          url: "wss://api.yourapp.com"
          auth:
            token: "test-token"
      
      # Subscribe to inventory updates
      - send:
          message: |
            {
              "type": "subscribe",
              "channel": "inventory:updates",
              "productIds": [1, 2, 3, 4, 5]
            }
      
      # Wait for real-time updates
      - think: 10
      
      # Subscribe to order updates
      - send:
          message: |
            {
              "type": "subscribe", 
              "channel": "orders:status",
              "userId": "{{ $randomInt(1, 1000) }}"
            }
```

### Performance Metrics Collection
```javascript
// performance-collector.js
const { performance, PerformanceObserver } = require('perf_hooks');
const prometheus = require('prom-client');

class PerformanceCollector {
  constructor() {
    this.register = new prometheus.Registry();
    this.setupMetrics();
    this.setupPerformanceObserver();
  }
  
  setupMetrics() {
    // Response time histogram
    this.responseTimeHistogram = new prometheus.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.5, 1, 2, 5, 10]
    });
    
    // Request rate counter
    this.requestCounter = new prometheus.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code']
    });
    
    // Active connections gauge
    this.activeConnections = new prometheus.Gauge({
      name: 'websocket_connections_active',
      help: 'Number of active WebSocket connections'
    });
    
    // Database query performance
    this.dbQueryHistogram = new prometheus.Histogram({
      name: 'database_query_duration_seconds',
      help: 'Duration of database queries',
      labelNames: ['query_type', 'table'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2]
    });
    
    // Payment processing metrics
    this.paymentHistogram = new prometheus.Histogram({
      name: 'payment_processing_duration_seconds',
      help: 'Duration of payment processing',
      labelNames: ['payment_method', 'status'],
      buckets: [0.5, 1, 2, 5, 10, 30]
    });
    
    this.register.registerMetric(this.responseTimeHistogram);
    this.register.registerMetric(this.requestCounter);
    this.register.registerMetric(this.activeConnections);
    this.register.registerMetric(this.dbQueryHistogram);
    this.register.registerMetric(this.paymentHistogram);
  }
  
  setupPerformanceObserver() {
    // Monitor HTTP request performance
    const httpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.startsWith('http-request')) {
          const [, method, route, statusCode] = entry.name.split(':');
          this.responseTimeHistogram
            .labels(method, route, statusCode)
            .observe(entry.duration / 1000);
          this.requestCounter
            .labels(method, route, statusCode)
            .inc();
        }
      }
    });
    httpObserver.observe({ entryTypes: ['measure'] });
    
    // Monitor database performance
    const dbObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.startsWith('db-query')) {
          const [, queryType, table] = entry.name.split(':');
          this.dbQueryHistogram
            .labels(queryType, table)
            .observe(entry.duration / 1000);
        }
      }
    });
    dbObserver.observe({ entryTypes: ['measure'] });
  }
  
  // Middleware to track HTTP requests
  trackHttpRequest() {
    return (req, res, next) => {
      const startTime = Date.now();
      const startMark = `http-request-start-${req.id}`;
      const endMark = `http-request-end-${req.id}`;
      
      performance.mark(startMark);
      
      res.on('finish', () => {
        performance.mark(endMark);
        performance.measure(
          `http-request:${req.method}:${req.route?.path || req.path}:${res.statusCode}`,
          startMark,
          endMark
        );
        
        // Clean up marks
        performance.clearMarks(startMark);
        performance.clearMarks(endMark);
      });
      
      next();
    };
  }
  
  // Database query tracker
  trackDatabaseQuery(queryType, table) {
    const startMark = `db-query-start-${Date.now()}`;
    const endMark = `db-query-end-${Date.now()}`;
    
    performance.mark(startMark);
    
    return () => {
      performance.mark(endMark);
      performance.measure(
        `db-query:${queryType}:${table}`,
        startMark,
        endMark
      );
      
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
    };
  }
  
  getMetrics() {
    return this.register.metrics();
  }
}

module.exports = PerformanceCollector;
```

---

## Real-time Collaboration Platform Benchmarks

### WebSocket Load Testing
```javascript
// websocket-load-test.js
const WebSocket = require('ws');
const { performance } = require('perf_hooks');

class WebSocketLoadTest {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'ws://localhost:8001';
    this.concurrentUsers = options.concurrentUsers || 1000;
    this.testDuration = options.testDuration || 300000; // 5 minutes
    this.messageRate = options.messageRate || 10; // messages per second per user
    this.connections = [];
    this.metrics = {
      connectionsEstablished: 0,
      connectionsFailed: 0,
      messagesSent: 0,
      messagesReceived: 0,
      latencies: [],
      errors: []
    };
  }
  
  async runTest() {
    console.log(`🚀 Starting WebSocket load test with ${this.concurrentUsers} concurrent users`);
    
    const startTime = Date.now();
    
    // Establish connections
    await this.establishConnections();
    
    // Start sending messages
    const messageInterval = setInterval(() => {
      this.sendMessages();
    }, 1000 / this.messageRate);
    
    // Run for specified duration
    await new Promise(resolve => setTimeout(resolve, this.testDuration));
    
    // Clean up
    clearInterval(messageInterval);
    await this.closeConnections();
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    return this.generateReport(duration);
  }
  
  async establishConnections() {
    const connectionPromises = [];
    
    for (let i = 0; i < this.concurrentUsers; i++) {
      connectionPromises.push(this.createConnection(i));
    }
    
    await Promise.allSettled(connectionPromises);
  }
  
  createConnection(userId) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`${this.baseUrl}?userId=${userId}`);
      const connectionStart = performance.now();
      
      ws.on('open', () => {
        const connectionTime = performance.now() - connectionStart;
        this.metrics.latencies.push(connectionTime);
        this.metrics.connectionsEstablished++;
        
        // Authenticate
        ws.send(JSON.stringify({
          type: 'authenticate',
          token: `test-token-${userId}`
        }));
        
        // Join a room
        ws.send(JSON.stringify({
          type: 'join-room',
          roomId: `room-${userId % 10}` // Distribute users across 10 rooms
        }));
        
        this.connections.push({ ws, userId });
        resolve();
      });
      
      ws.on('error', (error) => {
        this.metrics.connectionsFailed++;
        this.metrics.errors.push({ userId, error: error.message });
        reject(error);
      });
      
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          this.metrics.messagesReceived++;
          
          // Calculate message latency if timestamp is present
          if (message.timestamp) {
            const latency = Date.now() - message.timestamp;
            this.metrics.latencies.push(latency);
          }
        } catch (error) {
          this.metrics.errors.push({ userId, error: 'Invalid JSON received' });
        }
      });
      
      ws.on('close', () => {
        // Remove from connections array
        this.connections = this.connections.filter(conn => conn.userId !== userId);
      });
    });
  }
  
  sendMessages() {
    const messagesToSend = Math.min(this.messageRate, this.connections.length);
    
    for (let i = 0; i < messagesToSend; i++) {
      const connection = this.connections[Math.floor(Math.random() * this.connections.length)];
      
      if (connection && connection.ws.readyState === WebSocket.OPEN) {
        const message = {
          type: 'message',
          content: `Test message ${this.metrics.messagesSent}`,
          timestamp: Date.now(),
          roomId: `room-${connection.userId % 10}`
        };
        
        try {
          connection.ws.send(JSON.stringify(message));
          this.metrics.messagesSent++;
        } catch (error) {
          this.metrics.errors.push({ 
            userId: connection.userId, 
            error: 'Failed to send message' 
          });
        }
      }
    }
  }
  
  async closeConnections() {
    const closePromises = this.connections.map(conn => {
      return new Promise(resolve => {
        if (conn.ws.readyState === WebSocket.OPEN) {
          conn.ws.close();
          conn.ws.on('close', resolve);
        } else {
          resolve();
        }
      });
    });
    
    await Promise.all(closePromises);
  }
  
  generateReport(duration) {
    const avgLatency = this.metrics.latencies.reduce((sum, lat) => sum + lat, 0) / this.metrics.latencies.length;
    const p95Latency = this.percentile(this.metrics.latencies, 0.95);
    const p99Latency = this.percentile(this.metrics.latencies, 0.99);
    
    return {
      duration: duration,
      concurrentUsers: this.concurrentUsers,
      connectionsEstablished: this.metrics.connectionsEstablished,
      connectionsFailed: this.metrics.connectionsFailed,
      messagesSent: this.metrics.messagesSent,
      messagesReceived: this.metrics.messagesReceived,
      messagesPerSecond: (this.metrics.messagesSent / (duration / 1000)).toFixed(2),
      avgLatency: avgLatency.toFixed(2),
      p95Latency: p95Latency.toFixed(2),
      p99Latency: p99Latency.toFixed(2),
      errorRate: ((this.metrics.errors.length / this.metrics.messagesSent) * 100).toFixed(2),
      errors: this.metrics.errors
    };
  }
  
  percentile(arr, p) {
    const sorted = arr.slice().sort((a, b) => a - b);
    const index = (p * (sorted.length - 1));
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    
    if (upper >= sorted.length) return sorted[sorted.length - 1];
    
    return sorted[lower] + (index - lower) * (sorted[upper] - sorted[lower]);
  }
}

// Usage
async function runWebSocketBenchmark() {
  const loadTest = new WebSocketLoadTest({
    baseUrl: 'ws://localhost:8001',
    concurrentUsers: 1000,
    testDuration: 300000, // 5 minutes
    messageRate: 5 // messages per second per user
  });
  
  const results = await loadTest.runTest();
  console.log('\n📊 WebSocket Load Test Results:');
  console.log(JSON.stringify(results, null, 2));
}

if (require.main === module) {
  runWebSocketBenchmark().catch(console.error);
}

module.exports = WebSocketLoadTest;
```

### Document Collaboration Performance Test
```javascript
// document-collab-benchmark.js
const WebSocket = require('ws');
const Y = require('yjs');

class DocumentCollaborationBenchmark {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'ws://localhost:8001';
    this.collaborators = options.collaborators || 50;
    this.documentId = options.documentId || 'benchmark-doc';
    this.operationsPerSecond = options.operationsPerSecond || 10;
    this.testDuration = options.testDuration || 180000; // 3 minutes
    this.ydocs = [];
    this.connections = [];
    this.metrics = {
      operationsApplied: 0,
      conflictsResolved: 0,
      syncErrors: 0,
      avgSyncTime: 0,
      documentSizes: []
    };
  }
  
  async runBenchmark() {
    console.log(`🚀 Starting document collaboration benchmark with ${this.collaborators} collaborators`);
    
    // Create Y.Doc instances for each collaborator
    await this.setupCollaborators();
    
    // Start collaborative editing simulation
    const editingInterval = setInterval(() => {
      this.simulateEditing();
    }, 1000 / this.operationsPerSecond);
    
    // Run benchmark for specified duration
    await new Promise(resolve => setTimeout(resolve, this.testDuration));
    
    // Clean up
    clearInterval(editingInterval);
    await this.cleanup();
    
    return this.generateBenchmarkReport();
  }
  
  async setupCollaborators() {
    const setupPromises = [];
    
    for (let i = 0; i < this.collaborators; i++) {
      setupPromises.push(this.setupCollaborator(i));
    }
    
    await Promise.all(setupPromises);
  }
  
  async setupCollaborator(collaboratorId) {
    return new Promise((resolve, reject) => {
      const ydoc = new Y.Doc();
      const ytext = ydoc.getText('content');
      
      // WebSocket connection for Y.js sync
      const ws = new WebSocket(`${this.baseUrl}/yjs/${this.documentId}`);
      
      ws.on('open', () => {
        // Send initial sync
        const syncMessage = Y.encodeStateAsUpdate(ydoc);
        ws.send(syncMessage);
        
        this.ydocs.push({ ydoc, ytext, collaboratorId });
        this.connections.push(ws);
        resolve();
      });
      
      ws.on('message', (data) => {
        try {
          // Apply update from other collaborators
          const start = performance.now();
          Y.applyUpdate(ydoc, data);
          const syncTime = performance.now() - start;
          
          this.metrics.avgSyncTime = (this.metrics.avgSyncTime + syncTime) / 2;
          this.metrics.operationsApplied++;
        } catch (error) {
          this.metrics.syncErrors++;
        }
      });
      
      ws.on('error', reject);
      
      // Track document state changes
      ytext.observe((event) => {
        if (event.transaction.local) {
          // Local change, broadcast to others
          const update = Y.encodeStateAsUpdate(ydoc, event.transaction.beforeState);
          ws.send(update);
        } else {
          // Remote change received
          this.metrics.conflictsResolved += event.changes.keys.size;
        }
        
        // Track document size
        this.metrics.documentSizes.push(ytext.length);
      });
    });
  }
  
  simulateEditing() {
    if (this.ydocs.length === 0) return;
    
    // Select random collaborator to make edit
    const collaborator = this.ydocs[Math.floor(Math.random() * this.ydocs.length)];
    const { ytext } = collaborator;
    
    // Simulate different types of editing operations
    const operations = [
      () => this.insertText(ytext),
      () => this.deleteText(ytext),
      () => this.formatText(ytext),
      () => this.replaceText(ytext)
    ];
    
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    try {
      operation();
    } catch (error) {
      this.metrics.syncErrors++;
    }
  }
  
  insertText(ytext) {
    const position = Math.floor(Math.random() * (ytext.length + 1));
    const text = this.generateRandomText();
    ytext.insert(position, text);
  }
  
  deleteText(ytext) {
    if (ytext.length === 0) return;
    
    const position = Math.floor(Math.random() * ytext.length);
    const length = Math.min(Math.floor(Math.random() * 10) + 1, ytext.length - position);
    ytext.delete(position, length);
  }
  
  formatText(ytext) {
    if (ytext.length === 0) return;
    
    const start = Math.floor(Math.random() * ytext.length);
    const end = Math.min(start + Math.floor(Math.random() * 20), ytext.length);
    
    ytext.format(start, end - start, {
      bold: Math.random() > 0.5,
      italic: Math.random() > 0.5
    });
  }
  
  replaceText(ytext) {
    if (ytext.length === 0) return;
    
    const position = Math.floor(Math.random() * ytext.length);
    const deleteLength = Math.min(Math.floor(Math.random() * 5) + 1, ytext.length - position);
    const newText = this.generateRandomText();
    
    ytext.delete(position, deleteLength);
    ytext.insert(position, newText);
  }
  
  generateRandomText() {
    const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit'];
    const wordCount = Math.floor(Math.random() * 5) + 1;
    return Array.from({ length: wordCount }, () => 
      words[Math.floor(Math.random() * words.length)]
    ).join(' ') + ' ';
  }
  
  async cleanup() {
    const closePromises = this.connections.map(ws => {
      return new Promise(resolve => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
          ws.on('close', resolve);
        } else {
          resolve();
        }
      });
    });
    
    await Promise.all(closePromises);
  }
  
  generateBenchmarkReport() {
    const avgDocSize = this.metrics.documentSizes.reduce((sum, size) => sum + size, 0) / this.metrics.documentSizes.length;
    const maxDocSize = Math.max(...this.metrics.documentSizes);
    
    return {
      collaborators: this.collaborators,
      testDuration: this.testDuration,
      operationsApplied: this.metrics.operationsApplied,
      operationsPerSecond: (this.metrics.operationsApplied / (this.testDuration / 1000)).toFixed(2),
      conflictsResolved: this.metrics.conflictsResolved,
      syncErrors: this.metrics.syncErrors,
      avgSyncTime: this.metrics.avgSyncTime.toFixed(2),
      avgDocumentSize: avgDocSize.toFixed(0),
      maxDocumentSize: maxDocSize,
      errorRate: ((this.metrics.syncErrors / this.metrics.operationsApplied) * 100).toFixed(2)
    };
  }
}

module.exports = DocumentCollaborationBenchmark;
```

---

## DevOps Dashboard Benchmarks

### Metrics Collection Performance
```javascript
// metrics-collection-benchmark.js
const axios = require('axios');
const { performance } = require('perf_hooks');

class MetricsCollectionBenchmark {
  constructor(options = {}) {
    this.dashboardUrl = options.dashboardUrl || 'http://localhost:8002';
    this.metricsEndpoints = [
      '/api/metrics/system',
      '/api/metrics/applications', 
      '/api/metrics/infrastructure',
      '/api/metrics/custom'
    ];
    this.concurrentRequests = options.concurrentRequests || 100;
    this.testDuration = options.testDuration || 300000; // 5 minutes
    this.metrics = {
      requestsSent: 0,
      requestsCompleted: 0,
      requestsFailed: 0,
      responseTimesMs: [],
      dataPointsCollected: 0,
      memoryUsage: []
    };
  }
  
  async runBenchmark() {
    console.log(`🚀 Starting metrics collection benchmark`);
    
    const startTime = Date.now();
    
    // Start memory monitoring
    const memoryInterval = setInterval(() => {
      this.metrics.memoryUsage.push(process.memoryUsage().heapUsed / 1024 / 1024);
    }, 1000);
    
    // Start concurrent metric collection
    const testPromise = this.runConcurrentCollection();
    
    // Stop after test duration
    setTimeout(() => {
      this.stopBenchmark = true;
    }, this.testDuration);
    
    await testPromise;
    clearInterval(memoryInterval);
    
    const duration = Date.now() - startTime;
    return this.generateReport(duration);
  }
  
  async runConcurrentCollection() {
    const promises = [];
    
    for (let i = 0; i < this.concurrentRequests; i++) {
      promises.push(this.collectMetricsLoop(i));
    }
    
    await Promise.all(promises);
  }
  
  async collectMetricsLoop(workerId) {
    while (!this.stopBenchmark) {
      const endpoint = this.metricsEndpoints[workerId % this.metricsEndpoints.length];
      
      try {
        const start = performance.now();
        const response = await axios.get(`${this.dashboardUrl}${endpoint}`, {
          timeout: 10000,
          headers: {
            'Authorization': `Bearer test-token-${workerId}`
          }
        });
        const duration = performance.now() - start;
        
        this.metrics.requestsSent++;
        this.metrics.requestsCompleted++;
        this.metrics.responseTimesMs.push(duration);
        
        // Count data points in response
        if (response.data && response.data.metrics) {
          this.metrics.dataPointsCollected += Array.isArray(response.data.metrics) 
            ? response.data.metrics.length 
            : Object.keys(response.data.metrics).length;
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        this.metrics.requestsSent++;
        this.metrics.requestsFailed++;
        
        // Exponential backoff on errors
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  generateReport(duration) {
    const avgResponseTime = this.metrics.responseTimesMs.reduce((sum, time) => sum + time, 0) / this.metrics.responseTimesMs.length;
    const p95ResponseTime = this.percentile(this.metrics.responseTimesMs, 0.95);
    const p99ResponseTime = this.percentile(this.metrics.responseTimesMs, 0.99);
    const avgMemoryUsage = this.metrics.memoryUsage.reduce((sum, mem) => sum + mem, 0) / this.metrics.memoryUsage.length;
    const maxMemoryUsage = Math.max(...this.metrics.memoryUsage);
    
    return {
      testDuration: duration,
      concurrentWorkers: this.concurrentRequests,
      totalRequests: this.metrics.requestsSent,
      completedRequests: this.metrics.requestsCompleted,
      failedRequests: this.metrics.requestsFailed,
      successRate: ((this.metrics.requestsCompleted / this.metrics.requestsSent) * 100).toFixed(2),
      requestsPerSecond: (this.metrics.requestsCompleted / (duration / 1000)).toFixed(2),
      avgResponseTime: avgResponseTime.toFixed(2),
      p95ResponseTime: p95ResponseTime.toFixed(2),
      p99ResponseTime: p99ResponseTime.toFixed(2),
      dataPointsCollected: this.metrics.dataPointsCollected,
      dataPointsPerSecond: (this.metrics.dataPointsCollected / (duration / 1000)).toFixed(2),
      avgMemoryUsageMB: avgMemoryUsage.toFixed(2),
      maxMemoryUsageMB: maxMemoryUsage.toFixed(2)
    };
  }
  
  percentile(arr, p) {
    const sorted = arr.slice().sort((a, b) => a - b);
    const index = (p * (sorted.length - 1));
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    
    if (upper >= sorted.length) return sorted[sorted.length - 1];
    
    return sorted[lower] + (index - lower) * (sorted[upper] - sorted[lower]);
  }
}

module.exports = MetricsCollectionBenchmark;
```

---

## Continuous Performance Monitoring

### GitHub Actions Performance Pipeline
```yaml
# .github/workflows/performance-tests.yml
name: Performance Testing Pipeline

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM

jobs:
  performance-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        test-type: [ecommerce, collaboration, devops]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Start test environment
        run: |
          docker-compose -f docker-compose.test.yml up -d
          sleep 30 # Wait for services to be ready
          
      - name: Run Performance Tests
        run: npm run test:performance:${{ matrix.test-type }}
        env:
          TEST_DURATION: 300000 # 5 minutes
          CONCURRENT_USERS: 1000
          
      - name: Upload Performance Report
        uses: actions/upload-artifact@v3
        with:
          name: performance-report-${{ matrix.test-type }}
          path: |
            performance-reports/
            screenshots/
            
      - name: Comment Performance Results
        uses: actions/github-script@v6
        if: github.event_name == 'pull_request'
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('performance-reports/${{ matrix.test-type }}.json', 'utf8'));
            
            const comment = `
            ## Performance Test Results - ${{ matrix.test-type }}
            
            | Metric | Value | Threshold | Status |
            |--------|-------|-----------|--------|
            | Response Time (p95) | ${report.p95ResponseTime}ms | <500ms | ${report.p95ResponseTime < 500 ? '✅' : '❌'} |
            | Requests/sec | ${report.requestsPerSecond} | >100 | ${report.requestsPerSecond > 100 ? '✅' : '❌'} |
            | Error Rate | ${report.errorRate}% | <1% | ${report.errorRate < 1 ? '✅' : '❌'} |
            | Success Rate | ${report.successRate}% | >99% | ${report.successRate > 99 ? '✅' : '❌'} |
            
            ${report.successRate < 99 ? '⚠️ Performance regression detected!' : '✅ Performance targets met'}
            `;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
            
      - name: Fail on Performance Regression
        run: |
          if [[ $(jq '.successRate < 99 or .p95ResponseTime > 500 or .errorRate > 1' performance-reports/${{ matrix.test-type }}.json) == "true" ]]; then
            echo "Performance regression detected!"
            exit 1
          fi
```

This comprehensive benchmarking suite provides real-world performance validation for all three production applications, ensuring they meet enterprise-grade performance requirements under realistic load conditions.