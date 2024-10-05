import { useRecoilValue } from "recoil";
import Menu from "../../Menu/Menu";
import "./Header.css";
import React, { useState } from "react";
import { LoginUser } from "../../../hooks/recoil/userState";
import { IoMenu, IoClose, IoSearchOutline } from "react-icons/io5";
import { useHistory } from "react-router-dom";
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { menu, close, heart, search } from "ionicons/icons";

const Header = () => {
  const history = useHistory();

  const [menuOn, setMenuOn] = useState<boolean>(false);

  const login_user = useRecoilValue(LoginUser);

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton onClick={() => setMenuOn(!menuOn)}>
            {!menuOn ? <IonIcon icon={menu} /> : <IonIcon icon={close} />}
          </IonButton>
        </IonButtons>

        <IonTitle className="header-title">Daily-Diary</IonTitle>
        <IonButtons slot="end">
          <IonButton>
            <IonIcon icon={search} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <Menu on={menuOn} status={() => setMenuOn(false)} />
    </IonHeader>
  );
};

export default Header;
