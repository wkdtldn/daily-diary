import "./profile.css";
import { useRecoilValue } from "recoil";
import { LoginUser } from "../../../hooks/recoil/userState";
import { IonIcon } from "@ionic/react";
import { create } from "ionicons/icons";
import RedirectLogin from "../../../components/Redirect-Login/redirect-login";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();

  const login_user = useRecoilValue(LoginUser);

  return (
    <div className="profile-container">
      {login_user.username ? (
        <div className="profile-container">
          <div
            className="profile-header-wrapper"
            style={
              {
                "--bg-image-url": `url(${login_user.image})`,
              } as React.CSSProperties
            }
          >
            <div className="profile-info">
              <div className="profile-info-left">
                <img
                  className="profile-img"
                  src={login_user.image}
                  alt="profile-img"
                />
                <button
                  className="profile-edit-button"
                  onClick={() => navigate("/home/profile-edit")}
                >
                  편집
                  <IonIcon icon={create} size="10" />
                </button>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  flexBasis: "50%",
                }}
              >
                <span className="profile__username">
                  @{login_user.username}
                </span>
                <span className="profile__name">{login_user.name}</span>
              </div>
            </div>

            <div className="profile-follow">
              <div className="profile-follow_option">
                <span>팔로워</span>
                <span className="follow_number">
                  {login_user.follower_count}
                </span>
              </div>
              <div className="profile-follow_option">
                <span>팔로잉</span>
                <span className="follow_number">
                  {login_user.following_count}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-content"></div>
        </div>
      ) : (
        <RedirectLogin />
      )}
    </div>
  );
}
export default ProfilePage;
