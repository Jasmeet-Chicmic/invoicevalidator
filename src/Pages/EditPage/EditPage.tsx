// Libraries
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Constants
import {
  API_BASE_URL,
  CommonErrorResponse,
  ExtractedData,
} from '../../Services/Api/Constants';
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
import { approveAllFields, areAllFieldsApproved } from '../../Shared/functions';
import IMAGES from '../../Shared/Images';
import {
  useEditDataQuery,
  useOnSubmitMutation,
} from '../../Services/Api/module/fileApi';
import { STATUS } from '../../Shared/enum';

const EditPage = () => {
  const navigate = useNavigate();
  const notify = useNotification();
  const oldStateRef = useRef<ExtractedData | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  const [onSubmit] = useOnSubmitMutation();
  const [confirmationModal, setConfirmationModal] = useState(false);
  const { invoiceId } = useParams();

  const {
    data,
    error,
    isFetching: loading,
  } = useEditDataQuery(
    { invoiceId: Number(invoiceId) },
    { skip: !invoiceId, refetchOnMountOrArgChange: true }
  );

  const [statusText, setStatusText] = useState({
    buttonText: BUTTON_TEXT.PENDING,
    status: INVOICE_STATUS.PENDING,
  });
  const extractedEditData = useMemo(() => {
    if (data) {
      return data.data;
    }
    return null;
  }, [data]);

  useEffect(() => {
    if (invoiceId === undefined) {
      navigate(ROUTES.LISTING);
    }
  }, [invoiceId, navigate]);

  useEffect(() => {
    if (extractedData && areAllFieldsApproved(extractedData)) {
      setStatusText({
        buttonText: BUTTON_TEXT.SAVE,
        status: INVOICE_STATUS.APPROVED,
      });
    } else {
      setStatusText({
        buttonText: BUTTON_TEXT.PENDING,
        status: INVOICE_STATUS.PENDING,
      });
    }
  }, [extractedData]);

  useEffect(() => {
    if (data) {
      const editExtractedData = data.data?.data;
      setExtractedData(editExtractedData);
      oldStateRef.current = JSON.parse(JSON.stringify(editExtractedData));
    }
  }, [data]);

  const handleSave = async () => {
    if (extractedEditData && extractedEditData.id === undefined) {
      notify(MESSAGES.NOTIFICATION.INVOICE_ID_NOT_FOUND);
      return;
    }
    try {
      await onSubmit({
        invoiceId: extractedEditData.id,
        isApproved: statusText.status === INVOICE_STATUS.APPROVED,
        data: extractedData!,
      });
      oldStateRef.current = JSON.parse(JSON.stringify(extractedData));
      notify(MESSAGES.NOTIFICATION.SAVED);
      navigate(ROUTES.LISTING);
    } catch (errorCatch) {
      const errorObj = errorCatch as unknown as CommonErrorResponse;
      notify(
        errorObj.data.message || MESSAGES.NOTIFICATION.SOMETHING_WENT_WRONG,
        {
          type: STATUS.error,
        }
      );
    }
  };

  const handleDiscard = () => {
    navigate(ROUTES.LISTING);
  };
  const handleBack = () => {
    handleDiscard();
  };
  const onApproveAllFields = () => {
    if (extractedData) {
      const updatedState = approveAllFields(extractedData);
      setExtractedData(updatedState);
    }
  };
  return (
    <div className="invoice_preview">
      <PreviewWrapper
        left={
          <div className="file-previewbx">
            <FilePreviewer
              isImage={extractedEditData && extractedEditData.type}
              fileUrl={
                extractedEditData &&
                `${API_BASE_URL}/${extractedEditData.mediaUrl}`
              }
            />
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
                  error={!!error}
                  invoiceId={extractedEditData && extractedEditData.id}
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
