import { User, UserResponse } from "../types";
import UserModel from "./user";

export const findUser = async (
  id: string,
  type: "id" | "username"
): Promise<UserResponse> => {
  try {
    let result = null;
    if (type === "id") {
      result = await UserModel.findOne({ _id: id });
    } else if (type === "username") {
      result = await UserModel.findOne({ username: id });
    }
    if (result === null) {
      throw new Error("User not found");
    }
    return result;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "User not found") {
        return { error: "User not found" };
      }
      return { error: "Error when fetching user" };
    }
    return { error: "Error when fetching user" };
  }
};

export const signupUser = async (user: User): Promise<UserResponse> => {
  try {
    const newUser = await UserModel.create(user);
    return newUser;
  } catch (error) {
    return { error: "Error when saving a user" };
  }
};

export const loginUser = async (
  username: string,
  password: string
): Promise<UserResponse> => {
  try {
    const result = await UserModel.findOne({ username, password });
    if (result === null) {
      throw new Error("User not found");
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if ((error as Error).message === "User not found") {
        return { error: `Invalid username or password` };
      }
      return { error: "Error when fetching user" };
    }
    return { error: "Error when fetching user" };
  }
};

export const deleteUser = async (uid: string) => {
  try {
    const user = await UserModel.findOne({ _id: uid });
    if (!user) {
      throw new Error("User not found");
    } else {
      const result = await UserModel.deleteOne({ _id: uid });
      if (result.deletedCount === 0) {
        throw new Error("Error when deleting user");
      }
    }
    return { msg: "User deleted successfully" };
  } catch (error) {
    return { error: "Error when deleting user" };
  }
};
