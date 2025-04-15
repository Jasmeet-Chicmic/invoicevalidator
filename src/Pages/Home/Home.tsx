//  React or core framework imports
import { useState } from 'react';

// Components
import FileUploader from '../../Components/Cells/FileUploader';
import PreviewWrapper from '../../Components/Cells/PreviewWrapper';
import FilePreviewer from '../../Components/Atoms/FilePreviewer';
import { useFileUploadMutation } from '../../Services/Api/module/fileApi';
import { API_BASE_URL, FileUploadResponse } from '../../Services/Api/Constants';
import ExtractedFields from '../../Components/Molecules/ExtractedFields';

function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadFile] = useFileUploadMutation();

  const handleUpload = async (newFile: File) => {
    setLoading(true);
    setFile(newFile);
    const formData = new FormData();
    try {
      formData.append('file', newFile);
      const fileUploadResponse: FileUploadResponse =
        await uploadFile(formData).unwrap();
      setFileUrl(API_BASE_URL + fileUploadResponse.file_path);
      setLoading(false);
    } catch (error) {
      console.log('Error uploading file', error);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setFileUrl(null);
  };

  const handleBack = () => {
    handleRemove();
  };

  return (
    <div className="file-uploadbx">
      {!fileUrl ? (
        <FileUploader
          onUpload={handleUpload}
          file={file}
          fileUrl={fileUrl}
          loading={loading}
          onRemove={handleRemove}
        />
      ) : (
        <PreviewWrapper
          onBack={handleBack}
          left={<FilePreviewer file={file!} fileUrl={fileUrl} />}
          right={<ExtractedFields />}
        />
      )}
    </div>
  );
}

export default Home;
