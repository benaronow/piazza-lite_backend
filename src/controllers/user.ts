import express, { Response } from "express";
import {
  SignupUserRequest,
  PiazzaLiteSocket,
  User,
  LoginUserRequest,
  DeleteUserRequest,
} from "../types";
import {
  deleteUser,
  findUser,
  loginUser,
  signupUser,
} from "../models/application";

export const userController = (socket: PiazzaLiteSocket) => {
  const router = express.Router();

  const isUserValid = (user: User): boolean =>
    user.username !== "" && user.password !== "";

  const signupUserEndpoint = async (
    req: SignupUserRequest,
    res: Response
  ): Promise<void> => {
    if (!isUserValid(req.body)) {
      res.status(400).send("Invalid user data");
      return;
    }

    const user: User = req.body;
    try {
      const existingUser = await findUser(user.username, "username");
      if (!("error" in existingUser)) {
        res.status(409).send("User already exists");
        return;
      }

      const result = await signupUser(user);
      if ("error" in result) {
        throw new Error(result.error);
      }

      socket.emit("userUpdate", user._id?.toString() || "");
      res.status(200).json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving user: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving user`);
      }
    }
  };

  const loginUserEndpoint = async (
    req: LoginUserRequest,
    res: Response
  ): Promise<void> => {
    if (!req.body.username || !req.body.password) {
      res.status(400).send("Invalid request");
      return;
    }
    try {
      const { username, password } = req.body;
      const user = await loginUser(username, password);
      if ("error" in user) {
        if (user.error === "Invalid username or password") {
          res.status(404).send(user.error);
          return;
        }
        throw new Error(user.error);
      }

      res.status(200).json(user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when getting user: ${err.message}`);
      } else {
        res.status(500).send(`Error when getting user`);
      }
    }
  };

  const deleteUserEndpoint = async (
    req: DeleteUserRequest,
    res: Response
  ): Promise<void> => {
    const { uid } = req.query;

    if (!uid || typeof uid !== "string") {
      res.status(400).send("Invalid request: uid is required");
      return;
    }

    try {
      const result = await deleteUser(uid);
      if ("error" in result) {
        throw new Error(result.error);
      }
      res.status(200).json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when deleting user: ${err.message}`);
      } else {
        res.status(500).send("Error when deleting user");
      }
    }
  };

  router.post("/signupUser", signupUserEndpoint);
  router.post("/loginUser", loginUserEndpoint);
  router.delete("/deleteUser", deleteUserEndpoint);
  return router;
};
