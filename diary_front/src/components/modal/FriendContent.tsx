import "./FriendContent.css";

import React, { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";
import { api } from "../../api/axiosInstance";
import { HiOutlineDotsVertical } from "react-icons/hi";

type Friend = {
  id: number;
  username: string;
  name: string;
  image_url: string;
  following: boolean;
  isActive: boolean;
  last_active: string | null;
};

interface FriendComponentProps {
  friend: Friend;
  handleFriendState: React.Dispatch<React.SetStateAction<Friend[]>>;
  navigate: NavigateFunction;
}

const FriendComponent: React.FC<FriendComponentProps> = ({
  friend,
  handleFriendState,
  navigate,
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const FriendOptionAnimation = useSpring({
    width: showOptions ? "85px" : "15px",
    height: showOptions ? "33px" : "10px",
    opacity: showOptions ? 1 : 0,
    transform: "translateY(200%) translateX(150%)",
  });

  const follow = async (
    e: React.MouseEvent<HTMLButtonElement>,
    targetFriend: Friend
  ) => {
    if (targetFriend.following) {
      await api.delete(`/api/follow/${targetFriend.id}/unfollow/`);
      handleFriendState((prevFriends) =>
        prevFriends.map((friend) =>
          friend.id === targetFriend.id
            ? { ...friend, following: false }
            : friend
        )
      );
    } else {
      await api.post("/api/follow/", { following: targetFriend.id });
      handleFriendState((prevFriends) =>
        prevFriends.map((friend) =>
          friend.id === targetFriend.id
            ? { ...friend, following: true }
            : friend
        )
      );
    }
  };

  return (
    <div className="m-w flex a-c j-c" style={{ height: "70px" }}>
      <div
        className="m-w m-h flex a-c mb-5 p-5 friendpage-content"
        onClick={() => navigate(`/home/user/${friend.username}`)}
      >
        <div className="m-h flex a-c j-c">
          <img
            className="friendpage-image fitimg round"
            style={
              friend.isActive
                ? {
                    borderColor: "blue",
                  }
                : { borderColor: "gray" }
            }
            src={friend.image_url}
            alt="friend-image"
          />
        </div>
        <div className="flex f-1 j-c a-fs pl-10 m-h flex-c friendpage-info">
          <span className="friendpage_username bold sumtext">
            @{friend.username}
          </span>
          <span className="friendpage_name sumtext">{friend.name}</span>
        </div>
        <button
          className="friendpage-option_select flex a-c j-c border-n bg-n"
          onClick={(e) => {
            e.stopPropagation();
            setShowOptions(!showOptions);
          }}
        >
          <HiOutlineDotsVertical />
        </button>
      </div>
      <animated.button
        style={FriendOptionAnimation}
        className="friend-option absolute flex a-c j-c bold border-n"
        onClick={(e) => follow(e, friend)}
      >
        {friend.following ? "팔로우 취소" : "팔로우"}
      </animated.button>
    </div>
  );
};

export default FriendComponent;
