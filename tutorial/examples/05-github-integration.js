// 05-github-integration.js
// Demonstrates GitHub integration for repository management and CI/CD

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function githubIntegrationExample() {
  console.log('🐙 Starting GitHub Integration Example\n');
  
  try {
    // Initialize swarm for GitHub operations
    console.log('1️⃣ Initializing swarm for GitHub operations...');
    await execAsync('npx claude-flow@alpha swarm init --topology hierarchical --max-agents 6');
    
    // Spawn specialized GitHub agents
    console.log('\n2️⃣ Spawning GitHub-specialized agents...');
    const githubAgents = [
      { type: 'reviewer', name: 'pr-reviewer' },
      { type: 'coordinator', name: 'release-manager' },
      { type: 'analyst', name: 'code-analyzer' },
      { type: 'documenter', name: 'docs-generator' }
    ];
    
    for (const agent of githubAgents) {
      await execAsync(`npx claude-flow@alpha agent spawn --type ${agent.type} --name ${agent.name}`);
      console.log(`✅ Spawned ${agent.name}`);
    }
    
    // Repository analysis
    console.log('\n3️⃣ Analyzing repository...');
    await execAsync('npx claude-flow@alpha github repo analyze \
      --repo "owner/repository" \
      --analysis-type "code_quality"');
    
    console.log('✅ Repository analysis complete');
    
    // Pull request management
    console.log('\n4️⃣ Managing pull requests...');
    
    // Automated PR review workflow
    const prWorkflow = {
      trigger: 'pr_opened',
      steps: [
        'lint_check',
        'test_suite',
        'code_review',
        'security_scan',
        'performance_check'
      ]
    };
    
    await execAsync(`npx claude-flow@alpha workflow create \
      --name "pr-review-pipeline" \
      --steps '${JSON.stringify(prWorkflow.steps)}' \
      --triggers '["pr_opened","pr_synchronized"]'`);
    
    console.log('✅ PR review workflow created');
    
    // Issue triage automation
    console.log('\n5️⃣ Setting up issue triage...');
    
    await execAsync('npx claude-flow@alpha github issue track \
      --repo "owner/repository" \
      --action "auto-triage"');
    
    // Auto-labeling rules
    const labelingRules = [
      { keyword: 'bug', label: 'bug' },
      { keyword: 'feature', label: 'enhancement' },
      { keyword: 'documentation', label: 'docs' },
      { keyword: 'performance', label: 'performance' }
    ];
    
    await execAsync(`npx claude-flow@alpha automation setup \
      --rules '${JSON.stringify(labelingRules)}'`);
    
    console.log('✅ Issue triage configured');
    
    // Release coordination
    console.log('\n6️⃣ Coordinating release process...');
    
    await execAsync('npx claude-flow@alpha github release coord \
      --repo "owner/repository" \
      --version "1.0.0"');
    
    // Generate changelog
    console.log('Generating changelog...');
    await execAsync('npx claude-flow@alpha task orchestrate \
      "Generate changelog from commit history" \
      --agent "docs-generator"');
    
    console.log('✅ Release coordination complete');
    
    // Multi-repo synchronization
    console.log('\n7️⃣ Synchronizing multiple repositories...');
    
    const repos = [
      'org/frontend',
      'org/backend',
      'org/shared-libs'
    ];
    
    await execAsync(`npx claude-flow@alpha github sync coord \
      --repos '${JSON.stringify(repos)}'`);
    
    console.log('✅ Multi-repo sync configured');
    
    // CI/CD pipeline creation
    console.log('\n8️⃣ Creating CI/CD pipeline...');
    
    const pipeline = {
      name: 'deploy-pipeline',
      stages: [
        {
          name: 'build',
          parallel: ['lint', 'typecheck', 'test']
        },
        {
          name: 'deploy',
          sequential: ['staging', 'production']
        }
      ]
    };
    
    await execAsync(`npx claude-flow@alpha pipeline create \
      --config '${JSON.stringify(pipeline)}'`);
    
    console.log('✅ CI/CD pipeline created');
    
    // Code review swarm
    console.log('\n9️⃣ Deploying code review swarm...');
    
    await execAsync('npx claude-flow@alpha task orchestrate \
      "Review PR #123 for security, performance, and best practices" \
      --strategy parallel \
      --priority critical');
    
    console.log('✅ Code review swarm deployed');
    
    // Store GitHub metrics
    console.log('\n🔟 Collecting and storing metrics...');
    
    await execAsync('npx claude-flow@alpha github metrics --repo "owner/repository"');
    await execAsync('npx claude-flow@alpha memory store \
      --key "github/metrics/latest" \
      --value \'{"prs":45,"issues":23,"stars":1234,"contributors":56}\' \
      --namespace project');
    
    console.log('✅ GitHub metrics stored');
    
    console.log('\n🎉 GitHub integration example completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Advanced GitHub patterns
async function advancedGitHubPatterns() {
  console.log('\n🔧 Advanced GitHub Patterns\n');
  
  // Pattern 1: Automated dependency updates
  console.log('Pattern 1: Automated Dependency Updates');
  await execAsync('npx claude-flow@alpha workflow create \
    --name "dependency-updater" \
    --steps \'["check_outdated","create_branch","update_deps","run_tests","create_pr"]\' \
    --triggers \'["schedule:weekly"]\'');
  
  // Pattern 2: Security vulnerability scanning
  console.log('\nPattern 2: Security Scanning');
  await execAsync('npx claude-flow@alpha task orchestrate \
    "Scan repository for security vulnerabilities and create issues for findings" \
    --strategy adaptive \
    --priority high');
  
  // Pattern 3: Automated documentation generation
  console.log('\nPattern 3: Auto-Documentation');
  await execAsync('npx claude-flow@alpha workflow create \
    --name "docs-generator" \
    --steps \'["extract_comments","generate_api_docs","update_readme","commit_changes"]\' \
    --triggers \'["push:main"]\'');
  
  // Pattern 4: Performance regression detection
  console.log('\nPattern 4: Performance Monitoring');
  await execAsync('npx claude-flow@alpha task orchestrate \
    "Compare performance metrics between commits and flag regressions" \
    --strategy sequential');
  
  console.log('\n✅ Advanced GitHub patterns demonstrated');
}

// GitHub Actions workflow generation
async function generateGitHubActions() {
  console.log('\n📝 Generating GitHub Actions Workflows\n');
  
  const workflows = {
    ci: `name: CI Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build`,
    
    deploy: `name: Deploy Pipeline
on:
  release:
    types: [published]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy with Claude-Flow
        run: |
          npx claude-flow@alpha swarm init --topology star
          npx claude-flow@alpha task orchestrate "Deploy to production"`,
    
    review: `name: Automated Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Claude-Flow Review
        run: |
          npx claude-flow@alpha github code review \\
            --repo \${{ github.repository }} \\
            --pr \${{ github.event.pull_request.number }}`
  };
  
  // Save workflows
  for (const [name, content] of Object.entries(workflows)) {
    await execAsync(`mkdir -p .github/workflows`);
    require('fs').writeFileSync(`.github/workflows/${name}.yml`, content);
    console.log(`✅ Created ${name}.yml workflow`);
  }
  
  console.log('\n✅ GitHub Actions workflows generated');
}

// Run the example
if (require.main === module) {
  githubIntegrationExample()
    .then(() => advancedGitHubPatterns())
    .then(() => generateGitHubActions())
    .catch(console.error);
}

module.exports = { githubIntegrationExample, advancedGitHubPatterns, generateGitHubActions };