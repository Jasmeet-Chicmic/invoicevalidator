//  React or core framework imports
import { useEffect, useRef, useState } from 'react';

// Components
import { useNavigate } from 'react-router-dom';
import FileUploader from '../../Components/Cells/FileUploader';
import PreviewWrapper from '../../Components/Cells/PreviewWrapper';
import FilePreviewer from '../../Components/Atoms/FilePreviewer';
import { useFileUploadMutation } from '../../Services/Api/module/fileApi';
import {
  API_BASE_URL,
  ExtractedData,
  FileUploadResponse,
} from '../../Services/Api/Constants';
import ExtractedFields from '../../Components/Molecules/ExtractedFields';
import CommonModal from '../../Components/Molecules/CommonModal';
import useNotification from '../../Hooks/useNotification';

// constants
import {
  BUTTON_TEXT,
  MESSAGES,
  MODAL_MESSAGES,
  ROUTES,
} from '../../Shared/Constants';
import { areAllFieldsApproved } from '../../Shared/functions';

function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitBtnText, setSubmitBtnText] = useState(BUTTON_TEXT.DRAFT);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  const oldStateRef = useRef<ExtractedData | null>(null);
  const [uploadFile] = useFileUploadMutation();
  const notify = useNotification();
  const navigate = useNavigate();
  useEffect(() => {
    if (extractedData && areAllFieldsApproved(extractedData)) {
      setSubmitBtnText(BUTTON_TEXT.SAVE);
    } else {
      setSubmitBtnText(BUTTON_TEXT.DRAFT);
    }
  }, [extractedData]);
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
    setConfirmationModal(false);
  };

  const handleBack = () => {
    setConfirmationModal(true);
  };
  const handleSave = () => {
    oldStateRef.current = JSON.parse(JSON.stringify(extractedData));
    notify(MESSAGES.NOTIFICATION.SAVED);
    navigate(ROUTES.LISTING);
  };

  const onCloseModal = () => {
  setConfirmationModal(false);
}
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
        <>
          <PreviewWrapper
            onBack={handleBack}
            left={
              <FilePreviewer
                isImage={file!.type.startsWith('image/')}
                fileUrl={fileUrl}
              />
            }
            right={
              <ExtractedFields
                data={extractedData}
                setData={setExtractedData}
                oldStateRef={oldStateRef}
              />
            }
          />
          <button onClick={handleSave} type="button">
            {submitBtnText}
          </button>
        </>
      )}
      <CommonModal
        isOpen={confirmationModal}
        onRequestClose={onCloseModal}
        onOk={handleRemove}
        message={MODAL_MESSAGES.CANCLE_INVOICE_CONFIRMATION}
      />
    </div>
  );
}

export default Home;
