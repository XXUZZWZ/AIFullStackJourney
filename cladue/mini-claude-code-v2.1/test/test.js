const ToolManager = require('../lib/tool-manager');
const CodeGenerator = require('../lib/code-generator');

async function runTests() {
  console.log('🧪 Running Mini Claude Code Tests...\n');

  // Test 1: Tool Manager Initialization
  console.log('Test 1: Tool Manager Initialization');
  try {
    const toolManager = new ToolManager();
    const context = toolManager.getContext();
    console.log('✅ Tool Manager initialized successfully');
    console.log(`   Available tools: ${context.availableTools.join(', ')}`);
  } catch (error) {
    console.log(`❌ Tool Manager initialization failed: ${error.message}`);
  }

  // Test 2: File System Operations
  console.log('\nTest 2: File System Operations');
  try {
    const toolManager = new ToolManager();
    
    // Test file creation
    const testContent = 'Hello from Mini Claude Code!';
    const writeResult = await toolManager.execute('fs', 'writeFile', './test-output.txt', testContent);
    
    if (writeResult.success) {
      console.log('✅ File write successful');
      
      // Test file reading
      const readResult = await toolManager.execute('fs', 'readFile', './test-output.txt');
      if (readResult.success && readResult.content === testContent) {
        console.log('✅ File read successful');
        
        // Clean up
        const fs = require('fs-extra');
        await fs.remove('./test-output.txt');
        console.log('✅ Test file cleaned up');
      } else {
        console.log(`❌ File read failed or content mismatch`);
      }
    } else {
      console.log(`❌ File write failed: ${writeResult.error}`);
    }
  } catch (error) {
    console.log(`❌ File system test failed: ${error.message}`);
  }

  // Test 3: Command Execution
  console.log('\nTest 3: Command Execution');
  try {
    const toolManager = new ToolManager();
    const result = await toolManager.execute('cmd', 'run', 'echo "Hello World"');
    
    if (result.success && result.stdout.includes('Hello World')) {
      console.log('✅ Command execution successful');
    } else {
      console.log(`❌ Command execution failed`);
    }
  } catch (error) {
    console.log(`❌ Command execution test failed: ${error.message}`);
  }

  // Test 4: Code Generation
  console.log('\nTest 4: Code Generation');
  try {
    const codeGenerator = new CodeGenerator();
    
    // Test React component generation
    const result = await codeGenerator.generateFile('component', 'TestComponent');
    
    if (result.success) {
      console.log('✅ Code generation successful');
      console.log(`   Generated: ${result.filePath}`);
      console.log(`   Type: ${result.type}`);
    } else {
      console.log(`❌ Code generation failed: ${result.error}`);
    }
  } catch (error) {
    console.log(`❌ Code generation test failed: ${error.message}`);
  }

  // Test 5: Project Analysis
  console.log('\nTest 5: Project Analysis');
  try {
    const toolManager = new ToolManager();
    const analysis = await toolManager.tools.analyzer.analyzeProject('.');
    
    if (analysis.success) {
      console.log('✅ Project analysis successful');
      console.log(`   Total files: ${analysis.analysis.totalFiles}`);
      console.log(`   Languages detected: ${Object.keys(analysis.analysis.languages).join(', ') || 'None'}`);
      console.log(`   Package manager: ${analysis.analysis.packageManager || 'None'}`);
    } else {
      console.log(`❌ Project analysis failed: ${analysis.error}`);
    }
  } catch (error) {
    console.log(`❌ Project analysis test failed: ${error.message}`);
  }

  console.log('\n🎉 Test suite completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };