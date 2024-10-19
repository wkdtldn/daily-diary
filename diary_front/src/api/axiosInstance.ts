import axios from "axios";

export const api = axios.create({
  baseURL: "https://3ea6-106-240-132-18.ngrok-free.app",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
