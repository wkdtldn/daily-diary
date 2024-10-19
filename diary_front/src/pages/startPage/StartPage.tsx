import { Link } from "react-router-dom";
import "./StartPage.css";
import { fetchCookies } from "../../api/token";

function StartPage() {
  return (
    <div className="startpage-container">
      <div className="daily_emotion-wrapper">
        <span className="diary_emotion__title">
          <span className="diary_emotion__title-mood">D</span>aily{" "}
          <span className="diary_emotion__title-mood">E</span>motion
        </span>
      </div>
      <button className="start-btn">
        <Link to="/login">일기 쓰기</Link>
      </button>
    </div>
  );
}

export default StartPage;
