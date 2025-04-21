// Library
import React from 'react';
import Modal from 'react-modal';

// Styles
import './CommonModal.scss';
// Constants
import { MODAL_TEXT } from './helpers/Constants';
import { BUTTON } from '../../../Shared/Constants';

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
  okText = MODAL_TEXT.CONFIRM_TEXT,
  closeText = MODAL_TEXT.CLOSE_TEXT,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="common-modal__content"
      overlayClassName="common-modal__overlay"
      ariaHideApp={false}
    >
      <h2>{message}</h2>
      <div className="common-modal__footer">
        <button
          className="common-modal__button blue-btn"
          onClick={onOk}
          type={BUTTON.BUTTON_TYPE.button}
        >
          {okText}
        </button>
        <button
          className="common-modal__button outline-btn"
          onClick={onRequestClose}
          type={BUTTON.BUTTON_TYPE.button}
        >
          {closeText}
        </button>
      </div>
    </Modal>
  );
};

export default CommonModal;
