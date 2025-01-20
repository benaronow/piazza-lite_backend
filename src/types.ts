import { Server } from "socket.io";

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {}

export type PiazzaLiteSocket = Server<ServerToClientEvents>;
