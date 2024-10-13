import axios from "axios";

export const api = axios.create({
  baseURL: "https://7f73-49-169-117-4.ngrok-free.app",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
