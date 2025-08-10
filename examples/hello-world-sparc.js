#!/usr/bin/env node

/**
 * SPARC Hello World Example
 * 
 * This demonstrates the complete SPARC methodology:
 * S - Specification (What we want to build)
 * P - Pseudocode (How we'll solve it)  
 * A - Architecture (System structure)
 * R - Refinement (Test-driven implementation)
 * C - Completion (Integration and validation)
 * 
 * Run with: node examples/hello-world-sparc.js
 */

// ============================================================================
// PHASE 1: SPECIFICATION
// ============================================================================
console.log('🎯 SPARC PHASE 1: SPECIFICATION');
console.log('===============================');

/**
 * REQUIREMENTS:
 * - Create a greeting application that personalizes messages
 * - Support multiple languages (English, Spanish, French)
 * - Handle edge cases (empty names, invalid languages)
 * - Provide timestamp with greeting
 * - Be extensible for future enhancements
 */

const specification = {
    purpose: "Create a personalized greeting application",
    features: [
        "Multi-language support",
        "Personalized messages", 
        "Timestamp inclusion",
        "Input validation",
        "Extensible design"
    ],
    constraints: [
        "No external dependencies beyond Node.js",
        "Simple console interface",
        "Error handling for edge cases"
    ]
};

console.log('📋 Specification:', JSON.stringify(specification, null, 2));
console.log();

// ============================================================================
// PHASE 2: PSEUDOCODE
// ============================================================================
console.log('📝 SPARC PHASE 2: PSEUDOCODE');
console.log('============================');

/**
 * ALGORITHM DESIGN:
 * 
 * 1. Initialize greeting templates for each language
 * 2. Create function to validate input parameters
 * 3. Create function to format timestamp
 * 4. Create main greeting function that:
 *    - Validates name and language inputs
 *    - Selects appropriate template
 *    - Formats current timestamp
 *    - Returns personalized greeting
 * 5. Create demo function to show various use cases
 * 6. Handle errors gracefully with fallbacks
 */

const pseudocode = [
    "1. DEFINE greeting templates by language",
    "2. FUNCTION validateInputs(name, language)",
    "   IF name is empty RETURN error",
    "   IF language not supported RETURN error", 
    "   RETURN valid",
    "3. FUNCTION formatTimestamp()",
    "   GET current date and time",
    "   FORMAT as readable string",
    "   RETURN formatted timestamp",
    "4. FUNCTION createGreeting(name, language)",
    "   VALIDATE inputs",
    "   SELECT template for language",
    "   GET current timestamp",
    "   COMBINE template + name + timestamp",
    "   RETURN complete greeting",
    "5. FUNCTION runDemo()",
    "   TEST various scenarios",
    "   DISPLAY results"
];

console.log('🔄 Pseudocode Steps:');
pseudocode.forEach(step => console.log(`   ${step}`));
console.log();

// ============================================================================
// PHASE 3: ARCHITECTURE
// ============================================================================
console.log('🏗️  SPARC PHASE 3: ARCHITECTURE');
console.log('===============================');

/**
 * SYSTEM DESIGN:
 * 
 * Components:
 * - GreetingTemplates: Data structure for multi-language templates
 * - InputValidator: Validates user inputs
 * - TimeFormatter: Handles timestamp formatting
 * - GreetingEngine: Core business logic
 * - DemoRunner: Orchestrates examples
 * 
 * Data Flow:
 * Input → Validation → Template Selection → Time Formatting → Output
 */

const architecture = {
    components: {
        "GreetingTemplates": "Static data structure with language templates",
        "InputValidator": "Validates name and language parameters", 
        "TimeFormatter": "Formats current timestamp",
        "GreetingEngine": "Core greeting creation logic",
        "DemoRunner": "Orchestrates demonstration examples"
    },
    dataFlow: "Input → Validation → Template Selection → Time Formatting → Output",
    patterns: ["Factory Pattern", "Validator Pattern", "Template Method"]
};

console.log('🏛️  Architecture Design:', JSON.stringify(architecture, null, 2));
console.log();

// ============================================================================
// PHASE 4: REFINEMENT (Test-Driven Development)
// ============================================================================
console.log('🔧 SPARC PHASE 4: REFINEMENT (TDD)');
console.log('==================================');

// Simple test framework for demonstration
class SimpleTest {
    static assertEqual(actual, expected, message) {
        if (actual === expected) {
            console.log(`✅ PASS: ${message}`);
            return true;
        } else {
            console.log(`❌ FAIL: ${message}`);
            console.log(`   Expected: ${expected}`);
            console.log(`   Actual: ${actual}`);
            return false;
        }
    }
    
    static assertTrue(condition, message) {
        if (condition) {
            console.log(`✅ PASS: ${message}`);
            return true;
        } else {
            console.log(`❌ FAIL: ${message}`);
            return false;
        }
    }
}

// Test-driven implementation
console.log('📝 Writing tests first...');

// Test 1: Greeting Templates
function testGreetingTemplates() {
    console.log('\n🧪 Testing Greeting Templates:');
    
    const templates = {
        en: "Hello, {name}! Welcome. Current time: {timestamp}",
        es: "¡Hola, {name}! Bienvenido. Hora actual: {timestamp}",
        fr: "Bonjour, {name}! Bienvenue. Heure actuelle: {timestamp}"
    };
    
    SimpleTest.assertTrue(templates.en.includes('{name}'), 'English template has name placeholder');
    SimpleTest.assertTrue(templates.es.includes('{name}'), 'Spanish template has name placeholder');
    SimpleTest.assertTrue(templates.fr.includes('{name}'), 'French template has name placeholder');
    
    return templates;
}

// Test 2: Input Validation
function testInputValidation() {
    console.log('\n🧪 Testing Input Validation:');
    
    function validateInputs(name, language) {
        const supportedLanguages = ['en', 'es', 'fr'];
        
        if (!name || name.trim().length === 0) {
            return { valid: false, error: 'Name cannot be empty' };
        }
        
        if (!supportedLanguages.includes(language)) {
            return { valid: false, error: 'Unsupported language' };
        }
        
        return { valid: true };
    }
    
    SimpleTest.assertEqual(validateInputs('John', 'en').valid, true, 'Valid inputs pass validation');
    SimpleTest.assertEqual(validateInputs('', 'en').valid, false, 'Empty name fails validation');
    SimpleTest.assertEqual(validateInputs('John', 'de').valid, false, 'Unsupported language fails validation');
    
    return validateInputs;
}

// Test 3: Time Formatting
function testTimeFormatting() {
    console.log('\n🧪 Testing Time Formatting:');
    
    function formatTimestamp() {
        const now = new Date();
        return now.toLocaleString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    const timestamp = formatTimestamp();
    SimpleTest.assertTrue(timestamp.length > 0, 'Timestamp is generated');
    SimpleTest.assertTrue(timestamp.includes(','), 'Timestamp includes comma separator');
    
    return formatTimestamp;
}

// Test 4: Core Greeting Function
function testGreetingCreation() {
    console.log('\n🧪 Testing Greeting Creation:');
    
    // Dependencies from previous tests
    const templates = testGreetingTemplates();
    const validateInputs = testInputValidation();
    const formatTimestamp = testTimeFormatting();
    
    function createGreeting(name, language = 'en') {
        // Validate inputs
        const validation = validateInputs(name, language);
        if (!validation.valid) {
            throw new Error(validation.error);
        }
        
        // Get template and timestamp
        const template = templates[language];
        const timestamp = formatTimestamp();
        
        // Create greeting
        return template
            .replace('{name}', name)
            .replace('{timestamp}', timestamp);
    }
    
    // Test successful greeting creation
    const greeting = createGreeting('Alice', 'en');
    SimpleTest.assertTrue(greeting.includes('Alice'), 'Greeting includes name');
    SimpleTest.assertTrue(greeting.includes('Hello'), 'English greeting uses correct template');
    
    // Test error handling
    try {
        createGreeting('', 'en');
        SimpleTest.assertTrue(false, 'Should throw error for empty name');
    } catch (error) {
        SimpleTest.assertTrue(true, 'Throws error for empty name');
    }
    
    return createGreeting;
}

// Run all tests and get implementations
const createGreeting = testGreetingCreation();

// ============================================================================
// PHASE 5: COMPLETION (Integration & Validation)
// ============================================================================
console.log('\n🎉 SPARC PHASE 5: COMPLETION');
console.log('============================');

/**
 * INTEGRATION:
 * - All components tested and working
 * - Error handling implemented
 * - Multiple use cases validated
 * - Performance is acceptable
 * - Code is maintainable and extensible
 */

function runCompleteDemo() {
    console.log('\n🚀 Running Complete Demo:');
    console.log('-------------------------');
    
    const testCases = [
        { name: 'Alice', language: 'en' },
        { name: 'Carlos', language: 'es' },
        { name: 'Marie', language: 'fr' },
        { name: 'Bob', language: 'en' }
    ];
    
    console.log('\n📋 Test Cases Results:');
    testCases.forEach((testCase, index) => {
        try {
            const greeting = createGreeting(testCase.name, testCase.language);
            console.log(`\n${index + 1}. Input: ${testCase.name} (${testCase.language})`);
            console.log(`   Output: ${greeting}`);
        } catch (error) {
            console.log(`\n${index + 1}. Input: ${testCase.name} (${testCase.language})`);
            console.log(`   Error: ${error.message}`);
        }
    });
    
    // Test error cases
    console.log('\n❌ Error Handling Test:');
    try {
        createGreeting('', 'en');
    } catch (error) {
        console.log(`   Empty name: ${error.message}`);
    }
    
    try {
        createGreeting('Test', 'invalid');
    } catch (error) {
        console.log(`   Invalid language: ${error.message}`);
    }
}

// Final integration test
runCompleteDemo();

// ============================================================================
// SPARC METHODOLOGY SUMMARY
// ============================================================================
console.log('\n📊 SPARC METHODOLOGY COMPLETE');
console.log('==============================');

const sparcSummary = {
    'Phase 1 - Specification': 'Requirements and constraints clearly defined',
    'Phase 2 - Pseudocode': 'Algorithm steps outlined in plain language',
    'Phase 3 - Architecture': 'System components and data flow designed',
    'Phase 4 - Refinement': 'Test-driven development with validation',
    'Phase 5 - Completion': 'Integration testing and final validation'
};

Object.entries(sparcSummary).forEach(([phase, description]) => {
    console.log(`✅ ${phase}: ${description}`);
});

console.log('\n🎯 Benefits Demonstrated:');
console.log('- Systematic problem-solving approach');
console.log('- Early error detection through testing');
console.log('- Clear separation of concerns');
console.log('- Maintainable and extensible code');
console.log('- Comprehensive validation');

console.log('\n🚀 Next Steps:');
console.log('- Scale this approach for larger projects');
console.log('- Use Claude Flow for team coordination');
console.log('- Apply to real-world applications');
console.log('- Extend with additional languages/features');

console.log('\n✨ SPARC Hello World Example Complete! ✨');

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createGreeting, specification, architecture };
}