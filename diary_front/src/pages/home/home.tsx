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

import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { check_auth } from "../../api/user";
import { userState } from "../../hooks/recoil/userState";
import { api } from "../../api/axiosInstance";
import DiaryEditPage from "./diary-edit/[...diaryId]";
import { SyncLoader } from "react-spinners";
import SearchPage from "./search/search";

function DefaultPage() {
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Header />
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
    </>
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

  return (
    <>
      {loading && (
        <div className="m-w m-h flex a-c j-c absolute top left">
          <SyncLoader />
        </div>
      )}
      <div
        className="m-w m-h relative m-0 p-0"
        style={loading ? { backgroundColor: "gray", opacity: 0.1 } : {}}
      >
        <div className="m-w m-h flex flex-c a-c relative">
          <div className="relative m-w f-1 over-h">
            <Routes>
              <Route path="/" element={<DefaultPage />}></Route>
              <Route path="/search" element={<SearchPage />} />
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
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default HomePage;
