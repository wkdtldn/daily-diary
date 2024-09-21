import { atom, selector } from "recoil";

//recoil state 생성
type dateStateTypePiece = Date | null;
type dateStateType =
  | dateStateTypePiece
  | [dateStateTypePiece, dateStateTypePiece];

export const dateState = atom<dateStateType>({
  key: "date",
  default: new Date(),
});

const getDate = (idx: number): string => {
  const Date = ["일", "월", "화", "수", "목", "금", "토"];
  return Date[idx];
};

export const SelectedDate = selector({
  key: "SelectedDate",
  get: ({ get }) => {
    const params = get(dateState);
    if (params) {
      let toDate = new Date(params.toString());
      return {
        year: toDate.getFullYear(),
        month: toDate.getMonth() + 1,
        date: toDate.getDate(),
        day: getDate(toDate.getDay()),
      };
    }
    return null;
  },
});
