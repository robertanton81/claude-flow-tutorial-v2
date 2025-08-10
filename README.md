# Claude-Flow: AI Swarm Orchestration Tutorial

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![NPM Version](https://img.shields.io/badge/npm-%3E%3D9.0.0-red.svg)](https://www.npmjs.com/)
[![Claude-Flow](https://img.shields.io/badge/claude--flow-alpha-blue.svg)](https://github.com/ruvnet/claude-flow)
[![Performance](https://img.shields.io/badge/SWE--Bench-84.8%25-brightgreen.svg)](#performance-metrics)

> **Revolutionary AI Swarm Orchestration with 84.8% SWE-Bench solve rate and 2.8-4.4x speed improvements**

## 🎯 What is Claude-Flow?

Claude-Flow is a cutting-edge AI swarm orchestration framework that enables coordinated AI agents to work together using the **SPARC methodology** (Specification, Pseudocode, Architecture, Refinement, Completion). It transforms how AI systems collaborate on complex development tasks through intelligent coordination, neural training, and distributed consensus mechanisms.

### 🚀 Key Features

- **🧠 54 Specialized AI Agents** - Research, coding, testing, GitHub integration, and more
- **⚡ 2.8-4.4x Speed Improvements** - Parallel execution and optimized coordination
- **🎯 84.8% SWE-Bench Success Rate** - Industry-leading performance on software engineering benchmarks
- **🧪 SPARC Methodology** - Systematic Test-Driven Development workflow
- **🤖 Neural Training** - 27+ neural models with adaptive learning
- **🔗 GitHub Integration** - Automated PR reviews, issue triage, release management
- **💾 Persistent Memory** - Cross-session context and knowledge sharing
- **🛡️ Consensus Mechanisms** - Byzantine fault tolerance and distributed decision making

## 📚 Quick Navigation

| **🚀 Getting Started** | **📖 Documentation** | **🛠️ Advanced** |
|------------------------|----------------------|------------------|
| [⚡ DO FIRST - Setup Guide](tutorial/DO-FIRST-README.md) | [📋 Master Setup Guide](docs/MASTER-SETUP-GUIDE.md) | [🧠 Neural Training](examples/04-neural-training.js) |
| [🎯 Quick Start Checklist](tutorial/QUICK-START-CHECKLIST.md) | [📚 SPARC Tutorial](tutorial/docs/SPARC-TUTORIAL.md) | [🤝 Consensus Voting](examples/06-consensus-voting.js) |
| [👨‍💻 First Time User Guide](tutorial/FIRST-TIME-USER-GUIDE.md) | [🧪 SPARC TDD Guide](docs/SPARC-TDD-GUIDE.md) | [⚡ Performance Optimization](examples/07-performance-optimization.js) |
| | [🎯 Advanced Patterns](docs/SPARC-ADVANCED-PATTERNS.md) | [🚀 Hello World SPARC](examples/hello-world-sparc.js) |
| | [📊 Documentation Audit](docs/DOCUMENTATION_AUDIT_REPORT.md) | |

## 🚨 Quick Start (5 Minutes)

### Prerequisites
- Node.js 18+ 
- npm 9+
- Claude Code CLI

### Installation & Setup

```bash
# 1. Install Claude-Flow globally
npm install -g claude-flow@alpha

# 2. Add MCP server to Claude
claude mcp add claude-flow npx claude-flow@alpha mcp start

# 3. Run quick setup
cd tutorial && bash scripts/instant-setup.sh

# 4. Test with basic swarm
npm run example:basic
```

### Your First Swarm (30 seconds)

```bash
# Initialize a mesh topology swarm
npx claude-flow swarm init mesh

# Spawn specialized agents
npx claude-flow agent spawn researcher
npx claude-flow agent spawn coder  
npx claude-flow agent spawn tester

# Execute coordinated task
npx claude-flow task orchestrate "Build a REST API with tests"
```

## 📁 Project Structure

```
claude-tut-v2/
├── 📖 tutorial/              # Complete learning path
│   ├── 🚀 DO-FIRST-README.md        # Essential setup (START HERE)
│   ├── 📋 QUICK-START-CHECKLIST.md  # Step-by-step checklist
│   ├── 📚 examples/                  # 9 comprehensive examples
│   │   ├── 01-basic-swarm.js        # Simple swarm coordination
│   │   ├── 02-parallel-execution.js # Concurrent processing
│   │   ├── 03-memory-management.js  # Persistent memory
│   │   ├── 04-neural-training.js    # AI model training
│   │   ├── 05-github-integration.js # GitHub automation
│   │   ├── 06-consensus-voting.js   # Distributed decisions
│   │   ├── 07-performance-optimization.js
│   │   ├── 08-sparc-methodology.js  # Complete SPARC workflow
│   │   └── 09-complete-project.js   # Full project example
│   └── 🔧 scripts/                  # Automation utilities
├── 📚 docs/                  # Comprehensive documentation
│   ├── 📋 MASTER-SETUP-GUIDE.md     # Complete setup reference
│   ├── 🔧 SETUP-INSTALLATION-GUIDE.md
│   └── 📊 DOCUMENTATION_AUDIT_REPORT.md
├── 🧠 coordination/          # Swarm coordination systems
│   ├── memory_bank/                 # Shared memory storage
│   ├── orchestration/              # Task coordination
│   └── subtasks/                   # Distributed task management
└── 💾 memory/               # Persistent agent memory
    ├── agents/                     # Agent-specific memory
    └── sessions/                   # Session state management
```

## 🎯 SPARC Methodology

Claude-Flow implements the revolutionary **SPARC workflow** for systematic development:

| Phase | Purpose | Tools | Duration |
|-------|---------|-------|----------|
| **S** - Specification | Requirements analysis | `sparc run spec-pseudocode` | 5-10 min |
| **P** - Pseudocode | Algorithm design | `sparc run spec-pseudocode` | 10-15 min |
| **A** - Architecture | System design | `sparc run architect` | 15-20 min |
| **R** - Refinement | TDD implementation | `sparc tdd` | 30-60 min |
| **C** - Completion | Integration & testing | `sparc run integration` | 10-15 min |

```bash
# Complete SPARC workflow
npx claude-flow sparc tdd "Build user authentication system"

# Individual phases
npx claude-flow sparc run architect "Design microservices architecture"
npx claude-flow sparc run integration "Deploy and test complete system"
```

## 🚀 Performance Metrics

| Metric | Claude-Flow | Traditional | Improvement |
|--------|-------------|-------------|-------------|
| **SWE-Bench Solve Rate** | 84.8% | 45-60% | **+39-84%** |
| **Development Speed** | 2.8-4.4x | 1x | **180-340% faster** |
| **Token Efficiency** | 32.3% reduction | Baseline | **-32% tokens** |
| **Code Quality** | 94%+ | 70-85% | **+9-24%** |
| **Test Coverage** | 95%+ | 60-80% | **+15-35%** |

## 🤖 Available Agents (54 Total)

### 🔧 Core Development
`coder`, `reviewer`, `tester`, `planner`, `researcher`, `architect`

### 🕸️ Swarm Coordination  
`hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`, `collective-intelligence-coordinator`

### 🔒 Consensus & Security
`byzantine-coordinator`, `raft-manager`, `gossip-coordinator`, `consensus-builder`, `security-manager`

### ⚡ Performance
`perf-analyzer`, `performance-benchmarker`, `task-orchestrator`, `memory-coordinator`

### 🐙 GitHub Integration
`pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`, `workflow-automation`

### 🧠 SPARC Methodology
`sparc-coord`, `sparc-coder`, `specification`, `pseudocode`, `architecture`, `refinement`

[View complete agent list →](CLAUDE.md#available-agents-54-total)

## 🔗 Integration Ecosystem

### MCP Server Integration
```bash
# Core coordination
claude mcp add claude-flow npx claude-flow@alpha mcp start

# GitHub integration  
claude mcp add github-integration npx claude-flow@alpha github start

# Neural training
claude mcp add neural-flow npx claude-flow@alpha neural start
```

### Command Examples

```bash
# Swarm Management
npx claude-flow swarm init hierarchical --max-agents 8
npx claude-flow agent spawn researcher --capabilities analysis,planning
npx claude-flow task orchestrate "Analyze codebase and suggest improvements"

# Memory & Neural  
npx claude-flow memory store --key "project-context" --value "E-commerce API"
npx claude-flow neural train --pattern coordination --epochs 50

# GitHub Automation
npx claude-flow github repo analyze --repo owner/project --analysis-type security
npx claude-flow github pr manage --repo owner/project --action review --pr 123
```

## 📖 Learning Path

### 🥇 Beginner (30 minutes)
1. **[DO FIRST Setup](tutorial/DO-FIRST-README.md)** - Essential installation
2. **[Basic Swarm](tutorial/examples/01-basic-swarm.js)** - Your first agents
3. **[Quick Start Guide](tutorial/FIRST-TIME-USER-GUIDE.md)** - Core concepts

### 🥈 Intermediate (2 hours)  
1. **[Parallel Execution](tutorial/examples/02-parallel-execution.js)** - Concurrent processing
2. **[Memory Management](tutorial/examples/03-memory-management.js)** - Persistent context
3. **[SPARC Methodology](tutorial/examples/08-sparc-methodology.js)** - Complete workflow
4. **[SPARC TDD Guide](docs/SPARC-TDD-GUIDE.md)** - Test-driven development mastery

### 🥉 Advanced (4+ hours)
1. **[SPARC Advanced Patterns](docs/SPARC-ADVANCED-PATTERNS.md)** - Enterprise architecture patterns
2. **[Neural Training](tutorial/examples/04-neural-training.js)** - AI model optimization
3. **[Consensus Voting](tutorial/examples/06-consensus-voting.js)** - Distributed decisions
4. **[Complete Project](tutorial/examples/09-complete-project.js)** - Full-scale application

## 🌟 Community & Support

### 📞 Get Help
- **Documentation**: [Master Setup Guide](docs/MASTER-SETUP-GUIDE.md)
- **TDD Guide**: [SPARC TDD Guide](docs/SPARC-TDD-GUIDE.md)
- **Advanced Patterns**: [SPARC Advanced Patterns](docs/SPARC-ADVANCED-PATTERNS.md)
- **Issues**: [GitHub Issues](https://github.com/ruvnet/claude-flow/issues)
- **Examples**: [Tutorial Examples](tutorial/examples/)
- **Discord**: [Claude-Flow Community](https://discord.gg/claude-flow)

### 🤝 Contributing
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Follow [SPARC methodology](tutorial/docs/SPARC-TUTORIAL.md) for development
4. Submit Pull Request with comprehensive tests

### 📜 License
MIT License - see [LICENSE](LICENSE) for details.

---

## 🎉 Ready to Start?

**Choose your path:**

| Experience Level | Recommended Starting Point | Time Investment |
|-----------------|----------------------------|-----------------|
| 🆕 **New to AI Swarms** | [DO FIRST Setup →](tutorial/DO-FIRST-README.md) | 5 minutes |
| 👨‍💻 **Developer** | [SPARC Tutorial →](tutorial/docs/SPARC-TUTORIAL.md) | 30 minutes |
| 🏗️ **Architect** | [Complete Project Example →](tutorial/examples/09-complete-project.js) | 2 hours |

**Remember**: *Claude Flow coordinates, Claude Code creates!* 🚀

---

<div align="center">

**[⚡ Get Started Now](tutorial/DO-FIRST-README.md)** | **[📚 View Examples](tutorial/examples/)** | **[🤖 Spawn Your First Agent](tutorial/examples/01-basic-swarm.js)**

*Built with ❤️ by the Claude-Flow Team*

</div>
