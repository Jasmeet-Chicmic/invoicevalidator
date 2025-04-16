/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
//  React or core framework imports
import React, { useRef } from 'react';
// Components
import useNotification from '../../../Hooks/useNotification';
import { INPUT, MESSAGES } from '../../../Shared/Constants';
import { isValidFileType } from '../../../Shared/functions';
// Styles
import './FileUploader.scss';

type Props = {
  onUpload: (file: File) => void;
  fileUrl: string | null;
  file: File | null;
  loading: boolean;
  onRemove: () => void;
};

const FileUploader: React.FC<Props> = ({
  onUpload,
  fileUrl,
  file,
  loading,
  onRemove,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const notify = useNotification();

  const handleFile = (selectedFile: File) => {
    if (!isValidFileType(selectedFile)) {
      notify(MESSAGES.NOTIFICATION.FILE_TYPE_NOT_ALLOWED);
      return;
    }

    onUpload(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="file-uploader">
      {loading && (
        <div className="loader-box">
          <p>Uploading...</p>
          <div className="spinner" />
        </div>
      )}
      {!loading && file && fileUrl && (
        <div className="preview-box">
          {file.type.startsWith('image/') ? (
            <img src={fileUrl} alt="Preview" className="preview-image" />
          ) : (
            <div className="pdf-preview">
              <iframe src={fileUrl} title="PDF Preview" className="pdf-frame" />
              <p>{file.name}</p>
            </div>
          )}
          <button type="button" className="remove-btn" onClick={onRemove}>
            Remove
          </button>
        </div>
      )}
      {!loading && (!file || !fileUrl) && (
        <div
          className="dropzone"
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <p>{MESSAGES.FILE_UPLOADER.MESSAGE}</p>
          <span>📁</span>
        </div>
      )}
      <input
        type={INPUT.INPUT_TYPE.FILE}
        accept={INPUT.INPUT_REGEX.FILE}
        ref={inputRef}
        onChange={handleFileChange}
        hidden
      />
    </div>
  );
};

export default FileUploader;
