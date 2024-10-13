import { useRecoilValue } from "recoil";
import Menu from "../../Menu/Menu";
import "./Header.css";
import { useState } from "react";
import { LoginUser } from "../../../hooks/recoil/userState";
import { useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { close, menu, search } from "ionicons/icons";

const Header = () => {
  const navigate = useNavigate();

  const [menuOn, setMenuOn] = useState<boolean>(false);

  const login_user = useRecoilValue(LoginUser);

  return (
    <header className="Header">
      <button className="header-button" onClick={() => setMenuOn(!menuOn)}>
        {!menuOn ? <IonIcon icon={menu} /> : <IonIcon icon={close} />}
      </button>

      <span className="header-title">Daily-Diary</span>
      {!login_user.username ? (
        <button onClick={() => navigate("/login")}>로그인</button>
      ) : (
        false
      )}
      <button className="header-button">
        <IonIcon icon={search} />
      </button>
      <Menu on={menuOn} status={() => setMenuOn(false)} />
    </header>
  );
};

export default Header;
