// 02-parallel-execution.js
// Demonstrates parallel task execution for maximum efficiency

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function parallelExecutionExample() {
  console.log('⚡ Starting Parallel Execution Example\n');
  
  try {
    // Initialize swarm with star topology for parallel tasks
    console.log('1️⃣ Initializing star topology swarm...');
    await execAsync('npx claude-flow@alpha swarm init --topology star --max-agents 8');
    
    // Define parallel tasks
    const tasks = [
      {
        name: 'API Development',
        description: 'Create RESTful API endpoints for user management',
        agent: 'coder'
      },
      {
        name: 'Database Schema',
        description: 'Design PostgreSQL schema for user data',
        agent: 'analyst'
      },
      {
        name: 'Test Suite',
        description: 'Write comprehensive unit tests',
        agent: 'tester'
      },
      {
        name: 'Documentation',
        description: 'Generate API documentation',
        agent: 'documenter'
      }
    ];
    
    console.log('\n2️⃣ Spawning agents in parallel...');
    // Spawn all agents simultaneously
    const spawnPromises = tasks.map(task => 
      execAsync(`npx claude-flow@alpha agent spawn --type ${task.agent} --name "${task.name}-agent"`)
    );
    await Promise.all(spawnPromises);
    console.log('✅ All agents spawned simultaneously');
    
    console.log('\n3️⃣ Executing tasks in parallel...');
    const startTime = Date.now();
    
    // Execute all tasks in parallel
    const taskPromises = tasks.map(task => 
      execAsync(`npx claude-flow@alpha task orchestrate "${task.description}" --strategy parallel --priority high`)
    );
    
    const results = await Promise.all(taskPromises);
    const endTime = Date.now();
    
    console.log(`✅ All tasks completed in ${(endTime - startTime) / 1000}s`);
    
    // Demonstrate the difference with sequential execution
    console.log('\n4️⃣ Comparing with sequential execution...');
    const seqStartTime = Date.now();
    
    for (const task of tasks) {
      await execAsync(`npx claude-flow@alpha task orchestrate "${task.description}" --strategy sequential`);
    }
    
    const seqEndTime = Date.now();
    
    console.log('\n📊 Performance Comparison:');
    console.log(`Parallel: ${(endTime - startTime) / 1000}s`);
    console.log(`Sequential: ${(seqEndTime - seqStartTime) / 1000}s`);
    console.log(`Speed improvement: ${((seqEndTime - seqStartTime) / (endTime - startTime)).toFixed(1)}x`);
    
    // Store performance metrics
    console.log('\n5️⃣ Storing performance metrics...');
    await execAsync(`npx claude-flow@alpha memory store --key "performance/parallel" --value "${JSON.stringify({
      parallel_time: (endTime - startTime) / 1000,
      sequential_time: (seqEndTime - seqStartTime) / 1000,
      speedup: ((seqEndTime - seqStartTime) / (endTime - startTime))
    })}"`);
    
    console.log('\n🎉 Parallel execution example completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Advanced parallel patterns
async function advancedParallelPatterns() {
  console.log('\n🔧 Advanced Parallel Patterns\n');
  
  // Pattern 1: Map-Reduce
  console.log('Pattern 1: Map-Reduce');
  const mapReduce = async (data, mapFn, reduceFn) => {
    // Map phase - parallel processing
    const mapped = await Promise.all(data.map(mapFn));
    // Reduce phase - aggregate results
    return mapped.reduce(reduceFn);
  };
  
  // Pattern 2: Pipeline with parallel stages
  console.log('Pattern 2: Parallel Pipeline');
  const parallelPipeline = async (stages) => {
    const results = [];
    for (const stage of stages) {
      if (Array.isArray(stage)) {
        // Parallel stage
        results.push(await Promise.all(stage));
      } else {
        // Sequential stage
        results.push(await stage);
      }
    }
    return results;
  };
  
  // Pattern 3: Dynamic worker pool
  console.log('Pattern 3: Dynamic Worker Pool');
  const workerPool = async (tasks, maxWorkers = 4) => {
    const results = [];
    const executing = [];
    
    for (const task of tasks) {
      const promise = task().then(result => {
        executing.splice(executing.indexOf(promise), 1);
        return result;
      });
      
      results.push(promise);
      executing.push(promise);
      
      if (executing.length >= maxWorkers) {
        await Promise.race(executing);
      }
    }
    
    return Promise.all(results);
  };
  
  console.log('✅ Parallel patterns demonstrated');
}

// Run the example
if (require.main === module) {
  parallelExecutionExample()
    .then(() => advancedParallelPatterns())
    .catch(console.error);
}

module.exports = { parallelExecutionExample, advancedParallelPatterns };