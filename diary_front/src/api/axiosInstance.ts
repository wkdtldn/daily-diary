import axios from "axios";

export const api = axios.create({
  baseURL: "https://431a-49-169-117-4.ngrok-free.app",
  withCredentials: true,
});
