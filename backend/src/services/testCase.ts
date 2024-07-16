import { ITestCase } from '../models/Problem';
import { cleanCode } from '../utils/codeGen';

export interface TestCaseResult {
  input: any[] | object;
  expectedOutput: any;
  actualOutput: any;
  passed: boolean;
}

export interface TestResult {
  passed: boolean;
  feedbackArray: TestCaseResult[];
}

export function runTests(fnStr: string, testCases: ITestCase[]): TestResult {
  if (testCases.length === 0 || typeof testCases[0] === 'undefined')
    throw new Error('No test cases provided');
  try {
    const feedbackArray: TestCaseResult[] = []; // array to store feedback for each test case
    // save the passed in function string to a file
    fnStr = cleanCode(fnStr);

    let allPassed = true; // flag to check if all test cases passed

    // create a new function from the function string
    const func = new Function('return ' + fnStr)();

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
    console.error('Error running tests:', error);
    return {
      passed: false,
      feedbackArray: testCases.map(testCase => ({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: null,
        passed: false,
      })),
    };
  }
}
