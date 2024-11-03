import "./profile.css";
import { useRecoilValue } from "recoil";
import { LoginUser } from "../../../hooks/recoil/userState";
import { IonIcon } from "@ionic/react";
import { albums, arrowBack, create, list } from "ionicons/icons";
import RedirectLogin from "../../../components/Redirect-Login/redirect-login";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { RiApps2Line } from "react-icons/ri";
import { useSpring, animated } from "@react-spring/web";
import ListBox from "../../../components/ContentBox/ListBox";
import { getDiaryByUser } from "../../../api/diary";
import AlbumsBox from "../../../components/ContentBox/AlbumsBox";

type probsPiece = {
  name: string;
  pv: number;
};

type Diary = {
  id: string;
  writer_name: string;
  text: string;
  content: string;
  like_count: number;
  time: string;
  writer: number;
  date: string;
  images: string[];
};

function ProfilePage() {
  const navigate = useNavigate();

  const login_user = useRecoilValue(LoginUser);

  const [loading, setLoading] = useState<boolean>(false);

  const [selectValue, setSelectValue] = useState<"list" | "albums" | string>(
    "list"
  );

  const [selectOpen, setSelectOpen] = useState<boolean>(false);
  const selectRef = useRef<HTMLButtonElement | null>(null);

  const handleSelectValue = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectValue(e.currentTarget.value);
  };

  const selectBtnAnimation = useSpring({
    transform: selectOpen ? "translateX(-200%)" : "translateX(0%)",
    config: { duration: 300 },
  });

  const listBtnAnimation = useSpring({
    transform: selectOpen ? "translateX(-120%)" : "translateX(0%)",
    opacity: selectOpen ? 1 : 0,
    pointerEvents: selectOpen ? "auto" : "none",
    boxShadow:
      selectValue === "list"
        ? "1.5px 1.5px 3px rgb(221, 221, 221)"
        : "inset 1.5px 1.5px 3px rgb(221, 221, 221)",
    backgroundColor: selectValue === "list" ? "rgb(245, 206, 206)" : "white",
    config: { duration: 300 },
  });

  const albumsBtnAnimation = useSpring({
    transform: "translateX(0%)",
    opacity: selectOpen ? 1 : 0,
    pointerEvents: selectOpen ? "auto" : "none",
    boxShadow:
      selectValue === "albums"
        ? "1.5px 1.5px 3px rgb(221, 221, 221)"
        : "inset 1.5px 1.5px 3px rgb(221, 221, 221)",
    backgroundColor: selectValue === "albums" ? "rgb(245, 206, 206)" : "white",
    config: { duration: 300 },
  });

  const [Diaries, setDiaries] = useState<Diary[] | null>(null);

  useEffect(() => {
    const load_data = async () => {
      setDiaries(await getDiaryByUser(login_user.id));
    };
    load_data();
  }, []);

  const profileBackgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profileBackgroundRef.current) {
      profileBackgroundRef.current.style.setProperty(
        "--bg-image-url",
        `url(${login_user.image})`
      );
    }
  }, []);

  return (
    <div className="profile-container">
      {login_user.username ? (
        <div className="profile-container">
          <div ref={profileBackgroundRef} className="profile-header-wrapper">
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
              <animated.button
                style={selectBtnAnimation}
                ref={selectRef}
                type="button"
                className="select-btn"
                onClick={() => setSelectOpen(!selectOpen)}
              >
                <IonIcon icon={arrowBack} />
              </animated.button>
              <animated.button
                style={{
                  ...listBtnAnimation,
                  pointerEvents: listBtnAnimation.opacity.to((opacity) =>
                    opacity === 0 ? "none" : "auto"
                  ),
                }}
                className="option-btn"
                value="list"
                onClick={handleSelectValue}
              >
                <IonIcon icon={list} />
              </animated.button>
              <animated.button
                style={{
                  ...albumsBtnAnimation,
                  pointerEvents: albumsBtnAnimation.opacity.to((opacity) =>
                    opacity === 0 ? "none" : "auto"
                  ),
                }}
                className="option-btn"
                value="albums"
                onClick={handleSelectValue}
              >
                <RiApps2Line />
              </animated.button>
            </article>
            {selectValue === "list" ? (
              <div className="profile-list">
                {Diaries?.map((diary, value) => (
                  <ListBox
                    id={diary.id}
                    text={diary.text}
                    writer={diary.writer_name}
                    date={diary.date}
                    time={diary.time}
                    images={diary.images}
                    key={value}
                  />
                ))}
              </div>
            ) : (
              <div className="profile-albums">
                {Diaries?.map((diary, value) => (
                  <AlbumsBox
                    id={diary.id}
                    text={diary.text}
                    date={diary.date}
                    time={diary.time}
                    like_count={diary.like_count}
                    images={diary.images}
                    writer={diary.writer_name}
                    key={value}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <RedirectLogin />
      )}
    </div>
  );
}
export default ProfilePage;
