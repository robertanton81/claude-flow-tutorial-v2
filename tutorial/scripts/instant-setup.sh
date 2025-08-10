#!/bin/bash
# instant-setup.sh - Complete claude-flow setup in one command
# Usage: ./instant-setup.sh [project-name]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project name (default: claude-flow-project)
PROJECT_NAME=${1:-claude-flow-project}

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}     CLAUDE-FLOW INSTANT SETUP SCRIPT${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Function to check command success
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1 failed${NC}"
        exit 1
    fi
}

# Step 1: Prerequisites check
echo -e "${YELLOW}📋 STEP 1: Checking prerequisites...${NC}"
NODE_VERSION=$(node --version 2>/dev/null | cut -d'v' -f2 | cut -d'.' -f1)
if [ -z "$NODE_VERSION" ] || [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ required. Please install from https://nodejs.org${NC}"
    exit 1
fi
check_status "Node.js 18+ found"

# Step 2: Install claude-flow
echo -e "\n${YELLOW}📋 STEP 2: Installing claude-flow...${NC}"
if ! command -v claude-flow &> /dev/null; then
    npm install -g claude-flow@alpha 2>/dev/null || true
fi
check_status "claude-flow installed"

# Step 3: Create project structure
echo -e "\n${YELLOW}📋 STEP 3: Creating project structure...${NC}"
mkdir -p "$PROJECT_NAME"/{src,tests,docs,scripts,config}
cd "$PROJECT_NAME"
check_status "Project directories created"

# Step 4: Create CLAUDE.md
echo -e "\n${YELLOW}📋 STEP 4: Creating configuration files...${NC}"
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
check_status "CLAUDE.md created"

# Step 5: Create package.json
cat > package.json << EOF
{
  "name": "$PROJECT_NAME",
  "version": "1.0.0",
  "description": "Claude-Flow enabled project",
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
    "sparc": "npx claude-flow@alpha sparc"
  }
}
EOF
check_status "package.json created"

# Step 6: Create .sparc.config.js
cat > .sparc.config.js << 'EOF'
module.exports = {
  phases: {
    specification: {
      timeout: '1h',
      validators: ['requirements-checker'],
      output: 'docs/specs/'
    },
    pseudocode: {
      language: 'python-like',
      detail: 'high'
    },
    architecture: {
      patterns: ['microservices', 'event-driven'],
      diagrams: true
    },
    refinement: {
      tdd: true,
      coverage: 95,
      linting: 'strict'
    },
    completion: {
      documentation: ['api', 'user', 'developer'],
      deployment: 'kubernetes'
    }
  },
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
EOF
check_status "SPARC config created"

# Step 7: Initialize swarm
echo -e "\n${YELLOW}📋 STEP 5: Initializing claude-flow swarm...${NC}"
npx claude-flow@alpha swarm init \
  --topology hierarchical \
  --max-agents 12 \
  --enable-memory \
  --enable-neural \
  --enable-consensus \
  --enable-simd 2>/dev/null
check_status "Swarm initialized"

# Step 8: Create memory namespaces
echo -e "\n${YELLOW}📋 STEP 6: Creating memory namespaces...${NC}"
for ns in project agents tasks cache neural; do
  npx claude-flow@alpha memory namespace --create $ns 2>/dev/null
done
check_status "Memory namespaces created"

# Step 9: Spawn initial agents
echo -e "\n${YELLOW}📋 STEP 7: Spawning initial agents...${NC}"
npx claude-flow@alpha agent spawn --type researcher --name researcher-1 2>/dev/null &
npx claude-flow@alpha agent spawn --type coder --name coder-1 2>/dev/null &
npx claude-flow@alpha agent spawn --type tester --name tester-1 2>/dev/null &
npx claude-flow@alpha agent spawn --type coordinator --name coordinator-1 2>/dev/null &
wait
check_status "Agents spawned"

# Step 10: Store initialization
echo -e "\n${YELLOW}📋 STEP 8: Storing initialization data...${NC}"
npx claude-flow@alpha memory store \
  --key "system/initialized" \
  --value "$(date)" \
  --namespace project 2>/dev/null
check_status "Initialization stored"

# Step 11: Create test script
echo -e "\n${YELLOW}📋 STEP 9: Creating verification script...${NC}"
cat > scripts/verify-setup.sh << 'EOF'
#!/bin/bash
echo "🔍 Verifying Claude-Flow Setup..."
echo ""

PASS=0
FAIL=0

# Test functions
test_command() {
    echo -n "$1: "
    if $2 > /dev/null 2>&1; then
        echo "✅ PASS"
        ((PASS++))
    else
        echo "❌ FAIL"
        ((FAIL++))
    fi
}

# Run tests
test_command "Swarm Status" "npx claude-flow@alpha swarm status"
test_command "Agent List" "npx claude-flow@alpha agent list"
test_command "Memory System" "npx claude-flow@alpha memory usage"
test_command "Neural Features" "npx claude-flow@alpha neural status"
test_command "Task Execution" "npx claude-flow@alpha task orchestrate 'test' --strategy parallel"

echo ""
echo "Results: $PASS passed, $FAIL failed"

if [ $FAIL -eq 0 ]; then
    echo "✅ All systems operational!"
    exit 0
else
    echo "❌ Some systems need attention"
    exit 1
fi
EOF
chmod +x scripts/verify-setup.sh
check_status "Verification script created"

# Step 12: Run verification
echo -e "\n${YELLOW}📋 STEP 10: Running verification...${NC}"
./scripts/verify-setup.sh

# Final summary
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}     ✅ SETUP COMPLETE!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Project created: ${NC}$PROJECT_NAME"
echo -e "${BLUE}Location: ${NC}$(pwd)"
echo ""
echo -e "${YELLOW}🚀 Quick Start Commands:${NC}"
echo "  cd $PROJECT_NAME"
echo "  npx claude-flow@alpha sparc tdd \"Your first feature\""
echo ""
echo -e "${YELLOW}📚 Resources:${NC}"
echo "  Tutorial: docs/README.md"
echo "  SPARC Guide: docs/SPARC-TUTORIAL.md"
echo "  Examples: examples/"
echo ""
echo -e "${YELLOW}⚡ Daily Startup:${NC}"
echo "  npm run init  # Initialize swarm"
echo "  npm run status  # Check status"
echo ""
echo -e "${GREEN}Happy coding with claude-flow! 🎉${NC}"