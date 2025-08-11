# 🗳️ Consensus & Voting Mechanisms Guide

## Overview

Claude-Flow implements sophisticated consensus mechanisms enabling distributed decision-making across AI agent swarms. This guide covers everything from simple majority voting to Byzantine fault-tolerant consensus protocols.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Consensus Types](#consensus-types)
3. [Voting Mechanisms](#voting-mechanisms)
4. [Byzantine Fault Tolerance](#byzantine-fault-tolerance)
5. [Raft Consensus](#raft-consensus)
6. [Quorum Management](#quorum-management)
7. [Advanced Patterns](#advanced-patterns)
8. [Best Practices](#best-practices)

---

## Quick Start

### Basic Consensus Setup

```bash
# Initialize swarm with consensus
npx claude-flow@alpha swarm init \
  --topology mesh \
  --consensus-enabled \
  --min-agents 5

# Create a simple vote
npx claude-flow@alpha consensus create \
  --proposal "Switch to TypeScript" \
  --type "majority" \
  --timeout 60000

# Cast votes
npx claude-flow@alpha consensus vote \
  --proposal "prop-001" \
  --vote "approve" \
  --reason "Type safety benefits"

# Tally results
npx claude-flow@alpha consensus tally --proposal "prop-001"
```

---

## Consensus Types

### Overview of Consensus Mechanisms

```
┌─────────────────────────────────────────────────┐
│              Consensus Mechanisms               │
├─────────────────────────────────────────────────┤
│                                                 │
│  Simple Majority (>50%)                        │
│  ├─ Fast decisions                             │
│  ├─ Low overhead                               │
│  └─ Suitable for non-critical choices          │
│                                                 │
│  Supermajority (≥66%)                          │
│  ├─ Higher confidence                          │
│  ├─ Important decisions                        │
│  └─ Reduces split decisions                    │
│                                                 │
│  Byzantine Fault Tolerant (BFT)                │
│  ├─ Handles malicious actors                   │
│  ├─ Tolerates up to 33% faulty nodes          │
│  └─ Critical security decisions                │
│                                                 │
│  Raft Consensus                                │
│  ├─ Leader election                            │
│  ├─ Log replication                            │
│  └─ Strong consistency                         │
│                                                 │
│  Weighted Voting                               │
│  ├─ Expertise-based weights                    │
│  ├─ Reputation scoring                         │
│  └─ Domain-specific decisions                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Comparison Matrix

| Mechanism | Speed | Fault Tolerance | Use Case |
|-----------|-------|----------------|----------|
| **Simple Majority** | Fast | Low | Feature flags, UI changes |
| **Supermajority** | Moderate | Medium | Architecture decisions |
| **Byzantine (BFT)** | Slow | High | Security, finance |
| **Raft** | Moderate | High | Distributed state |
| **Weighted** | Fast | Variable | Technical decisions |

---

## Voting Mechanisms

### 1. Simple Majority Voting

```bash
# Create majority vote proposal
npx claude-flow@alpha consensus create \
  --id "prop-001" \
  --title "Add dark mode feature" \
  --type "majority" \
  --required-consensus 0.5

# Agents vote
npx claude-flow@alpha consensus vote \
  --proposal "prop-001" \
  --agent "coder-1" \
  --vote "approve"

npx claude-flow@alpha consensus vote \
  --proposal "prop-001" \
  --agent "designer-1" \
  --vote "approve"

npx claude-flow@alpha consensus vote \
  --proposal "prop-001" \
  --agent "tester-1" \
  --vote "reject"

# Check results (2/3 = 66% approval)
npx claude-flow@alpha consensus tally --proposal "prop-001"
```

### 2. Supermajority Voting

```bash
# Create supermajority proposal (66% required)
npx claude-flow@alpha consensus create \
  --id "prop-002" \
  --title "Migrate to Kubernetes" \
  --type "supermajority" \
  --required-consensus 0.66 \
  --voting-window 3600000  # 1 hour
```

### 3. Weighted Voting

```javascript
// Set agent weights based on expertise
const agentWeights = {
  'system-architect': 3,    // High weight for architecture decisions
  'senior-developer': 2,
  'junior-developer': 1,
  'project-manager': 1,
  'qa-engineer': 2
};

// Apply weights
for (const [agent, weight] of Object.entries(agentWeights)) {
  await executeCommand(`npx claude-flow@alpha agent update \
    --name "${agent}" \
    --voting-weight ${weight}`);
}

// Create weighted vote
await executeCommand(`npx claude-flow@alpha consensus create \
  --id "prop-003" \
  --title "Database technology choice" \
  --type "weighted" \
  --category "technical"`);
```

### 4. Delegated Voting

```bash
# Agent delegates vote to expert
npx claude-flow@alpha consensus delegate \
  --from "junior-dev" \
  --to "senior-architect" \
  --for-proposals "technical" \
  --duration 86400000  # 24 hours
```

### 5. Time-Weighted Voting

```bash
# Earlier votes have more weight to encourage quick decisions
npx claude-flow@alpha consensus configure \
  --voting-window 3600000 \
  --weight-decay 0.1 \
  --min-weight 0.5
```

---

## Byzantine Fault Tolerance

### Understanding Byzantine Consensus

Byzantine fault tolerance ensures consensus even when some agents are faulty, offline, or malicious.

```
┌──────────────────────────────────────┐
│     Byzantine Consensus Process      │
├──────────────────────────────────────┤
│                                      │
│  Total Nodes: N = 7                 │
│  Faulty Nodes: F ≤ 2 (33%)         │
│  Required for Consensus: 2F + 1 = 5 │
│                                      │
│  Round 1: Propose                   │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐    │
│  │ A │ │ B │ │ C │ │ D │ │ E │    │
│  └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘    │
│    ▼     ▼     ▼     ▼     ▼       │
│         Broadcast Votes              │
│                                      │
│  Round 2: Vote                      │
│  Collect 2F + 1 matching votes      │
│                                      │
│  Round 3: Commit                    │
│  Final consensus achieved            │
│                                      │
└──────────────────────────────────────┘
```

### Implementing Byzantine Consensus

```bash
# Initialize Byzantine fault-tolerant consensus
npx claude-flow@alpha consensus configure \
  --algorithm "byzantine" \
  --fault-tolerance 0.33 \
  --timeout 30000 \
  --rounds 3

# Create critical proposal requiring BFT
npx claude-flow@alpha consensus create \
  --id "critical-001" \
  --title "Deploy payment system update" \
  --type "byzantine" \
  --critical true

# Monitor Byzantine consensus
npx claude-flow@alpha consensus monitor \
  --proposal "critical-001" \
  --show-rounds \
  --detect-faults
```

### Handling Faulty Nodes

```javascript
// Detect and handle Byzantine faults
const consensusHealth = await monitorConsensus();

if (consensusHealth.faultyNodes.length > 0) {
  console.log(`Detected ${consensusHealth.faultyNodes.length} faulty nodes`);
  
  // Isolate faulty nodes
  for (const node of consensusHealth.faultyNodes) {
    await executeCommand(`npx claude-flow@alpha agent isolate --name "${node}"`);
  }
  
  // Continue with healthy nodes
  if (consensusHealth.healthyNodes.length >= consensusHealth.requiredForConsensus) {
    console.log('Consensus can still be achieved');
  }
}
```

---

## Raft Consensus

### Raft Protocol Overview

```
┌─────────────────────────────────────┐
│         Raft Consensus States       │
├─────────────────────────────────────┤
│                                     │
│    ┌──────────┐                    │
│    │ Follower │ ─────┐             │
│    └──────────┘      │             │
│          ▲           ▼             │
│          │     ┌──────────┐        │
│          └──── │Candidate │        │
│                └──────────┘        │
│                      │              │
│                      ▼              │
│                ┌──────────┐        │
│                │  Leader  │        │
│                └──────────┘        │
│                                     │
│  Leader handles all client requests │
│  Replicates log to followers       │
│  Heartbeat to maintain authority   │
│                                     │
└─────────────────────────────────────┘
```

### Implementing Raft

```bash
# Initialize Raft consensus
npx claude-flow@alpha raft init \
  --nodes 5 \
  --election-timeout 150 \
  --heartbeat-interval 50

# Trigger leader election
npx claude-flow@alpha raft elect-leader

# Check Raft status
npx claude-flow@alpha raft status
```

### Raft Configuration

```javascript
const raftConfig = {
  nodes: ['agent-1', 'agent-2', 'agent-3', 'agent-4', 'agent-5'],
  electionTimeout: {
    min: 150,  // milliseconds
    max: 300
  },
  heartbeatInterval: 50,
  logReplication: {
    maxBatchSize: 100,
    maxBatchDelay: 10
  },
  persistence: {
    enabled: true,
    path: './raft-logs'
  }
};

// Apply configuration
await executeCommand(`npx claude-flow@alpha raft configure \
  --config '${JSON.stringify(raftConfig)}'`);
```

### Log Replication

```bash
# Append entry to Raft log
npx claude-flow@alpha raft append \
  --entry '{"command":"deploy","version":"2.0.0"}' \
  --consistency "strong"

# Check log consistency
npx claude-flow@alpha raft verify-logs \
  --check-all-nodes \
  --fix-inconsistencies
```

---

## Quorum Management

### Quorum Configuration

```bash
# Set quorum requirements
npx claude-flow@alpha quorum configure \
  --minimum-participants 5 \
  --timeout 30000 \
  --retry-attempts 3
```

### Dynamic Quorum Adjustment

```javascript
// Adjust quorum based on network size
const networkSize = await getActiveAgentCount();
const quorumSize = Math.ceil(networkSize * 0.6);

await executeCommand(`npx claude-flow@alpha quorum update \
  --size ${quorumSize} \
  --enforce-strict`);
```

### Quorum Strategies

| Strategy | Formula | Use Case |
|----------|---------|----------|
| **Simple Majority** | N/2 + 1 | General decisions |
| **Supermajority** | 2N/3 + 1 | Important changes |
| **Byzantine** | 2F + 1 | Security-critical |
| **Unanimous** | N | Fundamental changes |
| **Dynamic** | Variable | Adaptive systems |

---

## Advanced Patterns

### 1. Multi-Phase Commit

```bash
# Two-phase commit for distributed transactions
# Phase 1: Prepare
npx claude-flow@alpha consensus prepare \
  --transaction "deploy-v2.0" \
  --participants "all" \
  --timeout 10000

# Phase 2: Commit (if all prepared)
npx claude-flow@alpha consensus commit \
  --transaction "deploy-v2.0" \
  --verify-prepared
```

### 2. Reputation-Based Consensus

```javascript
// Track agent decision accuracy
const reputationScores = {
  'agent-1': 0.95,  // 95% historical accuracy
  'agent-2': 0.88,
  'agent-3': 0.92,
  'agent-4': 0.79,
  'agent-5': 0.90
};

// Weight votes by reputation
for (const [agent, score] of Object.entries(reputationScores)) {
  const weight = Math.round(score * 10);
  await executeCommand(`npx claude-flow@alpha agent update \
    --name "${agent}" \
    --voting-weight ${weight}`);
}
```

### 3. Hybrid Consensus

```bash
# Combine multiple consensus mechanisms
npx claude-flow@alpha consensus hybrid \
  --primary "raft" \
  --fallback "byzantine" \
  --switch-threshold 0.2 \
  --monitor-health true
```

### 4. Consensus with Proof of Work

```javascript
// Require computational proof for voting
const proofOfWork = {
  difficulty: 4,  // Number of leading zeros required
  challenge: 'solve-optimization-problem',
  timeout: 30000
};

await executeCommand(`npx claude-flow@alpha consensus create \
  --id "pow-001" \
  --title "Major architecture change" \
  --require-proof '${JSON.stringify(proofOfWork)}'`);
```

### 5. Cascading Consensus

```bash
# Hierarchical consensus with escalation
npx claude-flow@alpha consensus cascade \
  --levels "team,department,organization" \
  --escalation-threshold 0.8 \
  --timeout-per-level 3600000
```

---

## Best Practices

### 1. Choose the Right Mechanism

```javascript
function selectConsensusMechanism(decision) {
  if (decision.critical && decision.securityRelated) {
    return 'byzantine';
  } else if (decision.requiresConsistency) {
    return 'raft';
  } else if (decision.technical) {
    return 'weighted';
  } else if (decision.importance === 'high') {
    return 'supermajority';
  } else {
    return 'majority';
  }
}
```

### 2. Set Appropriate Timeouts

```bash
# Configure timeouts based on decision urgency
npx claude-flow@alpha consensus configure \
  --urgent-timeout 60000 \      # 1 minute
  --normal-timeout 3600000 \     # 1 hour
  --low-priority-timeout 86400000  # 24 hours
```

### 3. Monitor Consensus Health

```bash
# Setup consensus monitoring
npx claude-flow@alpha consensus monitor \
  --metrics "participation,agreement,faults,latency" \
  --alert-on "participation<0.7,faults>0.2" \
  --dashboard true
```

### 4. Handle Edge Cases

```javascript
// Handle split votes
const handleSplitVote = async (proposal) => {
  const result = await getVoteResult(proposal);
  
  if (result.approve === result.reject) {
    // Tiebreaker strategies
    if (proposal.tiebreaker === 'leader') {
      return await leaderDecides(proposal);
    } else if (proposal.tiebreaker === 'random') {
      return Math.random() > 0.5 ? 'approve' : 'reject';
    } else {
      // Default: extend voting period
      return await extendVoting(proposal, 3600000);
    }
  }
};
```

### 5. Audit Trail

```bash
# Enable comprehensive audit logging
npx claude-flow@alpha consensus audit \
  --enable true \
  --log-votes true \
  --log-reasons true \
  --store-permanent true \
  --path "./consensus-audit"
```

---

## Troubleshooting

### Common Issues

| Issue | Symptoms | Solution |
|-------|----------|----------|
| **Low Participation** | < 50% agents voting | Reduce quorum, send reminders, check agent health |
| **Consensus Deadlock** | No decision reached | Use tiebreaker, extend timeout, escalate |
| **Byzantine Faults** | Inconsistent votes | Isolate faulty nodes, increase fault tolerance |
| **Split Brain** | Multiple leaders | Force re-election, check network partition |
| **Vote Manipulation** | Suspicious patterns | Enable vote verification, use cryptographic signing |

### Debug Commands

```bash
# Debug consensus issues
npx claude-flow@alpha consensus debug \
  --proposal "prop-001" \
  --show-votes \
  --show-timeline \
  --detect-anomalies

# Reset consensus system
npx claude-flow@alpha consensus reset \
  --clear-proposals \
  --reset-weights \
  --maintain-history
```

---

## Example: Complete Consensus Workflow

```bash
#!/bin/bash

# 1. Initialize swarm with consensus
npx claude-flow@alpha swarm init \
  --topology mesh \
  --consensus-enabled \
  --min-agents 7

# 2. Spawn specialized agents
agents=("architect" "senior-dev" "junior-dev" "qa-lead" "security" "devops" "pm")
for agent in "${agents[@]}"; do
  npx claude-flow@alpha agent spawn --type specialist --name "$agent"
done

# 3. Configure consensus parameters
npx claude-flow@alpha consensus configure \
  --algorithm "hybrid" \
  --primary "weighted" \
  --fallback "byzantine" \
  --quorum 5

# 4. Set agent weights based on expertise
npx claude-flow@alpha agent update --name "architect" --voting-weight 3
npx claude-flow@alpha agent update --name "senior-dev" --voting-weight 2
npx claude-flow@alpha agent update --name "security" --voting-weight 3

# 5. Create important proposal
npx claude-flow@alpha consensus create \
  --id "arch-decision-001" \
  --title "Migrate to microservices architecture" \
  --type "supermajority" \
  --required-consensus 0.66 \
  --voting-window 7200000

# 6. Agents analyze and vote
npx claude-flow@alpha task orchestrate \
  "Analyze microservices migration proposal and vote"

# 7. Monitor voting progress
npx claude-flow@alpha consensus monitor \
  --proposal "arch-decision-001" \
  --real-time \
  --show-reasons

# 8. Tally and execute decision
result=$(npx claude-flow@alpha consensus tally --proposal "arch-decision-001")
echo "Consensus Result: $result"

# 9. Record decision in audit log
npx claude-flow@alpha consensus audit \
  --record "arch-decision-001" \
  --outcome "$result" \
  --timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)"

echo "✅ Consensus workflow completed!"
```

---

## Performance Metrics

### Consensus Performance Benchmarks

| Mechanism | Agents | Time to Consensus | Fault Tolerance | Throughput |
|-----------|--------|------------------|-----------------|------------|
| **Simple Majority** | 5 | < 1s | 0% | 1000 decisions/min |
| **Supermajority** | 7 | 2-3s | 14% | 500 decisions/min |
| **Byzantine** | 7 | 5-10s | 33% | 100 decisions/min |
| **Raft** | 5 | 1-2s | 40% | 300 decisions/min |
| **Weighted** | 10 | < 1s | Variable | 800 decisions/min |

---

## Resources

- [Consensus API Reference](https://github.com/ruvnet/claude-flow/docs/api/consensus)
- [Byzantine Generals Problem](https://github.com/ruvnet/claude-flow/docs/theory/byzantine)
- [Raft Visualization](https://raft.github.io/)
- [Consensus Examples](https://github.com/ruvnet/claude-flow/examples/consensus)

---

*Last Updated: January 2025 | Claude-Flow v2.0.0*