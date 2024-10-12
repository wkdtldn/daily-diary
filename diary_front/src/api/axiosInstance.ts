import axios from "axios";

export const api = axios.create({
  baseURL: "https://c576-121-135-218-25.ngrok-free.app",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
