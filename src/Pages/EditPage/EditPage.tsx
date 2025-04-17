// Libraries
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Constants
import { ExtractedData } from '../../Services/Api/Constants';
import {
  BUTTON_TEXT,
  INVOICE_STATUS,
  MESSAGES,
  MODAL_MESSAGES,
  ROUTES,
} from '../../Shared/Constants';
// Custom components
import PreviewWrapper from '../../Components/Cells/PreviewWrapper';
import FilePreviewer from '../../Components/Atoms/FilePreviewer';
import ExtractedFields from '../../Components/Molecules/ExtractedFields';
import CommonModal from '../../Components/Molecules/CommonModal';
// Hooks
import useNotification from '../../Hooks/useNotification';
// Utils
import { areAllFieldsApproved } from '../../Shared/functions';
import IMAGES from '../../Shared/Images';

const EditPage = () => {
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  const [extractedFieldLoading, setExtractedFieldLoading] = useState(true);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [statusText, setStatusText] = useState({
    buttonText: BUTTON_TEXT.DRAFT,
    status: INVOICE_STATUS.PENDING,
  });
  const oldStateRef = useRef<ExtractedData | null>(null);
  const navigate = useNavigate();
  const notify = useNotification();
  useEffect(() => {
    if (extractedData && areAllFieldsApproved(extractedData)) {
      setStatusText({
        buttonText: BUTTON_TEXT.SAVE,
        status: INVOICE_STATUS.APPROVED,
      });
    } else {
      setStatusText({
        buttonText: BUTTON_TEXT.DRAFT,
        status: INVOICE_STATUS.PENDING,
      });
    }
  }, [extractedData]);
  useEffect(() => {
    setTimeout(() => {
      const fetchedData: ExtractedData = {
        invoiceDetails: {
          invoiceNo: { value: 'INV-123', confidenceScore: 85, approved: true },
          date: { value: '2024-04-01', confidenceScore: 90, approved: true },
          modeOfPayment: {
            value: 'Credit Card',
            confidenceScore: 75,
            approved: true,
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
  const handleSave = () => {
    oldStateRef.current = JSON.parse(JSON.stringify(extractedData));
    notify(MESSAGES.NOTIFICATION.SAVED);
    navigate(ROUTES.LISTING);
  };

  const handleDiscard = () => {
    // setExtractedData(oldStateRef.current);
    // setConfirmationModal(false);
    navigate(ROUTES.LISTING);
  };
  const handleBack = () => {
    // setConfirmationModal(true);
    handleDiscard();
  };
  return (
    <div className="invoice_preview">
      <PreviewWrapper
        onBack={handleBack}
        left={
          <div className="file-previewbx">
            <FilePreviewer
              isImage
              fileUrl="https://via.placeholder.com/150x150"
            />
          </div>
        }
        right={
          <div className="extracted-filedsbx">
            <div className="fields-top-section">
              <h2>File Fields</h2>
            </div>
            <div className="fields-data">
              <div className="fields">
                <ExtractedFields
                  data={extractedData}
                  setData={setExtractedData}
                  oldStateRef={oldStateRef}
                  loading={extractedFieldLoading}
                />
              </div>
            </div>
            <div className="fields-bottom-section">
              <h3>
                Status:{' '}
                <span className={`${statusText.status}`}>
                  {statusText.status}
                </span>
              </h3>
              <button
                onClick={handleSave}
                className="draft-save-btn ms-auto"
                type="button"
              >
                <span>
                  <img src={IMAGES.saveIcon} alt="save-icon" />
                </span>
                {statusText.buttonText}
              </button>
            </div>
          </div>
        }
      />
      <CommonModal
        isOpen={confirmationModal}
        onRequestClose={() => setConfirmationModal(false)}
        onOk={() => {
          handleDiscard();
        }}
        message={MODAL_MESSAGES.EDIT_INVOICE_CONFIRMATION}
      />
    </div>
  );
};

export default EditPage;
