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
import { arrowBack, arrowForward, list } from "ionicons/icons";
import { RiApps2Line } from "react-icons/ri";
import ListBox from "../../../components/ContentBox/ListBox";
import AlbumsBox from "../../../components/ContentBox/AlbumsBox";
import FollowComponent from "../../../components/modal/Follow";

type SearchTargetType = {
  id: number;
  username: string;
  name: string;
  email: string;
  image_url: string;
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

  const [followingOpen, setFollowingOpen] = useState(false);
  const [followerOpen, setFollowerOpen] = useState(false);

  return (
    <div className="m-w m-h flex flex-c a-c over-h">
      {login_user.username ? (
        !loading ? (
          searchTarget?.username ? (
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
                        src={searchTarget.image_url}
                        alt="profile-img"
                      />
                    </div>
                    <div
                      className="flex flex-c j-c"
                      style={{ flexBasis: "50%" }}
                    >
                      <span className="profile__username bold sumtext">
                        @{searchTarget.username}
                      </span>
                      <span className="profile__name sumtext">
                        {searchTarget.name}
                      </span>
                    </div>
                  </div>

                  <div id="profile-follow" className="m-w flex a-c j-se">
                    <button
                      className="profile-follow_option flex flex-c a-c j-c bold border-n bg-n"
                      onClick={() => setFollowerOpen(true)}
                    >
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
                    </button>
                    <button
                      className="profile-follow_option flex flex-c a-c j-c bold border-n bg-n"
                      onClick={() => setFollowingOpen(true)}
                    >
                      <span>팔로잉</span>
                      <span className="follow_number">
                        {searchTarget.followings.length}
                      </span>
                    </button>
                    <button
                      className={` ${followState ? "followed" : "follow-btn"}`}
                      onClick={() => follow()}
                    >
                      {`${followState ? "팔로우 취소" : "팔로우"}`}
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
                        pointerEvents: albumsBtnAnimation.opacity.to(
                          (opacity) => (opacity === 0 ? "none" : "auto")
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
                follow_list={searchTarget.followers}
                close={() => setFollowerOpen(false)}
              />
              <FollowComponent
                option="following"
                isOpen={followingOpen}
                follow_list={searchTarget.followings}
                close={() => setFollowingOpen(false)}
              />
            </>
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
