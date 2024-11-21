import { IonIcon } from "@ionic/react";
import "./redirect-login.css";
import { warning } from "ionicons/icons";
import { Link } from "react-router-dom";

const RedirectLogin = () => {
  return (
    <div className="m-w m-h flex a-c j-c">
      <div className="redirect-login-page absolute flex-c a-c j-c">
        <span className="ERROR-message flex a-c flex-c j-c">
          <IonIcon icon={warning} className="ERROR-icon" />
          로그인이 필요한
          <br />
          페이지입니다!
        </span>
        <Link className="redirect-btn flex a-c j-c bg-n" to="/login">
          로그인 하기
        </Link>
      </div>
    </div>
  );
};

export default RedirectLogin;
