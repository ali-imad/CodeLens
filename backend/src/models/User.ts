import { Schema, Document, model } from "mongoose";
import bcrypt from "bcrypt";

const SALT_DIGIT = 10;

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(SALT_DIGIT);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods["comparePassword"] = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this["password"]);
};

export const User = model<IUser>("User", UserSchema);
