import { useEffect, useRef, useState } from "react";
import "./friend.css";
import { useRecoilValue } from "recoil";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { LoginUser } from "../../../hooks/recoil/userState";
import { useSpring, animated } from "@react-spring/web";
import { userSearch } from "../../../api/user";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/axiosInstance";

type Friend = {
  id: number;
  username: string;
  name: string;
  image: string;
  following: boolean;
  isActive: boolean;
  last_active: string | null;
};

function FriendPage() {
  const navigate = useNavigate();

  const login_user = useRecoilValue(LoginUser);

  const [Friends, setFriends] = useState<Friend[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load_friend = async () => {
      setLoading(true);
      let friend_list = Array.from(
        new Set([...login_user.followers, ...login_user.followings])
      );

      friend_list.forEach(async (username, index) => {
        const user = (await userSearch(username)) as Friend;
        await api.get(`/api/check-status/${user.id}`).then((res) => {
          if (res.status === 200) {
            const data = res.data;
            setFriends((prevFriends) => [
              ...prevFriends,
              { ...user, isActive: data.status },
            ]);
          }
        });
      });
      console.log(friend_list);
      setLoading(false);
    };
    load_friend();
  }, []);

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
      setFriends((prevFriends) =>
        prevFriends.map((friend) =>
          friend.id === targetFriend.id
            ? { ...friend, following: false }
            : friend
        )
      );
    } else {
      await api.post("/api/follow/", { following: targetFriend.id });
      setFriends((prevFriends) =>
        prevFriends.map((friend) =>
          friend.id === targetFriend.id
            ? { ...friend, following: true }
            : friend
        )
      );
    }
  };

  return (
    <>
      <div className="friendpage-container">
        {Friends.length === 0 ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h3>팔로우, 팔로잉을 하면 여기에 표시됩니다</h3>
          </div>
        ) : (
          <>
            {loading ? (
              <p>loading...</p>
            ) : (
              <>
                {Friends.map((friend, index) => (
                  <div
                    style={{
                      width: "100%",
                      height: "70px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    key={index}
                  >
                    <div
                      className="friendpage-content"
                      key={index}
                      onClick={() => navigate(`/home/user/${friend.username}`)}
                    >
                      <div className="friendpage-image_wrapper">
                        <img
                          className="friendpage-image"
                          style={
                            friend.isActive
                              ? {
                                  borderColor: "blue",
                                }
                              : { borderColor: "gray" }
                          }
                          src={friend.image}
                          alt="friend-image"
                        />
                      </div>
                      <div className="friendpage-info">
                        <span className="friendpage_username">
                          @{friend.username}
                        </span>
                        <span className="friendpage_name">{friend.name}</span>
                      </div>
                      <button
                        className="friendpage-option_select"
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
                      className="friend-option"
                      onClick={(e) => follow(e, friend)}
                    >
                      {friend.following ? "팔로우 취소" : "팔로우"}
                    </animated.button>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default FriendPage;
