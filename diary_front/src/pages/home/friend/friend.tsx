import { useEffect, useState } from "react";
import "./friend.css";
import { useRecoilValue } from "recoil";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { LoginUser } from "../../../hooks/recoil/userState";
import { api } from "../../../api/axiosInstance";
import { userSearch } from "../../../api/user";

type FriendType = {
  username: string;
  name: string;
  image: string;
};

function FriendPage() {
  const login_user = useRecoilValue(LoginUser);

  const [Friends, setFriends] = useState<FriendType[]>([]);

  useEffect(() => {
    const load_friend = () => {
      let friend_list = [...login_user.followers, ...login_user.followings];

      friend_list.forEach(async (username, index) => {
        const user = await userSearch(username);
        setFriends((prevFriends) => [...prevFriends, user]);
        console.log(Friends);
      });
    };
    load_friend();
  }, []);
  return (
    <>
      <div className="friendpage-container">
        {Friends.map((friend, index) => (
          <button className="friendpage-content" key={index}>
            <div className="friendpage-image_wrapper">
              <img
                className="friendpage-image"
                src={friend.image}
                alt="friend-image"
              />
            </div>
            <div className="friendpage-info">
              <span className="friendpage_username">@{friend.username}</span> /
              <span className="friendpage_name">{friend.name}</span>
            </div>
            <button className="friendpage-option_select">
              <HiOutlineDotsVertical />
            </button>
          </button>
        ))}
      </div>
    </>
  );
}

export default FriendPage;
