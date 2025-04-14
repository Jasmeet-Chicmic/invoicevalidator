import React from 'react';

type Props = {
  fileUrl: string;
  file: File;
};

const FilePreviewer: React.FC<Props> = ({ fileUrl, file }) => {
  return (
    <div>
      {file.type.startsWith('image/') ? (
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
