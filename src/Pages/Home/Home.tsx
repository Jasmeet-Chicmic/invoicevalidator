//  React or core framework imports
import { useState } from 'react';

// Components
import FileUploader from '../../Components/Cells/FileUploader';
import PreviewWrapper from '../../Components/Cells/PreviewWrapper';
import FilePreviewer from '../../Components/Atoms/FilePreviewer';
import { useFileUploadMutation } from '../../Services/Api/module/fileApi';

function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadFile] = useFileUploadMutation();

  const handleUpload = async (newFile: File) => {
    const formData = new FormData();
    try {
      formData.append('file', newFile);
      const response = await uploadFile(formData).unwrap();
      console.log('response', response);
    } catch (error) {
      console.log('Error uploading file', error);
    }
    setLoading(true);
    setFile(newFile);

    setTimeout(() => {
      const simulatedUrl = URL.createObjectURL(newFile);
      setFileUrl(simulatedUrl);
      setLoading(false);
    }, 2000);
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
          right={
            <div className="right-side">
              <h3>Metadata</h3>
              <input placeholder="Title" />
              <input placeholder="Description" />
            </div>
          }
        />
      )}
    </div>
  );
}

export default Home;
