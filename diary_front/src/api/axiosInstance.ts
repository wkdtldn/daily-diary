import axios from "axios";

export const api = axios.create({
  baseURL: "https://db90-121-135-218-25.ngrok-free.app",
  withCredentials: true,
});
