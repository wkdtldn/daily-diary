import { api } from "./axiosInstance";

export const diary_write = async (
  content: string,
  date: string
): Promise<void> => {
  const res = await api.post("/api/diary/write/", {
    content: content,
    date: date,
  });
  if (res.status === 200) {
    console.log(res.data);
  } else {
    console.log("fail");
  }
};

export const diary_by_date = async (date: string) => {
  const res = await api.get(`/api/diary/?date=${date}`);
  if (res.status === 200) {
    return res.data;
  }
  return null;
};

export const diary_by_month = async (month: string, option?: string) => {
  const res = await api.get(`/api/diary/?month=${month}&option=${option}`);
  if (res.status === 200) {
    return res.data;
  }
  return null;
};
