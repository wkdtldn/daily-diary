import { atom, selector } from "recoil";

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  image_url: string;
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
    image_url: "",
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
      image: params.image_url,
      followings: params.followings,
      following_count: params.followings.length,
      followers: params.followers,
      follower_count: params.followers.length,
    };
  },
});
