# SPARC & Claude-Flow Troubleshooting Guide

## Table of Contents
1. [Installation Problems](#installation-problems)
2. [SPARC Phase Failures](#sparc-phase-failures)
3. [Swarm Initialization Issues](#swarm-initialization-issues)
4. [Memory and Performance Problems](#memory-and-performance-problems)
5. [Command Errors and Fixes](#command-errors-and-fixes)
6. [Network and Connectivity Issues](#network-and-connectivity-issues)
7. [Agent Coordination Problems](#agent-coordination-problems)
8. [Debug Commands and Diagnostic Tools](#debug-commands-and-diagnostic-tools)
9. [Environment Configuration Issues](#environment-configuration-issues)
10. [Common Error Messages](#common-error-messages)

---

## Installation Problems

### Problem: `npx claude-flow` command not found
**Error:** `bash: npx: command not found` or `command not found: claude-flow`

**Solution:**
1. Verify Node.js installation:
   ```bash
   node --version
   npm --version
   ```
2. If Node.js is missing, install it:
   ```bash
   # macOS with Homebrew
   brew install node
   
   # Ubuntu/Debian
   sudo apt update && sudo apt install nodejs npm
   
   # Windows - download from nodejs.org
   ```
3. Install claude-flow globally:
   ```bash
   npm install -g claude-flow@alpha
   ```

**Verification:** `npx claude-flow --version`
**Prevention:** Always use latest Node.js LTS version

### Problem: Permission denied during installation
**Error:** `EACCES: permission denied` or `Error: EPERM: operation not permitted`

**Solution:**
1. Fix npm permissions:
   ```bash
   # Create global directory
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   
   # Add to PATH (add to ~/.bashrc or ~/.zshrc)
   export PATH=~/.npm-global/bin:$PATH
   ```
2. Or use sudo (not recommended):
   ```bash
   sudo npm install -g claude-flow@alpha
   ```

**Verification:** `npm config get prefix`
**Prevention:** Configure npm properly from the start

### Problem: MCP server not connecting
**Error:** `Failed to connect to MCP server` or `MCP server timeout`

**Solution:**
1. Check MCP configuration:
   ```bash
   claude mcp list
   ```
2. Add claude-flow MCP server:
   ```bash
   claude mcp add claude-flow npx claude-flow@alpha mcp start
   ```
3. Restart Claude Desktop application
4. Verify connection:
   ```bash
   claude mcp status claude-flow
   ```

**Verification:** MCP tools should appear in Claude interface
**Prevention:** Always restart Claude Desktop after MCP changes

---

## SPARC Phase Failures

### Problem: Specification phase hangs or fails
**Error:** `SPARC spec-pseudocode timeout` or `Requirements analysis failed`

**Solution:**
1. Break down complex requirements:
   ```bash
   # Instead of complex task
   npx claude-flow sparc run spec-pseudocode "Build complete e-commerce platform"
   
   # Use smaller chunks
   npx claude-flow sparc run spec-pseudocode "User authentication system"
   npx claude-flow sparc run spec-pseudocode "Product catalog API"
   ```
2. Check memory usage:
   ```bash
   npx claude-flow memory usage --detail summary
   ```
3. Clear stale memory:
   ```bash
   npx claude-flow memory usage --action delete --namespace sparc
   ```

**Verification:** `npx claude-flow sparc info spec-pseudocode`
**Prevention:** Keep requirements focused and specific

### Problem: Architecture phase generates incomplete designs
**Error:** `Architecture generation incomplete` or `Missing system components`

**Solution:**
1. Ensure specification phase completed:
   ```bash
   npx claude-flow task status --detailed true
   ```
2. Provide more architectural context:
   ```bash
   npx claude-flow memory usage --action store --key "arch/patterns" --value "microservices,api-gateway,database"
   ```
3. Re-run with specific architecture type:
   ```bash
   npx claude-flow sparc run architect --options '{"pattern": "layered", "scale": "medium"}'
   ```

**Verification:** Check generated architecture files in `/docs`
**Prevention:** Always complete prerequisite phases first

### Problem: TDD phase fails to generate tests
**Error:** `Test generation failed` or `TDD workflow interrupted`

**Solution:**
1. Verify test framework setup:
   ```bash
   npm list jest
   # or
   npm list mocha
   ```
2. Install missing dependencies:
   ```bash
   npm install --save-dev jest @types/jest
   ```
3. Run TDD with specific framework:
   ```bash
   npx claude-flow sparc tdd "user-auth" --framework jest
   ```
4. Check test directory structure:
   ```bash
   ls -la tests/
   ```

**Verification:** Tests should run with `npm test`
**Prevention:** Set up test framework before running TDD

---

## Swarm Initialization Issues

### Problem: Swarm fails to initialize
**Error:** `Swarm initialization failed` or `Topology creation error`

**Solution:**
1. Check available topologies:
   ```bash
   npx claude-flow sparc modes
   ```
2. Start with simpler topology:
   ```bash
   # Instead of complex mesh
   npx claude-flow swarm init --topology hierarchical --maxAgents 3
   ```
3. Verify system resources:
   ```bash
   npx claude-flow features detect --category memory
   ```
4. Clear existing swarm:
   ```bash
   npx claude-flow swarm destroy --swarmId [id]
   ```

**Verification:** `npx claude-flow swarm status --verbose true`
**Prevention:** Start small and scale gradually

### Problem: Agents fail to spawn
**Error:** `Agent spawn timeout` or `Maximum agents exceeded`

**Solution:**
1. Check current agent count:
   ```bash
   npx claude-flow agent list --filter all
   ```
2. Remove idle agents:
   ```bash
   npx claude-flow agent list --filter idle
   # Remove specific agents if needed
   ```
3. Spawn agents incrementally:
   ```bash
   npx claude-flow agent spawn --type researcher --name "req-analyst"
   npx claude-flow agent spawn --type coder --name "backend-dev"
   ```

**Verification:** `npx claude-flow agent metrics --metric all`
**Prevention:** Monitor agent usage and clean up idle agents

### Problem: Swarm topology optimization fails
**Error:** `Topology optimization timeout` or `Network reconfiguration failed`

**Solution:**
1. Check current topology health:
   ```bash
   npx claude-flow swarm monitor --duration 30 --interval 5
   ```
2. Manual topology adjustment:
   ```bash
   npx claude-flow topology optimize --swarmId [id]
   ```
3. Restart swarm if needed:
   ```bash
   npx claude-flow swarm destroy --swarmId [id]
   npx claude-flow swarm init --topology mesh --maxAgents 5
   ```

**Verification:** Monitor performance improvement
**Prevention:** Regular topology health checks

---

## Memory and Performance Problems

### Problem: High memory usage or leaks
**Error:** `Memory usage exceeded threshold` or `Out of memory error`

**Solution:**
1. Check memory usage:
   ```bash
   npx claude-flow memory usage --detail by-agent
   ```
2. Clear unnecessary data:
   ```bash
   npx claude-flow memory usage --action delete --namespace temp
   npx claude-flow cache manage --action clear
   ```
3. Compress memory data:
   ```bash
   npx claude-flow memory compress --namespace default
   ```
4. Create memory backup before cleanup:
   ```bash
   npx claude-flow memory backup --path ./backups/memory-$(date +%Y%m%d)
   ```

**Verification:** Memory usage should decrease
**Prevention:** Regular memory cleanup and compression

### Problem: Slow performance or timeouts
**Error:** `Operation timeout` or `Performance degradation detected`

**Solution:**
1. Run performance benchmark:
   ```bash
   npx claude-flow benchmark run --type all --iterations 5
   ```
2. Identify bottlenecks:
   ```bash
   npx claude-flow bottleneck analyze --metrics ["cpu", "memory", "network"]
   ```
3. Optimize WASM operations:
   ```bash
   npx claude-flow wasm optimize --operation "neural-inference"
   ```
4. Reduce concurrent operations:
   ```bash
   # Reduce agent count temporarily
   npx claude-flow swarm scale --targetSize 3
   ```

**Verification:** `npx claude-flow performance report --format detailed`
**Prevention:** Regular performance monitoring and optimization

### Problem: Token usage too high
**Error:** `Token limit exceeded` or `High token consumption detected`

**Solution:**
1. Analyze token usage:
   ```bash
   npx claude-flow token usage --operation sparc --timeframe 24h
   ```
2. Optimize memory retrieval:
   ```bash
   npx claude-flow memory search --pattern "recent" --limit 5
   ```
3. Use more efficient prompts:
   ```bash
   # Break large tasks into smaller chunks
   npx claude-flow sparc batch "spec,pseudocode" "smaller task description"
   ```

**Verification:** Monitor token usage trends
**Prevention:** Efficient prompt engineering and task segmentation

---

## Command Errors and Fixes

### Problem: Invalid command syntax
**Error:** `Command not recognized` or `Invalid parameters`

**Solution:**
1. Check available commands:
   ```bash
   npx claude-flow --help
   npx claude-flow sparc --help
   ```
2. Verify command syntax:
   ```bash
   npx claude-flow sparc info [mode]
   ```
3. Use correct parameter format:
   ```bash
   # Correct
   npx claude-flow sparc run architect "API design"
   
   # Incorrect
   npx claude-flow sparc run architect API design
   ```

**Verification:** Command should execute without syntax errors
**Prevention:** Always quote task descriptions and complex parameters

### Problem: JSON parsing errors in commands
**Error:** `JSON parse error` or `Invalid JSON format`

**Solution:**
1. Validate JSON syntax:
   ```bash
   # Use proper JSON escaping
   npx claude-flow sparc run architect --options '{"pattern": "microservices", "scale": "large"}'
   ```
2. Use environment variables for complex JSON:
   ```bash
   export SPARC_OPTIONS='{"framework": "jest", "coverage": true}'
   npx claude-flow sparc tdd "feature" --options "$SPARC_OPTIONS"
   ```

**Verification:** JSON should parse correctly
**Prevention:** Use JSON validators for complex configurations

### Problem: File path resolution errors
**Error:** `File not found` or `Path resolution failed`

**Solution:**
1. Use absolute paths:
   ```bash
   npx claude-flow workflow execute --workflowId test --params '{"inputFile": "/full/path/to/file"}'
   ```
2. Verify working directory:
   ```bash
   pwd
   ls -la
   ```
3. Check file permissions:
   ```bash
   ls -la [file]
   chmod +r [file]
   ```

**Verification:** Files should be accessible
**Prevention:** Always use absolute paths or verify current directory

---

## Network and Connectivity Issues

### Problem: API connection failures
**Error:** `Connection refused` or `Network timeout`

**Solution:**
1. Check network connectivity:
   ```bash
   ping api.claude.ai
   curl -I https://api.claude.ai
   ```
2. Verify proxy settings:
   ```bash
   echo $HTTP_PROXY
   echo $HTTPS_PROXY
   ```
3. Test with different endpoint:
   ```bash
   npx claude-flow health check --components ["api", "mcp", "neural"]
   ```

**Verification:** Network requests should succeed
**Prevention:** Configure proper network settings and firewall rules

### Problem: MCP server connection drops
**Error:** `MCP connection lost` or `Server unavailable`

**Solution:**
1. Restart MCP server:
   ```bash
   claude mcp restart claude-flow
   ```
2. Check server logs:
   ```bash
   claude mcp logs claude-flow
   ```
3. Verify server configuration:
   ```bash
   claude mcp status claude-flow --verbose
   ```

**Verification:** MCP tools should be available
**Prevention:** Monitor MCP server health regularly

---

## Agent Coordination Problems

### Problem: Agents not communicating
**Error:** `Inter-agent communication failed` or `Coordination timeout`

**Solution:**
1. Check agent status:
   ```bash
   npx claude-flow agent list --filter active
   npx claude-flow coordination sync --swarmId [id]
   ```
2. Test communication:
   ```bash
   npx claude-flow daa communication --from "agent1" --to "agent2" --message '{"type": "ping"}'
   ```
3. Restart coordination:
   ```bash
   npx claude-flow coordination sync --swarmId [id]
   ```

**Verification:** Agents should show active communication
**Prevention:** Regular coordination sync checks

### Problem: Task distribution failures
**Error:** `Task allocation failed` or `Load balancing error`

**Solution:**
1. Check agent capabilities:
   ```bash
   npx claude-flow daa capability match --task-requirements ["coding", "testing"]
   ```
2. Manual task assignment:
   ```bash
   npx claude-flow task orchestrate --task "specific task" --maxAgents 2 --strategy sequential
   ```
3. Rebalance workload:
   ```bash
   npx claude-flow load balance --swarmId [id] --tasks [task-array]
   ```

**Verification:** Tasks should distribute evenly
**Prevention:** Monitor task distribution patterns

---

## Debug Commands and Diagnostic Tools

### Essential Diagnostic Commands

```bash
# System Health Check
npx claude-flow health check --components ["all"]

# Performance Metrics
npx claude-flow performance report --format detailed --timeframe 24h

# Memory Analysis
npx claude-flow memory analytics --timeframe 24h

# Agent Performance
npx claude-flow agent metrics --metric performance

# Swarm Status
npx claude-flow swarm monitor --duration 60 --interval 10

# Error Analysis
npx claude-flow error analysis --logs [log-array]

# Feature Detection
npx claude-flow features detect --category all

# Bottleneck Analysis
npx claude-flow bottleneck analyze --component "swarm"

# Token Usage Analysis
npx claude-flow token usage --timeframe 7d

# Neural Network Status
npx claude-flow neural status --detailed true
```

### Log Analysis Commands

```bash
# View system logs
npx claude-flow log analysis --logFile "/path/to/logs" --patterns ["error", "timeout", "failed"]

# Export diagnostic data
npx claude-flow diagnostic run --components ["swarm", "agents", "memory"]

# Create system snapshot
npx claude-flow state snapshot --name "debug-$(date +%Y%m%d-%H%M%S)"

# Backup current state
npx claude-flow backup create --components ["memory", "config"] --destination "./debug-backup"
```

---

## Environment Configuration Issues

### Problem: Environment variables not loading
**Error:** `Environment variable not found` or `Configuration missing`

**Solution:**
1. Check environment file:
   ```bash
   cat .env
   ```
2. Load environment properly:
   ```bash
   export $(cat .env | xargs)
   ```
3. Verify variables:
   ```bash
   echo $CLAUDE_API_KEY
   echo $NODE_ENV
   ```

**Verification:** Variables should be accessible
**Prevention:** Use environment validation scripts

### Problem: Configuration conflicts
**Error:** `Configuration conflict` or `Invalid configuration`

**Solution:**
1. Reset to default configuration:
   ```bash
   npx claude-flow config manage --action reset
   ```
2. Validate current config:
   ```bash
   npx claude-flow config manage --action validate
   ```
3. Export working configuration:
   ```bash
   npx claude-flow config manage --action export --path "./backup-config.json"
   ```

**Verification:** Configuration should validate successfully
**Prevention:** Version control configuration files

---

## Common Error Messages

### `Error: SPARC phase [phase] failed with timeout`
- **Cause:** Complex task or insufficient resources
- **Solution:** Break task into smaller parts, check system resources
- **Command:** `npx claude-flow sparc info [phase]`

### `Error: Maximum agents exceeded (limit: N)`
- **Cause:** Too many agents spawned
- **Solution:** Remove idle agents, increase limit, or optimize topology
- **Command:** `npx claude-flow agent list --filter idle`

### `Error: Memory threshold exceeded`
- **Cause:** Memory leak or excessive data storage
- **Solution:** Clear unnecessary data, compress memory, restart swarm
- **Command:** `npx claude-flow memory usage --detail by-agent`

### `Error: MCP server connection failed`
- **Cause:** Server not running or configuration issue
- **Solution:** Restart MCP server, check configuration
- **Command:** `claude mcp restart claude-flow`

### `Error: Neural model not found`
- **Cause:** Model not loaded or path incorrect
- **Solution:** Load model, verify path, check model directory
- **Command:** `npx claude-flow model load --modelPath [path]`

### `Error: Task orchestration failed`
- **Cause:** No available agents or resource constraints
- **Solution:** Spawn appropriate agents, check resources
- **Command:** `npx claude-flow agent spawn --type [required-type]`

### `Error: Workflow execution timeout`
- **Cause:** Long-running operations or deadlock
- **Solution:** Optimize workflow, check for circular dependencies
- **Command:** `npx claude-flow workflow export --workflowId [id] --format json`

---

## Prevention Checklist

### Before Starting Development
- [ ] Verify Node.js and npm versions
- [ ] Install claude-flow latest version
- [ ] Configure MCP server properly
- [ ] Set up environment variables
- [ ] Test basic connectivity

### During Development
- [ ] Monitor memory usage regularly
- [ ] Keep agent count reasonable
- [ ] Use appropriate task complexity
- [ ] Clear temporary data periodically
- [ ] Backup important configurations

### After Issues
- [ ] Document the solution
- [ ] Update prevention measures
- [ ] Test fix thoroughly
- [ ] Share with team if applicable
- [ ] Monitor for recurrence

---

## Emergency Recovery Commands

```bash
# Nuclear option - reset everything
npx claude-flow swarm destroy --swarmId [id]
npx claude-flow memory usage --action delete --namespace default
npx claude-flow cache manage --action clear
claude mcp restart claude-flow

# Then reinitialize
npx claude-flow swarm init --topology hierarchical --maxAgents 3
npx claude-flow agent spawn --type coordinator
```

---

## Getting Help

1. **Check logs:** Always start with diagnostic commands
2. **Search this guide:** Use Ctrl+F to find specific errors
3. **Community:** GitHub issues and discussions
4. **Documentation:** Official claude-flow documentation
5. **Support:** Create detailed issue reports with diagnostic output

Remember: Most issues are resolved by understanding the system state and applying targeted solutions rather than wholesale restarts.