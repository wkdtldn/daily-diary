import "./calendar.css";
import "react-calendar/dist/Calendar.css";

import React, { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import ContentBox from "../../../components/ContentBox/ContentBox";
import PreviewModal from "../../../components/PreviewModal/PreviewModal";

import { SelectedDate, dateState } from "../../../hooks/recoil/dateState";
import { useRecoilState, useRecoilValue } from "recoil";
import { diary_by_month } from "../../../api/diary";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
type PreviewModalValue = HTMLDialogElement | null;

type Diary = {
  id: string;
  writer_name: string;
  content: string;
  like: number;
  time: string;
  writer: number;
  date: string;
};

function CalendarPage() {
  const [value, setValue] = useRecoilState<Value>(dateState);
  const [lastSelectedValue, setLastSelectedValue] = useState<Value>(new Date());
  const PreviewModalRef = useRef<PreviewModalValue>(null);

  const selected_date = useRecoilValue(SelectedDate);

  const [filterValue, setFilterValue] = useState<string>("recent");

  const [loading, setLoading] = useState(true);
  const [diaries, setDiaries] = useState<Diary[] | null>(null);

  const handleDateClick = (date: Value): void => {
    if (lastSelectedValue?.toString() === date?.toString()) {
      PreviewModalRef.current?.showModal();
    } else {
      setLastSelectedValue(date);
      setValue(date);
    }
  };

  useEffect(() => {
    setLoading(true);
    const load_data = async () => {
      let date = selected_date?.year + "-" + selected_date?.month;
      let option = filterValue;
      const diaries = await diary_by_month(date, option);
      if (diaries) {
        setDiaries(diaries);
      }
      setLoading(false);
    };
    load_data();
  }, [selected_date, filterValue]);

  return (
    <div className="calendar-page">
      <PreviewModal modalRef={PreviewModalRef} />
      <div className="calendar-wrapper">
        <Calendar
          value={value}
          onChange={handleDateClick}
          locale="ko"
          calendarType="gregory"
          formatDay={(locale, date) => date.getDate().toString()}
          minDetail="year"
          prev2Label={null}
          next2Label={null}
        />
      </div>
      <div className="filter-wrapper">
        <div className="selected-date">
          <span className="filter-select__year">{selected_date?.year}년</span>{" "}
          <span className="filter-select__month">{selected_date?.month}월</span>{" "}
          <span className="filter-select__date">{selected_date?.date}일</span>{" "}
          <span className="filter-select__day">{selected_date?.day}요일</span>
        </div>
        <select
          id="showOption"
          className="filter-show__select"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        >
          <option value="recent" className="filter-show__option">
            최신순
          </option>
          <option value="old" className="filter-show__option">
            오래된순
          </option>
          <option value="like" className="filter-show__option">
            좋아요순
          </option>
        </select>
      </div>
      <div className="content-container">
        {loading ? (
          <p>loadding...</p>
        ) : (
          diaries?.map((diary, value) => (
            <ContentBox
              writer={diary.writer_name}
              date={diary.date}
              time={diary.time}
              content={diary.content}
              like={diary.like}
              key={value}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default CalendarPage;
