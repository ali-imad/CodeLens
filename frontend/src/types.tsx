/* eslint-disable @typescript-eslint/no-explicit-any */
export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export interface ITestCase {
  input: any;
  expectedOutput: any;
}

export interface IProblem extends Document {
  _id?: string;
  title: string;
  difficulty: Difficulty;
  functionBody: string;
  testCases: ITestCase[];
  hints: string[];
}

export enum Verdict {
  Passed = 'Passed',
  Failed = 'Failed',
  Error = 'Error',
}

export interface TestCaseResult {
  input: any[];
  expectedOutput: any;
  actualOutput: any;
  passed: Verdict;
}

export enum ProblemStatus {
  NotAttempted = 'Not Attempted',
  Error = 'Error',
  Attempted = 'Attempted',
  Completed = 'Completed',
}
