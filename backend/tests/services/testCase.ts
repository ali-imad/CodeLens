import { expect } from 'chai';
import { runTests, TestResult } from '../../src/services/testCase';
import mockProblems from '../../src/sampleProblems';
import { ITestCase } from '../../src/models/Problem';

const isPalindromeProblem = mockProblems.find(
  problem => problem.title === 'Palindrome Check',
);
const medianTwoArrsProblem = mockProblems.find(
  problem => problem.title === 'Median of Two Sorted Arrays',
);
const maxRectProblem = mockProblems.find(
  problem => problem.title === 'Container With Most Water',
);
if (!isPalindromeProblem || !medianTwoArrsProblem || !maxRectProblem)
  throw new Error('Test problem(s) not found');

type TestCase = Omit<ITestCase, keyof Document>;

describe('runTests', () => {
  it('should return successful results when function under test passes all test cases', () => {
    const functionUnderTest = 'function swap(a, b) { return [b, a]; }';
    const testCases: TestCase[] = [
      { input: [1, 2], expectedOutput: [2, 1] },
      { input: [2, 3], expectedOutput: [3, 2] },
      { input: [3, 4], expectedOutput: [4, 3] },
    ];

    const expected: TestResult = {
      passed: true,
      feedbackArray: testCases.map(({ input, expectedOutput }) => ({
        input,
        expectedOutput,
        actualOutput: expectedOutput,
        passed: true,
      })),
    };

    const result = runTests(functionUnderTest, testCases as ITestCase[]);
    expect(result).to.deep.equal(expected);
  });

  it('should return unsuccessful results when the function under test fails any test cases', () => {
    const functionUnderTest = 'function swap(a, b) { return [b, a]; }';
    const testCases: TestCase[] = [
      { input: [1, 2], expectedOutput: [2, 1] },
      { input: [2, 3], expectedOutput: [2, 3] }, // Expected output would be [3, 2]
      { input: [3, 4], expectedOutput: [4, 3] },
    ];

    const expected: TestResult = {
      passed: false,
      feedbackArray: [
        {
          input: [1, 2],
          expectedOutput: [2, 1],
          actualOutput: [2, 1],
          passed: true,
        },
        {
          input: [2, 3],
          expectedOutput: [2, 3],
          actualOutput: [3, 2], // Actual output will be 5
          passed: false,
        },
        {
          input: [3, 4],
          expectedOutput: [4, 3],
          actualOutput: [4, 3],
          passed: true,
        },
      ],
    };

    const result = runTests(functionUnderTest, testCases as ITestCase[]);
    expect(result).to.deep.equal(expected);
  });

  it('should return unsuccessful results when function under test throws an error', () => {
    const functionUnderTest = 'throw new Error("Test error")';
    const testCases: TestCase[] = [
      { input: [1, 2], expectedOutput: 3 },
      { input: [2, 3], expectedOutput: 5 },
      { input: [3, 4], expectedOutput: 7 },
    ];

    const expected: TestResult = {
      passed: false,
      feedbackArray: testCases.map(({ input, expectedOutput }) => ({
        input,
        expectedOutput,
        actualOutput: null,
        passed: false,
      })),
    };

    const result = runTests(functionUnderTest, testCases as ITestCase[]);
    expect(result).to.deep.equal(expected);
  });
});

describe('palindrome test-runner check (identical input)', () => {
  isPalindromeProblem.testCases.forEach((testCase: any, index: number) => {
    it(`Test Case #${index + 1}`, () => {
      const result = runTests(isPalindromeProblem.functionBody, [testCase]);
      expect(result).to.exist;
      expect(result.passed).to.equal(true);
      expect(result.feedbackArray).to.exist;
      expect(result.feedbackArray[0]).to.exist;
      // @ts-ignore
      expect(result.feedbackArray[0].passed).to.equal(true);
    });
  });
});

describe('palindrome test-runner check (generated input)', () => {
  isPalindromeProblem.testCases.forEach((testCase: any, index: number) => {
    it(`Test Case #${index + 1}`, () => {
      // simulate generated code
      const fnStr = `
    function isPalindrome(str) {
      str = str.toLowerCase();
      str = str.replace(/[^a-z0-9]/g, '');
      return str === str.split('').reverse().join('');
    }
      `;
      const result = runTests(fnStr, [testCase]);
      expect(result).to.exist;
      expect(result.passed).to.equal(true);
      expect(result.feedbackArray).to.exist;
      expect(result.feedbackArray[0]).to.exist;
      // @ts-ignore
      expect(result.feedbackArray[0].passed).to.equal(true);
    });
  });
});

describe('median test-runner check (identical input)', () => {
  medianTwoArrsProblem.testCases.forEach((testCase: any, index: number) => {
    it(`Test Case #${index + 1}`, () => {
      const result = runTests(medianTwoArrsProblem.functionBody, [testCase]);
      expect(result).to.exist;
      expect(result.passed).to.equal(true);
      expect(result.feedbackArray).to.exist;
      expect(result.feedbackArray[0]).to.exist;
      // @ts-ignore
      expect(result.feedbackArray[0].passed).to.equal(true);
    });
  });
});

describe('max area test-runner check (identical input)', () => {
  maxRectProblem.testCases.forEach((testCase: any, index: number) => {
    it(`Test Case #${index + 1}`, () => {
      const result = runTests(maxRectProblem.functionBody, [testCase]);
      expect(result).to.exist;
      expect(result.passed).to.equal(true);
      expect(result.feedbackArray).to.exist;
      expect(result.feedbackArray[0]).to.exist;
      // @ts-ignore
      expect(result.feedbackArray[0].passed).to.equal(true);
    });
  });
});
