import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.40.8:8000/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
