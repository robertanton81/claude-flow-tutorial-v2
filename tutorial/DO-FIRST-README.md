# 🚨 DO FIRST: Claude-Flow Essential Setup Guide

## ⚡ START HERE - MANDATORY STEPS IN ORDER

> **WARNING**: Claude-Flow will NOT work properly without completing ALL these steps in the EXACT order shown.

---

## 📌 STEP 0: PRE-FLIGHT CHECK (30 seconds)

```bash
# Check Node.js version (MUST be 18+)
node --version
# ❌ If < 18: Install Node.js 18+ from https://nodejs.org

# Check npm version (MUST be 9+)
npm --version
# ❌ If < 9: Run: npm install -g npm@latest
```

---

## 📌 STEP 1: INSTALL CLAUDE-FLOW (1 minute)

```bash
# Choose ONE method:

# Option A: Global install (recommended)
npm install -g claude-flow@alpha

# Option B: Use npx (no install)
# Always prefix commands with: npx claude-flow@alpha
```

✅ **Verify**: `npx claude-flow@alpha --version` shows a version number

---

## 📌 STEP 2: ADD TO CLAUDE DESKTOP (1 minute)

```bash
# MANDATORY: Register as MCP server
claude mcp add claude-flow npx claude-flow@alpha mcp start

# Verify it's registered
claude mcp list
# ✅ Should show: claude-flow
```

---

## 📌 STEP 3: CREATE PROJECT STRUCTURE (1 minute)

```bash
# Create ALL required directories
mkdir -p project-name/{src,tests,docs,scripts,config}
cd project-name

# Create MANDATORY CLAUDE.md file
cat > CLAUDE.md << 'EOF'
# Claude Code Configuration

## 🚨 CRITICAL RULES
1. ALL operations MUST be concurrent/parallel in a single message
2. NEVER save files to root folder - use subdirectories
3. ALWAYS batch operations with BatchTool

## File Organization
- /src - Source code
- /tests - Test files  
- /docs - Documentation
- /config - Configuration
- /scripts - Utilities

## Execution Pattern
✅ CORRECT: BatchTool with multiple operations
❌ WRONG: Sequential operations in multiple messages
EOF
```

---

## 📌 STEP 4: INITIALIZE SWARM (MOST IMPORTANT!)

```bash
# 🔴 RUN THIS FIRST IN EVERY SESSION
npx claude-flow@alpha swarm init \
  --topology hierarchical \
  --max-agents 12 \
  --enable-memory \
  --enable-neural \
  --enable-consensus \
  --enable-simd

# ✅ Success message should appear
```

**⚠️ CRITICAL**: Without swarm initialization, NOTHING will work!

---

## 📌 STEP 5: CREATE MEMORY NAMESPACES (30 seconds)

```bash
# Run these commands ONE TIME per project
npx claude-flow@alpha memory namespace --create project
npx claude-flow@alpha memory namespace --create agents  
npx claude-flow@alpha memory namespace --create tasks
npx claude-flow@alpha memory namespace --create cache
npx claude-flow@alpha memory namespace --create neural

# Store initialization flag
npx claude-flow@alpha memory store \
  --key "system/initialized" \
  --value "$(date)" \
  --namespace project
```

---

## 📌 STEP 6: SPAWN INITIAL AGENTS (30 seconds)

```bash
# Spawn core agents in PARALLEL (use & for background)
npx claude-flow@alpha agent spawn --type researcher --name research-1 &
npx claude-flow@alpha agent spawn --type coder --name coder-1 &
npx claude-flow@alpha agent spawn --type tester --name tester-1 &
npx claude-flow@alpha agent spawn --type coordinator --name coord-1 &
wait  # Wait for all to complete

# Verify agents are running
npx claude-flow@alpha agent list
# ✅ Should show 4 active agents
```

---

## 📌 STEP 7: CREATE CONFIG FILES

### A. Package.json (MANDATORY)
```json
{
  "name": "your-project",
  "version": "1.0.0",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "dependencies": {
    "claude-flow": "alpha"
  },
  "scripts": {
    "setup": "npx claude-flow@alpha swarm init --topology hierarchical --max-agents 12 --enable-memory --enable-neural",
    "agents": "npx claude-flow@alpha agent list",
    "status": "npx claude-flow@alpha swarm status",
    "memory": "npx claude-flow@alpha memory usage"
  }
}
```

### B. .sparc.config.js (For SPARC methodology)
```javascript
module.exports = {
  swarm: {
    topology: 'hierarchical',
    maxAgents: 12,
    consensus: 'byzantine'
  },
  optimization: {
    parallel: true,
    caching: true,
    simd: true
  }
};
```

---

## 🎯 QUICK VERIFICATION TEST

Run this test to ensure everything works:

```bash
# Create test script
cat > test-setup.sh << 'EOF'
#!/bin/bash
echo "🔍 Testing Claude-Flow Setup..."

# Test 1: Swarm status
echo -n "1. Swarm Status: "
npx claude-flow@alpha swarm status > /dev/null 2>&1 && echo "✅ PASS" || echo "❌ FAIL"

# Test 2: Agents
echo -n "2. Agent List: "
npx claude-flow@alpha agent list > /dev/null 2>&1 && echo "✅ PASS" || echo "❌ FAIL"

# Test 3: Memory
echo -n "3. Memory System: "
npx claude-flow@alpha memory usage > /dev/null 2>&1 && echo "✅ PASS" || echo "❌ FAIL"

# Test 4: Neural
echo -n "4. Neural Features: "
npx claude-flow@alpha neural status > /dev/null 2>&1 && echo "✅ PASS" || echo "❌ FAIL"

# Test 5: Task execution
echo -n "5. Task Execution: "
npx claude-flow@alpha task orchestrate "test task" --strategy parallel > /dev/null 2>&1 && echo "✅ PASS" || echo "❌ FAIL"

echo ""
echo "Setup complete! All tests should show ✅ PASS"
EOF

chmod +x test-setup.sh
./test-setup.sh
```

---

## ⚠️ CRITICAL REMINDERS

### 🔴 ALWAYS DO:
```bash
# 1. Initialize swarm FIRST (every session)
npx claude-flow@alpha swarm init --topology hierarchical --max-agents 12 --enable-memory --enable-neural

# 2. Use parallel execution (& and wait)
command1 & command2 & command3 & wait

# 3. Include namespace in memory operations
--namespace project  # or agents, tasks, cache, neural

# 4. Use BatchTool in Claude for multiple operations
[BatchTool]: 
  operation1
  operation2
  operation3
```

### ❌ NEVER DO:
```bash
# 1. Sequential operations in multiple messages
# 2. Save files to root directory
# 3. Forget to initialize swarm
# 4. Use without namespaces
# 5. Run without proper Node.js version
```

---

## 🚀 YOUR FIRST WORKING COMMAND

After setup, try this complete example:

```bash
# One-liner to test everything
npx claude-flow@alpha sparc tdd "Create a hello world function with tests"
```

If this works, you're ready to use ALL claude-flow features!

---

## 📊 SETUP STATUS CHECKLIST

- [ ] Node.js 18+ installed
- [ ] claude-flow@alpha installed
- [ ] Added to Claude Desktop MCP
- [ ] Project directories created
- [ ] CLAUDE.md file created
- [ ] Swarm initialized
- [ ] Memory namespaces created
- [ ] Initial agents spawned
- [ ] Config files created
- [ ] Verification test passed

**✅ When ALL boxes checked = Ready for full parallel, memory-enabled, neural-powered development!**

---

## 🆘 TROUBLESHOOTING

### Problem: "Command not found"
```bash
# Solution: Use npx prefix
npx claude-flow@alpha <command>
```

### Problem: "Swarm not initialized"
```bash
# Solution: Always run first
npx claude-flow@alpha swarm init --topology hierarchical --max-agents 12 --enable-memory --enable-neural
```

### Problem: "Memory operation failed"
```bash
# Solution: Create namespace first
npx claude-flow@alpha memory namespace --create <namespace>
```

### Problem: "Agents not responding"
```bash
# Solution: Check and restart
npx claude-flow@alpha agent list
npx claude-flow@alpha swarm destroy
# Then re-initialize
```

---

## 📖 NEXT STEPS

Once setup is complete:

1. **Basic Operations**: See `tutorial/examples/01-basic-swarm.js`
2. **SPARC Development**: Run `npx claude-flow@alpha sparc info`
3. **Full Tutorial**: Read `tutorial/docs/README.md`
4. **Advanced Features**: Check `tutorial/docs/SPARC-TUTORIAL.md`

---

**🎉 Setup Complete! You now have claude-flow with ALL bells and whistles!**