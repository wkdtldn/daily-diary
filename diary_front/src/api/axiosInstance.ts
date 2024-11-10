import axios from "axios";

// export const fetchDefaults = {
//   url: "https://3a53-221-149-135-202.ngrok-free.app",
//   headers: {},
// };

export const api = axios.create({
  baseURL: "https://7ab7-221-149-135-202.ngrok-free.app",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
