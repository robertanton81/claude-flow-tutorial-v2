# 🚀 Claude-Flow Tutorial & Quick Start

> **Get claude-flow running with ALL features in 5 minutes!**

## 🎯 START HERE

### First Time? Read These IN ORDER:

1. **[DO-FIRST-README.md](tutorial/DO-FIRST-README.md)** - Essential setup steps (MANDATORY)
2. **[FIRST-TIME-USER-GUIDE.md](tutorial/FIRST-TIME-USER-GUIDE.md)** - 5-minute quick start
3. **[QUICK-START-CHECKLIST.md](tutorial/QUICK-START-CHECKLIST.md)** - Copy-paste commands

### Instant Setup (One Command)

```bash
# Automatic setup - creates project with everything configured
cd tutorial/scripts && ./instant-setup.sh my-project
```

---

## 📚 Complete Documentation

### Core Tutorials
- **[Tutorial README](tutorial/docs/README.md)** - Comprehensive claude-flow tutorial
- **[SPARC Tutorial](tutorial/docs/SPARC-TUTORIAL.md)** - Complete SPARC methodology guide

### Working Examples
- **[Basic Examples](tutorial/examples/)** - 9 progressive examples
- **[SPARC Examples](tutorial/examples/sparc/)** - Deep dives into each SPARC phase

---

## ⚡ Quick Reference

### Most Important Commands

```bash
# 1. ALWAYS RUN FIRST (every session)
npx claude-flow@alpha swarm init \
  --topology hierarchical \
  --max-agents 12 \
  --enable-memory \
  --enable-neural

# 2. Check status
npx claude-flow@alpha swarm status

# 3. Run SPARC TDD
npx claude-flow@alpha sparc tdd "Your feature description"
```

### Parallel Execution Pattern

```bash
# ❌ WRONG (Sequential)
command1
command2  
command3

# ✅ CORRECT (Parallel)
command1 & command2 & command3 & wait
```

---

## 🏗️ Project Structure

```
claude-tut-v2/
├── SETUP-README.md                    # This file
├── CLAUDE.md                          # MANDATORY config file
├── tutorial/
│   ├── DO-FIRST-README.md            # Essential setup (START HERE)
│   ├── FIRST-TIME-USER-GUIDE.md      # 5-minute guide
│   ├── QUICK-START-CHECKLIST.md      # Copy-paste setup
│   ├── docs/
│   │   ├── README.md                 # Main tutorial
│   │   └── SPARC-TUTORIAL.md         # SPARC methodology
│   ├── examples/
│   │   ├── 01-basic-swarm.js         # Basic operations
│   │   ├── 02-parallel-execution.js  # Parallel patterns
│   │   ├── 03-memory-management.js   # Persistent memory
│   │   ├── 04-neural-training.js     # Neural networks
│   │   ├── 05-github-integration.js  # GitHub automation
│   │   ├── 06-consensus-voting.js    # Consensus mechanisms
│   │   ├── 07-performance-optimization.js
│   │   ├── 08-sparc-methodology.js   # SPARC workflow
│   │   ├── 09-complete-project.js    # Full project example
│   │   └── sparc/
│   │       ├── 01-specification-deep-dive.js
│   │       ├── 02-pseudocode-patterns.js
│   │       └── 03-architecture-design.js
│   ├── scripts/
│   │   ├── instant-setup.sh          # One-command setup
│   │   ├── quick-start.js            # Interactive guide
│   │   └── run-all-examples.sh       # Example runner
│   └── config/
│       └── package.json              # Project config
```

---

## 🔑 Key Features Enabled

When properly configured, claude-flow provides:

- **🚀 2.8-4.4x Speed** - Parallel execution
- **🧠 Neural Networks** - WASM SIMD acceleration  
- **💾 Persistent Memory** - Cross-session knowledge
- **🐝 Swarm Intelligence** - Multi-agent coordination
- **🗳️ Consensus** - Byzantine fault tolerance
- **📊 84.8% Success** - SWE-Bench proven
- **🎯 SPARC** - Systematic development with TDD

---

## ⚠️ Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| "Command not found" | Use `npx claude-flow@alpha` |
| "Swarm not initialized" | Run init command first (see DO-FIRST-README) |
| "Memory error" | Create namespaces: `for ns in project agents tasks cache neural; do npx claude-flow@alpha memory namespace --create $ns; done` |
| "No agents" | Spawn agents: `npx claude-flow@alpha agent spawn --type coder & npx claude-flow@alpha agent spawn --type tester & wait` |

---

## 🎓 Learning Path

1. **Setup** (5 min) - Follow DO-FIRST-README.md
2. **Verify** (1 min) - Run `npx claude-flow@alpha swarm status`
3. **Basic** (10 min) - Try `examples/01-basic-swarm.js`
4. **SPARC** (15 min) - Read SPARC-TUTORIAL.md
5. **Build** (30 min) - Create your first project with `sparc tdd`

---

## 📊 Verification Checklist

Run this to verify everything works:

```bash
echo "Checking claude-flow setup..."
npx claude-flow@alpha swarm status | grep -q "active" && echo "✅ Swarm" || echo "❌ Swarm"
npx claude-flow@alpha agent list | grep -q "active" && echo "✅ Agents" || echo "❌ Agents"
npx claude-flow@alpha memory usage | grep -q "namespace" && echo "✅ Memory" || echo "❌ Memory"
npx claude-flow@alpha neural status | grep -q "enabled" && echo "✅ Neural" || echo "❌ Neural"
```

All checks should show ✅

---

## 🚀 Quick Start Example

After setup, try this:

```bash
# Create a complete feature with tests
npx claude-flow@alpha sparc tdd "Create a user authentication system with JWT tokens"
```

---

## 📚 Resources

- **GitHub**: https://github.com/ruvnet/claude-flow
- **Documentation**: See `tutorial/docs/`
- **Examples**: See `tutorial/examples/`
- **Support**: GitHub Issues

---

## 🎉 Ready to Start?

1. Open **[DO-FIRST-README.md](tutorial/DO-FIRST-README.md)**
2. Follow the steps in order
3. Build something amazing!

**Welcome to claude-flow - where AI agents work as a team! 🐝🚀**