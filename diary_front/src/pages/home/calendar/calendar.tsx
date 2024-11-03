import "./calendar.css";
import "./calendarStyle.css";
import "react-calendar/dist/Calendar.css";

import ListBox from "../../../components/ContentBox/ListBox";
import Preview from "../../../components/modal/preview/Preview";
import { SelectedDate, dateState } from "../../../hooks/recoil/dateState";
import { useRecoilState, useRecoilValue } from "recoil";
import { diary_by_month } from "../../../api/diary";
import { LoginUser } from "../../../hooks/recoil/userState";

import React, { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import moment from "moment";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
type PreviewValue = HTMLDialogElement | null;

type probsPiece = {
  name: string;
  pv: number;
};

type Diary = {
  id: string;
  writer_name: string;
  text: string;
  content: string;
  like: number;
  time: string;
  writer: number;
  date: string;
  images: string[];
  emotion: number;
};

function CalendarPage() {
  const [value, setValue] = useRecoilState<Value>(dateState);
  const [lastSelectedValue, setLastSelectedValue] = useState<Value>(new Date());

  const PreviewRef = useRef<PreviewValue>(null);

  const selected_date = useRecoilValue(SelectedDate);

  const [filterValue, setFilterValue] = useState<string>("recent");

  const [loading, setLoading] = useState(true);

  const [diaries, setDiaries] = useState<Diary[] | null>(null);

  const login_user = useRecoilValue(LoginUser);

  const handleDateClick = (date: Value): void => {
    if (lastSelectedValue?.toString() === date?.toString()) {
      if (login_user.username) {
        PreviewRef.current?.showModal();
      } else {
        alert("로그인을 먼저 진행해주세요");
      }
    } else {
      setLastSelectedValue(date);
      setValue(date);
    }
  };

  useEffect(() => {
    const load_data = async () => {
      if (lastSelectedValue?.toString()) {
        const lastValue = new Date(lastSelectedValue?.toString());
        if (lastValue.getFullYear() !== selected_date?.year) return;
        if (lastValue.getMonth() + 1 !== selected_date?.month) return;

        setLoading(true);
        let date = selected_date?.year + "-" + selected_date?.month;
        let option = filterValue;
        const diaries = await diary_by_month(date, option);
        if (diaries) {
          setDiaries(diaries);
        }
        setLoading(false);
      } else {
        return;
      }
    };
    load_data();
  }, [selected_date, filterValue]);

  const COLORS = ["#a00d0d", "#d66f6f", "#9f9f9f", "#6f8ddb", "#1e43a1"];

  return (
    <div className="calendar-page">
      <Preview modalRef={PreviewRef} />
      <div className="calendar-wrapper">
        <Calendar
          value={value}
          onChange={handleDateClick}
          locale="ko"
          calendarType="gregory"
          formatDay={(locale, date) => date.getDate().toString()}
          tileContent={({ date }: { date: Date }) => {
            return (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  position: "relative",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {diaries?.map((diary) => {
                  if (diary.date === moment(date).format("YYYY-MM-DD")) {
                    return (
                      <div
                        key={diary.id}
                        style={{
                          display: "flex",
                          position: "absolute",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          className="dot"
                          style={{
                            backgroundColor: "gray",
                          }}
                        ></div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            );
          }}
          showNeighboringMonth={false}
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
          <p>loading</p>
        ) : diaries !== null && diaries.length === 0 ? (
          <p>오늘의 일기 작성</p>
        ) : (
          diaries?.map((diary, value) => (
            <ListBox
              id={diary.id}
              text={diary.text}
              writer={diary.writer_name}
              date={diary.date}
              time={diary.time}
              images={diary.images}
              key={value}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default CalendarPage;
