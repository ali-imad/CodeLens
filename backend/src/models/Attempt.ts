import mongoose, { Schema, Document } from "mongoose";

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

export default mongoose.model<IAttempt>("Attempt", AttemptSchema);
