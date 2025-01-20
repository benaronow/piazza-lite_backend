import { Request } from "express";
import { ObjectId } from "mongodb";
import { Server } from "socket.io";

export interface ServerToClientEvents {
  userUpdate: (uid: string) => void;
}

export type PiazzaLiteSocket = Server<ServerToClientEvents>;

export interface User {
  _id?: ObjectId;
  username: string;
  password: string;
}

export type UserResponse = User | { error: string };

export type UsersResponse = User[] | { error: string };

export interface SignupUserRequest extends Request {
  body: User;
}

export interface LoginUserRequest extends Request {
  body: {
    username: string;
    password: string;
    uid: string;
  };
}

export interface DeleteUserRequest extends Request {
  query: {
    uid: string;
  };
}
