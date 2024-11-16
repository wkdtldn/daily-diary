import "./profile.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { LoginUser, userState } from "../../../hooks/recoil/userState";
import { IonIcon } from "@ionic/react";
import { arrowForward, arrowBack, create, list } from "ionicons/icons";
import RedirectLogin from "../../../components/Redirect-Login/redirect-login";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { RiApps2Line } from "react-icons/ri";
import { useSpring, animated } from "@react-spring/web";
import ListBox from "../../../components/ContentBox/ListBox";
import { getDiaryByUser } from "../../../api/diary";
import AlbumsBox from "../../../components/ContentBox/AlbumsBox";
import FollowComponent from "../../../components/modal/Follow";
import { check_auth } from "../../../api/user";

type Diary = {
  id: string;
  writer_name: string;
  text: string;
  content: string;
  like_count: number;
  time: string;
  writer: number;
  date: string;
};

function ProfilePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  const [, setUser] = useRecoilState(userState);

  useEffect(() => {
    const checkAuthentication = async () => {
      setLoading(true);
      try {
        const auth = await check_auth();

        if (auth) {
          setUser(auth.user);
        }
      } catch (error) {
        alert("로그인을 먼저 진행해주세요");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuthentication();
  }, []);

  const login_user = useRecoilValue(LoginUser);

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

  const [followingOpen, setFollowingOpen] = useState(false);
  const [followerOpen, setFollowerOpen] = useState(false);

  return (
    <div className="profile-container">
      {login_user.username ? (
        <>
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
                <button
                  className="profile-follow_option"
                  onClick={() => setFollowerOpen(true)}
                >
                  <span>팔로워</span>
                  <span className="follow_number">
                    {login_user.follower_count}
                  </span>
                </button>
                <button
                  className="profile-follow_option"
                  onClick={() => setFollowingOpen(true)}
                >
                  <span>팔로잉</span>
                  <span className="follow_number">
                    {login_user.following_count}
                  </span>
                </button>
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
                  {selectOpen ? (
                    <IonIcon icon={arrowForward} />
                  ) : (
                    <IonIcon icon={arrowBack} />
                  )}
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
                      writer={diary.writer_name}
                      key={value}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <FollowComponent
            option="follower"
            isOpen={followerOpen}
            follow_list={login_user.followers}
            close={() => setFollowerOpen(false)}
          />
          <FollowComponent
            option="following"
            isOpen={followingOpen}
            follow_list={login_user.followings}
            close={() => setFollowingOpen(false)}
          />
        </>
      ) : (
        <RedirectLogin />
      )}
    </div>
  );
}
export default ProfilePage;
