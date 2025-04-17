import React from 'react';

type FilePreviewerProps = {
  isImage: boolean;
  fileUrl: string;
};

const FilePreviewer: React.FC<FilePreviewerProps> = ({ fileUrl, isImage }) => {
  return (
    <div className="invoice-preview">
      {isImage ? (
        <img
          src={fileUrl}
          alt="Preview"
          style={{ width: '100%', maxHeight: '400px' }}
        />
      ) : (
        <iframe src={fileUrl} width="100%" height="400px" title="PDF Preview" />
      )}
    </div>
  );
};

export default FilePreviewer;
