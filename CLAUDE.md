# Claude Code Configuration - SPARC Development Environment

## 🚨 CRITICAL: CONCURRENT EXECUTION & FILE MANAGEMENT

**ABSOLUTE RULES**:
1. ALL operations MUST be concurrent/parallel in a single message
2. **NEVER save working files, text/mds and tests to the root folder**
3. ALWAYS organize files in appropriate subdirectories

### ⚡ GOLDEN RULE: "1 MESSAGE = ALL RELATED OPERATIONS"

**MANDATORY PATTERNS:**
- **TodoWrite**: ALWAYS batch ALL todos in ONE call (5-10+ todos minimum)
- **Task tool**: ALWAYS spawn ALL agents in ONE message with full instructions
- **File operations**: ALWAYS batch ALL reads/writes/edits in ONE message
- **Bash commands**: ALWAYS batch ALL terminal operations in ONE message
- **Memory operations**: ALWAYS batch ALL memory store/retrieve in ONE message

### 📁 File Organization Rules

**NEVER save to root folder. Use these directories:**
- `/src` - Source code files
- `/tests` - Test files
- `/docs` - Documentation and markdown files
- `/config` - Configuration files
- `/scripts` - Utility scripts
- `/examples` - Example code

## Project Overview

This project uses SPARC (Specification, Pseudocode, Architecture, Refinement, Completion) methodology with Claude-Flow orchestration for systematic Test-Driven Development.

## SPARC Commands

### Core Commands
- `npx claude-flow@alpha sparc modes` - List available modes
- `npx claude-flow@alpha sparc run <mode> "<task>"` - Execute specific mode
- `npx claude-flow@alpha sparc tdd "<feature>"` - Run complete TDD workflow
- `npx claude-flow@alpha sparc info <mode>` - Get mode details

### Batchtools Commands
- `npx claude-flow@alpha sparc batch <modes> "<task>"` - Parallel execution
- `npx claude-flow@alpha sparc pipeline "<task>"` - Full pipeline processing
- `npx claude-flow@alpha sparc concurrent <mode> "<tasks-file>"` - Multi-task processing

### Build Commands
- `npm run build` - Build project
- `npm run test` - Run tests
- `npm run lint` - Linting
- `npm run typecheck` - Type checking

## SPARC Workflow Phases

1. **Specification** - Requirements analysis (`npx claude-flow@alpha sparc run spec`)
2. **Pseudocode** - Algorithm design (`npx claude-flow@alpha sparc run spec`)
3. **Architecture** - System design (`npx claude-flow@alpha sparc run architect`)
4. **Refinement** - TDD implementation (`npx claude-flow@alpha sparc tdd`)
5. **Completion** - Integration (`npx claude-flow@alpha sparc run integration`)

## Code Style & Best Practices

- **Modular Design**: Files under 500 lines
- **Environment Safety**: Never hardcode secrets
- **Test-First**: Write tests before implementation
- **Clean Architecture**: Separate concerns
- **Documentation**: Keep updated

## 🚀 Available Agents (49 Total)

### 🔧 Core Development (5 agents)
- **`coder`** - Primary implementation agent for writing production code, implementing features, and handling core programming tasks
- **`reviewer`** - Code quality specialist focused on security, performance, maintainability, and best practices review
- **`tester`** - Unit testing expert creating comprehensive test suites, test cases, and ensuring code coverage
- **`planner`** - Project planning and task breakdown specialist, creates roadmaps and coordinates development phases
- **`researcher`** - Requirements analysis and technical research agent for investigating solutions and technologies

### 🎛️ Swarm Coordination (5 agents)
- **`hierarchical-coordinator`** - Manages tree-structured agent hierarchies with clear command chains and delegation
- **`mesh-coordinator`** - Coordinates peer-to-peer agent networks with distributed decision making
- **`adaptive-coordinator`** - Dynamic coordination that adjusts topology and strategies based on workload
- **`collective-intelligence-coordinator`** - Aggregates knowledge and decisions from multiple agents for optimal outcomes
- **`swarm-memory-manager`** - Manages shared memory, context, and knowledge distribution across agent networks

### 🔗 Consensus & Distributed (7 agents)
- **`byzantine-coordinator`** - Handles fault-tolerant consensus in untrusted distributed environments
- **`raft-manager`** - Implements Raft consensus protocol for leader election and log replication
- **`gossip-coordinator`** - Manages information propagation through gossip protocols in large networks
- **`consensus-builder`** - General consensus mechanism coordinator for group decision making
- **`crdt-synchronizer`** - Handles conflict-free replicated data types for distributed state management
- **`quorum-manager`** - Manages voting and quorum-based decisions in distributed systems
- **`security-manager`** - Security-focused agent for access control, authentication, and threat detection

### ⚡ Performance & Optimization (5 agents)
- **`perf-analyzer`** - Real-time performance monitoring and bottleneck identification specialist
- **`performance-benchmarker`** - Automated performance testing and benchmarking across different scenarios
- **`task-orchestrator`** - Optimizes task distribution and execution scheduling for maximum efficiency
- **`memory-coordinator`** - Memory usage optimization and resource allocation management
- **`smart-agent`** - AI-enhanced agent with adaptive learning and intelligent decision making capabilities

### 🐙 GitHub & Repository (9 agents)
- **`github-modes`** - Multi-mode GitHub operations handler for various repository management tasks
- **`pr-manager`** - Pull request lifecycle management including reviews, merges, and conflict resolution
- **`code-review-swarm`** - Distributed code review system with multiple specialized reviewers
- **`issue-tracker`** - GitHub issue management, triage, labeling, and workflow automation
- **`release-manager`** - Release planning, versioning, changelog generation, and deployment coordination
- **`workflow-automation`** - GitHub Actions and CI/CD workflow creation and management
- **`project-board-sync`** - Project board synchronization and agile workflow management
- **`repo-architect`** - Repository structure design and multi-repository architecture planning
- **`multi-repo-swarm`** - Coordinates operations across multiple related repositories

### 📋 SPARC Methodology (6 agents)
- **`sparc-coord`** - SPARC methodology coordinator ensuring proper phase execution and transitions
- **`sparc-coder`** - SPARC-specialized coder implementing the Refinement and Completion phases
- **`specification`** - Requirements gathering and specification writing specialist
- **`pseudocode`** - Algorithm design and pseudocode creation expert
- **`architecture`** - System architecture design and technical specification creator
- **`refinement`** - TDD implementation and iterative refinement specialist

### 🏗️ Specialized Development (8 agents)
- **`backend-dev`** - Backend services, APIs, databases, and server-side logic specialist
- **`mobile-dev`** - Mobile application development for iOS, Android, and cross-platform solutions
- **`ml-developer`** - Machine learning, AI model development, and data science specialist
- **`cicd-engineer`** - CI/CD pipeline design, DevOps automation, and deployment specialist
- **`api-docs`** - API documentation, OpenAPI specs, and developer documentation creator
- **`system-architect`** - Large-scale system design and infrastructure architecture planning
- **`code-analyzer`** - Static code analysis, code quality metrics, and technical debt assessment
- **`base-template-generator`** - Project scaffolding and boilerplate code generation specialist

### 🧪 Testing & Validation (2 agents)
- **`tdd-london-swarm`** - Test-Driven Development using London School methodology with mocks and stubs
- **`production-validator`** - Production readiness validation, performance testing, and deployment verification

### 🔄 Migration & Planning (2 agents)
- **`migration-planner`** - Legacy system migration planning and execution strategy development
- **`swarm-init`** - Swarm initialization and configuration management for optimal agent deployment

## 🎯 Quick Agent Selection Guide

### For New Projects
1. **Start Here**: `planner` → `researcher` → `coder` → `tester` → `reviewer`
2. **SPARC Workflow**: `specification` → `pseudocode` → `architecture` → `refinement`
3. **Setup**: `swarm-init` → `hierarchical-coordinator`

### For Existing Projects  
- **Bug Fixes**: `code-analyzer` → `coder` → `tester`
- **New Features**: `researcher` → `coder` → `code-review-swarm`
- **Performance Issues**: `perf-analyzer` → `performance-benchmarker`
- **Refactoring**: `system-architect` → `coder` → `reviewer`

### For Specialized Tasks
- **API Development**: `backend-dev` → `api-docs` → `tester`
- **Mobile Apps**: `mobile-dev` → `code-analyzer` → `production-validator`
- **Machine Learning**: `ml-developer` → `code-analyzer` → `performance-benchmarker`
- **CI/CD Setup**: `cicd-engineer` → `workflow-automation` → `production-validator`

### For Repository Management
- **Code Reviews**: `pr-manager` → `code-review-swarm` → `reviewer`
- **Release Process**: `release-manager` → `production-validator`
- **Issue Management**: `issue-tracker` → `project-board-sync`
- **Multi-Repo**: `multi-repo-swarm` → `repo-architect`

### For Large Teams
- **Coordination**: `collective-intelligence-coordinator` → `mesh-coordinator`
- **Consensus**: `consensus-builder` → `quorum-manager`
- **Memory Management**: `swarm-memory-manager` → `memory-coordinator`

## 🎯 Claude Code vs MCP Tools

### Claude Code Handles ALL:
- File operations (Read, Write, Edit, MultiEdit, Glob, Grep)
- Code generation and programming
- Bash commands and system operations
- Implementation work
- Project navigation and analysis
- TodoWrite and task management
- Git operations
- Package management
- Testing and debugging

### MCP Tools ONLY:
- Coordination and planning
- Memory management
- Neural features
- Performance tracking
- Swarm orchestration
- GitHub integration

**KEY**: MCP coordinates, Claude Code executes.

## 🚀 Quick Setup

```bash
# Add Claude Flow MCP server
claude mcp add claude-flow npx claude-flow@alpha mcp start
```

## MCP Tool Categories

### Coordination
`swarm_init`, `agent_spawn`, `task_orchestrate`

### Monitoring
`swarm_status`, `agent_list`, `agent_metrics`, `task_status`, `task_results`

### Memory & Neural
`memory_usage`, `neural_status`, `neural_train`, `neural_patterns`

### GitHub Integration
`github_swarm`, `repo_analyze`, `pr_enhance`, `issue_triage`, `code_review`

### System
`benchmark_run`, `features_detect`, `swarm_monitor`

## 📋 Agent Coordination Protocol

### Every Agent MUST:

**1️⃣ BEFORE Work:**
```bash
npx claude-flow@alpha hooks pre-task --description "[task]"
npx claude-flow@alpha hooks session-restore --session-id "swarm-[id]"
```

**2️⃣ DURING Work:**
```bash
npx claude-flow@alpha hooks post-edit --file "[file]" --memory-key "swarm/[agent]/[step]"
npx claude-flow@alpha hooks notify --message "[what was done]"
```

**3️⃣ AFTER Work:**
```bash
npx claude-flow@alpha hooks post-task --task-id "[task]"
npx claude-flow@alpha hooks session-end --export-metrics true
```

## 🎯 Concurrent Execution Examples

### ✅ CORRECT (Single Message):
```javascript
[BatchTool]:
  // Initialize swarm
  mcp__claude-flow__swarm_init { topology: "mesh", maxAgents: 6 }
  mcp__claude-flow__agent_spawn { type: "researcher" }
  mcp__claude-flow__agent_spawn { type: "coder" }
  mcp__claude-flow__agent_spawn { type: "tester" }
  
  // Spawn agents with Task tool
  Task("Research agent: Analyze requirements...")
  Task("Coder agent: Implement features...")
  Task("Tester agent: Create test suite...")
  
  // Batch todos
  TodoWrite { todos: [
    {id: "1", content: "Research", status: "in_progress", priority: "high"},
    {id: "2", content: "Design", status: "pending", priority: "high"},
    {id: "3", content: "Implement", status: "pending", priority: "high"},
    {id: "4", content: "Test", status: "pending", priority: "medium"},
    {id: "5", content: "Document", status: "pending", priority: "low"}
  ]}
  
  // File operations
  Bash "mkdir -p app/{src,tests,docs}"
  Write "app/src/index.js"
  Write "app/tests/index.test.js"
  Write "app/docs/README.md"
```

### ❌ WRONG (Multiple Messages):
```javascript
Message 1: mcp__claude-flow__swarm_init
Message 2: Task("agent 1")
Message 3: TodoWrite { todos: [single todo] }
Message 4: Write "file.js"
// This breaks parallel coordination!
```

## Performance Benefits

- **84.8% SWE-Bench solve rate**
- **32.3% token reduction**
- **2.8-4.4x speed improvement**
- **27+ neural models**

## Hooks Integration

### Pre-Operation
- Auto-assign agents by file type
- Validate commands for safety
- Prepare resources automatically
- Optimize topology by complexity
- Cache searches

### Post-Operation
- Auto-format code
- Train neural patterns
- Update memory
- Analyze performance
- Track token usage

### Session Management
- Generate summaries
- Persist state
- Track metrics
- Restore context
- Export workflows

## Advanced Features (v2.0.0)

- 🚀 Automatic Topology Selection
- ⚡ Parallel Execution (2.8-4.4x speed)
- 🧠 Neural Training
- 📊 Bottleneck Analysis
- 🤖 Smart Auto-Spawning
- 🛡️ Self-Healing Workflows
- 💾 Cross-Session Memory
- 🔗 GitHub Integration

## Integration Tips

1. Start with basic swarm init
2. Scale agents gradually
3. Use memory for context
4. Monitor progress regularly
5. Train patterns from success
6. Enable hooks automation
7. Use GitHub tools first

## Support

- Documentation: https://github.com/ruvnet/claude-flow
- Issues: https://github.com/ruvnet/claude-flow/issues

---

Remember: **Claude Flow coordinates, Claude Code creates!**

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
Never save working files, text/mds and tests to the root folder.
