import { api } from "./axiosInstance";

export const userSearch = async (username: string) => {
  const res = await api.get(`/api/user/${username}`);
  return res.data;
};

export const check_auth = async () => {
  const res = await api.get("/api/user/");
  if (res.status === 200) {
    return { status: true, user: res.data };
  } else {
    return { status: false };
  }
};
