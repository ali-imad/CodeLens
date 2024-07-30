import { expect } from 'chai';
import {
  getLanguage,
  Language,
  cleanGenCodeNoToken,
  cleanGenCodeWithToken,
  START_TOKEN,
  END_TOKEN,
} from '../../src/utils/codeGen';
import { transpile } from 'typescript';
import mockProblems from '../../src/sampleProblems';
import 'mocha';

const getPalindromeProblem = () => {
  const isPalindromeProblem = mockProblems.find(
    problem => problem.title === 'Palindrome Check',
  );
  if (!isPalindromeProblem) throw new Error('isPalindrome problem not found');
  return isPalindromeProblem;
};

describe('Testing cleaning of generated code', () => {
  it('Should clean the generated code with no taken and return it', () => {
    const generatedCode = `
      // This is a comment
      // Another comment
      function myFunction() {
        console.log('Hello World');
        }
      // End of code
    `;

    const expectedCleanCode = `
    function myFunction() {
        console.log('Hello World');
  `.trim();

    const cleanCode = cleanGenCodeNoToken(generatedCode).trim();
    expect(cleanCode).to.equal(expectedCleanCode);
  });

  it('Should clean the generated code with with token and return it', () => {
    const generatedCode = `
      // This is a comment
      // Another comment
      [[[START]]] function myFunction() {
        console.log('Hello World');
        [[[END]]]
        }
      // End of code
    `;

    const expectedCleanCode = `
    function myFunction() {
        console.log('Hello World');
  `.trim();

    const cleanCode = cleanGenCodeWithToken(
      generatedCode,
      START_TOKEN,
      END_TOKEN,
    ).trim();

    expect(cleanCode).to.equal(expectedCleanCode);
  });
});

describe('Problem loading', () => {
  it('should throw an error if the isPalindrome problem is not found', () => {
    const originalMockProblems = [...mockProblems];

    mockProblems.length = 0;

    expect(() => getPalindromeProblem()).to.throw(
      'isPalindrome problem not found',
    );

    mockProblems.push(...originalMockProblems);
  });

  it('should not throw an error if the isPalindrome problem is found', () => {
    expect(() => getPalindromeProblem()).not.to.throw();
  });
});

describe('getLanguage', () => {
  const isPalindromeProblem = getPalindromeProblem();

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
    expected = expected.replace(/\s/g, '');
    actual = actual.replace(/\s/g, '');
    expect(actual).to.equal(expected);
  });
});
