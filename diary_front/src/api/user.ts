import { NavigateFunction } from "react-router-dom";
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

export const login = async (
  username: string,
  password: string,
  navigate: NavigateFunction
): Promise<void> => {
  const csrfToken = await fetchCookies();

  const res = await api.post(
    "/api/login/",
    {
      username: username,
      password: password,
    },
    {
      headers: {
        "X-CSRFToken": csrfToken!,
      },
    }
  );

  if (res.status === 200) {
    console.log("Login successful");
    navigate("/home");
  } else {
    console.error("Login failed");
  }
};

export const logout = async (navigate: NavigateFunction): Promise<void> => {
  const csrfToken = await fetchCookies();

  const res = await api.get("/api/logout/", {
    headers: {
      "X-CSRFToken": csrfToken!,
    },
  });

  if (res.status === 200) {
    console.log("Logout successful");
    navigate("/login");
  } else {
    console.error("Logout failed");
  }
};

export const signin = async (
  username: string,
  password: string,
  name: string,
  email: string,
  navigate: NavigateFunction
): Promise<void> => {
  const csrftoken = await fetchCookies();

  const res = await api.post(
    "/api/signup/",
    {
      username: username,
      password: password,
      name: name,
      email: email,
    },
    {
      headers: {
        "X-CSRFToken": csrftoken!,
      },
    }
  );

  if (res.status === 201) {
    console.log("Signin successful");
    navigate("/login");
  } else {
    console.error("Signin failed");
  }
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
