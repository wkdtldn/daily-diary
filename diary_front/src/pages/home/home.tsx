import "./home.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Header from "../../components/Layout/Header/Header";
import CalendarPage from "./calendar/calendar";
import RecentPage from "./recent/recent";
import WritePage from "./write/write";
import ProfilePage from "./profile/profile";
import ProfileEditPage from "./profile-edit/profile-edit";
import UserProfile from "./user/[...username]";
import NotFound from "../notfound/notfound";
import Footer from "../../components/Layout/Footer/Footer";
import DiaryPage from "./diary/[...diaryId]";
import FriendPage from "./friend/friend";
import MapPage from "./map/map";

import { IoColorWand } from "react-icons/io5";

import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { useEffect, useRef, useState } from "react";
import Draggable, { DraggableData } from "react-draggable";
import { Swiper, SwiperSlide } from "swiper/react";

import { check_auth } from "../../api/user";
import { userState } from "../../hooks/recoil/userState";
import { api } from "../../api/axiosInstance";
import DiaryEditPage from "./diary-edit/[...diaryId]";
import { SyncLoader } from "react-spinners";

function DefaultPage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        initialSlide={1}
        pagination={{ clickable: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <SwiperSlide>
          <WritePage />
        </SwiperSlide>
        <SwiperSlide>
          <CalendarPage />
        </SwiperSlide>
        <SwiperSlide>
          <RecentPage />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

function HomePage() {
  const updateStatus = async () => {
    try {
      await api.get("/api/update-status/");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const interval = setInterval(updateStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  const location = useLocation();

  const navigate = useNavigate();

  const [, setUser] = useRecoilState(userState);

  const [loading, setLoading] = useState<boolean>(false);

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
  }, [location]);

  // const nodeRef = useRef(null);

  // const [, setPosition] = useState({ x: 0, y: 0 });
  // const [Opacity, setOpacity] = useState(false);
  // const trackPos = (data: DraggableData) => {
  //   setPosition({ x: data.x, y: data.y });
  // };
  // const handleStart = () => {
  //   setOpacity(true);
  // };
  // const handleEnd = () => {
  //   setTimeout(() => {
  //     setOpacity(false);
  //   }, 100);
  // };
  // const handleWriteDiary = () => {
  //   if (Opacity) return;
  //   navigate("/home/write");
  // };

  return (
    <div className="HomePage">
      {loading ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SyncLoader />
        </div>
      ) : (
        <div className="homepage-wrapper">
          <Header />
          <div className="home-content-wrapper">
            <Routes>
              <Route path="/" element={<DefaultPage />}></Route>
              <Route path="/map" element={<MapPage />}></Route>
              <Route path="/write" element={<WritePage />}></Route>
              <Route path="/profile" element={<ProfilePage />}></Route>
              <Route path="/profile-edit" element={<ProfileEditPage />}></Route>
              <Route path="/user/:username" element={<UserProfile />}></Route>
              <Route path="/diary/:diaryId" element={<DiaryPage />}></Route>
              <Route
                path="/diary/edit/:diaryId"
                element={<DiaryEditPage />}
              ></Route>
              <Route path="/friends" element={<FriendPage />}></Route>
              <Route path="*" element={<NotFound />}></Route>
            </Routes>
            {/* {location.pathname === "/home/write" ? (
              ""
            ) : (
              <Draggable
                nodeRef={nodeRef}
                onDrag={(e, data) => trackPos(data)}
                onStart={handleStart}
                onStop={handleEnd}
              >
                <div
                  ref={nodeRef}
                  className="draggable-wrapper"
                  style={{
                    opacity: Opacity ? "0.5" : "1",
                    zIndex: 10000,
                  }}
                >
                  <button
                    ref={nodeRef}
                    className="draggable-btn"
                    style={{ opacity: Opacity ? "0.5" : "1" }}
                    onClick={handleWriteDiary}
                    onTouchEnd={handleWriteDiary}
                  >
                    <IoColorWand fontSize={23} fontWeight={600} color="white" />
                  </button>
                </div>
              </Draggable>
            )} */}
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
}

export default HomePage;
