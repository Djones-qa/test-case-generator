import { generateBoundaryValues } from '../../../src/generators/boundary';
import { Parameter } from '../../../src/analysis/parser';

describe('Boundary Value Generator', () => {
  it('generates boundary values for number param', () => {
    const param: Parameter = { name: 'age', type: 'number', optional: false };
    const cases = generateBoundaryValues(param);

    expect(cases.length).toBeGreaterThan(0);
    expect(cases.some((c) => c.category === 'zero')).toBe(true);
    expect(cases.some((c) => c.category === 'max')).toBe(true);
    expect(cases.some((c) => c.category === 'min')).toBe(true);
  });

  it('generates boundary values for string param', () => {
    const param: Parameter = { name: 'name', type: 'string', optional: false };
    const cases = generateBoundaryValues(param);

    expect(cases.length).toBeGreaterThan(0);
    expect(cases.some((c) => c.category === 'empty')).toBe(true);
    expect(cases.some((c) => c.category === 'max')).toBe(true);
  });

  it('generates boundary values for array param', () => {
    const param: Parameter = { name: 'items', type: 'number[]', optional: false };
    const cases = generateBoundaryValues(param);

    expect(cases.length).toBeGreaterThan(0);
    expect(cases.some((c) => c.category === 'empty')).toBe(true);
    expect(cases.some((c) => c.input.items instanceof Array)).toBe(true);
  });

  it('includes zero and negative for numbers', () => {
    const param: Parameter = { name: 'count', type: 'number', optional: false };
    const cases = generateBoundaryValues(param);

    const values = cases.map((c) => c.input.count);
    expect(values).toContain(0);
    expect(values).toContain(-1);
    expect(values).toContain(1);
  });

  it('includes empty and long for strings', () => {
    const param: Parameter = { name: 'text', type: 'string', optional: false };
    const cases = generateBoundaryValues(param);

    const values = cases.map((c) => c.input.text);
    expect(values).toContain('');
    const longStr = values.find((v) => typeof v === 'string' && v.length === 1000);
    expect(longStr).toBeDefined();
  });
});
