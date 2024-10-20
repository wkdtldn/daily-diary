import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import ImageUploader from "quill-image-uploader";
import "./editor.css";
import { NavigateFunction } from "react-router-dom";
import { api } from "../../../../api/axiosInstance";

// 이미지 업로드 핸들러 설정
// Quill.register("modules/imageUploader", ImageUploader);

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
        alert("미래는 못써");
      } else if (month > today.getMonth() + 1) {
        alert("미래는 못써");
      } else if (date > today.getDate()) {
        alert("미래는 못써");
      } else {
        let writeDate = year + "-" + month + "-" + date;

        console.log(value, images, textContent);

        const res = await api.post("/api/diary/write/", {
          text: textContent,
          images: images,
          content: value,
          date: writeDate,
        });
        if (res.status === 200) {
          console.log(res.data);
          navigate("/home/calendar");
        } else {
          console.log("fail");
        }
      }
    }
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
    </div>
  );
};

export default WriteEditor;
