import { formatCamelCase } from '../../../Shared/functions';
import ExtractedField from '../../Atoms/ExtractedField';
import FieldWrapper from '../../Cells/FieldWrapper';
import useNotification from '../../../Hooks/useNotification';
import { MESSAGES } from '../../../Shared/Constants';
import { ExtractedData } from '../../../Services/Api/Constants';

type ExtractedFieldsProps = {
  setData: React.Dispatch<React.SetStateAction<ExtractedData | null>>;
  data: ExtractedData | null;
  oldStateRef: React.MutableRefObject<ExtractedData | null>;
  loading: boolean;
};

const ExtractedFields: React.FC<ExtractedFieldsProps> = ({
  setData,
  data,
  oldStateRef,
  loading,
}) => {
  const notify = useNotification();

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
      notify(MESSAGES.NOTIFICATION.APPROVED);
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
        // eslint-disable-next-line no-param-reassign
        oldStateRef.current[sectionKey][fieldKey].approved = value;

        // eslint-disable-next-line no-param-reassign
        oldStateRef.current[sectionKey][fieldKey].value = newFieldValue;
      }
    } catch (error) {
      notify(MESSAGES.NOTIFICATION.SOMETHING_WENT_WRONG);
    }
  };

  if (loading || !data)
    return <div className="loading-text">Loading extracted fields...</div>;

  return (
    <div className="extracted-data">
      {Object.entries(data).map(([sectionKey, fields]) => (
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
              />
            );
          })}
        </FieldWrapper>
      ))}
    </div>
  );
};

export default ExtractedFields;