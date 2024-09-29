import { api } from "./axiosInstance";

export const fetchCookies = async () => {
  const res = await api.get("/api/token/csrf/");
  alert(res.data);
  return res.data.csrftoken;
};
