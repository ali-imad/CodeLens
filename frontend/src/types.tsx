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
}

export interface TestCaseResult {
  input: any[];
  expectedOutput: any;
  actualOutput: any;
  passed: boolean;
}

export enum ProblemStatus {
  NotAttempted = 'Not Attempted',
  Attempted = 'Attempted',
  Completed = 'Completed',
}
