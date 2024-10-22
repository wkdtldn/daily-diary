import "./Public.css";

import React from "react";
import { NavigateFunction } from "react-router-dom";
import { api } from "../../../api/axiosInstance";
import { IonIcon } from "@ionic/react";
import { close } from "ionicons/icons";

type PublicProps = {
  isOpen: boolean;
  onClose: () => void;
  write_date: string;
  text: string;
  images: string[];
  content: string;
  navigate: NavigateFunction;
};

const PublicComponent: React.FC<PublicProps> = ({
  isOpen,
  onClose,
  write_date,
  text,
  images,
  content,
  navigate,
}) => {
  const write = async (isPublic: boolean) => {
    const res = await api.post("/api/diary/write/", {
      text: text,
      images: images,
      content: content,
      date: write_date,
      is_public: isPublic,
    });
    if (res.status === 201) {
      onClose();
      console.log(res.data);
      navigate("/home/calendar");
    } else {
      console.log("fail");
    }
  };
  return (
    <div
      className="public-modal-overlay"
      style={isOpen ? {} : { display: "none" }}
    >
      <div className="public-modal">
        <div className="public-modal-header">
          <h3 className="public-modal-title">공개/비공개</h3>
          <button className="public-modal-cancel" onClick={onClose}>
            <IonIcon icon={close} size="23" />
          </button>
        </div>
        <div className="public-modal-body">
          공개하실 경우 <strong>모든 사용자</strong>와 함께 당신의 이야기를
          공유할 수 있습니다.
        </div>
        <div className="public-modal-footer">
          <button className="public-modal-btn" onClick={() => write(true)}>
            공개
          </button>
          <button className="public-modal-btn" onClick={() => write(false)}>
            비공개
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicComponent;
