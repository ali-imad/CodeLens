import { expect } from 'chai';
import { getLanguage, Language } from '../../src/utils/codeGen';
import { transpile } from 'typescript';
import mockProblems from '../../src/sampleProblems';

const isPalindromeProblem = mockProblems.find(
  problem => problem.title === 'Palindrome Check',
);
if (!isPalindromeProblem) throw new Error('isPalindrome problem not found');

describe('getLanguage', () => {
  it('should return TypeScript if the function string contains type hinting', () => {
    const functionString =
      'function add(a: number, b: number): number { return a + b; }';
    expect(getLanguage(functionString)).to.equal(Language.TypeScript);
  });
  it('should return JavaScript if the function string does not contain type hinting', () => {
    const functionString = 'function add(a, b) { return a + b; }';
    expect(getLanguage(functionString)).to.equal(Language.JavaScript);
  });
  it('should return TypeScript if the function string contains type hinting in the return type', () => {
    const functionString = 'function add(a, b): number { return a + b; }';
    expect(getLanguage(functionString)).to.equal(Language.TypeScript);
  });
  it('should return TypeScript if the passed in function is Palindrome Check', () => {
    const functionString = isPalindromeProblem.functionBody;
    expect(getLanguage(functionString)).to.equal(Language.TypeScript);
  });
});

describe('transpile', () => {
  it('should transpile TypeScript to JavaScript', () => {
    const tsCode =
      'function add(a: number, b: number): number { return a + b; }';
    let expected = 'function add(a, b) {\n    return a + b' + ';\n}\n';
    let actual = transpile(tsCode);
    // strip out newlines and whitespace
    expected = expected.replace(/\s/g, '');
    actual = actual.replace(/\s/g, '');
    expect(actual).to.equal(expected);
  });
});
