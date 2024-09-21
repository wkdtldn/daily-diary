import React from "react";
import "./Menu.css";
import { Link, useNavigate } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import { logout } from "../../api/user";

type MenuProps = { on: boolean; status: VoidFunction };

const Menu: React.FC<MenuProps> = ({ on, status }) => {
  const navigate = useNavigate();

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
      <button className="logout-btn" onClick={() => logout(navigate)}>
        <IoLogOut className="logout-icon" />
        <p className="logout-text">로그아웃</p>
      </button>
    </div>
  );
};

export default Menu;
