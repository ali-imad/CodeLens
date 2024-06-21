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

export function runTests(
  generatedFunction: string,
  testCases: ITestCase[]
): TestResult {
  const feedbackArray: TestCaseResult[] = [];

  try {
    const func = new Function("return " + generatedFunction)();

    let allPassed = true;

    testCases.forEach(({ input, expectedOutput }) => {
      const inputArray = Array.isArray(input) ? input : Object.values(input);
      const actualOutput = func.apply(null, inputArray);
      const passed =
        JSON.stringify(actualOutput) === JSON.stringify(expectedOutput);

      feedbackArray.push({
        input: input,
        expectedOutput: expectedOutput,
        actualOutput,
        passed,
      });

      if (!passed) {
        allPassed = false;
      }
    });

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
