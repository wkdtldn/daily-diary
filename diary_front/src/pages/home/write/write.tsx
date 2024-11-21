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
    <div className="m-w m-h pt-10 flex a-c flex-c">
      <div
        className="mt-10 mb-10 m-w flex a-c j-fs pl-10"
        style={{ height: "35px", gap: "10px" }}
      >
        <button
          className="border-n bg-n flex a-c j-c write-button"
          onClick={minusDate}
        >
          &lt;
        </button>
        <span className="write-date">
          {writeDate?.year}년 {writeDate?.month}월 {writeDate?.date}일{" "}
          {writeDate?.day}요일
        </span>
        <button
          className="border-n bg-n flex a-c j-c write-button"
          onClick={plusDate}
        >
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
