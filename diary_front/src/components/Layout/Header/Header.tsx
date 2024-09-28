import { useRecoilValue } from "recoil";
import Menu from "../../Menu/Menu";
import "./Header.css";
import React, { useState } from "react";
import { LoginUser } from "../../../hooks/recoil/userState";
import { IoMenu, IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const [menuOn, setMenuOn] = useState<boolean>(false);

  const login_user = useRecoilValue(LoginUser);

  return (
    <header className="Header">
      <button className="header-btn" onClick={() => setMenuOn(!menuOn)}>
        {menuOn ? <IoClose /> : <IoMenu />}
      </button>
      <span className="header-title">{login_user.name}의 일기장</span>
      <button className="header-btn" onClick={() => navigate("/home/profile")}>
        내 정보
      </button>
      <Menu on={menuOn} status={() => setMenuOn(false)} />
    </header>
  );
};

export default Header;
