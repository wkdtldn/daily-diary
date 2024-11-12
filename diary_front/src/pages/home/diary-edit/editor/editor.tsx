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
  const [images, setImages] = useState<string[]>([]);
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
    const res = await api.patch(`/api/diary/update/${id}/`, {
      text: textContent,
      images: images,
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
            if (year && month && date && beforeDate) {
              let d1 = new Date(year, month - 1, date);
              let d2 = new Date(beforeDate);
              if (
                d1.getFullYear() === d2.getFullYear() &&
                d1.getMonth() === d2.getMonth() &&
                d1.getDate() === d2.getDate()
              ) {
                const res = window.confirm(
                  "수정 전과 바뀐 내용이 없습니다.\n그래도 저장하시겠습니까?"
                );
                if (res) {
                  navigate("/home");
                } else {
                }
              } else {
                const quillInstance = quillref.current!.getEditor();
                const ops = quillInstance.getContents().ops;
                const text = quillInstance.getText();
                setTextContent(text);
                if (ops) {
                  ops.forEach((op: any) => {
                    if (op.insert && op.insert.image) {
                      const imageUrl = op.insert.image;
                      if (imageUrl.startsWith("data:image/")) {
                        setImages([imageUrl]);
                      } else {
                        fetch(imageUrl)
                          .then((response) => response.blob())
                          .then((blob) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const base64String = reader.result as string;
                              setImages((prevImages) => [
                                ...prevImages,
                                base64String,
                              ]);
                            };
                            reader.readAsDataURL(blob);
                          })
                          .catch((error) =>
                            console.error("Error converting image:", error)
                          );
                      }
                    }
                  });
                }
                const res = window.confirm("정말로 수정하시겠습니까?");
                if (res) {
                  modalRef.current?.showModal();
                } else {
                }
              }
            }
          }
        }
      }
    }
  };

  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <div className="write-input-wrapper">
      <ReactQuill
        className="customQuill"
        ref={quillref}
        value={value}
        onChange={handleChange}
        modules={modules}
        placeholder="일기를 써주세요!"
      />
      <button className="save-btn" onClick={save}>
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
