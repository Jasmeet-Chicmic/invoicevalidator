import React from 'react';
import Modal from 'react-modal';

type CommonModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  onOk: () => void;
  message: string;
  okText?: string;
  closeText?: string;
};

const customStyles: Modal.Styles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    padding: '2rem',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
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
      style={customStyles}
      ariaHideApp={false}
    >
      <p>{message}</p>
      <div
        style={{
          marginTop: '1.5rem',
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
        }}
      >
        <button onClick={onRequestClose} type="button">
          {closeText}
        </button>
        <button onClick={onOk} type="button">
          {okText}
        </button>
      </div>
    </Modal>
  );
};

export default CommonModal;
