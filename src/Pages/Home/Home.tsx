//  React or core framework imports
import { useEffect, useRef, useState } from 'react';

// Components
import { useNavigate } from 'react-router-dom';
import FileUploader from '../../Components/Cells/FileUploader';
import PreviewWrapper from '../../Components/Cells/PreviewWrapper';
import FilePreviewer from '../../Components/Atoms/FilePreviewer';
import {
  useFileUploadMutation,
  useLazyGetInvoiceQuery,
} from '../../Services/Api/module/fileApi';
import {
  API_BASE_URL,
  ExtractedData,
  FileUploadResponse,
  GetInvoiceRequest,
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
  const [extractedFieldLoading, setExtractedFieldLoading] = useState(true);
  const [submitBtnText, setSubmitBtnText] = useState(BUTTON_TEXT.DRAFT);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  const oldStateRef = useRef<ExtractedData | null>(null);
  const [uploadFile] = useFileUploadMutation();
  const [getInvoice] = useLazyGetInvoiceQuery();
  const notify = useNotification();
  const navigate = useNavigate();
  useEffect(() => {
    if (extractedData && areAllFieldsApproved(extractedData)) {
      setSubmitBtnText(BUTTON_TEXT.SAVE);
    } else {
      setSubmitBtnText(BUTTON_TEXT.DRAFT);
    }
  }, [extractedData]);
  const fetchImageData = async (filePath: string, invoiceId: string) => {
    const getInvoicePayload: GetInvoiceRequest = {
      filePath,
      invoiceId,
    };

    await getInvoice(getInvoicePayload).unwrap();
  };

  useEffect(() => {
    setTimeout(() => {
      const fetchedData: ExtractedData = {
        invoiceDetails: {
          invoiceNo: { value: 'INV-123', confidenceScore: 85, approved: false },
          date: { value: '2024-04-01', confidenceScore: 90, approved: true },
          modeOfPayment: {
            value: 'Credit Card',
            confidenceScore: 75,
            approved: false,
          },
        },
        supplierDetails: {
          name: { value: 'ABC Pvt Ltd', confidenceScore: 95, approved: true },
          address: { value: '123 Street', confidenceScore: 80, approved: true },
          contact: { value: '9876543210', confidenceScore: 70, approved: true },
          gstin: {
            value: '22AAAAA0000A1Z5',
            confidenceScore: 85,
            approved: true,
          },
          stateName: {
            value: 'Karnataka',
            confidenceScore: 88,
            approved: true,
          },
          code: { value: 'KA01', confidenceScore: 60, approved: true },
          email: {
            value: 'abc@example.com',
            confidenceScore: 92,
            approved: true,
          },
        },
        buyerDetails: {
          name: { value: 'XYZ Traders', confidenceScore: 93, approved: true },
          address: { value: '456 Avenue', confidenceScore: 78, approved: true },
          gstin: {
            value: '29BBBBB1111B2Z6',
            confidenceScore: 82,
            approved: true,
          },
          stateName: {
            value: 'Maharashtra',
            confidenceScore: 87,
            approved: true,
          },
          code: { value: 'MH02', confidenceScore: 65, approved: true },
        },
      };
      setExtractedData(fetchedData);
      oldStateRef.current = JSON.parse(JSON.stringify(fetchedData));
      setExtractedFieldLoading(false);
    }, 1000);
  }, [oldStateRef, setExtractedData]);
  const handleUpload = async (newFile: File) => {
    setLoading(true);
    setFile(newFile);
    const formData = new FormData();
    try {
      formData.append('file', newFile);
      const fileUploadResponse: FileUploadResponse =
        await uploadFile(formData).unwrap();
      setFileUrl(API_BASE_URL + fileUploadResponse.data.filePath);
      setLoading(false);
      fetchImageData(
        fileUploadResponse.data.filePath,
        fileUploadResponse.data.invoiceId
      );
    } catch (error) {
      notify(MESSAGES.NOTIFICATION.SOMETHING_WENT_WRONG);
      setFile(null);
      setFileUrl(null);
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setExtractedData(oldStateRef.current);
    setFile(null);
    setFileUrl(null);
  };

  const handleBack = () => {
    setConfirmationModal(true);
  };
  const handleSave = () => {
    oldStateRef.current = JSON.parse(JSON.stringify(extractedData));
    notify(MESSAGES.NOTIFICATION.SAVED);
    navigate(ROUTES.LISTING);
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
                loading={extractedFieldLoading}
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
        onRequestClose={() => setConfirmationModal(false)}
        onOk={() => {
          handleRemove();
          setConfirmationModal(false);
        }}
        message={MODAL_MESSAGES.CANCLE_INVOICE_CONFIRMATION}
      />
    </div>
  );
}

export default Home;
