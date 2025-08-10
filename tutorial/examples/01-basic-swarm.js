// 01-basic-swarm.js
// Basic swarm initialization and task execution

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function basicSwarmExample() {
  console.log('🚀 Starting Basic Swarm Example\n');
  
  try {
    // Step 1: Initialize a swarm
    console.log('1️⃣ Initializing swarm with mesh topology...');
    const initResult = await execAsync('npx claude-flow@alpha swarm init --topology mesh --max-agents 4');
    console.log('✅ Swarm initialized:', initResult.stdout);
    
    // Step 2: Spawn agents
    console.log('\n2️⃣ Spawning specialized agents...');
    const agents = [
      { type: 'researcher', name: 'Scout' },
      { type: 'coder', name: 'Builder' },
      { type: 'tester', name: 'Validator' }
    ];
    
    for (const agent of agents) {
      const spawnCmd = `npx claude-flow@alpha agent spawn --type ${agent.type} --name ${agent.name}`;
      const result = await execAsync(spawnCmd);
      console.log(`✅ Spawned ${agent.name} (${agent.type})`);
    }
    
    // Step 3: Execute a simple task
    console.log('\n3️⃣ Orchestrating task...');
    const taskCmd = 'npx claude-flow@alpha task orchestrate "Create a simple calculator function with add, subtract, multiply, and divide operations"';
    const taskResult = await execAsync(taskCmd);
    console.log('✅ Task completed:', taskResult.stdout);
    
    // Step 4: Check swarm status
    console.log('\n4️⃣ Checking swarm status...');
    const statusResult = await execAsync('npx claude-flow@alpha swarm status');
    console.log('📊 Swarm Status:', statusResult.stdout);
    
    // Step 5: Store result in memory
    console.log('\n5️⃣ Storing results in memory...');
    const memoryCmd = 'npx claude-flow@alpha memory store --key "calculator/implementation" --value "Calculator function created successfully"';
    await execAsync(memoryCmd);
    console.log('✅ Results stored in memory');
    
    console.log('\n🎉 Basic swarm example completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  basicSwarmExample();
}

module.exports = { basicSwarmExample };