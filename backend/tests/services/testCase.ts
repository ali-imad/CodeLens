import { expect } from 'chai';
import { runTests, TestResult, Verdict } from '../../src/services/testCase';
import mockProblems from '../../src/sampleProblems';
import { ITestCase } from '../../src/models/Problem';
import 'mocha';

const getProblems = () => {
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

  return { isPalindromeProblem, medianTwoArrsProblem, maxRectProblem };
};

type TestCase = Omit<ITestCase, keyof Document>;

describe('Problem loading', () => {
  it('should throw an error if any test problem is not found', () => {
    const originalMockProblems = [...mockProblems];

    mockProblems.length = 0;

    expect(() => getProblems()).to.throw('Test problem(s) not found');

    mockProblems.push(...originalMockProblems);
  });

  it('should not throw an error if all test problems are found', () => {
    expect(() => getProblems()).not.to.throw();
  });
});

describe('runTests', () => {
  const { isPalindromeProblem, medianTwoArrsProblem, maxRectProblem } =
    getProblems();

  it('should return successful results when function under test passes all test cases', () => {
    const functionUnderTest = 'function swap(a, b) { return [b, a]; }';
    const testCases: TestCase[] = [
      { input: [1, 2], expectedOutput: [2, 1] },
      { input: [2, 3], expectedOutput: [3, 2] },
      { input: [3, 4], expectedOutput: [4, 3] },
    ];

    const expected: TestResult = {
      passed: Verdict.Passed,
      feedbackArray: testCases.map(({ input, expectedOutput }) => ({
        input,
        expectedOutput,
        actualOutput: expectedOutput,
        passed: Verdict.Passed,
      })),
    };

    const result = runTests(functionUnderTest, testCases as ITestCase[]);
    expect(result).to.deep.equal(expected);
  });

  it('SHould return error when no test cases in problem', () => {
    const functionUnderTest = 'function swap(a, b) { return [b, a]; }';
    const testCases: TestCase[] = [];
    try {
      runTests(functionUnderTest, testCases as ITestCase[]);
    } catch (error: any) {
      expect(error.message).to.equal('No test cases provided');
    }
  });

  it('should return unsuccessful results when the function under test fails any test cases', () => {
    const functionUnderTest = 'function swap(a, b) { return [b, a]; }';
    const testCases: TestCase[] = [
      { input: [1, 2], expectedOutput: [2, 1] },
      { input: [2, 3], expectedOutput: [2, 3] },
      { input: [3, 4], expectedOutput: [4, 3] },
    ];

    const expected: TestResult = {
      passed: Verdict.Failed,
      feedbackArray: [
        {
          input: [1, 2],
          expectedOutput: [2, 1],
          actualOutput: [2, 1],
          passed: Verdict.Passed,
        },
        {
          input: [2, 3],
          expectedOutput: [2, 3],
          actualOutput: [3, 2],
          passed: Verdict.Failed,
        },
        {
          input: [3, 4],
          expectedOutput: [4, 3],
          actualOutput: [4, 3],
          passed: Verdict.Passed,
        },
      ],
    };

    const result = runTests(functionUnderTest, testCases as ITestCase[]);
    expect(result).to.deep.equal(expected);
  });

  it('should return invalid verdict when function under test throws an error', () => {
    const functionUnderTest = 'throw new Error("Test error")';
    const testCases: TestCase[] = [
      { input: [1, 2], expectedOutput: 3 },
      { input: [2, 3], expectedOutput: 5 },
      { input: [3, 4], expectedOutput: 7 },
    ];

    const expected: TestResult = {
      passed: Verdict.Error,
      feedbackArray: testCases.map(({ input, expectedOutput }) => ({
        input,
        expectedOutput,
        actualOutput: null,
        passed: Verdict.Error,
      })),
    };

    const result = runTests(functionUnderTest, testCases as ITestCase[]);
    expect(result).to.deep.equal(expected);
  });
});

describe('palindrome test-runner check (identical input)', () => {
  const { isPalindromeProblem } = getProblems();
  isPalindromeProblem.testCases.forEach((testCase: any, index: number) => {
    it(`Test Case #${index + 1}`, () => {
      const result = runTests(isPalindromeProblem.functionBody, [testCase]);
      expect(result).to.exist;
      expect(result.passed).to.equal(Verdict.Passed);
      expect(result.feedbackArray).to.exist;
      expect(result.feedbackArray[0]).to.exist;
      // @ts-ignore
      expect(result.feedbackArray[0].passed).to.equal(Verdict.Passed);
    });
  });
});

describe('palindrome test-runner check (generated input)', () => {
  const { isPalindromeProblem } = getProblems();
  isPalindromeProblem.testCases.forEach((testCase: any, index: number) => {
    it(`Test Case #${index + 1}`, () => {
      const fnStr = `
    function isPalindrome(str) {
      str = str.toLowerCase();
      str = str.replace(/[^a-z0-9]/g, '');
      return str === str.split('').reverse().join('');
    }
      `;
      const result = runTests(fnStr, [testCase]);
      expect(result).to.exist;
      expect(result.passed).to.equal(Verdict.Passed);
      expect(result.feedbackArray).to.exist;
      expect(result.feedbackArray[0]).to.exist;
      // @ts-ignore
      expect(result.feedbackArray[0].passed).to.equal(Verdict.Passed);
    });
  });
});

describe('median test-runner check (identical input)', () => {
  const { medianTwoArrsProblem } = getProblems();
  medianTwoArrsProblem.testCases.forEach((testCase: any, index: number) => {
    it(`Test Case #${index + 1}`, () => {
      const result = runTests(medianTwoArrsProblem.functionBody, [testCase]);
      expect(result).to.exist;
      expect(result.passed).to.equal(Verdict.Passed);
      expect(result.feedbackArray).to.exist;
      expect(result.feedbackArray[0]).to.exist;
      // @ts-ignore
      expect(result.feedbackArray[0].passed).to.equal(Verdict.Passed);
    });
  });
});

describe('max area test-runner check (identical input)', () => {
  const { maxRectProblem } = getProblems();
  maxRectProblem.testCases.forEach((testCase: any, index: number) => {
    it(`Test Case #${index + 1}`, () => {
      const result = runTests(maxRectProblem.functionBody, [testCase]);
      expect(result).to.exist;
      expect(result.passed).to.equal(Verdict.Passed);
      expect(result.feedbackArray).to.exist;
      expect(result.feedbackArray[0]).to.exist;
      // @ts-ignore
      expect(result.feedbackArray[0].passed).to.equal(Verdict.Passed);
    });
  });
});
