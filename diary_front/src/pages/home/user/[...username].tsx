import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userSearch } from "../../../api/user";
import "../profile/profile.css";
import "./user.css";
import { useRecoilValue } from "recoil";
import { LoginUser } from "../../../hooks/recoil/userState";
import RedirectLogin from "../../../components/Redirect-Login/redirect-login";
import { api } from "../../../api/axiosInstance";

interface SearchTargetType {
  id: string;
  username: string;
  name: string;
  email: string;
  image: string;
  followings: string[];
  following_count: number;
  followers: string[];
  follower_count: number;
  following: boolean;
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();

  const [followState, setFollowState] = useState(false);

  const { username } = useParams<{ username: string }>();

  const login_user = useRecoilValue(LoginUser);

  const [searchTarget, setSearchTarget] = useState<SearchTargetType | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    if (login_user.username === username) {
      navigate("/home/profile");
    } else {
      const Search = async () => {
        if (username) {
          const user = await userSearch(username);
          console.log(user);
          setSearchTarget(user);
          setFollowState(user.following);
        }
        setLoading(false);
      };
      Search();
    }
  }, [username]);

  const follow = async () => {
    if (followState) {
      await api.delete(`/api/follow/${searchTarget?.id}/unfollow/`);
      setFollowState(false);
    } else {
      await api.post("/api/follow/", { following: searchTarget?.id });
      setFollowState(true);
    }
  };
  return (
    <div className="profile-container">
      {login_user.username ? (
        !loading ? (
          searchTarget?.username ? (
            <div className="profile-container">
              <div
                className="profile-header-wrapper"
                style={
                  {
                    "--bg-image-url": `url(${searchTarget.image})`,
                  } as React.CSSProperties
                }
              >
                <div className="profile-info">
                  <div className="profile-info-left">
                    <img
                      className="profile-img"
                      src={searchTarget.image}
                      alt="profile-img"
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      flexBasis: "50%",
                    }}
                  >
                    <span className="profile__username">
                      @{searchTarget.username}
                    </span>
                    <span className="profile__name">{searchTarget.name}</span>
                  </div>
                </div>

                <div className="profile-follow">
                  <div className="profile-follow_option">
                    <span>팔로워</span>
                    <span className="follow_number">
                      {login_user.follower_count}
                    </span>
                  </div>
                  <div className="profile-follow_option">
                    <span>팔로잉</span>
                    <span className="follow_number">
                      {login_user.following_count}
                    </span>
                  </div>
                  <button
                    className={` ${followState ? "followed" : "follow-btn"}`}
                    onClick={() => follow()}
                  >
                    {`${followState ? "팔로우 취소" : "팔로우"}`}
                  </button>
                </div>
              </div>

              <div className="profile-content"></div>
            </div>
          ) : (
            <p>존재하지 않는 사용자</p>
          )
        ) : (
          <p>loading</p>
        )
      ) : (
        <RedirectLogin />
      )}
    </div>
  );
};

export default UserProfile;
