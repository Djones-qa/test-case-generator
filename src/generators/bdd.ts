import { FunctionSignature } from '../analysis';

export function generateGherkinScenarios(fn: FunctionSignature): string[] {
  const scenarios: string[] = [];

  // Happy path scenario
  const happyInputs = fn.params
    .map((p) => {
      const type = p.type.toLowerCase();
      if (type === 'number') return `a ${p.name} of 42`;
      if (type === 'string') return `a ${p.name} of "valid-input"`;
      if (type === 'boolean') return `a ${p.name} of true`;
      return `a valid ${p.name}`;
    })
    .join(' and ');

  scenarios.push(
    [
      `Scenario: ${fn.name} happy path`,
      `  Given ${happyInputs || 'no input parameters'}`,
      `  When ${fn.name} is called`,
      `  Then it should return a valid ${fn.returnType} result`,
    ].join('\n'),
  );

  // Error cases for each param
  for (const param of fn.params) {
    scenarios.push(
      [
        `Scenario: ${fn.name} with null ${param.name}`,
        `  Given a ${param.name} of null`,
        `  When ${fn.name} is called`,
        `  Then it should throw an error or handle gracefully`,
      ].join('\n'),
    );

    if (param.type.toLowerCase() === 'number') {
      scenarios.push(
        [
          `Scenario: ${fn.name} with ${param.name} at boundary`,
          `  Given a ${param.name} of ${Number.MAX_SAFE_INTEGER}`,
          `  When ${fn.name} is called`,
          `  Then it should handle large number appropriately`,
        ].join('\n'),
      );
    }

    if (param.type.toLowerCase() === 'string') {
      scenarios.push(
        [
          `Scenario: ${fn.name} with empty ${param.name}`,
          `  Given a ${param.name} of ""`,
          `  When ${fn.name} is called`,
          `  Then it should handle empty string appropriately`,
        ].join('\n'),
      );
    }
  }

  // Async scenario
  if (fn.hasAsync) {
    scenarios.push(
      [
        `Scenario: ${fn.name} async error handling`,
        `  Given invalid input that causes an async failure`,
        `  When ${fn.name} is called`,
        `  Then it should reject with a meaningful error`,
      ].join('\n'),
    );
  }

  return scenarios;
}
