import { Link, useHistory } from "react-router-dom";
import "./profile.css";
import { useRecoilValue } from "recoil";
import { LoginUser } from "../../hooks/recoil/userState";
import { IonButton, IonIcon, IonPage } from "@ionic/react";
import { create, warning } from "ionicons/icons";

function ProfilePage() {
  const history = useHistory();

  const login_user = useRecoilValue(LoginUser);
  console.log(login_user.username);
  return (
    <IonPage className="profile-container">
      {login_user.username ? (
        <div className="profile-container">
          <div className="profile-info__wrapper">
            <div className="profile-info-left">
              <img
                className="profile-img"
                src="https://cdn.pixabay.com/photo/2020/05/17/20/21/cat-5183427_1280.jpg"
                alt="profile-img"
              />
              <IonButton
                className="profile-edit-button"
                onClick={() => history.push("/profile-edit")}
              >
                편집
                <IonIcon icon={create} size="10" />
              </IonButton>
            </div>
            <div className="profile-info">
              <span className="profile__username">@{login_user.username}</span>
              <span className="profile__name">{login_user.name}</span>
            </div>
          </div>
          <div className="profile-content"></div>
        </div>
      ) : (
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
      )}
    </IonPage>
  );
}
export default ProfilePage;
