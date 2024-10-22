import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./editor.css";
import { NavigateFunction } from "react-router-dom";
import PublicComponent from "../../../../components/modal/question/Public";

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
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
      ["bold", "italic", "underline", "strike"],
      ["link", "image"],
      [{ color: [] }, { background: [] }],
    ],
  };

  const quillref = useRef<ReactQuill | null>(null);

  const [value, setValue] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [textContent, setTextContent] = useState("");

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleChange = (content: string) => {
    setValue(content);

    if (!quillref.current) return;
    const quillInstance = quillref.current.getEditor();
    const text = quillInstance.getText();
    console.log(text);
    setTextContent(text);

    const ops = quillInstance.getContents().ops;
    console.log(ops);
    if (ops) {
      const imageUrls: string[] = [];

      ops.forEach((op: any) => {
        if (op.insert && op.insert.image) {
          imageUrls.push(op.insert.image);
        }
      });
      setImages(imageUrls);
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
        setIsOpen(!isOpen);
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
        write_date={writeDate()}
        text={textContent}
        images={images}
        content={value}
        navigate={navigate}
      />
    </div>
  );
};

export default WriteEditor;
