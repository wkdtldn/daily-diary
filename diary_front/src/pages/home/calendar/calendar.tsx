import "./calendar.css";
import "./calendarStyle.css";
import "react-calendar/dist/Calendar.css";

import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import ContentBox from "../../../components/ContentBox/ContentBox";
import PreviewModal from "../../../components/PreviewModal/PreviewModal";

import { SelectedDate, dateState } from "../../../hooks/recoil/dateState";
import { useRecoilState, useRecoilValue } from "recoil";
import { diary_by_month } from "../../../api/diary";

import { IoColorWand } from "react-icons/io5";
import { Link } from "react-router-dom";
import { LoginUser } from "../../../hooks/recoil/userState";
import RedirectLogin from "../../../components/Redirect-Login/redirect-login";
import Draggable, { DraggableData } from "react-draggable";

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
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleOnDrag = (data: DraggableData) => {
    setPosition({ x: data.x, y: data.y });
  };

  const [value, setValue] = useRecoilState<Value>(dateState);
  const [lastSelectedValue, setLastSelectedValue] = useState<Value>(new Date());
  const PreviewModalRef = useRef<PreviewModalValue>(null);

  const selected_date = useRecoilValue(SelectedDate);

  const [filterValue, setFilterValue] = useState<string>("recent");

  const [loading, setLoading] = useState(true);
  const [diaries, setDiaries] = useState<Diary[] | null>(null);

  const login_user = useRecoilValue(LoginUser);

  const handleDateClick = (date: Value): void => {
    if (lastSelectedValue?.toString() === date?.toString()) {
      if (login_user.username) {
        PreviewModalRef.current?.showModal();
      } else {
        alert("로그인을 먼저 진행해주세요");
      }
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
        {!login_user.username ? (
          <RedirectLogin />
        ) : loading ? (
          <p>loading</p>
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
      <Draggable
        position={{ x: position.x, y: position.y }} // 업데이트된 컴포넌트의 위치를 설정해준다.
        onDrag={(_, data) => handleOnDrag(data)}
      >
        <button className="write-calendar-btn">
          {login_user.username ? (
            <Link className="write-calendar-btn_link" to="/home/write">
              <IoColorWand fontSize={23} fontWeight={600} />
            </Link>
          ) : (
            false
          )}
        </button>
      </Draggable>
    </div>
  );
}

export default CalendarPage;
