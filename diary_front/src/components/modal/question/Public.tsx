import "./Public.css";

import React, { RefObject } from "react";
import { IonIcon } from "@ionic/react";
import { close } from "ionicons/icons";

type PublicProps = {
  modalRef: RefObject<HTMLDialogElement>;
  write: (bool: boolean) => void;
};

const PublicComponent: React.FC<PublicProps> = ({ modalRef, write }) => {
  const ModalClose = (event: React.MouseEvent<HTMLDialogElement>): void => {
    if (modalRef.current && event.target === modalRef.current) {
      modalRef.current.close();
    }
  };

  return (
    <dialog
      className="public-modal border-n over-h"
      ref={modalRef}
      onClick={ModalClose}
    >
      <div
        className="public-modal-container m-w m-h border-n flex flex-c a-c pb-10"
        style={{ gap: "8px" }}
      >
        <div className="public-modal-header h-a flex a-c j-c relative">
          <h3 className="public-modal-title">공개/비공개</h3>
          <button
            className="public-modal-cancel absolute right border-n round flex a-c j-c"
            onClick={() => modalRef.current?.close()}
          >
            <IonIcon icon={close} size="23" />
          </button>
        </div>
        <div className="public-modal-body f-1 ta-c">
          공개하실 경우 <strong>모든 사용자</strong>와 함께 당신의 이야기를
          공유할 수 있습니다.
        </div>
        <div className="m-w h-a flex j-se a-c">
          <button
            className="public-modal-btn border-n"
            onClick={() => write(true)}
          >
            공개
          </button>
          <button
            className="public-modal-btn border-n"
            onClick={() => write(false)}
          >
            비공개
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default PublicComponent;
