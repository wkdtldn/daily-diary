export const fetchCookies = async (): Promise<string> => {
  const res = await fetch("http://127.0.0.1:8000/api/token/csrf/", {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data.csrftoken;
};
