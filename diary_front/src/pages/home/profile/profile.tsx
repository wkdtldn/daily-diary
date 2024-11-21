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
    <div className="m-w m-h flex flex-c a-c over-h">
      {login_user.username ? (
        <>
          <div className="m-w m-h flex flex-c a-c over-h">
            <div
              ref={profileBackgroundRef}
              className="profile-header-wrapper m-w relative flex flex-c a-c j-se"
            >
              <div
                className="profile-info m-w h-a flex relative a-c j-c"
                style={{ gap: "20px" }}
              >
                <div
                  className="profile-info-left flex flex-c a-c relative j-fs"
                  style={{ height: "140px" }}
                >
                  <img
                    className="fitimg border-n round"
                    style={{ width: "120px", height: "120px" }}
                    src={login_user.image}
                    alt="profile-img"
                  />
                  <button
                    className="profile-edit-button p-0 m-0 absolute b-0 border-n bottom"
                    onClick={() => navigate("/home/profile-edit")}
                  >
                    편집
                    <IonIcon icon={create} size="10" />
                  </button>
                </div>
                <div className="flex flex-c j-c" style={{ flexBasis: "50%" }}>
                  <span className="profile__username bold sumtext">
                    @{login_user.username}
                  </span>
                  <span className="profile__name sumtext">
                    {login_user.name}
                  </span>
                </div>
              </div>

              <div id="profile-follow" className=" m-w flex a-c j-se">
                <button
                  className="profile-follow_option flex flex-c a-c j-c bold border-n bg-n"
                  onClick={() => setFollowerOpen(true)}
                >
                  <span>팔로워</span>
                  <span className="follow_number">
                    {login_user.follower_count}
                  </span>
                </button>
                <button
                  className="profile-follow_option flex flex-c a-c j-c bold border-n bg-n"
                  onClick={() => setFollowingOpen(true)}
                >
                  <span>팔로잉</span>
                  <span className="follow_number">
                    {login_user.following_count}
                  </span>
                </button>
              </div>
            </div>

            <div
              className="f-1 m-w flex relative overy-a"
              style={{ zIndex: 100 }}
            >
              <article
                className="absolute flex a-c j-c"
                style={{ top: "10px", right: "10px" }}
              >
                <animated.button
                  style={selectBtnAnimation}
                  ref={selectRef}
                  type="button"
                  className="select-btn flex a-c j-c bold border-n"
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
