import mongoose, { Schema, Document } from "mongoose";

export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export interface IProblem extends Document {
  title: string;
  difficulty: Difficulty;
  functionBody: string;
}

const ProblemSchema: Schema = new Schema<IProblem>({
  title: { type: String, required: true },
  difficulty: { type: String, enum: Object.values(Difficulty), required: true },
  functionBody: { type: String, required: true },
});

export default mongoose.model<IProblem>("Problem", ProblemSchema);
