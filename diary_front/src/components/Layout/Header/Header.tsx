import Menu from "../../Menu/Menu";
import "./Header.css";
import { useState } from "react";
import { IonIcon } from "@ionic/react";
import { close, menu } from "ionicons/icons";

const Header = () => {
  const [menuOn, setMenuOn] = useState<boolean>(false);

  return (
    <header>
      <button
        className="header-button absolute border-n flex a-c j-c bg-n"
        style={{ left: "10px" }}
        onClick={() => setMenuOn(!menuOn)}
      >
        {!menuOn ? <IonIcon icon={menu} /> : <IonIcon icon={close} />}
      </button>

      <span className="header-title">Daily-Diary</span>
      <Menu on={menuOn} status={() => setMenuOn(false)} />
    </header>
  );
};

export default Header;
