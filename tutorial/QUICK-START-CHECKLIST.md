# ✅ CLAUDE-FLOW QUICK START CHECKLIST

## 🎯 COPY-PASTE SETUP (5 MINUTES TOTAL)

> **Just copy and paste these commands in order. Green checkmarks = success!**

---

### 📋 PHASE 1: PREREQUISITES (1 minute)

```bash
# Check Node.js (must show 18.x.x or higher)
node --version

# If Node.js < 18, stop and install from https://nodejs.org
```

✅ **Gate 1**: Node.js 18+ installed

---

### 📋 PHASE 2: INSTALLATION (1 minute)

```bash
# Install claude-flow
npm install -g claude-flow@alpha

# Add to Claude Desktop
claude mcp add claude-flow npx claude-flow@alpha mcp start

# Verify
npx claude-flow@alpha --version
```

✅ **Gate 2**: Claude-flow installed and registered

---

### 📋 PHASE 3: PROJECT SETUP (1 minute)

```bash
# Create project (replace 'my-project' with your name)
mkdir my-project && cd my-project
mkdir -p {src,tests,docs,scripts,config}

# Create MANDATORY config file
cat > CLAUDE.md << 'EOF'
# Claude-Flow Project

## CRITICAL RULES
1. ALL operations MUST be parallel (use BatchTool)
2. NEVER save to root - use subdirectories
3. Initialize swarm FIRST

## Directories
- src/ - Code files
- tests/ - Test files
- docs/ - Documentation
- config/ - Configuration
EOF

# Create package.json
cat > package.json << 'EOF'
{
  "name": "my-project",
  "version": "1.0.0",
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "claude-flow": "alpha"
  }
}
EOF
```

✅ **Gate 3**: Project structure created

---

### 📋 PHASE 4: INITIALIZE EVERYTHING (1 minute)

```bash
# 🔴 MOST IMPORTANT COMMAND - RUN THIS FIRST
npx claude-flow@alpha swarm init \
  --topology hierarchical \
  --max-agents 12 \
  --enable-memory \
  --enable-neural \
  --enable-consensus \
  --enable-simd

# Create memory namespaces (one-liner)
for ns in project agents tasks cache neural; do \
  npx claude-flow@alpha memory namespace --create $ns; \
done

# Spawn initial agents in parallel
npx claude-flow@alpha agent spawn --type researcher &
npx claude-flow@alpha agent spawn --type coder &
npx claude-flow@alpha agent spawn --type tester &
npx claude-flow@alpha agent spawn --type coordinator &
wait
```

✅ **Gate 4**: Swarm initialized with all features

---

### 📋 PHASE 5: VERIFICATION (30 seconds)

```bash
# Run all checks
echo "=== VERIFICATION ==="
echo -n "✓ Swarm: " && npx claude-flow@alpha swarm status | grep -q "active" && echo "OK" || echo "FAIL"
echo -n "✓ Agents: " && npx claude-flow@alpha agent list | grep -q "active" && echo "OK" || echo "FAIL"  
echo -n "✓ Memory: " && npx claude-flow@alpha memory usage | grep -q "namespace" && echo "OK" || echo "FAIL"
echo -n "✓ Neural: " && npx claude-flow@alpha neural status | grep -q "enabled" && echo "OK" || echo "FAIL"
echo "=================="
```

✅ **Gate 5**: All systems operational

---

## 🚀 TEST WITH YOUR FIRST COMMAND

```bash
# If all checks passed, try this:
npx claude-flow@alpha sparc tdd "Create a calculator with add and subtract functions"
```

---

## 📌 DAILY STARTUP ROUTINE

**Every time you start working:**

```bash
# 1. Navigate to project
cd my-project

# 2. Initialize swarm (ALWAYS DO THIS FIRST)
npx claude-flow@alpha swarm init --topology hierarchical --max-agents 12 --enable-memory --enable-neural

# 3. Check status
npx claude-flow@alpha swarm status
```

---

## 🔥 POWER USER SHORTCUTS

Add to your `.bashrc` or `.zshrc`:

```bash
# Claude-Flow aliases
alias cfi='npx claude-flow@alpha swarm init --topology hierarchical --max-agents 12 --enable-memory --enable-neural'
alias cfs='npx claude-flow@alpha swarm status'
alias cfa='npx claude-flow@alpha agent'
alias cft='npx claude-flow@alpha task orchestrate'
alias cfm='npx claude-flow@alpha memory'
alias cfsparc='npx claude-flow@alpha sparc'

# Quick init function
cf-init() {
  echo "🚀 Initializing Claude-Flow..."
  cfi && echo "✅ Ready!"
}
```

---

## ⚡ PARALLEL EXECUTION CHEAT SHEET

### ❌ WRONG (Sequential)
```javascript
await operation1();
await operation2();
await operation3();
```

### ✅ CORRECT (Parallel)
```javascript
// JavaScript
await Promise.all([
  operation1(),
  operation2(),
  operation3()
]);

// Bash
operation1 & operation2 & operation3 & wait

// Claude BatchTool
[BatchTool]:
  operation1
  operation2
  operation3
```

---

## 🎓 VISUAL SETUP FLOW

```
START
  ↓
[Check Node.js 18+] → NO → [Install Node.js] → RESTART
  ↓ YES
[Install claude-flow]
  ↓
[Add to Claude Desktop]
  ↓
[Create project structure]
  ↓
[Create CLAUDE.md]
  ↓
[Initialize swarm] ← CRITICAL!
  ↓
[Create namespaces]
  ↓
[Spawn agents]
  ↓
[Verify all systems]
  ↓
READY! 🎉
```

---

## 🆘 QUICK FIXES

| Problem | Solution |
|---------|----------|
| "Command not found" | Use `npx claude-flow@alpha` |
| "Swarm not initialized" | Run the init command from Phase 4 |
| "Memory error" | Create namespaces (Phase 4) |
| "No agents" | Spawn agents (Phase 4) |
| "Parallel not working" | Check CLAUDE.md exists |

---

## 📊 SUCCESS CRITERIA

You're ready when you see:
- ✅ 4+ active agents
- ✅ 5 memory namespaces
- ✅ Swarm status: active
- ✅ Neural: enabled
- ✅ First SPARC command works

---

**🎯 TOTAL TIME: 5 MINUTES TO FULL POWER!**