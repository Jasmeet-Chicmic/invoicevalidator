import { useEffect, useState } from 'react';
import {
  ExtractedData,
  ExtractedDataResponse,
} from '../../../Services/Api/Constants';
import { BUTTON_TEXT, INVOICE_STATUS } from '../../../Shared/Constants';
import IMAGES from '../../../Shared/Images';
import FilePreviewer from '../../Atoms/FilePreviewer';
import PreviewWrapper from '../../Cells/PreviewWrapper';
import CommonModal from '../../Molecules/CommonModal';
import ExtractedFields from '../../Molecules/ExtractedFields';
import {
  approveAllFields,
  areAllFieldsApproved,
} from '../../../Shared/functions';

type PreviewPageTemplateProps = {
  isImage: boolean;
  fileUrl: string;
  extractedData: ExtractedData | null;
  setExtractedData: React.Dispatch<React.SetStateAction<ExtractedData | null>>;
  oldStateRef: React.MutableRefObject<ExtractedData | null>;
  loading: boolean;
  error: boolean;
  wholeExtractedData: ExtractedDataResponse;
  handleSave: () => void;
  confirmationModalMsg: string;
  onCloseModal: () => void;
  onConfirmModal: () => void;
  confirmModal: boolean;
  handleBack: () => void;
  isSubmitDisable: boolean;
  setIsSubmitDisable: React.Dispatch<React.SetStateAction<boolean>>;
  setIsApproved: React.Dispatch<React.SetStateAction<boolean>>;
  onRetry?: () => void;
};
const PreviewPageTemplate: React.FC<PreviewPageTemplateProps> = ({
  isImage,
  fileUrl,
  extractedData,
  setExtractedData,
  oldStateRef,
  loading,
  error,
  wholeExtractedData,
  handleSave,
  confirmModal,
  handleBack,
  onCloseModal,
  onConfirmModal,
  confirmationModalMsg,
  isSubmitDisable,
  setIsSubmitDisable,
  setIsApproved,
  onRetry = () => {},
}) => {
  const [statusText, setStatusText] = useState({
    buttonText: BUTTON_TEXT.PENDING,
    status: INVOICE_STATUS.PENDING,
  });

  const onApproveAllFields = () => {
    if (extractedData) {
      const updatedState = approveAllFields(extractedData);
      setExtractedData(updatedState);
    }
  };

  useEffect(() => {
    if (extractedData && areAllFieldsApproved(extractedData)) {
      setStatusText({
        buttonText: BUTTON_TEXT.SAVE,
        status: INVOICE_STATUS.APPROVED,
      });
      setIsApproved(true);
    } else {
      setIsApproved(false);
      setStatusText({
        buttonText: BUTTON_TEXT.PENDING,
        status: INVOICE_STATUS.PENDING,
      });
    }
  }, [extractedData, setIsApproved]);

  return (
    <div className="invoice_preview">
      <PreviewWrapper
        left={
          <div className="file-previewbx">
            <FilePreviewer isImage={isImage} fileUrl={fileUrl} />
          </div>
        }
        right={
          <div className="extracted-filedsbx">
            <div className="fields-top-section">
              <h2>File Fields</h2>
              <div className="top-actions">
                {extractedData &&
                  statusText.status !== INVOICE_STATUS.APPROVED && (
                    <button
                      onClick={onApproveAllFields}
                      className="approve-btn"
                      type="button"
                    >
                      <span>
                        <img src={IMAGES.tickIcon} alt="save-icon" />
                      </span>
                      Approve All
                    </button>
                  )}
              </div>
            </div>
            <div className="fields-data">
              <div className="fields">
                <ExtractedFields
                  data={extractedData}
                  setData={setExtractedData}
                  oldStateRef={oldStateRef}
                  loading={loading}
                  error={error}
                  invoiceId={
                    wholeExtractedData && wholeExtractedData.id.toString()
                  }
                  setIsSubmitDisable={setIsSubmitDisable}
                  onRetry={onRetry}
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
              <div className="bottom-actions">
                <button type="button" className="back-btn" onClick={handleBack}>
                  <span>
                    {' '}
                    <img src={IMAGES.backIcon} alt="back-icon" />
                  </span>{' '}
                  Back
                </button>

                <button
                  onClick={handleSave}
                  className="draft-save-btn ms-auto"
                  type="button"
                  disabled={isSubmitDisable}
                >
                  <span>
                    <img src={IMAGES.saveIcon} alt="save-icon" />
                  </span>
                  {statusText.buttonText}
                </button>
              </div>
            </div>
          </div>
        }
      />
      <CommonModal
        isOpen={confirmModal}
        onRequestClose={onCloseModal}
        onOk={onConfirmModal}
        message={confirmationModalMsg}
      />
    </div>
  );
};

export default PreviewPageTemplate;
