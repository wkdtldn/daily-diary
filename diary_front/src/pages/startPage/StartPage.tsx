import { Link } from "react-router-dom";
import "./StartPage.css";

function StartPage() {
  return (
    <div className="m-w m-h flex a-c j-c">
      <div className="w-a h-a flex a-c j-c">
        <span className="diary_emotion__title">
          <span className="diary_emotion__title-mood">D</span>aily{" "}
          <span className="diary_emotion__title-mood">E</span>motion
        </span>
      </div>
      <button className="start-btn flex a-c j-c cursor-p absolute border-n">
        <Link to="/login" className="m-w m-h a-c j-c flex">
          일기 쓰기
        </Link>
      </button>
    </div>
  );
}

export default StartPage;
