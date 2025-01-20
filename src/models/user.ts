import mongoose, { Model } from "mongoose";
import userSchema from "./schema/user";
import { User } from "../types";

const UserModel: Model<User> =
  mongoose.models.User || mongoose.model<User>("User", userSchema);

export default UserModel;
