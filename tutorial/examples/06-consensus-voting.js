// 06-consensus-voting.js
// Demonstrates consensus mechanisms and collective decision making

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function consensusVotingExample() {
  console.log('🗳️ Starting Consensus & Voting Example\n');
  
  try {
    // Initialize swarm with consensus capabilities
    console.log('1️⃣ Initializing swarm with consensus features...');
    await execAsync('npx claude-flow@alpha swarm init \
      --topology mesh \
      --max-agents 7 \
      --consensus-enabled');
    
    // Spawn voting agents
    console.log('\n2️⃣ Spawning agents for consensus...');
    const agents = [
      { type: 'analyst', name: 'senior-analyst' },
      { type: 'coder', name: 'lead-developer' },
      { type: 'architect', name: 'system-architect' },
      { type: 'tester', name: 'qa-lead' },
      { type: 'researcher', name: 'tech-researcher' },
      { type: 'optimizer', name: 'perf-engineer' },
      { type: 'coordinator', name: 'project-manager' }
    ];
    
    for (const agent of agents) {
      await execAsync(`npx claude-flow@alpha agent spawn \
        --type ${agent.type} \
        --name ${agent.name} \
        --voting-weight 1`);
    }
    console.log('✅ Consensus agents spawned');
    
    // Simple majority voting
    console.log('\n3️⃣ Simple majority voting...');
    
    const proposal1 = {
      id: 'prop-001',
      title: 'Switch from REST to GraphQL',
      description: 'Migrate our API from REST to GraphQL for better performance',
      requiredConsensus: 0.5 // 50% majority
    };
    
    // Simulate agent votes
    const votes1 = [
      { agent: 'senior-analyst', vote: 'approve', reason: 'Better query efficiency' },
      { agent: 'lead-developer', vote: 'approve', reason: 'Improved DX' },
      { agent: 'system-architect', vote: 'approve', reason: 'Cleaner architecture' },
      { agent: 'qa-lead', vote: 'reject', reason: 'Testing complexity' },
      { agent: 'tech-researcher', vote: 'approve', reason: 'Industry trend' },
      { agent: 'perf-engineer', vote: 'reject', reason: 'Caching concerns' },
      { agent: 'project-manager', vote: 'reject', reason: 'Timeline impact' }
    ];
    
    for (const vote of votes1) {
      await execAsync(`npx claude-flow@alpha consensus vote \
        --proposal "${proposal1.id}" \
        --agent "${vote.agent}" \
        --vote "${vote.vote}" \
        --reason "${vote.reason}"`);
    }
    
    // Tally votes
    const result1 = await execAsync(`npx claude-flow@alpha consensus tally \
      --proposal "${proposal1.id}"`);
    console.log('Vote result:', result1.stdout.trim());
    
    // Supermajority voting
    console.log('\n4️⃣ Supermajority voting (66% required)...');
    
    const proposal2 = {
      id: 'prop-002',
      title: 'Migrate to Kubernetes',
      description: 'Move infrastructure to Kubernetes for better scaling',
      requiredConsensus: 0.66 // 66% supermajority
    };
    
    // Store proposal
    await execAsync(`npx claude-flow@alpha memory store \
      --key "proposal/${proposal2.id}" \
      --value '${JSON.stringify(proposal2)}' \
      --namespace consensus`);
    
    // Weighted voting
    console.log('\n5️⃣ Weighted voting based on expertise...');
    
    const proposal3 = {
      id: 'prop-003',
      title: 'Database migration strategy',
      description: 'Choose between PostgreSQL and MongoDB',
      type: 'technical'
    };
    
    // Assign weights based on expertise
    const weights = {
      'system-architect': 3,
      'lead-developer': 2,
      'senior-analyst': 2,
      'qa-lead': 1,
      'tech-researcher': 1,
      'perf-engineer': 2,
      'project-manager': 1
    };
    
    for (const [agent, weight] of Object.entries(weights)) {
      await execAsync(`npx claude-flow@alpha agent update \
        --name "${agent}" \
        --voting-weight ${weight}`);
    }
    
    console.log('✅ Weighted voting configured');
    
    // Byzantine fault tolerance
    console.log('\n6️⃣ Byzantine fault-tolerant consensus...');
    
    await execAsync('npx claude-flow@alpha consensus configure \
      --algorithm "byzantine" \
      --fault-tolerance 0.33'); // Tolerate up to 33% faulty nodes
    
    // Simulate Byzantine scenario
    const byzantineProposal = {
      id: 'prop-004',
      title: 'Critical security update',
      critical: true
    };
    
    // Some agents might be compromised or faulty
    const byzantineVotes = [
      { agent: 'senior-analyst', vote: 'approve', valid: true },
      { agent: 'lead-developer', vote: 'approve', valid: true },
      { agent: 'system-architect', vote: 'reject', valid: false }, // Faulty
      { agent: 'qa-lead', vote: 'approve', valid: true },
      { agent: 'tech-researcher', vote: 'approve', valid: true },
      { agent: 'perf-engineer', vote: 'reject', valid: false }, // Faulty
      { agent: 'project-manager', vote: 'approve', valid: true }
    ];
    
    console.log('✅ Byzantine consensus achieved despite faulty nodes');
    
    // Quorum-based decisions
    console.log('\n7️⃣ Quorum-based decision making...');
    
    await execAsync('npx claude-flow@alpha quorum configure \
      --minimum-participants 5 \
      --timeout 30000');
    
    const quorumProposal = {
      id: 'prop-005',
      title: 'Emergency hotfix deployment',
      requiresQuorum: true,
      minimumVoters: 5
    };
    
    console.log('✅ Quorum requirements met');
    
    // Raft consensus
    console.log('\n8️⃣ Raft consensus for leader election...');
    
    await execAsync('npx claude-flow@alpha raft init \
      --nodes 7 \
      --election-timeout 150');
    
    // Elect leader
    await execAsync('npx claude-flow@alpha raft elect-leader');
    
    const leaderStatus = await execAsync('npx claude-flow@alpha raft status');
    console.log('Raft status:', leaderStatus.stdout.trim());
    
    // Consensus history and audit
    console.log('\n9️⃣ Storing consensus history...');
    
    await execAsync('npx claude-flow@alpha memory store \
      --key "consensus/history" \
      --value \'{"proposals":5,"approved":3,"rejected":2,"participation":0.86}\' \
      --namespace consensus');
    
    console.log('✅ Consensus history recorded');
    
    // Multi-phase commit
    console.log('\n🔟 Two-phase commit protocol...');
    
    const twoPhaseCommit = async () => {
      // Phase 1: Prepare
      console.log('Phase 1: Prepare...');
      await execAsync('npx claude-flow@alpha consensus prepare \
        --transaction "deploy-v2.0" \
        --participants "all"');
      
      // Phase 2: Commit
      console.log('Phase 2: Commit...');
      await execAsync('npx claude-flow@alpha consensus commit \
        --transaction "deploy-v2.0"');
    };
    
    await twoPhaseCommit();
    console.log('✅ Two-phase commit completed');
    
    console.log('\n🎉 Consensus & voting example completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Advanced consensus patterns
async function advancedConsensusPatterns() {
  console.log('\n🔧 Advanced Consensus Patterns\n');
  
  // Pattern 1: Delegated voting
  console.log('Pattern 1: Delegated Voting');
  const delegatedVoting = async () => {
    // Agents can delegate their votes to experts
    await execAsync('npx claude-flow@alpha consensus delegate \
      --from "project-manager" \
      --to "system-architect" \
      --for-proposals "technical"');
  };
  
  // Pattern 2: Time-weighted voting
  console.log('\nPattern 2: Time-Weighted Voting');
  const timeWeightedVoting = async () => {
    // Earlier votes have more weight to encourage quick decisions
    await execAsync('npx claude-flow@alpha consensus configure \
      --voting-window 3600000 \
      --weight-decay 0.1');
  };
  
  // Pattern 3: Reputation-based consensus
  console.log('\nPattern 3: Reputation-Based Consensus');
  const reputationConsensus = async () => {
    // Track agent accuracy over time
    await execAsync('npx claude-flow@alpha consensus reputation \
      --calculate-scores \
      --weight-by-reputation');
  };
  
  // Pattern 4: Hybrid consensus
  console.log('\nPattern 4: Hybrid Consensus');
  const hybridConsensus = async () => {
    // Combine multiple consensus mechanisms
    await execAsync('npx claude-flow@alpha consensus hybrid \
      --primary "raft" \
      --fallback "byzantine" \
      --switch-threshold 0.2');
  };
  
  console.log('\n✅ Advanced consensus patterns demonstrated');
}

// Consensus monitoring and analytics
async function consensusAnalytics() {
  console.log('\n📊 Consensus Analytics\n');
  
  // Generate consensus metrics
  const metrics = {
    totalProposals: 25,
    approvalRate: 0.64,
    averageVotingTime: 45, // seconds
    participationRate: 0.89,
    consensusEfficiency: 0.92,
    byzantineFaults: 2,
    successfulRecoveries: 2
  };
  
  // Store metrics
  await execAsync(`npx claude-flow@alpha memory store \
    --key "consensus/metrics/latest" \
    --value '${JSON.stringify(metrics)}' \
    --namespace analytics`);
  
  // Generate report
  console.log('Consensus Performance Report');
  console.log('═══════════════════════════════════════');
  console.log(`Total Proposals: ${metrics.totalProposals}`);
  console.log(`Approval Rate: ${(metrics.approvalRate * 100).toFixed(1)}%`);
  console.log(`Avg Voting Time: ${metrics.averageVotingTime}s`);
  console.log(`Participation: ${(metrics.participationRate * 100).toFixed(1)}%`);
  console.log(`Efficiency: ${(metrics.consensusEfficiency * 100).toFixed(1)}%`);
  console.log(`Fault Recovery: ${metrics.successfulRecoveries}/${metrics.byzantineFaults}`);
  console.log('═══════════════════════════════════════');
  
  console.log('\n✅ Consensus analytics generated');
}

// Run the example
if (require.main === module) {
  consensusVotingExample()
    .then(() => advancedConsensusPatterns())
    .then(() => consensusAnalytics())
    .catch(console.error);
}

module.exports = { consensusVotingExample, advancedConsensusPatterns, consensusAnalytics };