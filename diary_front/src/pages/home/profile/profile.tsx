import { Link } from "react-router-dom";
import "./profile.css";
import { useState } from "react";
import {
  AboutDiary,
  AboutEmotion,
} from "../../../components/Profile/Content/ProfileContent";
import { useRecoilValue } from "recoil";
import { LoginUser } from "../../../hooks/recoil/userState";

function ProfilePage() {
  const [otherOption, setOtherOption] = useState("diary");

  const login_user = useRecoilValue(LoginUser);

  return (
    <div className="profile-container">
      <h2 className="profile-title">내 정보</h2>
      <img
        className="profile-img"
        src="https://mblogthumb-phinf.pstatic.net/MjAxODA1MDNfMjQ0/MDAxNTI1MzA5NTYwMDc1.zjtNIKShHMyj7pSbrl9iiGCCVNKpkX3sdmXz0hAEVlIg.ygl01UhsaCHIm3az4GsW7eomkFV2vWqlUl9vlAFz52Qg.JPEG.cookierun_35/%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%94%84%EB%A0%8C%EC%A6%88%EC%BA%90%EB%A6%AD%ED%84%B0.jpg?type=w800"
        width="250px"
        alt="profile-img"
      />
      <span className="profile-name">{login_user.name}</span>
      <span className="profile-username">
        <Link to="/user/jangsiwoo">@{login_user.username}</Link>
      </span>
      <div className="profile-etc">
        <div className="profile-options">
          <button
            className="profile-option"
            onClick={() => setOtherOption("diary")}
          >
            일기
          </button>
          <button
            className="profile-option"
            onClick={() => setOtherOption("emotion")}
          >
            통계
          </button>
        </div>
        <div className="profile-etc__">
          {otherOption === "diary" ? <AboutDiary /> : false}
          {otherOption === "emotion" ? <AboutEmotion /> : false}
        </div>
      </div>
    </div>
  );
}
export default ProfilePage;
