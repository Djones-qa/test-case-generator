import { createServer } from './api/server';
import { generateTestSuite } from './engine';
import { logger } from './config';

const args = process.argv.slice(2);

if (args.includes('serve') || args.includes('--serve')) {
  const { start } = createServer();
  start();
} else {
  // CLI mode - read from stdin or show usage
  const sampleCode = `
function calculateTotal(price: number, quantity: number, discount?: string): number {
  return price * quantity;
}

export const validateEmail = async (email: string): boolean => {
  return email.includes('@');
}
`;

  logger.info('Test Case Generator - CLI Mode');
  logger.info('Usage: npm start -- serve    (start API server)');
  logger.info('');
  logger.info('Generating sample test suite...');

  const suites = generateTestSuite(sampleCode);

  for (const suite of suites) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Function: ${suite.functionName}`);
    console.log(`Total Test Cases: ${suite.totalCases}`);
    console.log(`${'='.repeat(60)}`);

    console.log(`\n  Boundary Tests (${suite.boundaryTests.length}):`);
    for (const test of suite.boundaryTests.slice(0, 5)) {
      console.log(`    - [${test.category}] ${test.description}`);
    }

    console.log(`\n  Edge Cases (${suite.edgeCases.length}):`);
    for (const test of suite.edgeCases.slice(0, 5)) {
      console.log(`    - [${test.category}] ${test.description}`);
    }

    console.log(`\n  Equivalence Classes (${suite.equivalenceClasses.length}):`);
    for (const ec of suite.equivalenceClasses.slice(0, 5)) {
      console.log(`    - [${ec.isValid ? 'valid' : 'invalid'}] ${ec.className}: ${ec.description}`);
    }

    console.log(`\n  BDD Scenarios (${suite.gherkinScenarios.length}):`);
    for (const scenario of suite.gherkinScenarios.slice(0, 2)) {
      console.log(`    ${scenario.split('\n').join('\n    ')}`);
    }
  }
}
