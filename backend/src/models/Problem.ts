import mongoose, { Schema, Document } from "mongoose";

export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export interface ITestCase {
  input: any;
  expectedOutput: any;
}

export interface IProblem extends Document {
  title: string;
  difficulty: Difficulty;
  functionBody: string;
  testCases: ITestCase[];
}

const TestCaseSchema: Schema = new Schema({
  input: { type: Schema.Types.Mixed, required: true },
  expectedOutput: { type: Schema.Types.Mixed, required: true },
});

const ProblemSchema: Schema = new Schema<IProblem>({
  title: { type: String, required: true },
  difficulty: { type: String, enum: Object.values(Difficulty), required: true },
  functionBody: { type: String, required: true },
  testCases: [TestCaseSchema],
});

export default mongoose.model<IProblem>("Problem", ProblemSchema);
