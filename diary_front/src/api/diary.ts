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
  } else {
  }
};

export const diary_by_date = async (date: string) => {
  const res = await api.get(`/api/diary/filter/?date=${date}`);
  if (res.status === 200) {
    return res.data;
  }
  return null;
};

export const diary_by_month = async (month: string, option?: string) => {
  const res = await api.get(
    `/api/diary/filter/?month=${month}&option=${option}`
  );
  if (res.status === 200) {
    return res.data;
  }
  return null;
};

export const getDiary = async (id: string) => {
  const res = await api.get(`/api/diary/${id}`);
  if (res.status === 200) {
    return res.data;
  }
  return null;
};

export const getDiaryByUser = async (id: number) => {
  const res = await api.get(`/api/diary/by_user/${id}`);
  if (res.status === 200) {
    return res.data;
  }
  return null;
};
