import { generateEquivalenceClasses } from '../../../src/generators/equivalence';
import { Parameter } from '../../../src/analysis/parser';

describe('Equivalence Partitioning Generator', () => {
  it('generates valid and invalid classes for number', () => {
    const param: Parameter = { name: 'price', type: 'number', optional: false };
    const classes = generateEquivalenceClasses(param);

    const validClasses = classes.filter((c) => c.isValid);
    const invalidClasses = classes.filter((c) => !c.isValid);

    expect(validClasses.length).toBeGreaterThan(0);
    expect(invalidClasses.length).toBeGreaterThan(0);
  });

  it('generates valid and invalid classes for string', () => {
    const param: Parameter = { name: 'username', type: 'string', optional: false };
    const classes = generateEquivalenceClasses(param);

    const validClasses = classes.filter((c) => c.isValid);
    const invalidClasses = classes.filter((c) => !c.isValid);

    expect(validClasses.length).toBeGreaterThan(0);
    expect(invalidClasses.length).toBeGreaterThan(0);
  });

  it('marks invalid classes correctly', () => {
    const param: Parameter = { name: 'count', type: 'number', optional: false };
    const classes = generateEquivalenceClasses(param);

    const invalidClasses = classes.filter((c) => !c.isValid);
    expect(invalidClasses.every((c) => c.isValid === false)).toBe(true);
    expect(invalidClasses.some((c) => c.className === 'nan-value')).toBe(true);
  });

  it('provides representative values', () => {
    const param: Parameter = { name: 'amount', type: 'number', optional: false };
    const classes = generateEquivalenceClasses(param);

    for (const cls of classes) {
      expect(cls.representative !== undefined || cls.className === 'undefined-value').toBe(true);
      expect(cls.description.length).toBeGreaterThan(0);
    }
  });

  it('handles boolean type', () => {
    const param: Parameter = { name: 'isActive', type: 'boolean', optional: false };
    const classes = generateEquivalenceClasses(param);

    expect(classes.length).toBe(3);
    expect(classes.some((c) => c.representative === true)).toBe(true);
    expect(classes.some((c) => c.representative === false)).toBe(true);
    expect(classes.some((c) => !c.isValid)).toBe(true);
  });
});
