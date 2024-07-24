import mongoose, { Schema, Document } from 'mongoose';
import Problem from './Problem';
import { TestCaseResult, Verdict } from '../services/testCase';
import { User } from './User';

export interface IAttempt extends Document {
  problemId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  description: string;
  generatedCode: string;
  feedback: TestCaseResult[];
  isPassed: Verdict;
  createdAt: Date;
  updateUserProgress: () => Promise<void>;
}

const AttemptSchema: Schema = new Schema<IAttempt>({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  generatedCode: { type: String },
  feedback: [
    {
      input: { type: [Schema.Types.Mixed], required: true },
      expectedOutput: { type: Schema.Types.Mixed, required: true },
      actualOutput: { type: Schema.Types.Mixed },
      passed: { type: String, required: true },
    },
  ],
  isPassed: { type: String, default: Verdict.Failed },
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to validate userId and problemId
AttemptSchema.pre<IAttempt>('save', async function (next) {
  try {
    const problem = await Problem.findById(this.problemId);
    const user = await User.findById(this.userId);

    if (!problem) {
      throw new Error('Invalid problemId: problem does not exist');
    }

    if (!user) {
      throw new Error('Invalid userId: user does not exist');
    }

    next();
  } catch (error: any) {
    next(error);
  }
});

// @ts-ignore
AttemptSchema.methods['updateUserProgress'] = async function () {
  const user: any = await User.findById(this['userId']);
  if (!user) throw new Error('User not found');

  if (!user.attemptedProblems.includes(this['problemId'])) {
    user.attemptedProblems.push(this['problemId']);
  }

  if (
    this['isPassed'] === Verdict.Passed &&
    !user.completedProblems.includes(this['problemId'])
  ) {
    user.completedProblems.push(this['problemId']);
  }

  await user.save();
};

export default mongoose.model<IAttempt>('Attempt', AttemptSchema);
