import React from 'react';
import './FilePreviewer.scss';

type FilePreviewerProps = {
  isImage: boolean;
  fileUrl: string;
};

const FilePreviewer: React.FC<FilePreviewerProps> = ({ fileUrl, isImage }) => {
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
