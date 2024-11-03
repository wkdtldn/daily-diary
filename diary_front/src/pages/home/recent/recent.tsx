import { useEffect, useState } from "react";
import "./recent.css";
import { diary_by_month } from "../../../api/diary";
import ListBox from "../../../components/ContentBox/ListBox";

type InputDatePicker = string | number | readonly string[] | undefined;

type probsPiece = {
  name: string;
  pv: number;
};

type Diary = {
  id: string;
  writer_name: string;
  text: string;
  time: string;
  writer: number;
  date: string;
  images: string[];
};

function RecentPage() {
  const today = new Date();
  const getTodayString = () => {
    let month = today.getMonth() + 1;
    if (String(month).length === 1) {
      return today.getFullYear() + "-0" + month;
    }
    return today.getFullYear() + "-" + month;
  };
  const [selectedDate, setSelectedDate] =
    useState<InputDatePicker>(getTodayString);

  const [loading, setLoading] = useState(true);
  const [diaries, setDiaries] = useState<Diary[] | null>(null);

  useEffect(() => {
    setLoading(true);
    const load_data = async () => {
      let date = selectedDate?.toString();
      if (date) {
        const diaries = await diary_by_month(date);
        if (diaries) {
          setDiaries(diaries);
        }
      }
      setLoading(false);
    };
    load_data();
  }, [selectedDate]);

  return (
    <div className="recent-container">
      <div className="recent-filter-wrapper">
        <input
          className="recent-date-picker"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          type="month"
        />
      </div>
      <div className="recent-history-content">
        {loading ? (
          <p>loadding...</p>
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

export default RecentPage;
