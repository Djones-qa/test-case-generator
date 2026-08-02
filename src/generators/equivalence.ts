import { Parameter } from '../analysis';

export interface EquivalencePartition {
  className: string;
  description: string;
  representative: unknown;
  isValid: boolean;
}

export function generateEquivalenceClasses(param: Parameter): EquivalencePartition[] {
  const classes: EquivalencePartition[] = [];
  const type = param.type.toLowerCase();

  if (type === 'number') {
    classes.push(
      {
        className: 'negative-numbers',
        description: `${param.name} is a negative number`,
        representative: -5,
        isValid: true,
      },
      {
        className: 'zero',
        description: `${param.name} is zero`,
        representative: 0,
        isValid: true,
      },
      {
        className: 'positive-numbers',
        description: `${param.name} is a positive number`,
        representative: 42,
        isValid: true,
      },
      {
        className: 'nan-value',
        description: `${param.name} is NaN`,
        representative: NaN,
        isValid: false,
      },
      {
        className: 'undefined-value',
        description: `${param.name} is undefined`,
        representative: undefined,
        isValid: false,
      },
    );
  } else if (type === 'string') {
    classes.push(
      {
        className: 'empty-string',
        description: `${param.name} is an empty string`,
        representative: '',
        isValid: true,
      },
      {
        className: 'short-string',
        description: `${param.name} is a short string (1-10 chars)`,
        representative: 'hello',
        isValid: true,
      },
      {
        className: 'medium-string',
        description: `${param.name} is a medium string (11-100 chars)`,
        representative: 'a'.repeat(50),
        isValid: true,
      },
      {
        className: 'long-string',
        description: `${param.name} is a long string (100+ chars)`,
        representative: 'a'.repeat(200),
        isValid: true,
      },
      {
        className: 'special-characters',
        description: `${param.name} contains special characters`,
        representative: '!@#$%^&*()_+-=[]{}|;:,.<>?',
        isValid: true,
      },
      {
        className: 'non-string-value',
        description: `${param.name} is not a string (number given)`,
        representative: 123,
        isValid: false,
      },
    );
  } else if (type === 'boolean') {
    classes.push(
      {
        className: 'true-value',
        description: `${param.name} is true`,
        representative: true,
        isValid: true,
      },
      {
        className: 'false-value',
        description: `${param.name} is false`,
        representative: false,
        isValid: true,
      },
      {
        className: 'non-boolean-value',
        description: `${param.name} is not a boolean (string given)`,
        representative: 'true',
        isValid: false,
      },
    );
  } else if (type.includes('array') || type.includes('[]')) {
    classes.push(
      {
        className: 'empty-array',
        description: `${param.name} is an empty array`,
        representative: [],
        isValid: true,
      },
      {
        className: 'single-element',
        description: `${param.name} has one element`,
        representative: [1],
        isValid: true,
      },
      {
        className: 'multiple-elements',
        description: `${param.name} has multiple elements`,
        representative: [1, 2, 3, 4, 5],
        isValid: true,
      },
      {
        className: 'non-array-value',
        description: `${param.name} is not an array`,
        representative: 'not-an-array',
        isValid: false,
      },
    );
  }

  return classes;
}
