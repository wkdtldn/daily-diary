import "./diary-edit.css";

import { useRecoilState, useRecoilValue } from "recoil";
import { SelectedDate, dateState } from "../../../hooks/recoil/dateState";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDiary } from "../../../api/diary";
import DiaryEditor from "./editor/editor";
import { BarLoader } from "react-spinners";

type Diary = {
  id: string;
  content: string;
  time: string;
  date: string;
};

function DiaryEditPage() {
  const navigate = useNavigate();

  const { diaryId } = useParams<{ diaryId: string }>();

  const [loading, setLoading] = useState(false);
  const [diary, setDiary] = useState<Diary | null>(null);

  const [dateValue, setDateValue] = useRecoilState(dateState);

  useEffect(() => {
    setLoading(true);
    if (diaryId) {
      const searchDiary = async () => {
        const data = await getDiary(diaryId);
        setDiary(data);
        setLoading(false);
        if (diary) {
          let date = new Date(diary.date);
          setDateValue(date);
        }
      };
      searchDiary();
    } else {
      alert("잘못된 주소입니다.");
      navigate("/home");
    }
  }, []);

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
    <>
      {loading ? (
        <div className="m-w m-h flex a-c j-c">
          <BarLoader />
        </div>
      ) : (
        <div className="m-w m-h pt-10 flex a-c flex-c">
          <div
            className="mt-10 mb-10 m-w flex a-c j-fs pl-10"
            style={{ height: "35px", gap: "10px" }}
          >
            <button
              className="write-button border-n bg-n flex a-c j-c"
              onClick={minusDate}
            >
              &lt;
            </button>
            <span className="write-date">
              {writeDate?.year}년 {writeDate?.month}월 {writeDate?.date}일{" "}
              {writeDate?.day}요일
            </span>
            <button
              className="write-button border-n bg-n flex a-c j-c"
              onClick={plusDate}
            >
              &gt;
            </button>
          </div>
          <DiaryEditor
            id={diaryId!}
            year={writeDate?.year}
            month={writeDate?.month}
            date={writeDate?.date}
            editContent={diary?.content}
            beforeDate={diary?.date}
            navigate={navigate}
          />
        </div>
      )}
    </>
  );
}

export default DiaryEditPage;
