import axios from "axios";

export const api = axios.create({
  baseURL: "http://3.35.156.41:8000/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
