import { api } from "./axiosInstance";
import { fetchCookies } from "./token";

export const diary_write = async (
  content: string,
  date: string
): Promise<void> => {
  const csrfToken = await fetchCookies();
  const res = await api.post(
    "/api/diary/write/",
    { content: content, date: date },
    {
      headers: {
        "X-CSRFToken": csrfToken!,
      },
    }
  );
  if (res.status === 200) {
    console.log(res.data);
  } else {
    console.log("fail");
  }
};

export const diary_by_date = async (date: string) => {
  const csrftoken = await fetchCookies();
  const res = await api.get(`/api/diary/?date=${date}`, {
    headers: {
      "X-CSRFToken": csrftoken!,
    },
  });
  if (res.status === 200) {
    return res.data;
  }
  return null;
};

export const diary_by_month = async (month: string, option?: string) => {
  const csrftoken = await fetchCookies();
  const res = await api.get(`/api/diary/?month=${month}&option=${option}`, {
    headers: {
      "X-CSRFToken": csrftoken!,
    },
  });
  if (res.status === 200) {
    return res.data;
  }
  return null;
};
