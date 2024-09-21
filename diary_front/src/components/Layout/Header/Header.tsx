import { useRecoilValue } from "recoil";
import Menu from "../../Menu/Menu";
import "./Header.css";
import React, { useState } from "react";
import { LoginUser } from "../../../hooks/recoil/userState";

const Header = () => {
  const [menuOn, setMenuOn] = useState<boolean>(false);

  const login_user = useRecoilValue(LoginUser);

  return (
    <header className="Header">
      <button
        className="header-btn"
        title="뒤로가기"
        onClick={() => window.history.back()}
      >
        뒤로가기
      </button>
      <span className="header-title">{login_user.name}의 일기장</span>
      <button
        className="header-btn"
        title={menuOn ? "메뉴 닫기" : "메뉴 열기"}
        onClick={() => setMenuOn(!menuOn)}
      >
        {menuOn ? "메뉴 닫기" : "메뉴"}
      </button>
      <Menu on={menuOn} status={() => setMenuOn(false)} />
    </header>
  );
};

export default Header;
