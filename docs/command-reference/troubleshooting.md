# Troubleshooting Guide

## Common Error Messages

### Swarm Initialization Errors

#### Error: "Failed to initialize swarm: topology not recognized"
```bash
# ❌ Problem
npx claude-flow@alpha swarm init invalid-topology

# ✅ Solution
npx claude-flow@alpha swarm init mesh
# Valid topologies: mesh, hierarchical, ring, star

# 🔧 Debug
npx claude-flow@alpha features detect --component=swarm
```

#### Error: "Maximum agents exceeded"
```bash
# ❌ Problem
npx claude-flow@alpha swarm init mesh 100

# ✅ Solution
npx claude-flow@alpha swarm init mesh 8  # Max recommended: 50

# 🔧 Check current limits
npx claude-flow@alpha swarm status --limits
```

### Agent Spawning Issues

#### Error: "Agent spawn failed: insufficient resources"
```bash
# 🔍 Diagnose
npx claude-flow@alpha memory usage --detailed
npx claude-flow@alpha agent metrics --resource-check

# ✅ Solutions
# Option 1: Free up resources
npx claude-flow@alpha memory clear --namespace=temp
npx claude-flow@alpha swarm destroy --inactive-agents

# Option 2: Reduce agent count
npx claude-flow@alpha swarm scale 3

# Option 3: Use lightweight agents
npx claude-flow@alpha agent spawn coordinator --lightweight
```

#### Error: "Agent type not recognized"
```bash
# ❌ Problem
npx claude-flow@alpha agent spawn invalid-type

# ✅ View available types
npx claude-flow@alpha agent list --types-only

# Valid types: coder, tester, researcher, reviewer, architect, optimizer, etc.
```

### Task Orchestration Problems

#### Error: "Task orchestration timeout"
```bash
# 🔍 Diagnose
npx claude-flow@alpha task status --verbose
npx claude-flow@alpha swarm status --performance

# ✅ Solutions
# Increase timeout
export CF_TIMEOUT=3600  # 1 hour
npx claude-flow@alpha task orchestrate "complex task" --timeout=3600

# Check for stuck agents
npx claude-flow@alpha agent metrics --stuck-check
npx claude-flow@alpha agent restart --stuck-only

# Simplify task
npx claude-flow@alpha task orchestrate "simplified version" --max-agents=3
```

### Memory and Neural Issues

#### Error: "Neural network initialization failed"
```bash
# 🔍 Check neural status
npx claude-flow@alpha neural status --detailed

# ✅ Solutions
# Reset neural networks
npx claude-flow@alpha neural reset --full

# Check WASM support
npx claude-flow@alpha features detect --category=wasm

# Reduce neural complexity
npx claude-flow@alpha neural train --simple-patterns --epochs=10
```

#### Error: "Memory store exhausted"
```bash
# 🔍 Check memory usage
npx claude-flow@alpha memory usage --by-namespace
npx claude-flow@alpha memory analytics --timeframe=24h

# ✅ Cleanup solutions
# Clear expired entries
npx claude-flow@alpha memory clear --expired-only

# Compress old data
npx claude-flow@alpha memory compress --namespace=all

# Backup and reset
npx claude-flow@alpha memory backup --path=/tmp/cf_backup.json
npx claude-flow@alpha memory clear --confirm
```

## Debug Flags and Verbose Modes

### Enable Debug Output
```bash
# Environment variables
export CF_DEBUG=true
export CF_VERBOSE=true
export CF_LOG_LEVEL=debug
export CF_TRACE=true

# Command-line flags
npx claude-flow@alpha --debug --verbose sparc tdd "feature with debug"

# Component-specific debugging
export CF_DEBUG_SWARM=true
export CF_DEBUG_NEURAL=true
export CF_DEBUG_MEMORY=true
```

### Verbose Mode Options
```bash
# Level 1: Basic verbose
npx claude-flow@alpha --verbose sparc run spec "analysis task"

# Level 2: Detailed verbose
npx claude-flow@alpha --verbose=2 swarm status

# Level 3: Maximum verbosity
npx claude-flow@alpha --verbose=3 --debug task orchestrate "complex task"

# Component-specific verbose
npx claude-flow@alpha swarm status --verbose-agents
npx claude-flow@alpha memory usage --verbose-breakdown
npx claude-flow@alpha neural status --verbose-layers
```

### Debug Output Interpretation
```bash
# Swarm debug output
[DEBUG:SWARM] Topology: mesh, Active agents: 5/8
[DEBUG:SWARM] Coordination latency: 45ms
[DEBUG:SWARM] Load balance: 0.73 (good)
[TRACE:AGENT:coder-001] Processing task chunk 3/7
[TRACE:AGENT:coder-001] Memory allocation: 234MB
[WARN:SWARM] Agent coder-002 response time elevated: 1.2s

# Neural debug output
[DEBUG:NEURAL] Model loaded: coordination_v2.3
[DEBUG:NEURAL] WASM SIMD: enabled
[DEBUG:NEURAL] Training batch: 15/100
[TRACE:NEURAL] Forward pass: 23ms
[TRACE:NEURAL] Backward pass: 31ms
[ERROR:NEURAL] Gradient explosion detected, reducing learning rate
```

## Log Analysis Techniques

### Log Collection
```bash
# Enable comprehensive logging
export CF_LOG_FILE="/tmp/claude-flow-$(date +%Y%m%d-%H%M%S).log"
export CF_LOG_ROTATE=true
export CF_LOG_MAX_SIZE=100MB

# Run with logging
npx claude-flow@alpha sparc tdd "logged task" 2>&1 | tee "$CF_LOG_FILE"
```

### Log Analysis Commands
```bash
# Search for errors
grep -i "error\|failed\|exception" "$CF_LOG_FILE"

# Performance analysis
grep "latency\|response time\|duration" "$CF_LOG_FILE" | \
  awk '{print $NF}' | sort -n

# Agent activity summary
grep "AGENT:" "$CF_LOG_FILE" | \
  awk '{print $2}' | sort | uniq -c | sort -nr

# Memory usage trends
grep "Memory:" "$CF_LOG_FILE" | \
  awk '{print $2, $4}' | \
  gnuplot -e "plot '-' with lines"
```

### Automated Log Analysis
```bash
# Log analysis script
analyze_logs() {
  local logfile="$1"
  
  echo "📊 Claude-Flow Log Analysis Report"
  echo "================================="
  echo "📁 Log file: $logfile"
  echo "📅 Analysis time: $(date)"
  echo
  
  # Error summary
  echo "🚨 Error Summary:"
  grep -c "ERROR" "$logfile" && grep "ERROR" "$logfile" | tail -5
  echo
  
  # Performance metrics
  echo "⚡ Performance Metrics:"
  echo "Average task duration: $(grep "Task completed" "$logfile" | \
    awk '{sum+=$6; count++} END {print sum/count "ms"}')"
  echo "Agent response times: $(grep "response time" "$logfile" | \
    awk '{sum+=$5; count++} END {print sum/count "ms"}')"
  echo
  
  # Resource usage
  echo "💾 Resource Usage:"
  echo "Peak memory: $(grep "Memory:" "$logfile" | \
    awk '{print $4}' | sort -n | tail -1)MB"
  echo "Active agents peak: $(grep "Active agents:" "$logfile" | \
    awk '{print $3}' | sort -n | tail -1)"
  echo
  
  # Recommendations
  echo "💡 Recommendations:"
  if grep -q "timeout" "$logfile"; then
    echo "- Consider increasing timeouts for complex tasks"
  fi
  if grep -q "Memory exhausted" "$logfile"; then
    echo "- Implement memory cleanup strategies"
  fi
  if grep -q "Agent spawn failed" "$logfile"; then
    echo "- Reduce concurrent agent count or increase resources"
  fi
}

# Usage
analyze_logs "/tmp/claude-flow-20240810-143022.log"
```

## Recovery Procedures

### Emergency Recovery
```bash
# Complete system reset
emergency_reset() {
  echo "🚨 Emergency Reset Initiated"
  
  # 1. Stop all processes
  pkill -f claude-flow 2>/dev/null || true
  
  # 2. Clear all caches and memory
  npx claude-flow@alpha memory clear --force --confirm
  
  # 3. Reset neural networks
  npx claude-flow@alpha neural reset --emergency
  
  # 4. Destroy swarm
  npx claude-flow@alpha swarm destroy --force --immediate
  
  # 5. Clean temporary files
  rm -rf /tmp/cf_* 2>/dev/null || true
  
  # 6. Reset configuration
  npx claude-flow@alpha config reset --defaults
  
  echo "✅ Emergency reset completed"
  echo "🔄 Reinitializing with safe defaults..."
  
  # 7. Reinitialize with minimal setup
  npx claude-flow@alpha swarm init star 3
  
  echo "🎯 System ready for basic operations"
}
```

### Graceful Recovery
```bash
# Gradual recovery process
graceful_recovery() {
  local issue_type="$1"
  
  echo "🔧 Starting graceful recovery for: $issue_type"
  
  case "$issue_type" in
    "memory")
      # Memory-related recovery
      echo "💾 Memory recovery..."
      npx claude-flow@alpha memory compress --all-namespaces
      npx claude-flow@alpha memory clear --expired-only
      npx claude-flow@alpha memory usage --report
      ;;
      
    "agents")
      # Agent-related recovery
      echo "👥 Agent recovery..."
      npx claude-flow@alpha agent metrics --health-check
      npx claude-flow@alpha agent restart --unhealthy-only
      npx claude-flow@alpha swarm optimize --rebalance
      ;;
      
    "neural")
      # Neural network recovery
      echo "🧠 Neural recovery..."
      npx claude-flow@alpha neural status --validate
      npx claude-flow@alpha neural train --recovery-mode --epochs=5
      npx claude-flow@alpha neural patterns --rebuild-cache
      ;;
      
    "performance")
      # Performance recovery
      echo "⚡ Performance recovery..."
      npx claude-flow@alpha benchmark run --quick
      npx claude-flow@alpha swarm scale --auto-optimize
      npx claude-flow@alpha memory compress --performance-mode
      ;;
  esac
  
  # Validate recovery
  echo "✅ Validating recovery..."
  npx claude-flow@alpha system health-check --full
}

# Usage examples
graceful_recovery "memory"
graceful_recovery "agents"
```

### State Recovery
```bash
# Save and restore system state
save_state() {
  local backup_name="backup-$(date +%Y%m%d-%H%M%S)"
  
  echo "💾 Saving system state: $backup_name"
  
  # Save swarm configuration
  npx claude-flow@alpha swarm status --export="/tmp/${backup_name}-swarm.json"
  
  # Save memory state
  npx claude-flow@alpha memory backup --path="/tmp/${backup_name}-memory.json"
  
  # Save neural models
  npx claude-flow@alpha neural export --path="/tmp/${backup_name}-neural.tar.gz"
  
  # Save configuration
  npx claude-flow@alpha config export --path="/tmp/${backup_name}-config.yaml"
  
  echo "✅ State saved to /tmp/${backup_name}-*"
  echo "$backup_name" > /tmp/latest-backup.txt
}

restore_state() {
  local backup_name="${1:-$(cat /tmp/latest-backup.txt 2>/dev/null)}"
  
  if [[ -z "$backup_name" ]]; then
    echo "❌ No backup specified and no latest backup found"
    return 1
  fi
  
  echo "🔄 Restoring system state: $backup_name"
  
  # Stop current system
  npx claude-flow@alpha swarm destroy --graceful
  
  # Restore configuration
  npx claude-flow@alpha config import --path="/tmp/${backup_name}-config.yaml"
  
  # Restore swarm
  npx claude-flow@alpha swarm restore --path="/tmp/${backup_name}-swarm.json"
  
  # Restore memory
  npx claude-flow@alpha memory restore --path="/tmp/${backup_name}-memory.json"
  
  # Restore neural models
  npx claude-flow@alpha neural import --path="/tmp/${backup_name}-neural.tar.gz"
  
  echo "✅ State restored successfully"
}
```

## Health Monitoring

### Continuous Health Checks
```bash
# Health monitoring script
monitor_health() {
  local interval="${1:-60}"  # Check every 60 seconds
  local alert_threshold="${2:-80}"  # Alert at 80% resource usage
  
  echo "🩺 Starting health monitoring (interval: ${interval}s)"
  
  while true; do
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Check swarm health
    swarm_health=$(npx claude-flow@alpha swarm status --health-score 2>/dev/null || echo "0")
    
    # Check memory usage
    memory_usage=$(npx claude-flow@alpha memory usage --percentage 2>/dev/null || echo "0")
    
    # Check neural performance
    neural_performance=$(npx claude-flow@alpha neural status --performance-score 2>/dev/null || echo "100")
    
    # Check system load
    system_load=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | tr -d ',' || echo "0")
    
    echo "[$timestamp] Health: Swarm=$swarm_health%, Memory=$memory_usage%, Neural=$neural_performance%, Load=$system_load"
    
    # Alert conditions
    if (( $(echo "$memory_usage > $alert_threshold" | bc -l 2>/dev/null || echo 0) )); then
      echo "🚨 ALERT: High memory usage ($memory_usage%)"
      graceful_recovery "memory"
    fi
    
    if (( $(echo "$swarm_health < 50" | bc -l 2>/dev/null || echo 0) )); then
      echo "🚨 ALERT: Poor swarm health ($swarm_health%)"
      graceful_recovery "agents"
    fi
    
    sleep "$interval"
  done
}

# Run in background
monitor_health 30 75 &  # Check every 30s, alert at 75%
echo $! > /tmp/health_monitor.pid
```

### System Diagnostics
```bash
# Comprehensive diagnostics
run_diagnostics() {
  local output_file="/tmp/diagnostics-$(date +%Y%m%d-%H%M%S).txt"
  
  echo "🔍 Running comprehensive diagnostics..."
  
  {
    echo "Claude-Flow System Diagnostics Report"
    echo "====================================="
    echo "Generated: $(date)"
    echo
    
    # System information
    echo "🖥️  System Information:"
    echo "OS: $(uname -s -r)"
    echo "Architecture: $(uname -m)"
    echo "CPU cores: $(nproc)"
    echo "Memory: $(free -h | awk 'NR==2{print $2}')"
    echo "Disk space: $(df -h / | awk 'NR==2{print $4}')"
    echo
    
    # Claude-Flow status
    echo "🤖 Claude-Flow Status:"
    npx claude-flow@alpha swarm status --detailed 2>&1
    echo
    
    # Agent status
    echo "👥 Agent Status:"
    npx claude-flow@alpha agent list --detailed 2>&1
    echo
    
    # Memory analysis
    echo "💾 Memory Analysis:"
    npx claude-flow@alpha memory usage --detailed 2>&1
    echo
    
    # Neural network status
    echo "🧠 Neural Network Status:"
    npx claude-flow@alpha neural status --detailed 2>&1
    echo
    
    # Performance metrics
    echo "⚡ Performance Metrics:"
    npx claude-flow@alpha benchmark run --quick 2>&1
    echo
    
    # Recent errors
    echo "🚨 Recent Errors:"
    if [[ -n "$CF_LOG_FILE" && -f "$CF_LOG_FILE" ]]; then
      tail -50 "$CF_LOG_FILE" | grep -i error | tail -10
    else
      echo "No log file configured"
    fi
    
  } > "$output_file"
  
  echo "📋 Diagnostics saved to: $output_file"
  
  # Quick summary
  echo
  echo "📊 Quick Summary:"
  grep -E "(Swarm|Memory|Neural|Performance)" "$output_file" | head -10
}
```

### Automated Recovery Rules
```bash
# Rule-based recovery system
setup_recovery_rules() {
  cat > /tmp/recovery_rules.conf << 'EOF'
# Recovery Rules Configuration
# Format: CONDITION -> ACTION

# Memory rules
memory_usage > 90 -> memory_clear_temp
memory_usage > 95 -> emergency_reset

# Agent rules
swarm_health < 30 -> agent_restart_unhealthy
agent_count < 1 -> swarm_reinit_minimal
agent_response_time > 5000 -> agent_optimize

# Neural rules
neural_performance < 50 -> neural_retrain_quick
neural_memory > 1000 -> neural_compress

# System rules
system_load > cpu_cores*2 -> reduce_parallelism
disk_free < 1GB -> cleanup_temp_files
EOF

  echo "✅ Recovery rules configured"
}

# Rule processor
process_recovery_rules() {
  local rules_file="/tmp/recovery_rules.conf"
  
  while IFS=' -> ' read -r condition action; do
    # Skip comments and empty lines
    [[ "$condition" =~ ^#.*$ || -z "$condition" ]] && continue
    
    # Evaluate condition (simplified)
    case "$condition" in
      "memory_usage > 90")
        current=$(npx claude-flow@alpha memory usage --percentage)
        if (( current > 90 )); then
          echo "🔧 Executing: $action (memory usage: $current%)"
          execute_recovery_action "$action"
        fi
        ;;
      "swarm_health < 30")
        current=$(npx claude-flow@alpha swarm status --health-score)
        if (( current < 30 )); then
          echo "🔧 Executing: $action (swarm health: $current%)"
          execute_recovery_action "$action"
        fi
        ;;
    esac
  done < "$rules_file"
}

execute_recovery_action() {
  local action="$1"
  
  case "$action" in
    "memory_clear_temp")
      npx claude-flow@alpha memory clear --namespace=temp --confirm
      ;;
    "emergency_reset")
      emergency_reset
      ;;
    "agent_restart_unhealthy")
      npx claude-flow@alpha agent restart --unhealthy-only
      ;;
    "neural_retrain_quick")
      npx claude-flow@alpha neural train --quick-boost --epochs=5
      ;;
    *)
      echo "⚠️  Unknown recovery action: $action"
      ;;
  esac
}
```