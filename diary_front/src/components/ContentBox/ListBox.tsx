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
    <div style={{ width: "100%", height: "auto", position: "relative" }}>
      <article
        className="listbox-wrapper"
        onClick={() => navigate(`/home/diary/${id}`)}
      >
        <div className="listbox-left">
          <span className="listbox-left-date__date">{date_.getDate()}</span>
          <span className="listbox-left-date__day">
            {get_day(date_.getDay())}
          </span>
        </div>
        <div className="listbox-middle">
          <span className="listbox-middle-date">{content_date.date}</span>
          <div className="listbox-middle__detail-wrapper">
            <span
              className="listbox-middle-writer"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/home/user/${writer}`);
              }}
            >
              @{writer}
            </span>
            <span className="listbox-middle-timeline">
              <CiClock2 className="clock-icon" />
              {content_date.time}
            </span>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ListBox;
