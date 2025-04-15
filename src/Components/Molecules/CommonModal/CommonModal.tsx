import React from 'react';
import Modal from 'react-modal';
import './CommonModal.scss';

type CommonModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  onOk: () => void;
  message: string;
  okText?: string;
  closeText?: string;
};

const CommonModal: React.FC<CommonModalProps> = ({
  isOpen,
  onRequestClose,
  onOk,
  message,
  okText = 'Yes',
  closeText = 'No',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="common-modal__content"
      overlayClassName="common-modal__overlay"
      ariaHideApp={false}
    >
      <p>{message}</p>
      <div className="common-modal__footer">
        <button
          className="common-modal__button"
          onClick={onRequestClose}
          type="button"
        >
          {closeText}
        </button>
        <button className="common-modal__button" onClick={onOk} type="button">
          {okText}
        </button>
      </div>
    </Modal>
  );
};

export default CommonModal;
