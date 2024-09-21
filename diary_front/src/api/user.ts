import { NavigateFunction } from "react-router-dom";
import { fetchCookies } from "./token";

export const login = async (
  username: string,
  password: string,
  navigate: NavigateFunction
): Promise<void> => {
  const csrfToken = await fetchCookies();

  const res = await fetch("http://127.0.0.1:8000/api/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken!,
    },
    credentials: "include",
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  if (res.ok) {
    console.log("Login successful");
    navigate("/home");
  } else {
    console.error("Login failed");
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

  const res = await fetch("http://127.0.0.1:8000/api/signup/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken!,
    },
    body: JSON.stringify({
      username: username,
      password: password,
      name: name,
      email: email,
    }),
  });

  if (res.ok) {
    console.log("Signin successful");
    navigate("/login");
  } else {
    console.error("Signin failed");
  }
};

export const check_auth = async () => {
  const csrftoken = await fetchCookies();
  const res = await fetch("http://127.0.0.1:8000/api/user/", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken!,
    },
  });
  if (res.ok) {
    const data = await res.json();
    return { status: true, user: data };
  } else {
    return { status: false };
  }
};
