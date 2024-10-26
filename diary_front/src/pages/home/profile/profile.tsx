import "./profile.css";
import { useRecoilValue } from "recoil";
import { LoginUser } from "../../../hooks/recoil/userState";
import { IonIcon } from "@ionic/react";
import { albums, create, list } from "ionicons/icons";
import RedirectLogin from "../../../components/Redirect-Login/redirect-login";
import { useNavigate } from "react-router-dom";
import React, { useRef, useState } from "react";
import { RiApps2Line } from "react-icons/ri";
import { useSpring, animated } from "@react-spring/web";

function ProfilePage() {
  const navigate = useNavigate();

  const login_user = useRecoilValue(LoginUser);

  const [selectValue, setSelectValue] = useState<"list" | "albums" | string>(
    "list"
  );

  const selectRef = useRef<HTMLButtonElement | null>(null);

  const selectOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.classList.toggle("on");
    if (e.currentTarget.classList.toggle("on")) {
      e.currentTarget.classList.remove("on");
    } else {
      e.currentTarget.classList.add("on");
    }
  };

  const handleSelectValue = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (selectRef.current) {
      selectRef.current.innerHTML = e.currentTarget.innerHTML;
      setSelectValue(e.currentTarget.value);
    }
  };

  const listBtnAnimation = useSpring({
    transform: selectRef.current?.classList.toggle("on")
      ? "translateY(110%)"
      : "translateY(-115%)",
    opacity: selectRef.current?.classList.toggle("on") ? 1 : 0,
    config: { duration: 500 },
  });

  return (
    <div className="profile-container">
      {login_user.username ? (
        <div className="profile-container">
          <div
            className="profile-header-wrapper"
            style={
              {
                "--bg-image-url": `url(${login_user.image})`,
              } as React.CSSProperties
            }
          >
            <div className="profile-info">
              <div className="profile-info-left">
                <img
                  className="profile-img"
                  src={login_user.image}
                  alt="profile-img"
                />
                <button
                  className="profile-edit-button"
                  onClick={() => navigate("/home/profile-edit")}
                >
                  편집
                  <IonIcon icon={create} size="10" />
                </button>
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
                  @{login_user.username}
                </span>
                <span className="profile__name">{login_user.name}</span>
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
            </div>
          </div>

          <div className="profile-content">
            <article className="profile-filter">
              <button
                ref={selectRef}
                className="select-btn"
                onClick={selectOpen}
              >
                리스트뷰
                <IonIcon icon={list} />
              </button>
              <ul className="show_option-wrap">
                <li>
                  <animated.button
                    style={listBtnAnimation}
                    className="option-btn"
                    value="list"
                    onClick={handleSelectValue}
                  >
                    리스트뷰
                    <IonIcon icon={list} />
                  </animated.button>
                </li>
                <li>
                  <animated.button
                    className="option-btn"
                    value="albums"
                    onClick={handleSelectValue}
                  >
                    앨범뷰
                    <RiApps2Line />
                  </animated.button>
                </li>
              </ul>
            </article>
          </div>
        </div>
      ) : (
        <RedirectLogin />
      )}
    </div>
  );
}
export default ProfilePage;
