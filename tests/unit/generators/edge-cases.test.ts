import { generateEdgeCases } from '../../../src/generators/edge-cases';
import { FunctionSignature } from '../../../src/analysis/parser';

describe('Edge Case Generator', () => {
  const sampleFn: FunctionSignature = {
    name: 'processData',
    params: [
      { name: 'value', type: 'number', optional: false },
      { name: 'label', type: 'string', optional: false },
    ],
    returnType: 'void',
    hasAsync: false,
  };

  it('generates null input cases', () => {
    const cases = generateEdgeCases(sampleFn);

    const nullCases = cases.filter((c) => c.category === 'null-input');
    expect(nullCases.length).toBeGreaterThan(0);
    expect(nullCases.some((c) => c.inputs.value === null)).toBe(true);
    expect(nullCases.some((c) => c.inputs.label === null)).toBe(true);
  });

  it('generates type coercion cases', () => {
    const cases = generateEdgeCases(sampleFn);

    const coercionCases = cases.filter((c) => c.category === 'type-coercion');
    expect(coercionCases.length).toBeGreaterThan(0);
    expect(coercionCases.some((c) => c.inputs.value === '42')).toBe(true);
  });

  it('generates cases for each parameter', () => {
    const cases = generateEdgeCases(sampleFn);

    const valueNullCase = cases.find(
      (c) => c.inputs.value === null && c.category === 'null-input',
    );
    const labelNullCase = cases.find(
      (c) => c.inputs.label === null && c.category === 'null-input',
    );
    expect(valueNullCase).toBeDefined();
    expect(labelNullCase).toBeDefined();
  });

  it('includes overflow cases for numbers', () => {
    const cases = generateEdgeCases(sampleFn);

    const overflowCases = cases.filter((c) => c.category === 'overflow');
    expect(overflowCases.length).toBeGreaterThan(0);
    expect(overflowCases.some((c) => c.inputs.value === Infinity)).toBe(true);
  });

  it('includes special character cases for strings', () => {
    const cases = generateEdgeCases(sampleFn);

    const specialCases = cases.filter((c) => c.category === 'special-chars');
    expect(specialCases.length).toBeGreaterThan(0);
    expect(specialCases.some((c) => typeof c.inputs.label === 'string')).toBe(true);
  });
});
