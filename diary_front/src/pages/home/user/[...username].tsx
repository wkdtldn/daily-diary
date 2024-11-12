import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userSearch } from "../../../api/user";
import "../profile/profile.css";
import "./user.css";
import { useRecoilValue } from "recoil";
import { LoginUser } from "../../../hooks/recoil/userState";
import RedirectLogin from "../../../components/Redirect-Login/redirect-login";
import { api } from "../../../api/axiosInstance";
import { useSpring, animated } from "@react-spring/web";
import { getDiaryByUser } from "../../../api/diary";
import { IonIcon } from "@ionic/react";
import { arrowBack, list } from "ionicons/icons";
import { RiApps2Line } from "react-icons/ri";
import ListBox from "../../../components/ContentBox/ListBox";
import AlbumsBox from "../../../components/ContentBox/AlbumsBox";

type SearchTargetType = {
  id: number;
  username: string;
  name: string;
  email: string;
  image: string;
  followings: string[];
  followers: string[];
  following: boolean;
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
          setSearchTarget(user);
          setFollowState(user.following);
        }
        setLoading(false);
      };
      Search();
    }
  }, [username]);

  useEffect(() => {
    const load_diary = async () => {
      setLoading(true);
      if (searchTarget) {
        const diaries = await getDiaryByUser(searchTarget.id);
        setDiaries(diaries);
      }
      setLoading(false);
    };
    load_diary();
  }, [searchTarget]);

  const follow = async () => {
    if (followState) {
      await api.delete(`/api/follow/${searchTarget?.id}/unfollow/`);
      setFollowState(false);
    } else {
      await api.post("/api/follow/", { following: searchTarget?.id });
      setFollowState(true);
    }
  };

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
    const load_data = async () => {};
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
                      {searchTarget.following
                        ? !followState
                          ? searchTarget.followers.length - 1
                          : searchTarget.followers.length
                        : followState
                        ? searchTarget.followers.length + 1
                        : searchTarget.followers.length}
                    </span>
                  </div>
                  <div className="profile-follow_option">
                    <span>팔로잉</span>
                    <span className="follow_number">
                      {searchTarget.followings.length}
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
