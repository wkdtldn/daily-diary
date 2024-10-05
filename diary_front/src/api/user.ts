import { fetchCookies } from "./token";
import { api } from "./axiosInstance";

export const userSearch = async (username: string) => {
  const csrfToken = await fetchCookies();

  const res = await api.get(`/api/user/${username}`, {
    headers: {
      "X-CSRFToken": csrfToken!,
    },
  });
  return res.data;
};

export const check_auth = async () => {
  const csrftoken = await fetchCookies();
  const res = await api.get("/api/user/", {
    headers: {
      "X-CSRFToken": csrftoken!,
    },
  });
  if (res.status === 200) {
    return { status: true, user: res.data };
  } else {
    return { status: false };
  }
};
