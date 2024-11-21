import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./editor.css";
import { NavigateFunction } from "react-router-dom";
import { api } from "../../../../api/axiosInstance";
import PublicComponent from "../../../../components/modal/question/Public";

interface DiaryEditorProps {
  id: string;
  year: number | undefined;
  month: number | undefined;
  date: number | undefined;
  editContent: string | undefined;
  beforeDate: string | undefined;
  navigate: NavigateFunction;
}

const DiaryEditor: React.FC<DiaryEditorProps> = ({
  id,
  year,
  month,
  date,
  editContent,
  beforeDate,
  navigate,
}) => {
  const quillref = useRef<ReactQuill | null>(null);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, false] }],
        ["bold", "italic", "underline", "strike"],
        ["link", "image"],
        [{ color: [] }, { background: [] }],
      ],
    },
  };

  const [value, setValue] = useState("");
  const [textContent, setTextContent] = useState("");

  useEffect(() => {
    if (editContent) {
      setValue(editContent);
    }
  }, []);

  const handleChange = (content: string) => {
    setValue(content);

    if (!quillref.current) return;
    const quillInstance = quillref.current.getEditor();
    const text = quillInstance.getText();
    setTextContent(text);
  };
  const writeDate = () => {
    return year + "-" + month + "-" + date;
  };

  const write = async (isPublic: boolean) => {
    await api.patch(`/api/diary/update/${id}/`, {
      text: textContent,
      content: value,
      date: writeDate(),
      is_public: isPublic,
    });
    navigate("/home");
  };

  const save = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let today = new Date();
    if (year && month && date) {
      if (year > today.getFullYear()) {
        alert("다가오지 않은 날의 일기로 수정할 수 없습니다.");
      } else if (month > today.getMonth() + 1) {
        alert("다가오지 않은 날의 일기로 수정할 수 없습니다.");
      } else if (date > today.getDate()) {
        alert("다가오지 않은 날의 일기로 수정할 수 없습니다.");
      } else {
        if (!value) {
          alert("일기를 작성해주세요");
        } else {
          if (value === editContent) {
            const res = window.confirm(
              "수정 전과 바뀐 내용이 없습니다.\n그래도 저장하시겠습니까?"
            );
            if (res) {
              navigate("/home");
            } else {
            }
          } else {
            const res = window.confirm("정말로 수정하시겠습니까?");
            if (res) {
              modalRef.current?.showModal();
            } else {
            }
          }
        }
      }
    }
  };

  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <div className="f-1 m-w flex a-c j-c overy-a">
      <ReactQuill
        className="f-1 m-h border-n flex flex-c a-c"
        ref={quillref}
        value={value}
        onChange={handleChange}
        modules={modules}
        placeholder="일기를 써주세요!"
      />
      <button className="save-btn absolute border-n" onClick={save}>
        수정
      </button>
      <PublicComponent
        modalRef={modalRef}
        write={(is_public) => write(is_public)}
      />
    </div>
  );
};

export default DiaryEditor;
