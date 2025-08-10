# Advanced Command Patterns

## Chaining Operations

### Sequential Execution
```bash
# Basic chaining with &&
npx claude-flow@alpha sparc run spec "user auth" && \
npx claude-flow@alpha sparc run architect "auth design" && \
npx claude-flow@alpha sparc tdd "auth implementation"

# With error handling
npx claude-flow@alpha sparc run spec "payment system" && \
  echo "✅ Specification complete" || \
  (echo "❌ Specification failed" && exit 1)

# Multi-step pipeline with validation
npx claude-flow@alpha sparc run spec "e-commerce cart" && \
npx claude-flow@alpha sparc run architect "cart system" && \
npx claude-flow@alpha hooks pre-task --validate && \
npx claude-flow@alpha sparc tdd "cart implementation" && \
npx claude-flow@alpha hooks post-task --analyze
```

### Conditional Execution
```bash
# Execute only if swarm is not running
npx claude-flow@alpha swarm status || npx claude-flow@alpha swarm init mesh 5

# Environment-based execution
if [[ "$NODE_ENV" == "production" ]]; then
  npx claude-flow@alpha sparc run deploy --env=prod --validate
else
  npx claude-flow@alpha sparc tdd --fast-mode "development feature"
fi

# Success-based continuation
npx claude-flow@alpha sparc run test "unit tests" && \
  npx claude-flow@alpha sparc run test "integration tests" && \
  npx claude-flow@alpha sparc run deploy "staging"
```

### Error Recovery Patterns
```bash
# Retry with backoff
for i in {1..3}; do
  npx claude-flow@alpha sparc tdd "flaky feature" && break
  echo "Attempt $i failed, retrying in $((i*5)) seconds..."
  sleep $((i*5))
done

# Fallback strategies
npx claude-flow@alpha sparc batch "spec,architect,tdd" "complex feature" || {
  echo "Batch failed, trying sequential approach..."
  npx claude-flow@alpha sparc run spec "complex feature" && \
  npx claude-flow@alpha sparc run architect "complex feature" && \
  npx claude-flow@alpha sparc tdd "complex feature"
}
```

## Parallel Processing

### Background Execution
```bash
# Run multiple tasks in parallel
npx claude-flow@alpha sparc tdd "backend API" &
PID1=$!
npx claude-flow@alpha sparc tdd "frontend components" &
PID2=$!
npx claude-flow@alpha sparc tdd "database schema" &
PID3=$!

# Wait for all to complete
wait $PID1 $PID2 $PID3
echo "All parallel tasks completed"

# Selective waiting
wait $PID1  # Wait only for backend API
if [ $? -eq 0 ]; then
  echo "Backend ready, starting integration tests"
  npx claude-flow@alpha sparc run test "integration"
fi
```

### Parallel with Resource Management
```bash
# Limit concurrent processes
MAX_PARALLEL=3
active_jobs=0

for task in "auth" "payments" "inventory" "notifications" "analytics"; do
  while [ $active_jobs -ge $MAX_PARALLEL ]; do
    wait -n  # Wait for any job to complete
    ((active_jobs--))
  done
  
  npx claude-flow@alpha sparc tdd "implement $task system" &
  ((active_jobs++))
done

wait  # Wait for all remaining jobs
```

### Parallel Pipeline Construction
```bash
# Create named pipes for inter-process communication
mkfifo /tmp/cf_pipe_spec
mkfifo /tmp/cf_pipe_arch

# Producer processes
npx claude-flow@alpha sparc run spec "microservice architecture" > /tmp/cf_pipe_spec &
npx claude-flow@alpha sparc run architect "system design" > /tmp/cf_pipe_arch &

# Consumer process
{
  spec_result=$(cat /tmp/cf_pipe_spec)
  arch_result=$(cat /tmp/cf_pipe_arch)
  
  echo "Combining results..."
  npx claude-flow@alpha sparc tdd --input-spec="$spec_result" --input-arch="$arch_result" "final implementation"
} &

wait
rm /tmp/cf_pipe_*
```

## Advanced Pipeline Construction

### Multi-Stage Pipelines
```bash
#!/bin/bash
# advanced_pipeline.sh

set -euo pipefail

FEATURE="$1"
ENVIRONMENT="${2:-dev}"

# Stage 1: Analysis
echo "🔍 Stage 1: Analysis"
npx claude-flow@alpha sparc run spec "$FEATURE" | tee spec_output.txt
npx claude-flow@alpha sparc run architect "$FEATURE" | tee arch_output.txt

# Stage 2: Implementation
echo "🔧 Stage 2: Implementation"
npx claude-flow@alpha sparc tdd "$FEATURE" \
  --input-spec="$(cat spec_output.txt)" \
  --input-arch="$(cat arch_output.txt)" | tee impl_output.txt

# Stage 3: Validation
echo "✅ Stage 3: Validation"
npx claude-flow@alpha sparc run test "$FEATURE" --coverage --report=junit
npx claude-flow@alpha neural analyze --component="$FEATURE" --export-metrics

# Stage 4: Deployment (if tests pass)
if [ $? -eq 0 ]; then
  echo "🚀 Stage 4: Deployment to $ENVIRONMENT"
  npx claude-flow@alpha sparc run deploy --env="$ENVIRONMENT" --feature="$FEATURE"
else
  echo "❌ Tests failed, skipping deployment"
  exit 1
fi

# Cleanup
rm -f spec_output.txt arch_output.txt impl_output.txt
```

### Dynamic Pipeline Generation
```bash
# Generate pipeline based on project structure
generate_pipeline() {
  local project_type="$1"
  local features=("$@:2")
  
  case "$project_type" in
    "microservice")
      for feature in "${features[@]}"; do
        echo "npx claude-flow@alpha sparc run spec '$feature service'"
        echo "npx claude-flow@alpha sparc run architect '$feature API design'"
        echo "npx claude-flow@alpha sparc tdd '$feature implementation'"
        echo "npx claude-flow@alpha sparc run test '$feature service tests'"
      done
      ;;
    "frontend")
      for feature in "${features[@]}"; do
        echo "npx claude-flow@alpha sparc run spec '$feature component'"
        echo "npx claude-flow@alpha sparc tdd '$feature UI implementation'"
        echo "npx claude-flow@alpha sparc run test '$feature component tests'"
      done
      ;;
    "fullstack")
      for feature in "${features[@]}"; do
        echo "npx claude-flow@alpha sparc batch 'spec,architect' '$feature system'"
        echo "npx claude-flow@alpha sparc tdd '$feature backend' &"
        echo "npx claude-flow@alpha sparc tdd '$feature frontend' &"
        echo "wait"
        echo "npx claude-flow@alpha sparc run test '$feature integration'"
      done
      ;;
  esac
}

# Usage
generate_pipeline "microservice" "auth" "payments" "inventory" | bash
```

### State-Dependent Pipelines
```bash
# Pipeline that adapts based on current state
adaptive_pipeline() {
  local task="$1"
  
  # Check current state
  swarm_status=$(npx claude-flow@alpha swarm status --json 2>/dev/null || echo '{"active": false}')
  
  if echo "$swarm_status" | jq -r '.active' | grep -q true; then
    echo "🔄 Swarm active, using existing agents"
    npx claude-flow@alpha task orchestrate "$task" --reuse-agents
  else
    echo "🆕 No active swarm, initializing"
    topology=$(determine_topology "$task")
    npx claude-flow@alpha swarm init "$topology" 5
    npx claude-flow@alpha sparc tdd "$task"
  fi
  
  # Adapt based on performance metrics
  performance=$(npx claude-flow@alpha neural analyze --quick --json)
  if echo "$performance" | jq -r '.efficiency' | awk '$1 < 0.7 {exit 1}'; then
    echo "⚡ Performance good, continuing with current setup"
  else
    echo "🔧 Performance suboptimal, optimizing"
    npx claude-flow@alpha swarm scale --auto-optimize
    npx claude-flow@alpha neural train --quick-boost
  fi
}

determine_topology() {
  local task="$1"
  local complexity=$(echo "$task" | wc -w)
  
  if [ $complexity -gt 10 ]; then
    echo "hierarchical"
  elif [ $complexity -gt 5 ]; then
    echo "mesh"
  else
    echo "star"
  fi
}
```

## Complex Conditional Logic

### Multi-Condition Execution
```bash
# Complex decision tree
execute_based_on_context() {
  local task="$1"
  local priority="$2"
  local deadline="$3"
  
  # Determine execution strategy
  if [[ "$priority" == "high" && "$deadline" -lt 24 ]]; then
    strategy="emergency"
    agents=8
    parallel=true
  elif [[ "$priority" == "high" ]]; then
    strategy="fast"
    agents=5
    parallel=true
  elif [[ "$deadline" -gt 168 ]]; then  # More than a week
    strategy="thorough"
    agents=3
    parallel=false
  else
    strategy="balanced"
    agents=4
    parallel=true
  fi
  
  echo "📋 Executing with $strategy strategy"
  echo "👥 Using $agents agents"
  echo "⚡ Parallel: $parallel"
  
  # Execute based on strategy
  case "$strategy" in
    "emergency")
      npx claude-flow@alpha swarm init mesh $agents
      npx claude-flow@alpha sparc batch "spec,tdd" "$task" --fast-mode --skip-docs
      ;;
    "fast")
      npx claude-flow@alpha swarm init mesh $agents
      npx claude-flow@alpha sparc tdd "$task" --parallel
      ;;
    "thorough")
      npx claude-flow@alpha swarm init hierarchical $agents
      npx claude-flow@alpha sparc pipeline "$task" --full-analysis --documentation
      ;;
    "balanced")
      npx claude-flow@alpha swarm init mesh $agents
      npx claude-flow@alpha sparc tdd "$task" --parallel --docs
      ;;
  esac
}

# Usage
execute_based_on_context "implement payment gateway" "high" 12  # 12 hours deadline
```

### Environment-Aware Execution
```bash
# Detect environment and adapt
smart_execute() {
  local task="$1"
  
  # Detect environment
  if [[ -n "$CI" ]]; then
    env_type="ci"
    timeout="30m"
    agents=2
  elif [[ "$NODE_ENV" == "production" ]]; then
    env_type="production"
    timeout="60m"
    agents=1  # Conservative in prod
  elif [[ -n "$DOCKER_CONTAINER" ]]; then
    env_type="container"
    timeout="45m"
    agents=3
  else
    env_type="local"
    timeout="120m"
    agents=5
  fi
  
  echo "🔍 Detected environment: $env_type"
  echo "⏰ Timeout: $timeout"
  echo "👥 Agents: $agents"
  
  # Environment-specific execution
  case "$env_type" in
    "ci")
      npx claude-flow@alpha sparc run test "$task" \
        --headless --timeout="$timeout" --agents="$agents" \
        --output-format=junit --no-interactive
      ;;
    "production")
      npx claude-flow@alpha sparc run deploy "$task" \
        --validate --rollback-ready --timeout="$timeout" \
        --agents="$agents" --confirm-destructive
      ;;
    "container")
      npx claude-flow@alpha sparc tdd "$task" \
        --container-optimized --timeout="$timeout" \
        --agents="$agents" --limited-resources
      ;;
    "local")
      npx claude-flow@alpha sparc tdd "$task" \
        --interactive --timeout="$timeout" --agents="$agents" \
        --full-features --debug-mode
      ;;
  esac
}
```

## Resource Management Patterns

### Memory and CPU Awareness
```bash
# Adaptive resource allocation
allocate_resources() {
  local task="$1"
  
  # Check available resources
  available_memory=$(free -m | awk 'NR==2{printf "%.0f", $7/1024}')  # GB
  cpu_cores=$(nproc)
  load_average=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | tr -d ',')
  
  echo "💾 Available Memory: ${available_memory}GB"
  echo "⚙️  CPU Cores: $cpu_cores"
  echo "📊 Load Average: $load_average"
  
  # Calculate optimal settings
  if (( $(echo "$available_memory < 4" | bc -l) )); then
    agents=2
    parallel_tasks=1
  elif (( $(echo "$available_memory < 8" | bc -l) )); then
    agents=3
    parallel_tasks=2
  else
    agents=5
    parallel_tasks=3
  fi
  
  # Adjust for CPU load
  if (( $(echo "$load_average > $cpu_cores" | bc -l) )); then
    echo "⚠️  High CPU load detected, reducing parallelism"
    agents=$((agents - 1))
    parallel_tasks=$((parallel_tasks - 1))
  fi
  
  echo "🎯 Optimal settings: $agents agents, $parallel_tasks parallel tasks"
  
  # Execute with optimal settings
  export CF_AGENTS_MAX=$agents
  export CF_PARALLEL_MAX=$parallel_tasks
  
  npx claude-flow@alpha sparc tdd "$task" --adaptive-resources
}
```

### Cleanup and Resource Recovery
```bash
# Comprehensive cleanup function
cleanup_resources() {
  echo "🧹 Starting resource cleanup..."
  
  # Stop all background processes
  jobs -p | xargs -r kill 2>/dev/null
  
  # Clean up named pipes
  find /tmp -name "cf_pipe_*" -type p -delete 2>/dev/null
  
  # Clear memory caches
  npx claude-flow@alpha memory clear --namespace=temp --confirm
  
  # Reset neural networks if they're consuming too much memory
  memory_usage=$(npx claude-flow@alpha memory usage --json | jq -r '.neural_memory_mb')
  if [[ $memory_usage -gt 1000 ]]; then
    echo "🧠 Resetting neural networks (high memory usage: ${memory_usage}MB)"
    npx claude-flow@alpha neural reset --preserve-trained-patterns
  fi
  
  # Gracefully shutdown swarm
  npx claude-flow@alpha swarm destroy --graceful --export-metrics
  
  echo "✅ Cleanup completed"
}

# Register cleanup on script exit
trap cleanup_resources EXIT
```

## Integration Patterns

### Git Integration Pipeline
```bash
# Git-aware pipeline
git_integrated_pipeline() {
  local feature_branch="$1"
  local task="$2"
  
  # Create feature branch
  git checkout -b "$feature_branch"
  
  # Pre-development analysis
  npx claude-flow@alpha github repo analyze --branch="$feature_branch"
  
  # Development with git integration
  npx claude-flow@alpha sparc tdd "$task" --git-integration \
    --commit-progress --branch="$feature_branch"
  
  # Post-development validation
  git add .
  git commit -m "feat: $task

  🤖 Generated with Claude-Flow
  
  Co-Authored-By: Claude <noreply@anthropic.com>"
  
  # Create PR with enhanced description
  npx claude-flow@alpha github pr create \
    --title "feat: $task" \
    --body="$(npx claude-flow@alpha github pr enhance --task='$task')" \
    --base=main --head="$feature_branch"
  
  echo "🚀 Feature branch $feature_branch created and PR submitted"
}
```

### CI/CD Integration
```bash
# CI/CD-aware execution
cicd_pipeline() {
  local stage="$1"
  local task="$2"
  
  case "$stage" in
    "build")
      npx claude-flow@alpha sparc run build "$task" \
        --ci-mode --output-artifacts --test-coverage
      ;;
    "test")
      npx claude-flow@alpha sparc run test "$task" \
        --parallel --coverage-threshold=80 --fail-fast
      ;;
    "deploy-staging")
      npx claude-flow@alpha sparc run deploy "$task" \
        --env=staging --health-check --rollback-ready
      ;;
    "deploy-production")
      npx claude-flow@alpha sparc run deploy "$task" \
        --env=production --blue-green --confirm-destructive \
        --backup-before-deploy
      ;;
  esac
  
  # Export metrics for CI/CD dashboard
  npx claude-flow@alpha hooks export-metrics \
    --format=prometheus --stage="$stage"
}
```