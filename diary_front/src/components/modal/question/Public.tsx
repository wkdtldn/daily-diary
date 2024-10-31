import "./Public.css";

import React from "react";
import { NavigateFunction } from "react-router-dom";
import { api } from "../../../api/axiosInstance";
import { IonIcon } from "@ionic/react";
import { close } from "ionicons/icons";

type PublicProps = {
  isOpen: boolean;
  onClose: () => void;
  write: (bool: boolean) => void;
};

const PublicComponent: React.FC<PublicProps> = ({ isOpen, onClose, write }) => {
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
