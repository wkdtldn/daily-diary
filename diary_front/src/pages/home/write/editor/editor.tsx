import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./editor.css";
import { NavigateFunction } from "react-router-dom";
import PublicComponent from "../../../../components/modal/question/Public";
import { api } from "../../../../api/axiosInstance";

interface WriteEditorProps {
  year: number | undefined;
  month: number | undefined;
  date: number | undefined;
  navigate: NavigateFunction;
}

const WriteEditor: React.FC<WriteEditorProps> = ({
  year,
  month,
  date,
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

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleChange = (content: string) => {
    setValue(content);

    if (!quillref.current) return;
    const quillInstance = quillref.current.getEditor();
    const text = quillInstance.getText();
    setTextContent(text);

    const ops = quillInstance.getContents().ops;
    console.log(ops);
    if (ops) {
      ops.forEach((op: any) => {
        if (op.insert && op.insert.image) {
          const imageUrl = op.insert.image;
          if (imageUrl.startsWith("data:image/")) {
            setImages((prevImages) => [...prevImages, imageUrl]);
          } else {
            fetch(imageUrl)
              .then((response) => response.blob())
              .then((blob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64String = reader.result as string;
                  setImages((prevImages) => [...prevImages, base64String]);
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
  };

  const write = async (isPublic: boolean) => {
    const res = await api.post("/api/diary/", {
      text: textContent,
      images: images,
      content: value,
      date: writeDate(),
      is_public: isPublic,
    });
    if (res.status === 201) {
      setIsOpen(false);
      console.log(res.data);
      navigate("/home/calendar");
    } else {
      console.log("fail");
    }
  };

  const save = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let today = new Date();
    if (year && month && date) {
      if (year > today.getFullYear()) {
        alert("다가오지 않은 날의 일기는 작성할 수 없습니다.");
      } else if (month > today.getMonth() + 1) {
        alert("다가오지 않은 날의 일기는 작성할 수 없습니다.");
      } else if (date > today.getDate()) {
        alert("다가오지 않은 날의 일기는 작성할 수 없습니다.");
      } else {
        if (!value) {
          alert("일기를 작성해주세요");
        } else {
          setIsOpen(!isOpen);
        }
      }
    }
  };
  const writeDate = () => {
    return year + "-" + month + "-" + date;
  };

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
        저장
      </button>
      <PublicComponent
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        write={(is_public) => write(is_public)}
      />
    </div>
  );
};

export default WriteEditor;
