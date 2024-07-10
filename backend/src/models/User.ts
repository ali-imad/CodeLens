import { Schema, Document, model, Types } from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_DIGIT = 10;

export interface IUser extends Document {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  instructor?: Types.ObjectId;
  assignedProblems: Types.ObjectId[];
  attemptedProblems: Types.ObjectId[];
  completedProblems: Types.ObjectId[];
}

export enum UserRole {
  Instructor = 'Instructor',
  Student = 'Student',
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true, unique: false },
  lastName: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), required: true },
  instructor: { type: Schema.Types.ObjectId, ref: 'User' },
  assignedProblems: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
  attemptedProblems: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
  completedProblems: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
});

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(SALT_DIGIT);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods['comparePassword'] = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this['password']);
};

export const User = model<IUser>('User', UserSchema);
