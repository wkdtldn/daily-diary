import { api } from "./axiosInstance";

// export const fetchAccessToken = async (username: string, password: string) => {
//   const res = await fetch(`${fetchDefaults.url}/o/token/`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: new URLSearchParams({
//       grant_type: "password",
//       username: username,
//       password: password,
//       client_id: "a9r8r9HughpfPG1CKrooIQSAZ4oZQwkngKmZ6Wfh",
//       client_secret:
//         "pbkdf2_sha256$720000$8h6C6gd1T0DCv77CvK2aH3$HDXBu8mgTi+zrJs6w3Jw50sMyK6e2oqrAgFdfkgX77w=",
//     }),
//   });

//   if (!res.ok) {
//     throw new Error("Failed");
//   }

//   const data = await res.json();
//   return data;
// };

export const userSearch = async (username: string) => {
  const res = await api.get(`/api/user/${username}`);
  return res.data;
};

export const check_auth = async () => {
  const res = await api.get("/api/user/");
  if (res.status === 200) {
    return { status: true, user: res.data };
  } else {
    return { status: false };
  }
};
