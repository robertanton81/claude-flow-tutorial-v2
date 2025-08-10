// 03-memory-management.js
// Demonstrates persistent memory and cross-session knowledge sharing

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function memoryManagementExample() {
  console.log('💾 Starting Memory Management Example\n');
  
  try {
    // Initialize swarm
    console.log('1️⃣ Initializing swarm with persistent memory...');
    await execAsync('npx claude-flow@alpha swarm init --topology mesh --enable-memory');
    
    // Demonstrate memory namespaces
    console.log('\n2️⃣ Creating memory namespaces...');
    const namespaces = [
      { name: 'project', description: 'Project-wide configuration and settings' },
      { name: 'agents', description: 'Agent-specific knowledge and state' },
      { name: 'tasks', description: 'Task history and results' },
      { name: 'cache', description: 'Temporary cached computations' }
    ];
    
    for (const ns of namespaces) {
      await execAsync(`npx claude-flow@alpha memory namespace --create ${ns.name}`);
      console.log(`✅ Created namespace: ${ns.name}`);
    }
    
    // Store different types of data
    console.log('\n3️⃣ Storing various data types...');
    
    // Store configuration
    await execAsync(`npx claude-flow@alpha memory store \
      --key "config/database" \
      --value '{"host":"localhost","port":5432,"name":"myapp"}' \
      --namespace project \
      --ttl 0`); // Permanent storage
    
    // Store agent knowledge
    await execAsync(`npx claude-flow@alpha memory store \
      --key "agent/coder-1/skills" \
      --value '["JavaScript","Python","Go","Rust"]' \
      --namespace agents`);
    
    // Store task results
    await execAsync(`npx claude-flow@alpha memory store \
      --key "task/auth-implementation" \
      --value '{"status":"completed","duration":45,"quality":0.95}' \
      --namespace tasks`);
    
    // Store with TTL (cache)
    await execAsync(`npx claude-flow@alpha memory store \
      --key "cache/expensive-computation" \
      --value '{"result":42,"timestamp":"${new Date().toISOString()}"}' \
      --namespace cache \
      --ttl 3600`); // 1 hour TTL
    
    console.log('✅ Data stored across namespaces');
    
    // Retrieve and search memories
    console.log('\n4️⃣ Retrieving and searching memories...');
    
    // Retrieve specific memory
    const config = await execAsync('npx claude-flow@alpha memory retrieve --key "config/database" --namespace project');
    console.log('Retrieved config:', config.stdout.trim());
    
    // Search with patterns
    const searchResults = await execAsync('npx claude-flow@alpha memory search --pattern "task/*" --namespace tasks');
    console.log('Search results:', searchResults.stdout.trim());
    
    // Cross-agent memory sharing
    console.log('\n5️⃣ Sharing memories between agents...');
    
    // Spawn two agents
    await execAsync('npx claude-flow@alpha agent spawn --type researcher --name "researcher-alpha"');
    await execAsync('npx claude-flow@alpha agent spawn --type coder --name "coder-beta"');
    
    // Researcher stores discovery
    await execAsync(`npx claude-flow@alpha memory store \
      --key "discovery/api-pattern" \
      --value '{"pattern":"REST","authentication":"JWT","rateLimit":"100/min"}' \
      --namespace agents \
      --agent "researcher-alpha"`);
    
    // Share with coder
    await execAsync('npx claude-flow@alpha memory sync --from "researcher-alpha" --to "coder-beta" --namespace agents');
    console.log('✅ Memory synchronized between agents');
    
    // Session persistence
    console.log('\n6️⃣ Demonstrating session persistence...');
    
    // Save current session
    const sessionId = `session-${Date.now()}`;
    await execAsync(`npx claude-flow@alpha session save --id "${sessionId}"`);
    console.log(`✅ Session saved: ${sessionId}`);
    
    // Simulate session end and restore
    console.log('Simulating session end...');
    await execAsync('npx claude-flow@alpha swarm destroy');
    
    console.log('Restoring session...');
    await execAsync(`npx claude-flow@alpha session restore --id "${sessionId}"`);
    console.log('✅ Session restored with all memories intact');
    
    // Memory backup
    console.log('\n7️⃣ Creating memory backup...');
    await execAsync('npx claude-flow@alpha memory backup --path "./memory-backup.json" --compress');
    console.log('✅ Memory backed up to memory-backup.json');
    
    // Performance optimization with memory
    console.log('\n8️⃣ Memory-based optimization...');
    
    // Store computation results to avoid re-computation
    const computationKey = 'cache/fibonacci-1000';
    const exists = await execAsync(`npx claude-flow@alpha memory retrieve --key "${computationKey}" --namespace cache`)
      .then(() => true)
      .catch(() => false);
    
    if (!exists) {
      console.log('Computing expensive operation...');
      // Simulate expensive computation
      await execAsync(`npx claude-flow@alpha memory store \
        --key "${computationKey}" \
        --value '{"result":"2.686e+208","cached":true}' \
        --namespace cache \
        --ttl 86400`); // Cache for 24 hours
    } else {
      console.log('Using cached result - skipping computation');
    }
    
    console.log('\n🎉 Memory management example completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Advanced memory patterns
async function advancedMemoryPatterns() {
  console.log('\n🔧 Advanced Memory Patterns\n');
  
  // Pattern 1: Memory-based consensus
  console.log('Pattern 1: Consensus through shared memory');
  const consensusVotes = [
    { agent: 'agent-1', vote: 'approve' },
    { agent: 'agent-2', vote: 'approve' },
    { agent: 'agent-3', vote: 'reject' }
  ];
  
  for (const vote of consensusVotes) {
    await execAsync(`npx claude-flow@alpha memory store \
      --key "consensus/proposal-1/${vote.agent}" \
      --value '{"vote":"${vote.vote}","timestamp":"${Date.now()}"}' \
      --namespace agents`);
  }
  
  // Pattern 2: Memory sharding for large datasets
  console.log('\nPattern 2: Memory sharding');
  const shardData = async (data, shardCount = 4) => {
    const shardSize = Math.ceil(data.length / shardCount);
    for (let i = 0; i < shardCount; i++) {
      const shard = data.slice(i * shardSize, (i + 1) * shardSize);
      await execAsync(`npx claude-flow@alpha memory store \
        --key "shard/data-${i}" \
        --value '${JSON.stringify(shard)}' \
        --namespace cache`);
    }
  };
  
  // Pattern 3: Memory-based learning
  console.log('\nPattern 3: Learning from memory');
  const learnFromHistory = async () => {
    // Retrieve all task results
    const history = await execAsync('npx claude-flow@alpha memory search --pattern "task/*" --namespace tasks');
    // Analyze patterns and store insights
    await execAsync(`npx claude-flow@alpha memory store \
      --key "learning/task-patterns" \
      --value '{"avgDuration":30,"successRate":0.92,"commonErrors":["timeout","memory"]}' \
      --namespace agents`);
  };
  
  console.log('✅ Advanced memory patterns demonstrated');
}

// Run the example
if (require.main === module) {
  memoryManagementExample()
    .then(() => advancedMemoryPatterns())
    .catch(console.error);
}

module.exports = { memoryManagementExample, advancedMemoryPatterns };