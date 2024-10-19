import { useRecoilState } from "recoil";
import { api } from "./axiosInstance";
import { userState } from "../hooks/recoil/userState";

export const fetchCookies = async () => {
  const res = await api.get("/api/token/csrf/");
  return res.data.csrftoken;
};
