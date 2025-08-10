# 📚 Claude-Flow SPARC Tutorial - Complete Setup & Installation Guide

> **The definitive guide to setting up Claude-Flow with SPARC methodology for AI-powered development**

## 🎯 Overview

This comprehensive guide will walk you through installing and configuring Claude-Flow, a powerful AI swarm orchestration system that implements the SPARC (Specification, Pseudocode, Architecture, Refinement, Completion) methodology for systematic Test-Driven Development.

### What You'll Get
- **🚀 2.8-4.4x Speed** - Parallel execution capabilities
- **🧠 Neural Networks** - WASM SIMD acceleration
- **💾 Persistent Memory** - Cross-session knowledge retention
- **🐝 Swarm Intelligence** - Multi-agent coordination
- **🗳️ Consensus Systems** - Byzantine fault tolerance
- **📊 84.8% Success Rate** - Proven on SWE-Bench
- **🎯 SPARC Methodology** - Systematic development with TDD

---

## 📋 System Requirements

### Minimum Requirements
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher
- **Operating System**: macOS, Linux, or Windows
- **Memory**: 8GB RAM minimum, 16GB recommended
- **Disk Space**: 2GB free space

### Recommended Environment
- **Claude Desktop App**: Latest version for MCP integration
- **Terminal**: Bash, Zsh, or PowerShell
- **Code Editor**: VS Code, Cursor, or similar with AI integration

### Compatibility Matrix
| OS | Node.js | npm | Status |
|---|---|---|---|
| macOS 12+ | 18+ | 9+ | ✅ Fully Supported |
| Ubuntu 20.04+ | 18+ | 9+ | ✅ Fully Supported |
| Windows 11 | 18+ | 9+ | ✅ Fully Supported |
| Windows 10 | 18+ | 9+ | ⚠️ Limited Testing |

---

## 🚀 Installation Methods

### Method 1: Instant Setup (Recommended)
**For users who want everything configured automatically**

```bash
# Clone the tutorial and run instant setup
git clone https://github.com/ruvnet/claude-flow.git
cd claude-flow/tutorial/scripts
./instant-setup.sh my-project-name
```

### Method 2: Manual Setup (Step-by-Step)
**For users who want to understand each step**

Follow the detailed instructions in [Section 3: Step-by-Step Installation](#step-by-step-installation).

### Method 3: Global Installation
**For advanced users with existing projects**

```bash
npm install -g claude-flow@alpha
claude mcp add claude-flow npx claude-flow@alpha mcp start
```

---

## 🔧 Step-by-Step Installation

### Prerequisites Check (2 minutes)

#### 1. Verify Node.js Version
```bash
# Check Node.js version (must be 18+)
node --version
# Expected output: v18.x.x or higher

# If version is too low, install from https://nodejs.org
```

#### 2. Verify npm Version
```bash
# Check npm version (must be 9+)
npm --version
# Expected output: 9.x.x or higher

# If version is too low:
npm install -g npm@latest
```

#### 3. System Resources Check
```bash
# Check available memory
free -h  # Linux/macOS with homebrew
Get-ComputerInfo | Select-Object TotalPhysicalMemory  # Windows PowerShell

# Check disk space
df -h  # Linux/macOS
Get-PSDrive C  # Windows PowerShell
```

### Core Installation (3 minutes)

#### 1. Install Claude-Flow
```bash
# Option A: Global installation (recommended)
npm install -g claude-flow@alpha

# Option B: Project-specific installation
npx claude-flow@alpha --version
```

**Verification**: Run `npx claude-flow@alpha --version` and confirm it returns a version number.

#### 2. Register with Claude Desktop
```bash
# Add as MCP server (required for Claude integration)
claude mcp add claude-flow npx claude-flow@alpha mcp start

# Verify registration
claude mcp list
# Should show: claude-flow ✅
```

#### 3. Create Project Structure
```bash
# Create project with required directories
mkdir -p your-project/{src,tests,docs,scripts,config}
cd your-project

# Verify structure
ls -la
# Should show: src/ tests/ docs/ scripts/ config/
```

### Configuration Setup (5 minutes)

#### 1. Create CLAUDE.md Configuration
```bash
cat > CLAUDE.md << 'EOF'
# Claude-Flow Project Configuration

## 🚨 CRITICAL EXECUTION RULES

**MANDATORY PATTERNS:**
1. ALL operations MUST be concurrent/parallel in single message
2. NEVER save files to root folder - use subdirectories
3. ALWAYS batch operations with BatchTool
4. Initialize swarm FIRST before any operations

## Directory Structure
- `/src` - Source code files
- `/tests` - Test files
- `/docs` - Documentation
- `/config` - Configuration files
- `/scripts` - Utility scripts

## Parallel Execution Pattern

### ✅ CORRECT (Single BatchTool message):
```
[BatchTool]:
  mcp__claude-flow__swarm_init { topology: "hierarchical" }
  mcp__claude-flow__agent_spawn { type: "coder" }
  mcp__claude-flow__agent_spawn { type: "tester" }
  mcp__claude-flow__task_orchestrate { task: "implement feature" }
```

### ❌ WRONG (Multiple sequential messages):
```
Message 1: swarm init
Message 2: agent spawn
Message 3: task orchestrate
```

## Memory Namespaces
- `project` - Project-wide configuration
- `agents` - Agent-specific knowledge
- `tasks` - Task history and results
- `cache` - Temporary cached data
- `neural` - Neural network models

## Available Agents
- researcher, coder, tester, analyst, optimizer, coordinator, documenter, reviewer

## Quick Commands
- Initialize: `npx claude-flow@alpha swarm init --topology hierarchical --max-agents 12 --enable-memory --enable-neural`
- Status: `npx claude-flow@alpha swarm status`
- Agents: `npx claude-flow@alpha agent list`
- Memory: `npx claude-flow@alpha memory usage`
EOF
```

#### 2. Create package.json
```bash
cat > package.json << EOF
{
  "name": "your-project",
  "version": "1.0.0",
  "description": "Claude-Flow enabled project with SPARC methodology",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "dependencies": {
    "claude-flow": "alpha"
  },
  "scripts": {
    "init": "npx claude-flow@alpha swarm init --topology hierarchical --max-agents 12 --enable-memory --enable-neural --enable-consensus --enable-simd",
    "status": "npx claude-flow@alpha swarm status",
    "agents": "npx claude-flow@alpha agent list",
    "memory": "npx claude-flow@alpha memory usage",
    "neural": "npx claude-flow@alpha neural status",
    "test-setup": "npm run init && npm run status && npm run agents",
    "sparc": "npx claude-flow@alpha sparc",
    "sparc-tdd": "npx claude-flow@alpha sparc tdd",
    "build": "echo 'Build process not configured'",
    "test": "echo 'Test runner not configured'",
    "lint": "echo 'Linter not configured'",
    "typecheck": "echo 'Type checker not configured'"
  },
  "keywords": [
    "claude-flow",
    "sparc",
    "ai",
    "swarm",
    "orchestration",
    "tdd",
    "neural-networks"
  ],
  "author": "Your Name",
  "license": "MIT"
}
EOF
```

#### 3. Create SPARC Configuration
```bash
cat > .sparc.config.js << 'EOF'
module.exports = {
  // SPARC Phase Configuration
  phases: {
    specification: {
      timeout: '1h',
      validators: ['requirements-checker'],
      output: 'docs/specs/',
      templates: ['user-story', 'acceptance-criteria']
    },
    pseudocode: {
      language: 'python-like',
      detail: 'high',
      includeComments: true,
      flowDiagrams: true
    },
    architecture: {
      patterns: ['microservices', 'event-driven', 'clean-architecture'],
      diagrams: true,
      documentation: ['sequence', 'component', 'deployment']
    },
    refinement: {
      tdd: true,
      coverage: 95,
      linting: 'strict',
      codeReview: true
    },
    completion: {
      documentation: ['api', 'user', 'developer'],
      deployment: 'containerized',
      monitoring: true
    }
  },
  
  // Swarm Configuration
  swarm: {
    topology: 'hierarchical',
    maxAgents: 12,
    consensus: 'byzantine',
    faultTolerance: true
  },
  
  // Performance Optimization
  optimization: {
    parallel: true,
    caching: true,
    simd: true,
    memoryManagement: 'aggressive'
  },
  
  // Integration Settings
  integrations: {
    github: {
      enabled: true,
      autoReview: true,
      issueTracking: true
    },
    claude: {
      mcp: true,
      hooks: true,
      memory: true
    }
  }
};
EOF
```

### System Initialization (3 minutes)

#### 1. Initialize Swarm
```bash
# Initialize the AI swarm with all features
npx claude-flow@alpha swarm init \
  --topology hierarchical \
  --max-agents 12 \
  --enable-memory \
  --enable-neural \
  --enable-consensus \
  --enable-simd

# Expected output: "✅ Swarm initialized successfully"
```

#### 2. Create Memory Namespaces
```bash
# Create all required memory namespaces
for namespace in project agents tasks cache neural; do
  npx claude-flow@alpha memory namespace --create $namespace
  echo "✅ Created namespace: $namespace"
done
```

#### 3. Spawn Initial Agents
```bash
# Spawn core agents in parallel
npx claude-flow@alpha agent spawn --type researcher --name researcher-1 &
npx claude-flow@alpha agent spawn --type coder --name coder-1 &
npx claude-flow@alpha agent spawn --type tester --name tester-1 &
npx claude-flow@alpha agent spawn --type coordinator --name coordinator-1 &
wait

# Verify agents are active
npx claude-flow@alpha agent list
```

#### 4. Store Initialization Data
```bash
# Record successful initialization
npx claude-flow@alpha memory store \
  --key "system/initialized" \
  --value "$(date)" \
  --namespace project

npx claude-flow@alpha memory store \
  --key "system/version" \
  --value "$(npx claude-flow@alpha --version)" \
  --namespace project
```

---

## ✅ Verification & Testing

### Automated Verification Script
```bash
# Create comprehensive verification script
cat > scripts/verify-setup.sh << 'EOF'
#!/bin/bash
echo "🔍 Verifying Claude-Flow Setup..."
echo ""

PASS=0
FAIL=0

# Test function
test_command() {
    echo -n "$1: "
    if eval "$2" > /dev/null 2>&1; then
        echo "✅ PASS"
        ((PASS++))
    else
        echo "❌ FAIL"
        ((FAIL++))
    fi
}

# Core system tests
test_command "Node.js Version (>=18)" "node -e 'process.exit(parseInt(process.version.slice(1)) >= 18 ? 0 : 1)'"
test_command "npm Version (>=9)" "npm -v | awk -F. '{exit (\$1 >= 9 ? 0 : 1)}'"
test_command "Claude-Flow Installation" "npx claude-flow@alpha --version"
test_command "Swarm Status" "npx claude-flow@alpha swarm status"
test_command "Agent List" "npx claude-flow@alpha agent list"
test_command "Memory System" "npx claude-flow@alpha memory usage"
test_command "Neural Features" "npx claude-flow@alpha neural status"
test_command "Task Orchestration" "npx claude-flow@alpha task orchestrate 'test task' --strategy parallel"

# Configuration tests
test_command "CLAUDE.md Present" "test -f CLAUDE.md"
test_command "package.json Valid" "npm ls --depth=0"
test_command "SPARC Config Present" "test -f .sparc.config.js"

# Directory structure tests
for dir in src tests docs scripts config; do
    test_command "Directory: $dir" "test -d $dir"
done

# Memory namespace tests
for ns in project agents tasks cache neural; do
    test_command "Namespace: $ns" "npx claude-flow@alpha memory usage --namespace $ns"
done

echo ""
echo "Results: $PASS passed, $FAIL failed"

if [ $FAIL -eq 0 ]; then
    echo "✅ All systems operational! Claude-Flow is ready for use."
    exit 0
else
    echo "❌ Some systems need attention. Check the failed tests above."
    exit 1
fi
EOF

chmod +x scripts/verify-setup.sh
./scripts/verify-setup.sh
```

### Manual Verification Checklist

Run through this checklist to ensure everything is working:

- [ ] **Node.js 18+**: `node --version` returns v18+ 
- [ ] **npm 9+**: `npm --version` returns 9+
- [ ] **Claude-Flow Installed**: `npx claude-flow@alpha --version` works
- [ ] **MCP Registration**: `claude mcp list` shows claude-flow
- [ ] **Project Structure**: All directories (src, tests, docs, scripts, config) exist
- [ ] **Configuration Files**: CLAUDE.md, package.json, .sparc.config.js present
- [ ] **Swarm Initialized**: `npx claude-flow@alpha swarm status` shows active
- [ ] **Memory Namespaces**: All 5 namespaces created
- [ ] **Agents Active**: At least 4 agents running
- [ ] **Neural Features**: Neural system enabled

### First Test Run
```bash
# Test the complete SPARC workflow
npx claude-flow@alpha sparc tdd "Create a simple calculator function that adds two numbers with unit tests"
```

**Expected Result**: The system should generate specifications, pseudocode, architecture, implement the function with tests, and provide completion documentation.

---

## 🎯 Quick Start Commands

Once installation is complete, these are your essential commands:

### Daily Startup Sequence
```bash
# 1. Initialize swarm (run once per session)
npm run init

# 2. Check system status
npm run status

# 3. List active agents
npm run agents
```

### SPARC Development Commands
```bash
# Run complete SPARC TDD workflow
npx claude-flow@alpha sparc tdd "Your feature description"

# Run individual SPARC phases
npx claude-flow@alpha sparc run specification "User authentication system"
npx claude-flow@alpha sparc run pseudocode "Login validation logic"
npx claude-flow@alpha sparc run architecture "Microservices design"
npx claude-flow@alpha sparc run refinement "Implement with TDD"
npx claude-flow@alpha sparc run completion "Deploy and document"

# Batch processing
npx claude-flow@alpha sparc batch "spec,pseudocode,architecture" "Complete user management system"
```

### Essential Monitoring Commands
```bash
# System monitoring
npx claude-flow@alpha swarm monitor --interval 5
npx claude-flow@alpha agent metrics
npx claude-flow@alpha performance report

# Memory management
npx claude-flow@alpha memory usage --detailed
npx claude-flow@alpha memory search --pattern "feature" --namespace project

# Task tracking
npx claude-flow@alpha task status
npx claude-flow@alpha task results <task-id>
```

---

## 🚨 Common Installation Issues & Solutions

### Issue 1: "Command not found"
**Symptoms**: `claude-flow: command not found`

**Solutions**:
```bash
# Solution A: Use npx prefix
npx claude-flow@alpha <command>

# Solution B: Check global installation
npm list -g claude-flow

# Solution C: Reinstall globally
npm install -g claude-flow@alpha
```

### Issue 2: "Swarm not initialized"
**Symptoms**: Commands fail with swarm initialization error

**Solutions**:
```bash
# Always run initialization first
npx claude-flow@alpha swarm init \
  --topology hierarchical \
  --max-agents 12 \
  --enable-memory \
  --enable-neural

# Check swarm status
npx claude-flow@alpha swarm status
```

### Issue 3: "Memory operation failed"
**Symptoms**: Memory commands return errors

**Solutions**:
```bash
# Create missing namespaces
for ns in project agents tasks cache neural; do
  npx claude-flow@alpha memory namespace --create $ns
done

# Check memory usage
npx claude-flow@alpha memory usage --detailed
```

### Issue 4: "Agents not responding"
**Symptoms**: No agents in agent list or agents appear inactive

**Solutions**:
```bash
# Check current agents
npx claude-flow@alpha agent list

# Restart swarm if needed
npx claude-flow@alpha swarm destroy
npx claude-flow@alpha swarm init --topology hierarchical --max-agents 12 --enable-memory --enable-neural

# Respawn agents
npx claude-flow@alpha agent spawn --type coordinator &
npx claude-flow@alpha agent spawn --type coder &
npx claude-flow@alpha agent spawn --type tester &
wait
```

### Issue 5: "Neural features disabled"
**Symptoms**: Neural commands return "not enabled" errors

**Solutions**:
```bash
# Reinitialize with neural features
npx claude-flow@alpha swarm destroy
npx claude-flow@alpha swarm init \
  --topology hierarchical \
  --max-agents 12 \
  --enable-memory \
  --enable-neural \
  --enable-simd

# Verify neural status
npx claude-flow@alpha neural status
```

### Issue 6: "MCP integration failed"
**Symptoms**: Claude Desktop doesn't recognize claude-flow

**Solutions**:
```bash
# Re-register MCP server
claude mcp remove claude-flow
claude mcp add claude-flow npx claude-flow@alpha mcp start

# Restart Claude Desktop application
# Verify registration
claude mcp list
```

### Issue 7: "Permission denied"
**Symptoms**: Cannot create directories or files

**Solutions**:
```bash
# Linux/macOS: Fix permissions
sudo chown -R $USER:$USER ~/.claude-flow
chmod -R 755 ~/.claude-flow

# Windows: Run as administrator
# Or check Windows Defender exclusions
```

---

## 🔧 Environment Setup & Configuration

### Environment Variables
Create a `.env` file in your project root:

```bash
cat > .env << 'EOF'
# Claude-Flow Configuration
CLAUDE_FLOW_LOG_LEVEL=info
CLAUDE_FLOW_MAX_AGENTS=12
CLAUDE_FLOW_MEMORY_PERSIST=true
CLAUDE_FLOW_NEURAL_ENABLED=true
CLAUDE_FLOW_CONSENSUS_TYPE=byzantine

# Development Settings
NODE_ENV=development
DEBUG=claude-flow:*

# Performance Settings
CLAUDE_FLOW_PARALLEL_ENABLED=true
CLAUDE_FLOW_SIMD_ENABLED=true
CLAUDE_FLOW_CACHE_ENABLED=true

# Integration Settings
GITHUB_TOKEN=your_token_here
OPENAI_API_KEY=your_key_here
EOF
```

### IDE Configuration

#### VS Code Settings
```json
{
  "files.associations": {
    "*.sparc": "javascript",
    ".sparc.config.js": "javascript"
  },
  "emmet.includeLanguages": {
    "sparc": "javascript"
  },
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

#### Cursor Integration
```bash
# Add claude-flow extension
cursor --install-extension claude-flow.cursor-integration
```

### Shell Integration

#### Bash/Zsh Aliases
```bash
# Add to ~/.bashrc or ~/.zshrc
alias cf='npx claude-flow@alpha'
alias cfs='npx claude-flow@alpha swarm status'
alias cfa='npx claude-flow@alpha agent list'
alias cfm='npx claude-flow@alpha memory usage'
alias cfsparctdd='npx claude-flow@alpha sparc tdd'

# Auto-completion
eval "$(npx claude-flow@alpha completion)"
```

#### PowerShell Profile
```powershell
# Add to $PROFILE
Set-Alias cf 'npx claude-flow@alpha'
Set-Alias cfs 'npx claude-flow@alpha swarm status'
Set-Alias cfa 'npx claude-flow@alpha agent list'
```

---

## 📊 Performance Optimization

### Memory Configuration
```bash
# Optimize memory usage
npx claude-flow@alpha memory configure \
  --max-size 1GB \
  --cleanup-interval 1h \
  --compression gzip

# Monitor memory usage
npx claude-flow@alpha memory analytics --timeframe 24h
```

### Neural Network Optimization
```bash
# Configure neural features
npx claude-flow@alpha neural configure \
  --enable-simd true \
  --model-cache-size 512MB \
  --training-threads 4

# Run performance benchmarks
npx claude-flow@alpha benchmark run --type neural
```

### Swarm Optimization
```bash
# Optimize topology based on workload
npx claude-flow@alpha swarm optimize \
  --strategy adaptive \
  --target-latency 100ms

# Monitor swarm performance
npx claude-flow@alpha swarm monitor --metrics detailed
```

---

## 🔗 Integration Guides

### GitHub Integration
```bash
# Configure GitHub integration
npx claude-flow@alpha github configure \
  --token $GITHUB_TOKEN \
  --auto-review true \
  --issue-tracking true

# Test GitHub features
npx claude-flow@alpha github repo analyze owner/repo
```

### CI/CD Integration

#### GitHub Actions
```yaml
name: Claude-Flow CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install Claude-Flow
        run: npm install -g claude-flow@alpha
      - name: Initialize Swarm
        run: npx claude-flow@alpha swarm init --topology hierarchical
      - name: Run SPARC Tests
        run: npx claude-flow@alpha sparc tdd "${{ github.event.head_commit.message }}"
```

---

## 📚 Next Steps

### Immediate Actions (First 30 minutes)
1. **Complete Verification**: Ensure all tests pass
2. **Try First Example**: Run a simple SPARC TDD workflow
3. **Explore Documentation**: Read tutorial examples
4. **Join Community**: Check GitHub discussions

### Learning Path (First Week)
1. **Day 1-2**: Complete all tutorial examples (01-09)
2. **Day 3-4**: Deep dive into SPARC methodology
3. **Day 5-6**: Build your first real project
4. **Day 7**: Explore advanced features and integrations

### Advanced Configuration (Week 2+)
1. **Custom Agent Types**: Create specialized agents
2. **Neural Training**: Train custom models
3. **Consensus Mechanisms**: Implement custom voting
4. **Performance Tuning**: Optimize for your specific use case

---

## 🔍 Troubleshooting & Support

### Diagnostic Commands
```bash
# Full system diagnostic
npx claude-flow@alpha diagnostic run --comprehensive

# Log analysis
npx claude-flow@alpha log analyze --pattern error --timeframe 1h

# Health check
npx claude-flow@alpha health check --all-components
```

### Getting Help
1. **Documentation**: Check `docs/` directory
2. **Examples**: Review `examples/` directory
3. **GitHub Issues**: https://github.com/ruvnet/claude-flow/issues
4. **Community**: GitHub Discussions
5. **Support**: Create detailed issue reports with diagnostic output

### Reporting Issues
When reporting issues, include:
```bash
# System information
npx claude-flow@alpha diagnostic system-info

# Recent logs
npx claude-flow@alpha log export --last 100

# Configuration dump
npx claude-flow@alpha config export --anonymize
```

---

## 🎉 Conclusion

You now have a fully configured Claude-Flow environment with SPARC methodology enabled! This setup provides you with:

- **Intelligent AI swarms** for coordinated development
- **Systematic SPARC workflow** for structured development
- **Neural-powered optimization** for enhanced performance
- **Persistent memory** for knowledge retention
- **Consensus mechanisms** for reliable decisions
- **GitHub integration** for seamless workflow

### Final Verification
Run this command to confirm everything is working:
```bash
npx claude-flow@alpha sparc tdd "Create a hello world application with comprehensive tests and documentation"
```

If this completes successfully, you're ready to build amazing things with Claude-Flow!

---

**🚀 Welcome to the future of AI-assisted development with Claude-Flow and SPARC! Happy coding! 🎯**

---

## 📖 Quick Reference

### Essential Commands
| Command | Purpose |
|---------|---------|
| `npx claude-flow@alpha swarm init` | Initialize AI swarm |
| `npx claude-flow@alpha sparc tdd "task"` | Run complete SPARC workflow |
| `npx claude-flow@alpha swarm status` | Check swarm health |
| `npx claude-flow@alpha agent list` | List active agents |
| `npx claude-flow@alpha memory usage` | Check memory usage |

### File Locations
| File | Purpose |
|------|---------|
| `CLAUDE.md` | Core configuration |
| `package.json` | Project configuration |
| `.sparc.config.js` | SPARC methodology settings |
| `scripts/verify-setup.sh` | Verification script |
| `.env` | Environment variables |

### Memory Namespaces
- `project` - Project configuration
- `agents` - Agent knowledge
- `tasks` - Task history
- `cache` - Temporary data
- `neural` - Neural models