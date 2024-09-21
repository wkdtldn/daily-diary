import React from "react";
import "./Menu.css";
import { Link } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";

type MenuProps = { on: boolean; status: VoidFunction };

const Menu: React.FC<MenuProps> = ({ on, status }) => {
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
      <button className="logout-btn" onClick={() => IoLogOut}>
        <IoLogOut className="logout-icon" />
        로그아웃
      </button>
    </div>
  );
};

export default Menu;
