import { parseFunctions, FunctionSignature } from '../analysis';
import {
  generateBoundaryValues,
  generateEdgeCases,
  generateEquivalenceClasses,
  generateGherkinScenarios,
  BoundaryCase,
  EdgeCase,
  EquivalencePartition,
} from '../generators';

export interface TestSuite {
  functionName: string;
  boundaryTests: BoundaryCase[];
  edgeCases: EdgeCase[];
  equivalenceClasses: EquivalencePartition[];
  gherkinScenarios: string[];
  totalCases: number;
}

export function generateTestSuite(code: string): TestSuite[] {
  const functions: FunctionSignature[] = parseFunctions(code);
  const suites: TestSuite[] = [];

  for (const fn of functions) {
    const boundaryTests: BoundaryCase[] = [];
    const equivalenceClasses: EquivalencePartition[] = [];

    for (const param of fn.params) {
      boundaryTests.push(...generateBoundaryValues(param));
      equivalenceClasses.push(...generateEquivalenceClasses(param));
    }

    const edgeCases: EdgeCase[] = generateEdgeCases(fn);
    const gherkinScenarios: string[] = generateGherkinScenarios(fn);

    const totalCases =
      boundaryTests.length + edgeCases.length + equivalenceClasses.length + gherkinScenarios.length;

    suites.push({
      functionName: fn.name,
      boundaryTests,
      edgeCases,
      equivalenceClasses,
      gherkinScenarios,
      totalCases,
    });
  }

  return suites;
}
