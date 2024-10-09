import { Document, Schema, model } from "mongoose";
export interface IUser extends Document {
  email: string;
  name?: string;
  password?: string;
}
const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    name: { type: String, default: "" },
    password: { type: String, default: "" },
  },
  { timestamps: true }
);
export const UserModel = model<IUser>("user", UserSchema);
