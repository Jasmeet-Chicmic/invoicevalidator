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
import { areAllFieldsApproved, checkFileType } from '../../Shared/functions';
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

  // const dummyData = {
  //   id: 288,
  //   mediaUrl: '/media/esi.jpg',
  //   fileUrl: null,
  //   uploadedOn: '2025-04-17T07:11:21.431369Z',
  //   approved: false,
  //   data: {
  //     invoiceDetails: {
  //       invoiceNo: {
  //         value: '3131',
  //         confidenceScore: 0.666,
  //         approved: false,
  //       },
  //       ewayBillNo: {
  //         value: null,
  //         confidenceScore: 0.0,
  //         approved: false,
  //       },
  //       date: {
  //         value: '31.07.2024',
  //         confidenceScore: 0.6606,
  //         approved: false,
  //       },
  //       ackNo: {
  //         value: null,
  //         confidenceScore: 0.0,
  //         approved: false,
  //       },
  //       ackDate: {
  //         value: null,
  //         confidenceScore: 0.0,
  //         approved: false,
  //       },
  //       modeOfPayment: {
  //         value: null,
  //         confidenceScore: 0.0,
  //         approved: false,
  //       },
  //     },
  //     supplierDetails: {
  //       name: {
  //         value: 'Ekonkar Consultancy Services',
  //         confidenceScore: 0.9688,
  //         approved: false,
  //       },
  //       address: {
  //         value:
  //           'B-1309, Golden City, Near Sidhu Dairy, Sector-4, Kharar, SAS NAGAR, MOHALI PB-140301',
  //         confidenceScore: 1.0,
  //         approved: false,
  //       },
  //       contact: {
  //         value: '9814085656, 9814585656',
  //         confidenceScore: 1.0,
  //         approved: false,
  //       },
  //       companyPan: {
  //         value: 'BEVPS9909C',
  //         confidenceScore: 1.0,
  //         approved: false,
  //       },
  //       gstin: {
  //         value: '03BEVPS9909C1Z1',
  //         confidenceScore: 1.0,
  //         approved: false,
  //       },
  //       stateName: {
  //         value: null,
  //         confidenceScore: 0.0,
  //         approved: false,
  //       },
  //       code: {
  //         value: null,
  //         confidenceScore: 0.0,
  //         approved: false,
  //       },
  //       email: {
  //         value: 'jassalbs1309@gmail.com, baljitjasal@gmail.com',
  //         confidenceScore: 1.0,
  //         approved: false,
  //       },
  //     },
  //     buyerDetails: {
  //       name: {
  //         value: 'CHICMIC TECHNOLOGIES LLP',
  //         confidenceScore: 0.918,
  //         approved: false,
  //       },
  //       address: {
  //         value: 'F-273, INDL. AREA, PHASE-8, MOHALI-PB',
  //         confidenceScore: 1.0,
  //         approved: false,
  //       },
  //       gstin: {
  //         value: '03AARFC2070M1ZC',
  //         confidenceScore: 1.0,
  //         approved: false,
  //       },
  //       stateName: {
  //         value: null,
  //         confidenceScore: 0.0,
  //         approved: false,
  //       },
  //       code: {
  //         value: null,
  //         confidenceScore: 0.0,
  //         approved: false,
  //       },
  //     },
  //     consigneeDetails: {
  //       name: {
  //         value: null,
  //         confidenceScore: 0.0,
  //         approved: false,
  //       },
  //       address: {
  //         value: null,
  //         confidenceScore: 0.0,
  //         approved: false,
  //       },
  //       gstin: {
  //         value: null,
  //         confidenceScore: 0.0,
  //         approved: false,
  //       },
  //       stateName: {
  //         value: null,
  //         confidenceScore: 0.0,
  //         approved: false,
  //       },
  //       code: {
  //         value: null,
  //         confidenceScore: 0.0,
  //         approved: false,
  //       },
  //     },
  //     items: {
  //       description: {
  //         value:
  //           'Legal and Professional Charges\nServices charges of EPF , ESIC and LWF',
  //         confidenceScore: 1.0,
  //         approved: false,
  //       },
  //       hsnCode: {
  //         value: '9982',
  //         confidenceScore: 0.4631,
  //         approved: false,
  //       },
  //       quantity: {
  //         value: '1',
  //         confidenceScore: 0.3643,
  //         approved: false,
  //       },
  //       unit: {
  //         value: 'Months',
  //         confidenceScore: 1.0,
  //         approved: false,
  //       },
  //       rate: {
  //         value: '9000',
  //         confidenceScore: 0.7344,
  //         approved: false,
  //       },
  //       discount: {
  //         value: null,
  //         confidenceScore: 0.0,
  //         approved: false,
  //       },
  //       amount: {
  //         value: '9000',
  //         confidenceScore: 0.7344,
  //         approved: false,
  //       },
  //     },
  //     charges: {
  //       subtotal: {
  //         value: '9000',
  //         confidenceScore: 0.7344,
  //         approved: false,
  //       },
  //       discount: {
  //         value: null,
  //         confidenceScore: 0.0,
  //         approved: false,
  //       },
  //       shipping: {
  //         value: null,
  //         confidenceScore: 0.0,
  //         approved: false,
  //       },
  //       total: {
  //         value: '10620.00',
  //         confidenceScore: 0.6895,
  //         approved: false,
  //       },
  //     },
  //     taxDetails: {
  //       taxableValue: {
  //         value: '9000',
  //         confidenceScore: 0.7344,
  //         approved: false,
  //       },
  //       cgstRate: {
  //         value: '9%',
  //         confidenceScore: 1.0,
  //         approved: false,
  //       },
  //       cgstAmount: {
  //         value: '810',
  //         confidenceScore: 0.6338,
  //         approved: false,
  //       },
  //       sgstRate: {
  //         value: '9%',
  //         confidenceScore: 1.0,
  //         approved: false,
  //       },
  //       sgstAmount: {
  //         value: '810',
  //         confidenceScore: 0.6338,
  //         approved: false,
  //       },
  //       igstRate: {
  //         value: '18%',
  //         confidenceScore: 1.0,
  //         approved: false,
  //       },
  //       igstAmount: {
  //         value: '1620',
  //         confidenceScore: 0.5928,
  //         approved: false,
  //       },
  //       totalTaxAmount: {
  //         value: '1620',
  //         confidenceScore: 0.5928,
  //         approved: false,
  //       },
  //       taxAmountInWords: {
  //         value: 'Ten Thousand Six Hundred and Twenty Only',
  //         confidenceScore: 0.9951,
  //         approved: false,
  //       },
  //     },
  //     companyBankDetails: {
  //       accountHolderName: {
  //         value: 'Ekonkar Consultancy Services',
  //         confidenceScore: 0.9688,
  //         approved: false,
  //       },
  //       bankName: {
  //         value: 'HDFC Bank Ltd',
  //         confidenceScore: 1.0,
  //         approved: false,
  //       },
  //       accountNo: {
  //         value: '50200026672561',
  //         confidenceScore: 1.0,
  //         approved: false,
  //       },
  //       branchIfsc: {
  //         value: 'HDFC0002322',
  //         confidenceScore: 0.6836,
  //         approved: false,
  //       },
  //       swiftCode: {
  //         value: null,
  //         confidenceScore: 0.0,
  //         approved: false,
  //       },
  //     },
  //   },
  // };
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
    invoiceId: string,
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

  // useEffect(() => {
  //   setTimeout(() => {
  //     const fetchedData: ExtractedData = {
  //       invoiceDetails: {
  //         invoiceNo: { value: 'INV-123', confidenceScore: 85, approved: false },
  //         date: { value: '2024-04-01', confidenceScore: 90, approved: true },
  //         modeOfPayment: {
  //           value: 'Credit Card',
  //           confidenceScore: 75,
  //           approved: false,
  //         },
  //       },
  //       supplierDetails: {
  //         name: { value: 'ABC Pvt Ltd', confidenceScore: 95, approved: true },
  //         address: { value: '123 Street', confidenceScore: 80, approved: true },
  //         contact: { value: '9876543210', confidenceScore: 70, approved: true },
  //         gstin: {
  //           value: '22AAAAA0000A1Z5',
  //           confidenceScore: 85,
  //           approved: true,
  //         },
  //         stateName: {
  //           value: 'Karnataka',
  //           confidenceScore: 88,
  //           approved: true,
  //         },
  //         code: { value: 'KA01', confidenceScore: 60, approved: true },
  //         email: {
  //           value: 'abc@example.com',
  //           confidenceScore: 92,
  //           approved: true,
  //         },
  //       },
  //       buyerDetails: {
  //         name: { value: 'XYZ Traders', confidenceScore: 93, approved: true },
  //         address: { value: '456 Avenue', confidenceScore: 78, approved: true },
  //         gstin: {
  //           value: '29BBBBB1111B2Z6',
  //           confidenceScore: 82,
  //           approved: true,
  //         },
  //         stateName: {
  //           value: 'Maharashtra',
  //           confidenceScore: 87,
  //           approved: true,
  //         },
  //         code: { value: 'MH02', confidenceScore: 65, approved: true },
  //       },
  //     };
  //     setExtractedData(fetchedData);
  //     oldStateRef.current = JSON.parse(JSON.stringify(fetchedData));
  //     setExtractedFieldLoading(false);
  //   }, 1000);
  // }, [oldStateRef, setExtractedData]);
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
  const onRetryCallback = () => {
    resetExtractedData();
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
  return (
    <div className="file-uploadbx">
      {!fileUrl ? (
        <div className="fileupload-page">
          {/* <button
            type="button"
            className="back-btn"
            onClick={() => navigate(ROUTES.LISTING)}
          >
            <span>
              {' '}
              <img src={IMAGES.backIcon} alt="back-icon" />
            </span>{' '}
            Back
          </button> */}
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
            onBack={handleBack}
            left={
              <div className="file-previewbx">
                <FilePreviewer
                  isImage={file!.type.startsWith('image/')}
                  fileUrl={fileUrl}
                />
              </div>
            }
            right={
              <div className="extracted-filedsbx">
                <div className="fields-top-section">
                  <h2>File Fields</h2>
                  <div className="top-actions">
                    <button
                        onClick={handleSave}
                        className="approve-btn"
                        type="button"
                        disabled={extractedFieldLoading || !extractedData}
                      >
                        <span>
                          <img src={IMAGES.tickIcon} alt="save-icon" />
                        </span>
                        {/* {statusText.buttonText} */}
                        Approve All
                      </button>
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
                    <button type="button" className="back-btn">
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
