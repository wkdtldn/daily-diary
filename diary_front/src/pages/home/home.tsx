import "./home.css";

import Header from "../../components/Layout/Header/Header";
import {
  Route,
  Routes,
  redirect,
  useLocation,
  useNavigate,
} from "react-router-dom";
import CalendarPage from "./calendar/calendar";
import RecentPage from "./recent/recent";
import WritePage from "./write/write";
import ProfilePage from "./profile/profile";
import ProfileEditPage from "./profile-edit/profile-edit";
import UserProfile from "./user/[...username]";
import Footer from "../../components/Layout/Footer/Footer";
import { useRecoilState } from "recoil";
import { userState } from "../../hooks/recoil/userState";
import { useEffect, useState } from "react";
import { check_auth } from "../../api/user";
import NotFound from "../notfound/notfound";
import { IoColorWand } from "react-icons/io5";

const HomePage = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const [user, setUser] = useRecoilState(userState);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      setLoading(true);
      try {
        const auth = await check_auth();

        if (auth) {
          if (auth.user.image) {
            setUser(auth.user);
          } else {
            setUser((prevUser) => ({
              ...prevUser,
              ...auth.user,
              image: prevUser.image,
            }));
          }
          if (location.pathname === "/home/calendar") {
          } else if (location.pathname === "/home/recent") {
          } else if (location.pathname === "/home/profile") {
          } else {
            navigate("/home/calendar");
          }
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
              <Route path="*" element={<NotFound />}></Route>
            </Routes>
            <button
              className="write-calendar-btn"
              onClick={() => navigate("/home/write")}
            >
              <IoColorWand fontSize={23} fontWeight={600} color="blue" />
            </button>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default HomePage;
