#!/bin/bash
# run-all-examples.sh
# Run all Claude-Flow tutorial examples in sequence

echo "🚀 Claude-Flow Tutorial Runner"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
PASSED=0
FAILED=0
SKIPPED=0

# Function to run an example
run_example() {
    local example_num=$1
    local example_name=$2
    local example_file="../examples/$example_num-$example_name.js"
    
    echo -e "${YELLOW}Running Example $example_num: $example_name${NC}"
    echo "----------------------------------------"
    
    if [ -f "$example_file" ]; then
        if node "$example_file"; then
            echo -e "${GREEN}✅ Example $example_num passed${NC}"
            ((PASSED++))
        else
            echo -e "${RED}❌ Example $example_num failed${NC}"
            ((FAILED++))
        fi
    else
        echo -e "${RED}⚠️  Example $example_num not found${NC}"
        ((SKIPPED++))
    fi
    
    echo ""
    echo "Press Enter to continue..."
    read
}

# Check if Claude-Flow is installed
echo "Checking Claude-Flow installation..."
if ! command -v npx &> /dev/null; then
    echo -e "${RED}Error: npx not found. Please install Node.js first.${NC}"
    exit 1
fi

if ! npx claude-flow@alpha --version &> /dev/null; then
    echo "Installing Claude-Flow..."
    npm install -g claude-flow@alpha
fi

echo -e "${GREEN}✅ Claude-Flow is installed${NC}"
echo ""

# Run examples
echo "Starting tutorial examples..."
echo ""

# Example selection menu
echo "Select examples to run:"
echo "1. Basic Swarm Operations"
echo "2. Parallel Execution"
echo "3. Memory Management"
echo "4. Neural Network Training"
echo "5. GitHub Integration"
echo "6. Consensus & Voting"
echo "7. Performance Optimization"
echo "8. SPARC Methodology"
echo "9. Complete Project"
echo "0. Run All Examples"
echo ""

read -p "Enter your choice (0-9): " choice

case $choice in
    1) run_example "01" "basic-swarm" ;;
    2) run_example "02" "parallel-execution" ;;
    3) run_example "03" "memory-management" ;;
    4) run_example "04" "neural-training" ;;
    5) run_example "05" "github-integration" ;;
    6) run_example "06" "consensus-voting" ;;
    7) run_example "07" "performance-optimization" ;;
    8) run_example "08" "sparc-methodology" ;;
    9) run_example "09" "complete-project" ;;
    0)
        # Run all examples
        run_example "01" "basic-swarm"
        run_example "02" "parallel-execution"
        run_example "03" "memory-management"
        run_example "04" "neural-training"
        run_example "05" "github-integration"
        run_example "06" "consensus-voting"
        run_example "07" "performance-optimization"
        run_example "08" "sparc-methodology"
        run_example "09" "complete-project"
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

# Summary
echo ""
echo "=============================="
echo "Tutorial Execution Summary"
echo "=============================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${YELLOW}Skipped: $SKIPPED${NC}"
echo ""

if [ $FAILED -eq 0 ] && [ $SKIPPED -eq 0 ]; then
    echo -e "${GREEN}🎉 All examples completed successfully!${NC}"
else
    echo -e "${YELLOW}⚠️  Some examples had issues. Please review the output above.${NC}"
fi

echo ""
echo "Thank you for using Claude-Flow!"
echo "For more information: https://github.com/ruvnet/claude-flow"