import { atom, selector } from "recoil";

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
}

export const userState = atom<User>({
  key: "user",
  default: {
    id: 1,
    username: "",
    name: "",
    email: "",
  },
});

export const LoginUser = selector({
  key: "LoggedinUser",
  get: ({ get }) => {
    const params = get(userState);
    return {
      username: params.username,
      name: params.name,
      email: params.email,
    };
  },
});
