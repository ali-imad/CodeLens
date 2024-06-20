import mongoose, { Schema, Document } from "mongoose";
import Problem from "./Problem";
import { User } from "./User";
export interface IAttempt extends Document {
  problemId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  description: string;
  generatedCode: string;
  feedback: string;
  isPassed: boolean;
  createdAt: Date;
}

const AttemptSchema: Schema = new Schema<IAttempt>({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  generatedCode: { type: String },
  feedback: { type: String },
  isPassed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to validate userId and problemId
AttemptSchema.pre<IAttempt>("save", async function (next) {
  try {
    const problem = await Problem.findById(this.problemId);
    const user = await User.findById(this.userId);

    if (!problem) {
      throw new Error("Invalid problemId: problem does not exist");
    }

    if (!user) {
      throw new Error("Invalid userId: user does not exist");
    }

    next();
  } catch (error: any) {
    next(error);
  }
});

export default mongoose.model<IAttempt>("Attempt", AttemptSchema);
