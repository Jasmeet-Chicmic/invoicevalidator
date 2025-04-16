import React from 'react';
import './FilePreviewer.css';

type FilePreviewerProps = {
  fileUrl: string;
  file: File;
};

const FilePreviewer: React.FC<FilePreviewerProps> = ({ fileUrl, file }) => {
  const isImage = file.type.startsWith('image/');
  return (
    <div>
      {isImage ? (
        <img src={fileUrl} alt="Preview" className="file-previewer-image" />
      ) : (
        <iframe
          src={fileUrl}
          className="file-previewer-pdf"
          title="PDF Preview"
        />
      )}
    </div>
  );
};

export default FilePreviewer;
