import { NavigateFunction } from "react-router-dom";
import "./Remove.css";
import React from "react";
import { api } from "../../../api/axiosInstance";
import { IonIcon } from "@ionic/react";
import { close, warningOutline } from "ionicons/icons";

interface RemoveProps {
  isOpen: boolean;
  onClose: () => void;
  diary_id: string;
  navigate: NavigateFunction;
}

const RemoveComponent: React.FC<RemoveProps> = ({
  isOpen,
  onClose,
  diary_id,
  navigate,
}) => {
  const remove_diary = async () => {
    await api.delete(`/api/diary/delete/${diary_id}/`).then((res) => {
      if (res.status === 204) {
        onClose();
        navigate("/home/calendar");
      } else {
        console.log("fail");
      }
    });
  };
  return (
    <div
      className="remove-modal-overlay"
      style={isOpen ? {} : { display: "none" }}
    >
      <div className="remove-modal">
        <div className="remove-modal-header">
          <h3 className="remove-modal-title">
            <IonIcon icon={warningOutline} className="remove-modal-warnicon" />
            일기 삭제
            <IonIcon icon={warningOutline} className="remove-modal-warnicon" />
          </h3>
          <button className="remove-modal-cancel" onClick={onClose}>
            <IonIcon icon={close} size="23" />
          </button>
        </div>
        <div className="remove-modal-body">
          이 일기를 삭제하실 경우 다시 <strong>복구</strong>하실 수 없습니다.
        </div>
        <div className="remove-modal-footer">
          <button className="remove-modal-btn_cancel" onClick={onClose}>
            취소
          </button>
          <button className="remove-modal-btn" onClick={remove_diary}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveComponent;
