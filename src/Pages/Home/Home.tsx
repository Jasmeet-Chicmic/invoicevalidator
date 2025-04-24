//  React or core framework imports
import { useEffect, useRef, useState } from 'react';
// Components
import { useNavigate } from 'react-router-dom';
import FileUploader from '../../Components/Cells/FileUploader';

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

import useNotification from '../../Hooks/useNotification';

// constants
import { MESSAGES, MODAL_MESSAGES, ROUTES } from '../../Shared/Constants';
import { checkFileType } from '../../Shared/functions';
import { ERRORID, STATUS } from '../../Shared/enum';
import PreviewPageTemplate from '../../Components/Template/PreviewPageTemplate';

function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [isSubmitDisable, setIsSubmitDisable] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const fileDataRef = useRef<FileUploadData>();
  const getInvoiceApiRef = useRef<(() => void) | null>(null);

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
    if (wholeExtractedData) {
      setIsSubmitDisable(wholeExtractedData.data?.approved);
    }
  }, [wholeExtractedData]);
  const resetExtractedData = () => {
    setExtractedData(null);
    oldStateRef.current = null;
  };

  const handleRemove = async () => {
    if (!fileDataRef.current?.invoiceId) {
      return;
    }
    try {
      if (getInvoiceApiRef.current) {
        getInvoiceApiRef.current();
      }
      await deleteFile({ invoiceId: fileDataRef.current?.invoiceId });
      // abortControllerRef.current?.abort();
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
    const getInvoicePayload: GetInvoiceRequest = {
      filePath,
      invoiceId,
      fileType,
    };

    // setExtractedData(dummyData.data);
    // oldStateRef.current = JSON.parse(JSON.stringify(dummyData.data));
    try {
      const { unwrap, abort } = getInvoice(getInvoicePayload);
      getInvoiceApiRef.current = abort;
      const extractedDataResponse: ExtractedDataResponse = await unwrap();
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
      } else if (error.data?.errorId === ERRORID.DUPLICATE_INVOICE) {
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
        isApproved,
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
  const handleBack = () => {
    setConfirmationModal(true);
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
  const onConfirmModal = () => {
    handleRemove();
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
        <PreviewPageTemplate
          isImage
          fileUrl={fileUrl}
          extractedData={extractedData}
          setExtractedData={setExtractedData}
          oldStateRef={oldStateRef}
          loading={extractedFieldLoading}
          error={!!imageDataFetchingError}
          wholeExtractedData={wholeExtractedData}
          handleSave={handleSave}
          confirmationModalMsg={MODAL_MESSAGES.CANCLE_INVOICE_CONFIRMATION}
          onCloseModal={onCloseModal}
          onConfirmModal={onConfirmModal}
          confirmModal={confirmationModal}
          handleBack={handleBack}
          isSubmitDisable={isSubmitDisable}
          setIsSubmitDisable={setIsSubmitDisable}
          onRetry={onRetryCallback}
          setIsApproved={setIsApproved}
        />
      )}
    </div>
  );
}

export default Home;
