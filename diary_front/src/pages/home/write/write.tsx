import "./write.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { SelectedDate, dateState } from "../../../hooks/recoil/dateState";
import { useNavigate } from "react-router-dom";
import WriteEditor from "./editor/editor";

function WritePage() {
  const navigate = useNavigate();

  const [dateValue, setDateValue] = useRecoilState(dateState);
  const writeDate = useRecoilValue(SelectedDate);
  const minusDate = () => {
    if (dateValue) {
      let today = new Date(dateValue.toString());
      today.setDate(today.getDate() - 1);
      setDateValue(today);
      return today;
    }
  };
  const plusDate = () => {
    if (dateValue) {
      let today = new Date(dateValue.toString());
      today.setDate(today.getDate() + 1);
      setDateValue(today);
      return today;
    }
  };

  return (
    <div className="write-container">
      <div className="write-title-wrapper">
        <button className="write-button" onClick={minusDate}>
          &lt;
        </button>
        <span className="write-date">
          {writeDate?.year}년 {writeDate?.month}월 {writeDate?.date}일{" "}
          {writeDate?.day}요일
        </span>
        <button className="write-button" onClick={plusDate}>
          &gt;
        </button>
      </div>
      <WriteEditor
        year={writeDate?.year}
        month={writeDate?.month}
        date={writeDate?.date}
        navigate={navigate}
      />
    </div>
  );
}

export default WritePage;
