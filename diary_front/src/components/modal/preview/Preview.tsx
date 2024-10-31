import "./Preview.css";

import React, { RefObject, useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { SelectedDate } from "../../../hooks/recoil/dateState";
import { diary_by_date } from "../../../api/diary";
import DiaryBox from "./diaryBox/DiaryBox";

interface PreviewProps {
  modalRef: RefObject<HTMLDialogElement>;
}

type Diary = {
  id: string;
  writer_name: string;
  text: string;
  content: string;
  like_count: number;
  likes: string[];
  time: string;
  writer: number;
  date: string;
};

const Preview: React.FC<PreviewProps> = ({ modalRef }) => {
  const selected_date = useRecoilValue(SelectedDate);
  const [loading, setLoading] = useState(true);
  const [diaries, setDiaries] = useState<Diary[] | null>(null);

  useEffect(() => {
    setLoading(true);
    const load_data = async () => {
      let date =
        selected_date?.year +
        "-" +
        selected_date?.month +
        "-" +
        selected_date?.date;
      const diaries = await diary_by_date(date);
      if (diaries) {
        setDiaries(diaries);
      }
      setLoading(false);
    };
    load_data();
  }, [selected_date]);

  const ModalClose = (event: React.MouseEvent<HTMLDialogElement>): void => {
    if (modalRef.current && event.target === modalRef.current) {
      modalRef.current.close();
    }
  };

  const ModalClostByButton = (): void => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  return (
    <dialog ref={modalRef} onClick={ModalClose} className="preview-modal">
      {loading ? (
        <p>loadding...</p>
      ) : diaries ? (
        <div className="preview-container">
          <div className="preview-content-header">
            <span className="preview-content-header-title">
              <Link
                className="preview-content-header__date"
                to="/user/username"
              >
                {selected_date?.month}월 {selected_date?.date}일
              </Link>
            </span>
            <button className="close-icon-wrapper" onClick={ModalClostByButton}>
              <IoCloseOutline className="close-icon" />
            </button>
          </div>
          <div className="preview-content">
            <span className="notice-msg">
              (*미리보기의 경우 이미지가 보여지지 않습니다.)
            </span>
            {diaries.map((diary, index) => (
              <DiaryBox
                id={diary.id}
                writer={diary.writer_name}
                date={diary.date}
                text={diary.text}
                content={diary.content}
                like_list={diary.likes}
                like_count={diary.like_count}
                key={index}
              />
            ))}
          </div>
        </div>
      ) : (
        <p>write new diary</p>
      )}
    </dialog>
  );
};

export default Preview;
