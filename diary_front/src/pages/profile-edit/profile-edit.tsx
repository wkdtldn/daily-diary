import "./profile-edit.css";

import { IonContent, IonPage } from "@ionic/react";

function ProfileEditPage() {
  return (
    <IonPage className="profile_edit-container">
      <img
        className="profile-img"
        src="https://cdn.pixabay.com/photo/2020/05/17/20/21/cat-5183427_1280.jpg"
        alt="profile-img"
      />
      <div className="profile-edit-input__wrapper">
        <input type="text" className="profile-edit-input" required />
        <label className="profile-edit-label">아이디을 입력해주세요</label>
      </div>
    </IonPage>
  );
}

export default ProfileEditPage;
