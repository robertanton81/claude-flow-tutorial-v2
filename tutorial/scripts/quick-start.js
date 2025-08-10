// quick-start.js
// Quick start script for Claude-Flow beginners

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function quickStart() {
  console.log('');
  console.log('🚀 Claude-Flow Quick Start Guide');
  console.log('═══════════════════════════════════════');
  console.log('');
  console.log('Welcome to Claude-Flow! This interactive guide will help you');
  console.log('get started with AI swarm orchestration in just a few minutes.');
  console.log('');
  
  await question('Press Enter to begin...');
  
  // Step 1: Installation check
  console.log('\n📦 Step 1: Checking Installation');
  console.log('─────────────────────────────────');
  
  try {
    await execAsync('npx claude-flow@alpha --version');
    console.log('✅ Claude-Flow is installed');
  } catch {
    console.log('Installing Claude-Flow...');
    await execAsync('npm install -g claude-flow@alpha');
    console.log('✅ Claude-Flow installed successfully');
  }
  
  await question('\nPress Enter to continue...');
  
  // Step 2: Choose your first swarm
  console.log('\n🐝 Step 2: Create Your First Swarm');
  console.log('─────────────────────────────────');
  console.log('\nWhat would you like to build?');
  console.log('1. Simple Task Executor');
  console.log('2. Code Generator');
  console.log('3. Test Suite Creator');
  console.log('4. Documentation Generator');
  console.log('5. Custom Project');
  
  const choice = await question('\nEnter your choice (1-5): ');
  
  let task = '';
  let topology = 'mesh';
  
  switch(choice) {
    case '1':
      task = 'Execute a simple calculation task';
      topology = 'star';
      break;
    case '2':
      task = 'Generate a REST API with CRUD operations';
      topology = 'hierarchical';
      break;
    case '3':
      task = 'Create comprehensive unit tests';
      topology = 'mesh';
      break;
    case '4':
      task = 'Generate project documentation';
      topology = 'ring';
      break;
    case '5':
      task = await question('Describe your task: ');
      break;
    default:
      task = 'Create a hello world function';
  }
  
  // Step 3: Initialize swarm
  console.log('\n⚡ Step 3: Initializing Swarm');
  console.log('─────────────────────────────────');
  console.log(`Task: ${task}`);
  console.log(`Topology: ${topology}`);
  console.log('');
  
  try {
    console.log('Initializing swarm...');
    await execAsync(`npx claude-flow@alpha swarm init --topology ${topology} --max-agents 4`);
    console.log('✅ Swarm initialized');
    
    console.log('\nSpawning agents...');
    await execAsync('npx claude-flow@alpha agent spawn --type researcher');
    await execAsync('npx claude-flow@alpha agent spawn --type coder');
    await execAsync('npx claude-flow@alpha agent spawn --type tester');
    console.log('✅ Agents ready');
    
    console.log('\nExecuting task...');
    await execAsync(`npx claude-flow@alpha task orchestrate "${task}"`);
    console.log('✅ Task completed');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await question('\nPress Enter to continue...');
  
  // Step 4: Learn more
  console.log('\n📚 Step 4: Next Steps');
  console.log('─────────────────────────────────');
  console.log('\nCongratulations! You\'ve created your first Claude-Flow swarm.');
  console.log('\nHere are some things you can try next:');
  console.log('');
  console.log('1. Run more examples:');
  console.log('   node ../examples/01-basic-swarm.js');
  console.log('');
  console.log('2. Try SPARC methodology:');
  console.log('   npx claude-flow@alpha sparc tdd "Your feature"');
  console.log('');
  console.log('3. Enable neural features:');
  console.log('   npx claude-flow@alpha neural train --pattern-type coordination');
  console.log('');
  console.log('4. Check swarm status:');
  console.log('   npx claude-flow@alpha swarm status');
  console.log('');
  console.log('5. Read the full tutorial:');
  console.log('   Open ../docs/README.md');
  console.log('');
  
  // Step 5: Resources
  console.log('📖 Resources');
  console.log('─────────────────────────────────');
  console.log('Documentation: https://github.com/ruvnet/claude-flow');
  console.log('Examples: ../examples/');
  console.log('Support: https://github.com/ruvnet/claude-flow/issues');
  console.log('');
  
  console.log('🎉 Happy Swarming!');
  console.log('');
  
  rl.close();
}

// Interactive command builder
async function interactiveCommandBuilder() {
  console.log('\n🔧 Interactive Command Builder');
  console.log('─────────────────────────────────');
  
  const command = {
    base: 'npx claude-flow@alpha',
    action: '',
    params: []
  };
  
  // Choose action
  console.log('\nChoose an action:');
  console.log('1. swarm init');
  console.log('2. agent spawn');
  console.log('3. task orchestrate');
  console.log('4. memory store');
  console.log('5. neural train');
  
  const actionChoice = await question('Enter choice (1-5): ');
  
  switch(actionChoice) {
    case '1':
      command.action = 'swarm init';
      const topology = await question('Topology (mesh/star/ring/hierarchical): ');
      command.params.push(`--topology ${topology}`);
      const maxAgents = await question('Max agents (1-20): ');
      command.params.push(`--max-agents ${maxAgents}`);
      break;
    case '2':
      command.action = 'agent spawn';
      const agentType = await question('Agent type (coder/tester/researcher/analyst): ');
      command.params.push(`--type ${agentType}`);
      break;
    case '3':
      command.action = 'task orchestrate';
      const task = await question('Task description: ');
      command.params.push(`"${task}"`);
      break;
    case '4':
      command.action = 'memory store';
      const key = await question('Memory key: ');
      const value = await question('Memory value: ');
      command.params.push(`--key "${key}" --value "${value}"`);
      break;
    case '5':
      command.action = 'neural train';
      const pattern = await question('Pattern type (coordination/optimization/prediction): ');
      command.params.push(`--pattern-type ${pattern}`);
      break;
  }
  
  const fullCommand = `${command.base} ${command.action} ${command.params.join(' ')}`;
  console.log('\nGenerated command:');
  console.log(fullCommand);
  
  const execute = await question('\nExecute this command? (y/n): ');
  if (execute.toLowerCase() === 'y') {
    try {
      const result = await execAsync(fullCommand);
      console.log('\nResult:', result.stdout);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
}

// Run quick start
if (require.main === module) {
  quickStart()
    .then(() => question('\nWould you like to try the command builder? (y/n): '))
    .then(answer => {
      if (answer.toLowerCase() === 'y') {
        return interactiveCommandBuilder();
      }
    })
    .then(() => {
      console.log('\nThank you for trying Claude-Flow!');
      process.exit(0);
    })
    .catch(console.error);
}

module.exports = { quickStart, interactiveCommandBuilder };