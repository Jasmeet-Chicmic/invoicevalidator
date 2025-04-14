import React from 'react';

type FilePreviewerProps = {
  fileUrl: string;
  file: File;
};

const FilePreviewer: React.FC<FilePreviewerProps> = ({ fileUrl, file }) => {
  const isImage = file.type.startsWith('image/');
  return (
    <div>
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
