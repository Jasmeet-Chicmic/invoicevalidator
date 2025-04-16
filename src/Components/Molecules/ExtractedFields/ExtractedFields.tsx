// Library
import { useEffect, useState } from 'react';
// Utils
import { formatCamelCase } from '../../../Shared/functions';
// Components
import ExtractedField from '../../Atoms/ExtractedField';
import FieldWrapper from '../../Cells/FieldWrapper';
// Hooks
import useNotification from '../../../Hooks/useNotification';
// Constants 
import { MESSAGES } from '../../../Shared/Constants';
import { ExtractedData } from '../../../Services/Api/Constants';
import { ExtracetedDummyData } from './helpers/constants';

type ExtractedFieldsProps = {
  setData: React.Dispatch<React.SetStateAction<ExtractedData | null>>;
  data: ExtractedData | null;
  oldStateRef: React.MutableRefObject<ExtractedData | null>;
};

const ExtractedFields: React.FC<ExtractedFieldsProps> = ({
  setData,
  data,
  oldStateRef,
}) => {
  const [loading, setLoading] = useState<boolean>(true);

  const notify = useNotification();
  const dummyApiTime =  1000;
  useEffect(() => {
    setTimeout(() => {
      const fetchedData: ExtractedData =ExtracetedDummyData
      setData(fetchedData);
      oldStateRef.current = JSON.parse(JSON.stringify(fetchedData));
      setLoading(false);
    }, dummyApiTime);
  }, [oldStateRef, setData]);

  type FieldUpdate = {
    value?: string;
    approved?: boolean;
  };
  
  const updateFieldState = (
    prevData: typeof data,
    sectionKey: string,
    fieldKey: string,
    updates: FieldUpdate
  ) => {
    return {
      ...prevData!,
      [sectionKey]: {
        ...prevData![sectionKey],
        [fieldKey]: {
          ...prevData![sectionKey][fieldKey],
          ...updates,
        },
      },
    };
  };
  
  const handleChange = (
    sectionKey: string,
    fieldKey: string,
    newValue: string
  ) => {
    if (!data) return;
  
    const isValueChanged =
      oldStateRef.current &&
      oldStateRef.current[sectionKey][fieldKey].value !== newValue;
  
    setData((prevData) =>
      updateFieldState(prevData, sectionKey, fieldKey, {
        approved: !isValueChanged ? true : false,
      })
    );
  
    setData((prevData) =>
      updateFieldState(prevData, sectionKey, fieldKey, {
        value: newValue,
      })
    );
  };
  

  const handleOnApprove = async (
    sectionKey: string,
    fieldKey: string,
    value: boolean,
    newFieldValue: string
  ) => {
    try {
      notify(MESSAGES.NOTIFICATION.APPROVED);
  
      setData((prevData) =>
        updateFieldState(prevData, sectionKey, fieldKey, {
          approved: value,
        })
      );
  
      if (oldStateRef.current) {
        oldStateRef.current[sectionKey][fieldKey].approved = value;
        oldStateRef.current[sectionKey][fieldKey].value = newFieldValue;
      }
    } catch (error) {
      notify(MESSAGES.NOTIFICATION.SOMETHING_WENT_WRONG);
    }
  };
  

  if (loading || !data) return <div>Loading extracted fields...</div>;

  return (
    <div>
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
