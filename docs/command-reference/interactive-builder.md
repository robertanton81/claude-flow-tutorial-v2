# Interactive Command Builder

## Visual Command Constructor

The interactive command builder helps you construct Claude-Flow commands with real-time validation and preview.

### Basic Structure
```bash
npx claude-flow@alpha [category] [command] [options] "[parameters]"
```

### Command Categories
- `sparc` - SPARC methodology commands
- `swarm` - Swarm orchestration
- `agent` - Agent management
- `memory` - Memory operations
- `neural` - Neural network functions
- `github` - GitHub integration
- `hooks` - Automation hooks

## Parameter Validation System

### Required Parameters Validator
```javascript
const commandValidator = {
  'sparc run': {
    required: ['mode'],
    optional: ['task', '--parallel', '--agents'],
    examples: [
      'npx claude-flow@alpha sparc run spec "analyze requirements"',
      'npx claude-flow@alpha sparc run architect --parallel'
    ]
  },
  'swarm init': {
    required: ['topology'],
    optional: ['maxAgents', 'strategy'],
    validation: {
      topology: ['mesh', 'hierarchical', 'ring', 'star'],
      strategy: ['balanced', 'specialized', 'adaptive']
    }
  }
}
```

## Real-time Preview Generator

### Command Preview Template
```bash
# Current Command:
npx claude-flow@alpha sparc run spec "analyze user authentication system"

# Preview Output:
✅ Mode: spec (Specification Analysis)
✅ Task: "analyze user authentication system"
✅ Agents: Auto-selected based on task complexity
✅ Expected Duration: 2-3 minutes
✅ Output: Requirements specification document
```

### Interactive Builder Interface
```
┌─ Claude-Flow Command Builder ─┐
│                               │
│ Category: [sparc        ▼]    │
│ Command:  [run          ▼]    │
│ Mode:     [spec         ▼]    │
│ Task:     [____________]      │
│                               │
│ Options:                      │
│ □ --parallel                  │
│ □ --agents=N                  │
│ □ --verbose                   │
│                               │
│ Generated Command:            │
│ npx claude-flow@alpha sparc   │
│ run spec "your task here"     │
│                               │
│ [Copy] [Run] [Save Template]  │
└───────────────────────────────┘
```

## Copy-Paste Ready Output

### Template Generator
```javascript
function generateCommand(category, command, options, params) {
  const base = `npx claude-flow@alpha ${category} ${command}`;
  const optionString = Object.entries(options)
    .filter(([key, value]) => value)
    .map(([key, value]) => typeof value === 'boolean' ? `--${key}` : `--${key}=${value}`)
    .join(' ');
  
  const paramString = params ? `"${params}"` : '';
  
  return `${base} ${optionString} ${paramString}`.trim();
}

// Example usage:
generateCommand('sparc', 'run', { parallel: true, agents: 5 }, 'implement auth system');
// Output: npx claude-flow@alpha sparc run --parallel --agents=5 "implement auth system"
```

### Quick Copy Buttons
```html
<!-- Command ready for clipboard -->
<div class="command-output">
  <code id="generated-command">npx claude-flow@alpha sparc tdd "user login feature"</code>
  <button onclick="copyToClipboard('generated-command')">📋 Copy</button>
  <button onclick="runCommand('generated-command')">▶️ Run</button>
</div>
```

## Advanced Parameter Combinations

### Conditional Parameters
```javascript
const conditionalParams = {
  'sparc tdd': {
    when: { framework: 'jest' },
    add: ['--test-runner=jest', '--coverage']
  },
  'swarm init': {
    when: { complexity: 'high' },
    suggest: ['--topology=hierarchical', '--maxAgents=8']
  }
}
```

### Smart Suggestions
```bash
# Based on current project structure
$ npx claude-flow@alpha sparc run spec "add payment processing"
💡 Suggestions:
  --agents=3 (detected: backend, frontend, security needs)
  --parallel (multiple components detected)
  --github-integration (repository detected)

# Auto-complete available modes
$ npx claude-flow@alpha sparc run [TAB]
spec        architect    tdd         integration
refactor    optimize     test        deploy
```

## Validation Rules

### Parameter Validation
```yaml
validation_rules:
  topology:
    values: [mesh, hierarchical, ring, star]
    default: mesh
    
  maxAgents:
    type: integer
    min: 1
    max: 50
    default: 5
    
  task:
    type: string
    min_length: 5
    required: true
    pattern: "^[a-zA-Z0-9\\s\\-_]+$"
```

### Error Prevention
```javascript
const validateCommand = (command) => {
  const errors = [];
  
  if (!command.category) {
    errors.push('Category is required');
  }
  
  if (!command.task && requiresTask(command)) {
    errors.push('Task description is required for this command');
  }
  
  if (command.agents && (command.agents < 1 || command.agents > 50)) {
    errors.push('Agent count must be between 1 and 50');
  }
  
  return errors;
};
```

## Interactive Examples

### Step-by-Step Builder
```
Step 1: Choose your goal
┌─────────────────────────────┐
│ What do you want to do?     │
│                             │
│ ○ Analyze requirements      │
│ ○ Design architecture       │
│ ○ Implement feature         │
│ ○ Run tests                 │
│ ○ Deploy application        │
└─────────────────────────────┘

Step 2: Describe your task
┌─────────────────────────────┐
│ Task Description:           │
│ ┌─────────────────────────┐ │
│ │ implement user auth     │ │
│ │ with JWT tokens         │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘

Step 3: Configure options
┌─────────────────────────────┐
│ ☑ Run in parallel           │
│ ☑ Include testing           │
│ ☑ Generate documentation    │
│ ☐ Deploy to staging         │
└─────────────────────────────┘

Step 4: Review and execute
┌─────────────────────────────┐
│ Final Command:              │
│ npx claude-flow@alpha sparc │
│ tdd --parallel --docs       │
│ "implement user auth with   │
│ JWT tokens"                 │
│                             │
│ [◀ Back] [▶ Execute]        │
└─────────────────────────────┘
```

### Template Library
```javascript
const commandTemplates = {
  'full-feature': 'npx claude-flow@alpha sparc tdd --parallel --docs "{feature}"',
  'quick-test': 'npx claude-flow@alpha sparc run test "{component}"',
  'architecture': 'npx claude-flow@alpha sparc run architect --agents=3 "{system}"',
  'optimize': 'npx claude-flow@alpha sparc run optimize --benchmark "{target}"'
};

// Usage
const command = commandTemplates['full-feature'].replace('{feature}', 'payment system');
```