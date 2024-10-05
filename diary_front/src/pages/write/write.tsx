import "./write.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { SelectedDate, dateState } from "../../hooks/recoil/dateState";
import React, { FormEvent } from "react";
import { diary_write } from "../../api/diary";
import { useHistory } from "react-router-dom";

function WritePage() {
  const history = useHistory();

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

  const submit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    let today = new Date();
    if (writeDate) {
      if (writeDate.year > today.getFullYear()) {
        alert("미래는 못써");
      } else if (writeDate.month > today.getMonth() + 1) {
        alert("미래는 못써");
      } else if (writeDate.date > today.getDate()) {
        alert("미래는 못써");
      } else {
        let formData: FormData = new FormData(e.currentTarget);

        let content = formData.get("content") as string;
        let date =
          writeDate?.year + "-" + writeDate?.month + "-" + writeDate?.date;

        diary_write(content, date);
        history.push("/calendar");
      }
    }
  };

  return (
    <div className="write-container">
      <div className="write-title-wrapper">
        <button onClick={minusDate}>&lt;</button>
        <span className="write-date">
          {writeDate?.year}년 {writeDate?.month}월 {writeDate?.date}일{" "}
          {writeDate?.day}요일
        </span>
        <button onClick={plusDate}>&gt;</button>
      </div>
      <form className="write-form" onSubmit={submit}>
        <textarea
          className="write-input write-input__detail"
          name="content"
          placeholder="내용을 입력해주세요"
        />
        <div className="write-button-wrapper">
          <button className="write-button__submit" type="submit">
            기록하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default WritePage;
