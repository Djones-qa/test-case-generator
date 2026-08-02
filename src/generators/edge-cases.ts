import { FunctionSignature } from '../analysis';

export interface EdgeCase {
  description: string;
  inputs: Record<string, unknown>;
  expectation: string;
  category:
    | 'null-input'
    | 'empty-input'
    | 'overflow'
    | 'special-chars'
    | 'type-coercion'
    | 'concurrent';
}

export function generateEdgeCases(fn: FunctionSignature): EdgeCase[] {
  const cases: EdgeCase[] = [];

  // Generate null/undefined cases for each param
  for (const param of fn.params) {
    cases.push(
      {
        description: `${fn.name} with ${param.name} as null`,
        inputs: { [param.name]: null },
        expectation: 'Should handle null gracefully or throw TypeError',
        category: 'null-input',
      },
      {
        description: `${fn.name} with ${param.name} as undefined`,
        inputs: { [param.name]: undefined },
        expectation: 'Should handle undefined gracefully or use default',
        category: 'null-input',
      },
    );

    // Type coercion cases
    const type = param.type.toLowerCase();
    if (type === 'number') {
      cases.push(
        {
          description: `${fn.name} with ${param.name} as string number`,
          inputs: { [param.name]: '42' },
          expectation: 'Should reject or coerce string to number',
          category: 'type-coercion',
        },
        {
          description: `${fn.name} with ${param.name} as Infinity`,
          inputs: { [param.name]: Infinity },
          expectation: 'Should handle Infinity appropriately',
          category: 'overflow',
        },
        {
          description: `${fn.name} with ${param.name} as -Infinity`,
          inputs: { [param.name]: -Infinity },
          expectation: 'Should handle -Infinity appropriately',
          category: 'overflow',
        },
      );
    } else if (type === 'string') {
      cases.push(
        {
          description: `${fn.name} with ${param.name} containing SQL injection`,
          inputs: { [param.name]: "'; DROP TABLE users; --" },
          expectation: 'Should sanitize or escape SQL characters',
          category: 'special-chars',
        },
        {
          description: `${fn.name} with ${param.name} containing XSS`,
          inputs: { [param.name]: '<img src=x onerror=alert(1)>' },
          expectation: 'Should sanitize or escape HTML characters',
          category: 'special-chars',
        },
        {
          description: `${fn.name} with ${param.name} as empty string`,
          inputs: { [param.name]: '' },
          expectation: 'Should handle empty string or validate',
          category: 'empty-input',
        },
      );
    }
  }

  // No arguments case
  if (fn.params.length > 0) {
    cases.push({
      description: `${fn.name} called with no arguments`,
      inputs: {},
      expectation: 'Should throw or use defaults for missing params',
      category: 'null-input',
    });
  }

  // Concurrent calls case for async functions
  if (fn.hasAsync) {
    cases.push({
      description: `${fn.name} called concurrently multiple times`,
      inputs: { _concurrent: true, _times: 10 },
      expectation: 'Should handle concurrent execution without race conditions',
      category: 'concurrent',
    });
  }

  return cases;
}
