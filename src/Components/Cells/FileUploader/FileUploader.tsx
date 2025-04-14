import React, { useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './FileUploader.scss';
import useNotification from '../../../Hooks/useNotification';
import { MESSAGES } from '../../../Shared/Constants';

type Props = {
  onUpload: (file: File) => void;
};

const FileUploader: React.FC<Props> = ({ onUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const notify = useNotification();

  const isValidFileType = (file: File) => {
    return file.type.startsWith('image/') || file.type === 'application/pdf';
  };

  const handleFile = (selectedFile: File) => {
    if (!isValidFileType(selectedFile)) {
      notify(MESSAGES.NOTIFICATION.FILE_TYPE_NOT_ALLOWED, { variant: 'error' });
      return;
    }

    setFile(selectedFile);
    onUpload(selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': []
    },
    multiple: false,
    onDrop
  });

  const handleClick = () => {
    inputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    inputRef.current!.value = '';
  };

  return (
    <div className="file-uploader">
      {file ? (
        <div className="preview-box">
          {file.type.startsWith('image/') && previewUrl ? (
            <img src={previewUrl} alt="Preview" className="preview-image" />
          ) : previewUrl && file.type === 'application/pdf' ? (
            <iframe
              src={previewUrl}
              title="PDF Preview"
              className="pdf-frame"
              width="100%"
              height="400px"
            />
          ) : (
            <div className="pdf-preview">
              <span>📄</span>
              <p>{file.name}</p>
            </div>
          )}
          <button className="remove-btn" onClick={removeFile}>Remove</button>
        </div>
      ) : (
        <div
          {...getRootProps({ className: 'dropzone' })}
          onClick={handleClick}
        >
          <input {...getInputProps()} />
          <p>
            {isDragActive
              ? 'Drop the file here...'
              : MESSAGES.FILE_UPLOADER.MESSAGE}
          </p>
          <span>📁</span>
        </div>
      )}

      <input
        type="file"
        accept=".pdf,image/*"
        ref={inputRef}
        onChange={(e) => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile) {
            handleFile(selectedFile);
          }
        }}
        hidden
      />
    </div>
  );
};

export default FileUploader;
