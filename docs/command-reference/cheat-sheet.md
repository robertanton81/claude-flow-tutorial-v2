# Command Cheat Sheet

## Quick Reference Cards

### SPARC Commands (One-Liners)
```bash
# Complete TDD workflow
npx claude-flow@alpha sparc tdd "feature description"

# Architecture analysis
npx claude-flow@alpha sparc run architect "system design"

# Specification generation
npx claude-flow@alpha sparc run spec "requirements analysis"

# Full pipeline
npx claude-flow@alpha sparc pipeline "end-to-end feature"

# Parallel batch processing
npx claude-flow@alpha sparc batch "spec,architect,tdd" "complex feature"
```

### Swarm Management (Essential)
```bash
# Quick swarm setup
npx claude-flow@alpha swarm init mesh 5

# Auto-spawn agents
npx claude-flow@alpha agent spawn-auto "task description"

# Status check
npx claude-flow@alpha swarm status --verbose

# Scale swarm
npx claude-flow@alpha swarm scale 8

# Emergency stop
npx claude-flow@alpha swarm destroy --force
```

### Memory & Neural (Power User)
```bash
# Store context
npx claude-flow@alpha memory store "key" "value" --ttl=3600

# Search patterns
npx claude-flow@alpha memory search "pattern*" --namespace=project

# Train on success
npx claude-flow@alpha neural train --pattern=success --data=recent

# Performance analysis
npx claude-flow@alpha neural analyze --metrics=all
```

## Alias Recommendations

### Create Aliases
```bash
# Add to ~/.bashrc or ~/.zshrc
alias cf='npx claude-flow@alpha'
alias cfs='npx claude-flow@alpha sparc'
alias cfsr='npx claude-flow@alpha sparc run'
alias cfst='npx claude-flow@alpha sparc tdd'
alias cfsw='npx claude-flow@alpha swarm'
alias cfm='npx claude-flow@alpha memory'
alias cfn='npx claude-flow@alpha neural'
alias cfg='npx claude-flow@alpha github'

# Power user shortcuts
alias cftdd='cf sparc tdd --parallel --docs'
alias cfarch='cf sparc run architect --agents=3'
alias cftest='cf sparc run test --coverage'
alias cfopt='cf sparc run optimize --benchmark'
```

### Using Aliases
```bash
# Instead of: npx claude-flow@alpha sparc tdd "user authentication"
cftdd "user authentication"

# Instead of: npx claude-flow@alpha swarm init mesh 5
cfsw init mesh 5

# Instead of: npx claude-flow@alpha memory search "auth*"
cfm search "auth*"
```

## Keyboard Shortcuts

### Terminal Shortcuts
```bash
# Command history search
Ctrl+R  # Search command history
!!      # Repeat last command
!cf     # Repeat last command starting with 'cf'

# Quick editing
Ctrl+A  # Move to beginning of line
Ctrl+E  # Move to end of line
Ctrl+W  # Delete word backward
Ctrl+U  # Clear entire line

# Background/foreground
Ctrl+Z  # Suspend current process
bg      # Resume in background
fg      # Bring to foreground
jobs    # List background jobs
```

### Custom Key Bindings
```bash
# Add to ~/.inputrc
# Quick claude-flow completion
"\C-xc": "npx claude-flow@alpha "
"\C-xs": "npx claude-flow@alpha sparc "
"\C-xt": "npx claude-flow@alpha sparc tdd \""
"\C-xa": "npx claude-flow@alpha sparc run architect \""
```

## Common Task Patterns

### Development Workflow
```bash
# 1. Start new feature
cftdd "implement user profile management"

# 2. Check progress
cf task status --detailed

# 3. Review and refine
cf sparc run refactor --target=profile

# 4. Deploy
cf sparc run deploy --env=staging
```

### Debugging Workflow
```bash
# 1. Analyze issue
cf sparc run analyze "bug in payment processing"

# 2. Create fix
cf sparc tdd "fix payment validation bug"

# 3. Verify solution
cf sparc run test --focus=payment

# 4. Performance check
cf neural analyze --component=payment
```

### Team Collaboration
```bash
# 1. Sync with team
cfg sync --branch=main

# 2. Review PRs
cfg pr review --auto-assign

# 3. Coordinate release
cfg release plan --version=1.2.0

# 4. Update documentation
cf sparc run docs --sync-readme
```

## Environment-Specific Commands

### Development Environment
```bash
# Local development
export CF_ENV=dev
export CF_DEBUG=true
export CF_AGENTS_MAX=3

cf sparc tdd "local feature test"
```

### Production Environment
```bash
# Production deployment
export CF_ENV=prod
export CF_PARALLEL=false
export CF_BACKUP=true

cf sparc run deploy --validate --rollback-ready
```

### CI/CD Environment
```bash
# Continuous integration
export CF_CI=true
export CF_HEADLESS=true
export CF_TIMEOUT=1800

cf sparc pipeline --no-interactive --report=junit
```

## Power User Combinations

### Chained Operations
```bash
# Sequential execution
cf sparc run spec "auth system" && \
cf sparc run architect "auth design" && \
cf sparc tdd "auth implementation"

# Conditional execution
cf swarm status || cf swarm init mesh 5

# Parallel with fallback
cf sparc batch "spec,architect" "feature" || \
cf sparc run spec "feature" && cf sparc run architect "feature"
```

### Complex Workflows
```bash
# Full-stack development
cf sparc tdd "backend API" &
cf sparc tdd "frontend components" &
cf sparc tdd "database schema" &
wait  # Wait for all background jobs

# Multi-environment deployment
for env in dev staging prod; do
  cf sparc run deploy --env=$env --validate
done
```

### Monitoring and Analytics
```bash
# Performance monitoring
watch -n 5 'cf swarm status --metrics'

# Log analysis
cf hooks post-task --analyze-logs --export-metrics

# Resource usage tracking
cf memory analytics --timeframe=24h --export=csv
```

## Quick Lookup Tables

### Mode Quick Reference
| Mode | Purpose | Usage |
|------|---------|-------|
| `spec` | Requirements analysis | `cf sparc run spec "feature"` |
| `architect` | System design | `cf sparc run architect "system"` |
| `tdd` | Test-driven development | `cf sparc tdd "implementation"` |
| `refactor` | Code improvement | `cf sparc run refactor "target"` |
| `optimize` | Performance tuning | `cf sparc run optimize "component"` |
| `test` | Testing execution | `cf sparc run test "suite"` |
| `deploy` | Deployment process | `cf sparc run deploy "environment"` |

### Agent Types Quick Reference
| Agent | Purpose | Best For |
|-------|---------|----------|
| `coder` | Implementation | Features, bugs, refactoring |
| `tester` | Quality assurance | Test creation, validation |
| `researcher` | Analysis | Requirements, research |
| `reviewer` | Code review | Quality checks, standards |
| `architect` | System design | Architecture, planning |
| `optimizer` | Performance | Speed, efficiency |
| `documenter` | Documentation | README, API docs |

### Topology Quick Reference
| Topology | Best For | Agents | Use Case |
|----------|----------|---------|----------|
| `mesh` | Collaboration | 3-8 | General development |
| `hierarchical` | Complex projects | 5-15 | Large features |
| `ring` | Sequential tasks | 3-6 | Pipeline processing |
| `star` | Coordination | 4-10 | Centralized control |

## Emergency Commands

### Quick Recovery
```bash
# Reset everything
cf swarm destroy --force && cf swarm init mesh 3

# Clear memory
cf memory clear --namespace=all --confirm

# Restart neural networks
cf neural reset --retrain

# Force sync
cf hooks session-end --force --export-all
```

### Debug Mode
```bash
# Enable verbose logging
export CF_DEBUG=true CF_VERBOSE=true

# Run with maximum logging
cf --debug --verbose sparc tdd "debug feature"

# Check system health
cf system health-check --full-report
```