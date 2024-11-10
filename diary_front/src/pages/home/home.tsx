import "./home.css";

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

import { IoColorWand } from "react-icons/io5";

import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../../hooks/recoil/userState";
import { useEffect, useRef, useState } from "react";
import { check_auth } from "../../api/user";
import Draggable, { DraggableData } from "react-draggable";
import { api } from "../../api/axiosInstance";
import DiaryEditPage from "./diary-edit/[...diaryId]";

const HomePage = () => {
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
  }, []);

  const nodeRef = useRef(null);

  const [, setPosition] = useState({ x: 0, y: 0 });
  const [Opacity, setOpacity] = useState(false);
  const trackPos = (data: DraggableData) => {
    setPosition({ x: data.x, y: data.y });
  };
  const handleStart = () => {
    setOpacity(true);
  };
  const handleEnd = () => {
    setTimeout(() => {
      setOpacity(false);
    }, 100);
  };
  const handleWriteDiary = () => {
    if (Opacity) return;
    navigate("/home/write");
  };

  return (
    <div className="HomePage">
      {loading ? (
        <p>loading</p>
      ) : (
        <div className="homepage-wrapper">
          <Header />
          <div className="home-content-wrapper">
            <Routes>
              <Route path="/calendar" element={<CalendarPage />}></Route>
              <Route path="/recent" element={<RecentPage />}></Route>
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
            {location.pathname === "/home/write" ? (
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
            )}
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default HomePage;
