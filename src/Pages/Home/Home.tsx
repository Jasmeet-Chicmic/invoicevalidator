//  React or core framework imports
import { useState } from 'react';

// Components
import FileUploader from '../../Components/Cells/FileUploader';
import PreviewWrapper from '../../Components/Cells/PreviewWrapper';
import FilePreviewer from '../../Components/Atoms/FilePreviewer';
import { useFileUploadMutation } from '../../Services/Api/module/fileApi';
import { API_BASE_URL, FileUploadResponse } from '../../Services/Api/Constants';
import ExtractedFields from '../../Components/Molecules/ExtractedFields';
import CommonModal from '../../Components/Molecules/CommonModal';
import useNotification from '../../Hooks/useNotification';
import { MESSAGES } from '../../Shared/Constants';

function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadFile] = useFileUploadMutation();
  const notify = useNotification();
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
      notify(MESSAGES.NOTIFICATION.SOMETHING_WENT_WRONG);
      setFile(null);
      setFileUrl(null);
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setFileUrl(null);
  };

  const handleBack = () => {
    setConfirmationModal(true);
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
          left={
            <FilePreviewer
              isImage={file!.type.startsWith('image/')}
              fileUrl={fileUrl}
            />
          }
          right={<ExtractedFields />}
        />
      )}
      <CommonModal
        isOpen={confirmationModal}
        onRequestClose={() => setConfirmationModal(false)}
        onOk={() => {
          handleRemove();
          setConfirmationModal(false);
        }}
        message="Are you sure you want to continue?"
        okText="Yes"
        closeText="No"
      />
    </div>
  );
}

export default Home;
