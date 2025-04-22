//  React or core framework imports
import { useEffect, useRef, useState } from 'react';
// Components
import { useNavigate } from 'react-router-dom';
import FileUploader from '../../Components/Cells/FileUploader';
import PreviewWrapper from '../../Components/Cells/PreviewWrapper';
import FilePreviewer from '../../Components/Atoms/FilePreviewer';
import {
  useDeleteFileMutation,
  useFileUploadMutation,
  useLazyGetInvoiceQuery,
  useOnSubmitMutation,
} from '../../Services/Api/module/fileApi';
import {
  API_BASE_URL,
  API_RESPONSE_STATUS_CODE,
  CommonErrorResponse,
  ExtractedData,
  ExtractedDataResponse,
  FileUploadData,
  FileUploadResponse,
  GetInvoiceRequest,
} from '../../Services/Api/Constants';
import ExtractedFields from '../../Components/Molecules/ExtractedFields';
import CommonModal from '../../Components/Molecules/CommonModal';
import useNotification from '../../Hooks/useNotification';

// constants
import {
  BUTTON_TEXT,
  INVOICE_STATUS,
  MESSAGES,
  MODAL_MESSAGES,
  ROUTES,
} from '../../Shared/Constants';
import {
  approveAllFields,
  areAllFieldsApproved,
  checkFileType,
} from '../../Shared/functions';
import IMAGES from '../../Shared/Images';
import { ERRORID, STATUS } from '../../Shared/enum';

function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [statusText, setStatusText] = useState({
    buttonText: BUTTON_TEXT.PENDING,
    status: INVOICE_STATUS.PENDING,
  });
  const fileDataRef = useRef<FileUploadData>();
  const abortControllerRef = useRef<AbortController | null>(null);

  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  const oldStateRef = useRef<ExtractedData | null>(null);
  const [uploadFile, { isLoading: uploadLoading }] = useFileUploadMutation();
  const [deleteFile] = useDeleteFileMutation();
  const [onSubmit] = useOnSubmitMutation();
  const [
    getInvoice,
    {
      isFetching: extractedFieldLoading,
      error: imageDataFetchingError,
      data: wholeExtractedData,
    },
  ] = useLazyGetInvoiceQuery();

  const notify = useNotification();
  const navigate = useNavigate();
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

  const resetExtractedData = () => {
    setExtractedData(null);
    oldStateRef.current = null;
  };
  const handleBack = () => {
    setConfirmationModal(true);
  };

  const handleRemove = async () => {
    if (!fileDataRef.current?.invoiceId) {
      return;
    }
    try {
      await deleteFile({ invoiceId: fileDataRef.current?.invoiceId });
      console.log(abortControllerRef.current, 'controller');
      abortControllerRef.current?.abort();
      resetExtractedData();
      setFile(null);
      setFileUrl(null);
      setConfirmationModal(false);
    } catch (error) {
      const errorObj = error as CommonErrorResponse;
      notify(
        errorObj.data.message || MESSAGES.NOTIFICATION.SOMETHING_WENT_WRONG,
        {
          type: STATUS.error,
        }
      );
    }
  };
  const fetchImageData = async (
    filePath: string,
    invoiceId: number,
    fileType: string
  ) => {
    const controller = new AbortController();
    const getInvoicePayload: GetInvoiceRequest = {
      filePath,
      invoiceId,
      fileType,
      signal: controller.signal,
    };

    abortControllerRef.current = controller;
    // setExtractedData(dummyData.data);
    // oldStateRef.current = JSON.parse(JSON.stringify(dummyData.data));
    try {
      const extractedDataResponse: ExtractedDataResponse =
        await getInvoice(getInvoicePayload).unwrap();
      setExtractedData(extractedDataResponse.data);
      oldStateRef.current = JSON.parse(
        JSON.stringify(extractedDataResponse.data)
      );
    } catch (catchError) {
      const error = catchError as unknown as CommonErrorResponse;
      notify(
        error?.data?.message || MESSAGES.NOTIFICATION.SOMETHING_WENT_WRONG,
        {
          type: STATUS.error,
        }
      );
      if (error.status === API_RESPONSE_STATUS_CODE.NOT_ACCEPTABLE) {
        handleRemove();
      } else if (error.data.errorId === ERRORID.DUPLICATE_INVOICE) {
        resetExtractedData();
        setFile(null);
        setFileUrl(null);
      }
    }
  };

  const handleUpload = async (newFile: File) => {
    setFile(newFile);
    const formData = new FormData();
    try {
      formData.append('file', newFile);
      formData.append('fileType', checkFileType(newFile));
      const fileUploadResponse: FileUploadResponse =
        await uploadFile(formData).unwrap();
      setFileUrl(API_BASE_URL + fileUploadResponse.data.filePath);
      fileDataRef.current = {
        filePath: fileUploadResponse.data.filePath,
        invoiceId: fileUploadResponse.data.invoiceId,
      };
      fetchImageData(
        fileUploadResponse.data.filePath,
        fileUploadResponse.data.invoiceId,
        checkFileType(newFile)
      );
    } catch (catchError) {
      const error = catchError as unknown as CommonErrorResponse;
      notify(
        error?.data?.message || MESSAGES.NOTIFICATION.SOMETHING_WENT_WRONG,
        {
          type: STATUS.error,
        }
      );
      setFile(null);
      setFileUrl(null);
    }
  };

  const handleSave = async () => {
    if (fileDataRef.current?.invoiceId === undefined) {
      notify(MESSAGES.NOTIFICATION.INVOICE_ID_NOT_FOUND);
      return;
    }
    try {
      await onSubmit({
        invoiceId: fileDataRef.current?.invoiceId,
        isApproved: statusText.status === INVOICE_STATUS.APPROVED,
        data: extractedData!,
      });
      oldStateRef.current = JSON.parse(JSON.stringify(extractedData));
      notify(MESSAGES.NOTIFICATION.SAVED);
      navigate(ROUTES.LISTING);
    } catch (errorCatch) {
      const error = errorCatch as unknown as CommonErrorResponse;
      notify(error.data.message || MESSAGES.NOTIFICATION.SOMETHING_WENT_WRONG, {
        type: STATUS.error,
      });
    }
  };

  const onCloseModal = () => {
    setConfirmationModal(false);
  };
  const refetchExtractedData = () => {
    if (
      fileDataRef.current &&
      fileDataRef.current.filePath &&
      fileDataRef.current.invoiceId &&
      file
    ) {
      fetchImageData(
        fileDataRef.current?.filePath,
        fileDataRef.current?.invoiceId,
        checkFileType(file)
      );
    } else {
      notify(MESSAGES.FILE_UPLOADER.FILE_DATA_ERROR, { type: STATUS.error });
    }
  };
  const onRetryCallback = () => {
    resetExtractedData();

    refetchExtractedData();
  };
  const onApproveAllFields = () => {
    if (extractedData) {
      const updatedState = approveAllFields(extractedData);
      setExtractedData(updatedState);
    }
  };

  return (
    <div className="file-uploadbx">
      {!fileUrl ? (
        <div className="fileupload-page">
          <div className="page-title">
            <h1>Upload File</h1>
          </div>
          <FileUploader
            onUpload={handleUpload}
            file={file}
            fileUrl={fileUrl}
            loading={uploadLoading}
            onRemove={handleRemove}
          />
        </div>
      ) : (
        <div className="invoice_preview">
          <PreviewWrapper
            left={
              <div className="file-previewbx">
                <FilePreviewer isImage fileUrl={fileUrl} />
              </div>
            }
            right={
              <div className="extracted-filedsbx">
                <div className="fields-top-section">
                  <h2>File Fields</h2>
                  <div className="top-actions">
                  {extractedData && statusText.status !== INVOICE_STATUS.APPROVED && (  <button
                      onClick={onApproveAllFields}
                      className="approve-btn"
                      type="button"
                    >
                      <span>
                        <img src={IMAGES.tickIcon} alt="save-icon" />
                      </span>
                      Approve All
                    </button>)}
                  </div>
                </div>
                <div className="fields-data">
                  <div className="fields">
                    <ExtractedFields
                      data={extractedData}
                      setData={setExtractedData}
                      loading={extractedFieldLoading}
                      oldStateRef={oldStateRef}
                      onRetry={onRetryCallback}
                      error={!!imageDataFetchingError}
                      invoiceId={wholeExtractedData && wholeExtractedData.id}
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
                    <button
                      type="button"
                      className="back-btn"
                      onClick={handleBack}
                    >
                      <span>
                        {' '}
                        <img src={IMAGES.backIcon} alt="back-icon" />
                      </span>{' '}
                      Back
                    </button>

                    <button
                      onClick={handleSave}
                      className="draft-save-btn"
                      type="button"
                      disabled={extractedFieldLoading || !extractedData}
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
        </div>
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
