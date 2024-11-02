import axios from "axios";

export const api = axios.create({
  baseURL: "https://fccf-221-149-135-202.ngrok-free.app",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
