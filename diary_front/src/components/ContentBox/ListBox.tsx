import { useNavigate } from "react-router-dom";
import "./ListBox.css";
import { CiClock2 } from "react-icons/ci";
import React from "react";

interface ListBoxProps {
  id: string;
  writer: string;
  date: string;
  text: string;
  time: string;
}

const ListBox: React.FC<ListBoxProps> = ({ id, writer, date, time }) => {
  const navigate = useNavigate();

  const get_day = (idx: number) => {
    const day = ["월", "화", "수", "목", "금", "토", "일"];
    return day[idx];
  };

  const createDate = (dateStr: string, timeStr: string) => {
    const [year, month, day] = dateStr.split("-");
    const [hours, minutes, seconds] = timeStr.split(":");

    // Date 객체를 생성하고, 날짜와 시간을 설정
    const datetime = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds)
    );
    return datetime;
  };

  const generalTime = () => {
    const datetime = createDate(date, time);

    const formattedDate = datetime.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });

    const formattedTime = datetime.toLocaleTimeString("ko-KR", {
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    });
    return { formatted_date: formattedDate, formatted_time: formattedTime };
  };

  const content_date = {
    date: generalTime().formatted_date,
    time: generalTime().formatted_time,
  };

  const date_ = new Date(date);

  return (
    <div
      className="m-w h-a relative"
      style={{ borderBottom: "1px solid rgb(203,203,203)" }}
    >
      <article
        className="m-w border-n p-5 flex a-c j-se bg-n relative cursor-p"
        style={{
          height: "85px",
          borderBottom: "1.5px solid rgb(196, 196, 196) !important",
        }}
        onClick={() => navigate(`/home/diary/${id}`)}
      >
        <div
          className="listbox-left m-h flex flex-c a-c j-c"
          style={{ flex: "0 0 12%", gap: "1px" }}
        >
          <span className="listbox-left-date__date">{date_.getDate()}</span>
          <span className="listbox-left-date__day">
            {get_day(date_.getDay())}
          </span>
        </div>
        <div
          className="over-h f-1 m-h p-5 flex flex-c j-c a-fs"
          style={{ gap: "5px" }}
        >
          <span className="listbox-middle-date">{content_date.date}</span>
          <div
            className="flex a-c"
            style={{ fontSize: "14px", color: "gray", gap: "10px" }}
          >
            <span
              className="cursor-p over-h sumtext listbox-middle-writer"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/home/user/${writer}`);
              }}
            >
              @{writer}
            </span>
            <span className="flex a-c j-c" style={{ gap: "3px" }}>
              <CiClock2 style={{ fontSize: "15px !important" }} />
              {content_date.time}
            </span>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ListBox;
