import { fetchCookies } from "./token";

export const diary_write = async (
  content: string,
  date: string
): Promise<void> => {
  const csrfToken = await fetchCookies();
  const res = await fetch("http://127.0.0.1:8000/api/diary/write/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken!,
    },
    body: JSON.stringify({ content: content, date: date }),
    credentials: "include",
  });
  if (res.ok) {
    const data = await res.json();
    console.log(data);
  } else {
    console.log("fail");
  }
};

export const diary_by_date = async (date: string) => {
  const csrftoken = await fetchCookies();
  const res = await fetch(`http://127.0.0.1:8000/api/diary/?date=${date}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken!,
    },
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  return null;
};

export const diary_by_month = async (month: string, option?: string) => {
  const csrftoken = await fetchCookies();
  const res = await fetch(
    `http://127.0.0.1:8000/api/diary/?month=${month}&option=${option}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken!,
      },
    }
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  return null;
};
