# 🎯 FIRST-TIME USER GUIDE: Claude-Flow in 5 Minutes

## 👋 Welcome! Let's Get You Started FAST

> **Goal**: Have claude-flow fully working with ALL features in under 5 minutes.

---

## 🚦 TRAFFIC LIGHT SYSTEM

- 🔴 **RED** = STOP! Must complete before continuing
- 🟡 **YELLOW** = Important but not blocking
- 🟢 **GREEN** = Good to go!

---

## 🔴 MINUTE 1: CRITICAL CHECKS

### Do you have Node.js 18+?

```bash
node --version
```

- **v18.x.x or higher** → 🟢 Continue to Minute 2
- **Lower or not installed** → 🔴 STOP! [Install Node.js](https://nodejs.org) first

---

## 🔴 MINUTE 2: ONE-COMMAND INSTALL

Copy and paste this ENTIRE block:

```bash
# Install claude-flow globally
npm install -g claude-flow@alpha

# Add to Claude Desktop (if using Claude Desktop)
claude mcp add claude-flow npx claude-flow@alpha mcp start 2>/dev/null || echo "Skipping Claude Desktop setup"

# Verify installation
npx claude-flow@alpha --version && echo "✅ Claude-Flow installed successfully!"
```

**See version number?** → 🟢 Continue to Minute 3  
**Error?** → 🔴 Try: `npx claude-flow@alpha --version`

---

## 🔴 MINUTE 3: INSTANT PROJECT SETUP

### Option A: Automatic Setup (Recommended)

```bash
# Download and run instant setup script
curl -fsSL https://raw.githubusercontent.com/ruvnet/claude-flow/main/setup.sh | bash -s my-project

# OR if you have the tutorial files:
cd tutorial/scripts
./instant-setup.sh my-awesome-project
```

### Option B: Manual Quick Setup

```bash
# Create project with one command
mkdir my-project && cd my-project && \
mkdir -p {src,tests,docs,scripts,config} && \
echo '# Claude-Flow Project

## CRITICAL RULES
1. ALL operations MUST be parallel
2. NEVER save to root folder
3. Initialize swarm FIRST

## Directories
- src/ - Code
- tests/ - Tests
- docs/ - Docs' > CLAUDE.md && \
echo '{
  "name": "my-project",
  "version": "1.0.0",
  "engines": { "node": ">=18.0.0" },
  "dependencies": { "claude-flow": "alpha" }
}' > package.json && \
echo "✅ Project created!"
```

---

## 🔴 MINUTE 4: INITIALIZE EVERYTHING

**THIS IS THE MOST IMPORTANT STEP!** Copy and run this ENTIRE block:

```bash
# Initialize swarm with ALL features (MANDATORY)
npx claude-flow@alpha swarm init \
  --topology hierarchical \
  --max-agents 12 \
  --enable-memory \
  --enable-neural \
  --enable-consensus \
  --enable-simd && \

# Create memory namespaces (one command)
for ns in project agents tasks cache neural; do \
  npx claude-flow@alpha memory namespace --create $ns; \
done && \

# Spawn 4 agents in parallel
(npx claude-flow@alpha agent spawn --type researcher &
npx claude-flow@alpha agent spawn --type coder &
npx claude-flow@alpha agent spawn --type tester &
npx claude-flow@alpha agent spawn --type coordinator &
wait) && \

echo "✅ Everything initialized!"
```

**See "Everything initialized!"?** → 🟢 Continue to Minute 5  
**Error?** → 🔴 Run each command separately to find the issue

---

## 🟢 MINUTE 5: VERIFY & TEST

### Quick Verification (10 seconds)

```bash
# Run this single command to check everything
npx claude-flow@alpha swarm status | grep -q "active" && \
npx claude-flow@alpha agent list | grep -q "active" && \
echo "🎉 SUCCESS! Claude-Flow is fully operational!" || \
echo "⚠️ Something needs attention - check the output above"
```

### Your First Real Command (20 seconds)

```bash
# Test with a real SPARC command
npx claude-flow@alpha sparc tdd "Create a function that converts Celsius to Fahrenheit with tests"
```

**Did it work?** → 🎉 **CONGRATULATIONS! You're ready!**

---

## 💡 WHAT YOU JUST ACHIEVED

In 5 minutes, you've enabled:

- ✅ **Parallel Execution** - 2.8-4.4x faster development
- ✅ **Collective Memory** - Persistent knowledge across sessions
- ✅ **Neural Networks** - AI-powered optimization with SIMD
- ✅ **Swarm Intelligence** - 12 agents working together
- ✅ **SPARC Methodology** - Systematic development with TDD
- ✅ **Byzantine Consensus** - Fault-tolerant decision making

---

## 📱 QUICK REFERENCE CARD

### Daily Startup (Every Session)
```bash
cd my-project
npx claude-flow@alpha swarm init --topology hierarchical --max-agents 12 --enable-memory --enable-neural
```

### Most Used Commands
```bash
# Check status
npx claude-flow@alpha swarm status

# List agents
npx claude-flow@alpha agent list

# Run SPARC TDD
npx claude-flow@alpha sparc tdd "feature description"

# Execute task
npx claude-flow@alpha task orchestrate "task description" --strategy parallel
```

### Parallel Pattern (MEMORIZE THIS!)
```bash
# ❌ WRONG
command1
command2
command3

# ✅ CORRECT
command1 & command2 & command3 & wait
```

---

## 🚨 TROUBLESHOOTING IN 30 SECONDS

| Problem | Fix |
|---------|-----|
| "command not found" | Use `npx claude-flow@alpha` prefix |
| "swarm not initialized" | Run the init command from Minute 4 |
| "no agents available" | Run spawn commands from Minute 4 |
| "memory error" | Create namespaces (Minute 4) |
| Nothing works | Start over with instant-setup.sh |

---

## 🎓 NEXT STEPS (After Success)

### 1. Learn SPARC (10 minutes)
```bash
cat tutorial/docs/SPARC-TUTORIAL.md
```

### 2. Try Examples (5 minutes each)
```bash
node tutorial/examples/01-basic-swarm.js
node tutorial/examples/02-parallel-execution.js
```

### 3. Build Something Real
```bash
npx claude-flow@alpha sparc pipeline "Build a REST API for todo list with authentication"
```

---

## 🏆 POWER USER TIP

Add this to your shell profile (.bashrc/.zshrc) for instant access:

```bash
# Claude-Flow instant init
alias cfinit='npx claude-flow@alpha swarm init --topology hierarchical --max-agents 12 --enable-memory --enable-neural --enable-consensus --enable-simd && echo "✅ Claude-Flow Ready!"'

# Now just type: cfinit
```

---

## ✅ SUCCESS CHECKLIST

Before starting real work, ensure:

- [ ] Node.js 18+ installed
- [ ] claude-flow@alpha installed  
- [ ] Project folder created with CLAUDE.md
- [ ] Swarm initialized (most important!)
- [ ] 4+ agents spawned
- [ ] Memory namespaces created
- [ ] First SPARC command worked

**All checked?** → **You're a claude-flow power user! 🚀**

---

## 📞 GETTING HELP

- **Documentation**: `tutorial/docs/`
- **Examples**: `tutorial/examples/`
- **GitHub**: https://github.com/ruvnet/claude-flow
- **Quick Test**: `npx claude-flow@alpha swarm status`

---

**🎉 Welcome to the claude-flow community! Happy parallel coding!**