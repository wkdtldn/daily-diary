import { IonIcon } from "@ionic/react";
import "./redirect-login.css";
import { warning } from "ionicons/icons";
import { Link } from "react-router-dom";

const RedirectLogin = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="redirect-login-page">
        <span className="ERROR-message">
          <IonIcon icon={warning} className="ERROR-icon" />
          로그인이 필요한
          <br />
          페이지입니다!
        </span>
        <Link className="redirect-btn" to="/login">
          로그인 하기
        </Link>
      </div>
    </div>
  );
};

export default RedirectLogin;
