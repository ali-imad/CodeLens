import { ITestCase } from "../models/Problem";

export interface TestCaseResult {
  input: any[];
  expectedOutput: any;
  actualOutput: any;
  passed: boolean;
}

export interface TestResult {
  passed: boolean;
  feedbackArray: TestCaseResult[];
}

// TODO: Implement the runTests function CORRECTLY

export function runTests(
  generatedFunction: string,
  testCases: ITestCase[]
): TestResult {
  const feedbackArray: TestCaseResult[] = [];

  try {
    const func = new Function("return " + generatedFunction)();
    console.log(func);
    let allPassed = true;

    for (const testCase of testCases) {
      const actualOutput = func(...testCase.input);
      const passed = actualOutput === testCase.expectedOutput;

      feedbackArray.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput,
        passed,
      });

      if (!passed) {
        allPassed = false;
      }
    }

    return { passed: allPassed, feedbackArray };
  } catch (error) {
    return {
      passed: false,
      feedbackArray: testCases.map((testCase) => ({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: null,
        passed: false,
      })),
    };
  }
}
