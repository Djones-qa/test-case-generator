import { parseFunctions } from '../../../src/analysis/parser';

describe('Function Parser', () => {
  it('parses named function with params', () => {
    const code = `function add(a: number, b: number): number { return a + b; }`;
    const result = parseFunctions(code);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('add');
    expect(result[0].params).toHaveLength(2);
    expect(result[0].params[0]).toEqual({ name: 'a', type: 'number', optional: false });
    expect(result[0].params[1]).toEqual({ name: 'b', type: 'number', optional: false });
    expect(result[0].returnType).toBe('number');
    expect(result[0].hasAsync).toBe(false);
  });

  it('parses arrow function', () => {
    const code = `const multiply = (x: number, y: number): number => x * y;`;
    const result = parseFunctions(code);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('multiply');
    expect(result[0].params).toHaveLength(2);
    expect(result[0].returnType).toBe('number');
    expect(result[0].hasAsync).toBe(false);
  });

  it('parses async function', () => {
    const code = `async function fetchData(url: string): Promise { return fetch(url); }`;
    const result = parseFunctions(code);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('fetchData');
    expect(result[0].hasAsync).toBe(true);
    expect(result[0].params[0].type).toBe('string');
  });

  it('detects optional parameters', () => {
    const code = `function greet(name: string, greeting?: string): string { return greeting + name; }`;
    const result = parseFunctions(code);

    expect(result).toHaveLength(1);
    expect(result[0].params[0].optional).toBe(false);
    expect(result[0].params[1].optional).toBe(true);
  });

  it('handles multiple functions', () => {
    const code = `
      function first(a: number): number { return a; }
      function second(b: string): string { return b; }
      const third = (c: boolean): boolean => !c;
    `;
    const result = parseFunctions(code);

    expect(result).toHaveLength(3);
    expect(result[0].name).toBe('first');
    expect(result[1].name).toBe('second');
    expect(result[2].name).toBe('third');
  });
});
