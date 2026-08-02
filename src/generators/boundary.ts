import { Parameter } from '../analysis';

export interface BoundaryCase {
  description: string;
  input: Record<string, unknown>;
  category: 'min' | 'max' | 'just-below' | 'just-above' | 'zero' | 'empty' | 'null';
}

export function generateBoundaryValues(param: Parameter): BoundaryCase[] {
  const cases: BoundaryCase[] = [];
  const type = param.type.toLowerCase();

  if (type === 'number') {
    cases.push(
      {
        description: `${param.name} at zero`,
        input: { [param.name]: 0 },
        category: 'zero',
      },
      {
        description: `${param.name} at negative one (just below zero)`,
        input: { [param.name]: -1 },
        category: 'just-below',
      },
      {
        description: `${param.name} at positive one (just above zero)`,
        input: { [param.name]: 1 },
        category: 'just-above',
      },
      {
        description: `${param.name} at MAX_SAFE_INTEGER`,
        input: { [param.name]: Number.MAX_SAFE_INTEGER },
        category: 'max',
      },
      {
        description: `${param.name} at MIN_SAFE_INTEGER`,
        input: { [param.name]: Number.MIN_SAFE_INTEGER },
        category: 'min',
      },
      {
        description: `${param.name} as NaN`,
        input: { [param.name]: NaN },
        category: 'null',
      },
    );
  } else if (type === 'string') {
    cases.push(
      {
        description: `${param.name} as empty string`,
        input: { [param.name]: '' },
        category: 'empty',
      },
      {
        description: `${param.name} as single character`,
        input: { [param.name]: 'a' },
        category: 'just-above',
      },
      {
        description: `${param.name} as very long string (1000 chars)`,
        input: { [param.name]: 'a'.repeat(1000) },
        category: 'max',
      },
      {
        description: `${param.name} with special characters`,
        input: { [param.name]: '<script>alert("xss")</script>&\'"\\n\\t' },
        category: 'null',
      },
    );
  } else if (type.includes('array') || type.includes('[]')) {
    cases.push(
      {
        description: `${param.name} as empty array`,
        input: { [param.name]: [] },
        category: 'empty',
      },
      {
        description: `${param.name} with single element`,
        input: { [param.name]: [1] },
        category: 'just-above',
      },
      {
        description: `${param.name} with large array (1000 elements)`,
        input: { [param.name]: Array.from({ length: 1000 }, (_, i) => i) },
        category: 'max',
      },
    );
  } else if (type === 'boolean') {
    cases.push(
      {
        description: `${param.name} as true`,
        input: { [param.name]: true },
        category: 'max',
      },
      {
        description: `${param.name} as false`,
        input: { [param.name]: false },
        category: 'min',
      },
    );
  }

  return cases;
}
