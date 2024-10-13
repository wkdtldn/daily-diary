import { atom, selector } from "recoil";

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  image: string;
  followings: string[];
  followers: string[];
}

export const userState = atom<User>({
  key: "user",
  default: {
    id: 0,
    username: "",
    name: "",
    email: "",
    image:
      "https://cdn.pixabay.com/photo/2020/05/17/20/21/cat-5183427_1280.jpg",
    followings: [],
    followers: [],
  },
});

export const LoginUser = selector({
  key: "LoggedinUser",
  get: ({ get }) => {
    const params = get(userState);
    return {
      id: params.id,
      username: params.username,
      name: params.name,
      email: params.email,
      image: params.image,
      followings: params.followings,
      following_count: params.followings.length,
      followers: params.followers,
      follower_count: params.followers.length,
    };
  },
});
