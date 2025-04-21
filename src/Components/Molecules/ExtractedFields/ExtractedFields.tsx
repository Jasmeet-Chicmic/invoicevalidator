import { formatCamelCase } from '../../../Shared/functions';
import ExtractedField from '../../Atoms/ExtractedField';
import FieldWrapper from '../../Cells/FieldWrapper';
import useNotification from '../../../Hooks/useNotification';
import { MESSAGES } from '../../../Shared/Constants';
import {
  CommonErrorResponse,
  ExtractedData,
} from '../../../Services/Api/Constants';
import TextLoader from '../../Atoms/TextLoader';
import RetryButton from '../../Atoms/RetryButton';
import { useOnApproveMutation } from '../../../Services/Api/module/fileApi';
import { STATUS } from '../../../Shared/enum';

type ExtractedFieldsProps = {
  setData: React.Dispatch<React.SetStateAction<ExtractedData | null>>;
  data: ExtractedData | null;
  oldStateRef: React.MutableRefObject<ExtractedData | null>;
  loading: boolean;
  error?: boolean;
  onRetry?: () => void;
  invoiceId: string;
};

const ExtractedFields: React.FC<ExtractedFieldsProps> = ({
  setData,
  data,
  oldStateRef,
  loading,
  error = true,
  onRetry = () => {},
  invoiceId,
}) => {
  const notify = useNotification();
  const [onApprove, { isLoading: approveButtonLoading }] =
    useOnApproveMutation();
  const handleChange = (
    sectionKey: string,
    fieldKey: string,
    newValue: string
  ) => {
    if (!data) return;
    if (
      oldStateRef.current &&
      oldStateRef.current[sectionKey][fieldKey].value !== newValue
    ) {
      setData((prevData) => ({
        ...prevData!,
        [sectionKey]: {
          ...prevData![sectionKey],
          [fieldKey]: {
            ...prevData![sectionKey][fieldKey],
            approved: false, // Only update `approved` status here
          },
        },
      }));
    } else if (
      oldStateRef.current &&
      oldStateRef.current[sectionKey][fieldKey].approved
    ) {
      setData((prevData) => ({
        ...prevData!,
        [sectionKey]: {
          ...prevData![sectionKey],
          [fieldKey]: {
            ...prevData![sectionKey][fieldKey],
            approved: true, // Only update `approved` status here
          },
        },
      }));
    }

    setData((prevData) => ({
      ...prevData!,
      [sectionKey]: {
        ...prevData![sectionKey],
        [fieldKey]: {
          ...prevData![sectionKey][fieldKey],
          value: newValue, // Do NOT touch `approved` here
        },
      },
    }));
  };

  const handleOnApprove = async (
    sectionKey: string,
    fieldKey: string,
    value: boolean,
    newFieldValue: string
  ) => {
    try {
      await onApprove({
        category: sectionKey,
        title: fieldKey,
        value: newFieldValue,
        invoiceId,
      });
      setData((prevData) => ({
        ...prevData!,
        [sectionKey]: {
          ...prevData![sectionKey],
          [fieldKey]: {
            ...prevData![sectionKey][fieldKey],
            approved: value, // Only update `approved` status here
          },
        },
      }));
      if (oldStateRef.current) {
        oldStateRef.current[sectionKey][fieldKey].approved = value;
        oldStateRef.current[sectionKey][fieldKey].value = newFieldValue;
      }
      notify(MESSAGES.NOTIFICATION.APPROVED);
    } catch (catchError) {
      const errorObj = catchError as CommonErrorResponse;
      notify(errorObj.data.message, { type: STATUS.error });
    }
  };

  if (error)
    return (
      <div className="retrybtn-data">
        {' '}
        <RetryButton onClick={onRetry} />
      </div>
    );
  if (loading) return <TextLoader />;

  return (
    <div className="extracted-data">
      {Object.entries(data || {}).map(([sectionKey, fields]) => (
        <FieldWrapper key={sectionKey} title={formatCamelCase(sectionKey)}>
          {Object.entries(fields).map(([fieldKey, fieldValue]) => {
            const isApproved = fieldValue.approved;
            const disableApprove = isApproved;
            const buttonText = isApproved
              ? MESSAGES.NOTIFICATION.APPROVED
              : MESSAGES.NOTIFICATION.APPROVE;

            return (
              <ExtractedField
                key={fieldKey}
                title={formatCamelCase(fieldKey)}
                placeholder={`Enter ${formatCamelCase(fieldKey)}`}
                value={fieldValue.value || ''}
                confidenceScore={fieldValue.confidenceScore}
                onChange={(e) =>
                  handleChange(sectionKey, fieldKey, e.target.value)
                }
                onApproveClick={(value: boolean, newFieldValue) =>
                  handleOnApprove(sectionKey, fieldKey, value, newFieldValue)
                }
                disableApprove={disableApprove}
                approveButtonText={buttonText}
                approveButtonLoading={!approveButtonLoading}
              />
            );
          })}
        </FieldWrapper>
      ))}
    </div>
  );
};

export default ExtractedFields;
