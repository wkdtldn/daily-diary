import "./home.css";

import { Routes, Route, useNavigate, Link } from "react-router-dom";
import Header from "../../components/Layout/Header/Header";
import Footer from "../../components/Layout/Footer/Footer";
import CalendarPage from "./calendar/calendar";
import RecentPage from "./recent/recent";
import WritePage from "./write/write";
import ProfilePage from "./profile/profile";
import NotFound from "../notfound/notfound";
import { useEffect, useState } from "react";

import { IoWarningOutline } from "react-icons/io5";
import { check_auth } from "../../api/user";
import { useRecoilState } from "recoil";
import { userState } from "../../hooks/recoil/userState";
import UserProfile from "./user/[...username]";

function HomePage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [, setUser] = useRecoilState(userState);

  useEffect(() => {
    const checkAuthentication = async () => {
      const auth = await check_auth();
      setIsAuthenticated(auth.status);

      if (auth) {
        setUser(auth.user);
        if (window.location.pathname === "/home") {
          navigate("/home/calendar");
        }
      }
    };
    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading..</div>;
  }

  return (
    <div className="HomePage">
      {isAuthenticated ? (
        <div className="homepage-wrapper">
          <div className="header-wrapper">
            <Header />
          </div>
          <div className="home-content-wrapper">
            <Routes>
              <Route path="/calendar" element={<CalendarPage />}></Route>
              <Route path="/recent" element={<RecentPage />}></Route>
              <Route path="/write" element={<WritePage />}></Route>
              <Route path="/profile" element={<ProfilePage />}></Route>
              <Route path="/user/:username" element={<UserProfile />}></Route>
              <Route path="*" element={<NotFound />}></Route>
            </Routes>
          </div>
          <div className="footer-wrapper">
            <Footer />
          </div>
        </div>
      ) : (
        <div className="redirect-login-page">
          <span className="ERROR-message">
            <IoWarningOutline className="ERROR-icon" />
            로그인이 필요한
            <br />
            페이지입니다!
          </span>
          <Link className="redirect-btn" to="../login">
            로그인 하기
          </Link>
        </div>
      )}
    </div>
  );
}

export default HomePage;
