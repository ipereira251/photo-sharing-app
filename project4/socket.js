// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  withCredentials: true,
  transports: ["websocket"], // optional: force ws in dev
});

export default socket;

