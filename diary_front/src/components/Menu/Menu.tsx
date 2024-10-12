import React from "react";
import "./Menu.css";
import { Link, useNavigate } from "react-router-dom";
import { fetchCookies } from "../../api/token";
import { api } from "../../api/axiosInstance";
import { useRecoilValue } from "recoil";
import { LoginUser } from "../../hooks/recoil/userState";
import { IonIcon } from "@ionic/react";
import { logIn, logOut } from "ionicons/icons";

type MenuProps = { on: boolean; status: VoidFunction };

const Menu: React.FC<MenuProps> = ({ on, status }) => {
  const navigate = useNavigate();

  const login_user = useRecoilValue(LoginUser);

  const logout = async (): Promise<void> => {
    const csrfToken = await fetchCookies();

    const res = await api.get("/api/logout/", {
      headers: {
        "X-CSRFToken": csrfToken!,
      },
    });

    if (res.status === 200) {
      console.log("Logout successful");
      navigate("/login");
    } else {
      console.error("Logout failed");
    }
  };

  return (
    <div className={`menu-wrapper ${on ? "open" : "close"}`}>
      <button className="menu-content__my-account" onClick={status}>
        <Link className="menu-link" to="/home/profile">
          내 정보
        </Link>
      </button>
      <button className="menu-content__notification" onClick={status}>
        <Link className="menu-link" to="/home/notice">
          알림
        </Link>
      </button>
      <button className="menu-content__shared" onClick={status}>
        <Link className="menu-link" to="/home/share">
          공유함
        </Link>
      </button>
      {login_user.username ? (
        <button className="logout-btn" onClick={() => logout()}>
          <IonIcon icon={logOut} className="logout-icon" />
          <p className="logout-text">로그아웃</p>
        </button>
      ) : (
        <button className="logout-btn" onClick={() => navigate("/login")}>
          {/* <IonIcon icon={logIn} className="logout-icon" /> */}
          <p className="logout-text">로그인</p>
        </button>
      )}
    </div>
  );
};

export default Menu;
