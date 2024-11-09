import "./Follow.css";

import React, { useEffect, useRef, useState } from "react";
import { userSearch } from "../../api/user";
import { useSpring, animated } from "@react-spring/web";
import { IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { api } from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  image: string;
  username: string;
  name: string;
  following: boolean;
};

interface FollowComponentProps {
  option: "following" | "follower";
  isOpen: boolean;
  follow_list: string[];
  close: () => void;
}

const FollowComponent: React.FC<FollowComponentProps> = ({
  option,
  isOpen,
  follow_list,
  close,
}) => {
  const navigate = useNavigate();

  const [followList, setFollowList] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const load_follow = async () => {
    if (follow_list.length !== 0) {
      setLoading(true);
      follow_list.forEach(async (username) => {
        let user = await userSearch(username);
        setFollowList((prevUser) => [...prevUser, user]);
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    load_follow();
  }, []);

  const ModalOverlayAnimation = useSpring({
    opacity: isOpen ? 0.3 : 0,
    display: isOpen ? "block" : "none",
  });

  const ModalAnimation = useSpring({
    transform: isOpen ? "translateY(25%)" : "translateY(125%)",
    opacity: isOpen ? 1 : 0,
  });

  const [showOptions, setShowOptions] = useState(false);

  const follow = async (
    e: React.MouseEvent<HTMLButtonElement>,
    targetUser: User
  ) => {
    if (targetUser.following) {
      await api.delete(`/api/follow/${targetUser.id}/unfollow/`);
      setFollowList((prevUsers) =>
        prevUsers.map((user) =>
          user.id === targetUser.id ? { ...user, following: false } : user
        )
      );
    } else {
      await api.post("/api/follow/", { following: targetUser.id });
      setFollowList((prevFriends) =>
        prevFriends.map((friend) =>
          friend.id === targetUser.id ? { ...friend, following: true } : friend
        )
      );
    }
  };

  return (
    <>
      <animated.div
        style={ModalOverlayAnimation}
        className="follow-overlay"
        onClick={() => close()}
      ></animated.div>
      <animated.div className="follow-container" style={ModalAnimation}>
        {loading ? (
          <p>loading</p>
        ) : (
          <>
            <div className="follow-header">
              <span className="follow-title">
                {option === "follower" ? "팔로우" : "팔로잉"}
              </span>
              <button className="follow-close" onClick={() => close()}>
                <IonIcon icon={closeOutline} />
              </button>
            </div>
            <div className="follow-body">
              {followList.map((user, idx) => (
                <article
                  className="follow-content"
                  onClick={() => navigate(`/home/user/${user.username}`)}
                  key={idx}
                >
                  <div className="follow-image">
                    <img
                      className="follow-image_profile"
                      src={user.image}
                      alt="user-profile"
                    />
                  </div>
                  <div className="follow-info">
                    <span className="follow-info_username">
                      {user.username}
                    </span>
                  </div>
                  <div className="follow-options">
                    <button
                      className="follow-options_btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowOptions(!showOptions);
                      }}
                    >
                      <HiOutlineDotsVertical />
                    </button>
                  </div>
                  {showOptions ? (
                    <button
                      className="follow-option"
                      onClick={(e) => {
                        e.stopPropagation();
                        follow(e, user);
                      }}
                    >
                      {user.following ? "팔로우 취소" : "팔로우"}
                    </button>
                  ) : (
                    <></>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </animated.div>
    </>
  );
};

export default FollowComponent;
