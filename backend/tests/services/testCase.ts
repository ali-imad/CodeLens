import { expect } from 'chai';
import { runTests, TestResult } from '../../src/services/testCase'

describe('runTests', () => {
  it('should return successful results when function under test passes all test cases', () => {
    const functionUnderTest = 'function(a, b) { return [b, a]; }';
    const testCases = [
      { input: [1, 2], expectedOutput: [2, 1] },
      { input: [2, 3], expectedOutput: [3, 2] },
      { input: [3, 4], expectedOutput: [4, 3] }
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

    const result = runTests(functionUnderTest, testCases);
    expect(result).to.deep.equal(expected);
  });

  it('should return unsuccessful results when the function under test fails any test cases', () => {
    const functionUnderTest = 'function(a, b) { return [b, a]; }';
    const testCases = [
      { input: [1, 2], expectedOutput: [2, 1] },
      { input: [2, 3], expectedOutput: [2, 3] }, // Expected output would be [3, 2]
      { input: [3, 4], expectedOutput: [4, 3] }
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

    const result = runTests(functionUnderTest, testCases);
    expect(result).to.deep.equal(expected);
  });

  it('should return unsuccessful results when function under test throws an error', () => {
    const functionUnderTest = 'throw new Error("Test error")';
    const testCases = [
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

    const result = runTests(functionUnderTest, testCases);
    expect(result).to.deep.equal(expected);
  });
});