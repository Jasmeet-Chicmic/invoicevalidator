import { useState } from 'react';
import useNotification from '../../../Hooks/useNotification';
import {
  CommonErrorResponse,
  DynamicField,
  DynamicFieldArrayItem,
  ExtractedData,
  FieldValue,
} from '../../../Services/Api/Constants';
import { useOnApproveMutation } from '../../../Services/Api/module/fileApi';
import { MESSAGES } from '../../../Shared/Constants';
import { STATUS } from '../../../Shared/enum';
import { formatCamelCase } from '../../../Shared/functions';
import ExtractedField from '../../Atoms/ExtractedField';
import RetryButton from '../../Atoms/RetryButton';
import TextLoader from '../../Atoms/TextLoader';
import FieldWrapper from '../../Cells/FieldWrapper';

type ExtractedFieldsProps = {
  setData: React.Dispatch<React.SetStateAction<ExtractedData | null>>;
  data: ExtractedData | null;
  oldStateRef: React.MutableRefObject<ExtractedData | null>;
  loading: boolean;
  invoiceId: string;
  error?: boolean;
  onRetry?: () => void;
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
  const [fieldKeyToApprove, setFieldKeyToApprove] = useState<string | null>(
    null
  );
  const [onApprove] = useOnApproveMutation();

  const extractOldValue = (
    field: DynamicField
  ): string | null | DynamicField | undefined => {
    return typeof field === 'object' && field !== null && 'value' in field
      ? field.value
      : undefined;
  };

  const handleArrayFieldChange = (
    arrParentKey: string,
    id: number,
    fieldKey: string,
    newValue: string
  ) => {
    if (!data) return;

    setData((prevData) => {
      if (!prevData) return prevData;

      const arrayItems = prevData[arrParentKey] as DynamicFieldArrayItem[];
      const prevArrayItems = oldStateRef.current?.[
        arrParentKey
      ] as DynamicFieldArrayItem[];
      const index = arrayItems.findIndex((item) => item.id === id);
      if (index === -1) return prevData;

      const targetItem = arrayItems[index];
      const prevItem = prevArrayItems?.[index];
      const oldValue = extractOldValue(prevItem?.[fieldKey] as DynamicField);
      const fieldObj = targetItem[fieldKey] as FieldValue;

      const updatedItem: DynamicFieldArrayItem = {
        ...targetItem,
        [fieldKey]: {
          ...fieldObj,
          value: newValue,
          approved: newValue === oldValue,
        },
      };

      const updatedArray = [...arrayItems];
      updatedArray[index] = updatedItem;

      return {
        ...prevData,
        [arrParentKey]: updatedArray,
      };
    });
  };

  const handleObjectFieldChange = (
    sectionKey: string,
    fieldKey: string,
    newValue: string
  ) => {
    const oldField = (oldStateRef.current?.[sectionKey] as ExtractedData)?.[
      fieldKey
    ];
    const oldValue = extractOldValue(oldField);

    setData((prevData) => {
      if (!prevData) return prevData;

      const currentSection = prevData[sectionKey] as DynamicField;
      const currentField = (currentSection as ExtractedData)?.[fieldKey];

      return {
        ...prevData,
        [sectionKey]: {
          ...currentSection,
          [fieldKey]: {
            ...currentField,
            value: newValue,
            approved: newValue === oldValue,
          },
        } as DynamicField,
      };
    });
  };

  const handleChange = (
    sectionKey: string,
    fieldKey: string,
    newValue: string,
    arrParentKey?: string,
    id?: number
  ) => {
    if (!data) return;

    if (arrParentKey && id !== undefined) {
      handleArrayFieldChange(arrParentKey, id, fieldKey, newValue);
    } else {
      handleObjectFieldChange(sectionKey, fieldKey, newValue);
    }
  };

  const handleOnApprove = async (
    sectionKey: string,
    fieldKey: string,
    newFieldValue: string,
    arrParentKey?: string,
    id?: number
  ) => {
    try {
      if (id === undefined) {
        await onApprove({
          category: sectionKey,
          title: fieldKey,
          value: newFieldValue,
          invoiceId,
          itemId: null,
        }).unwrap();
      } else {
        await onApprove({
          category: arrParentKey?.toString() || sectionKey,
          title: fieldKey,
          value: newFieldValue,
          invoiceId,
          itemId: id.toString(),
        }).unwrap();
      }
      // await onApproveCallback();
      setFieldKeyToApprove(null);
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
  const renderFields = (
    sectionKey: string,
    fields: DynamicField | DynamicFieldArrayItem,
    id?: number,
    arrParentKey?: string | undefined
  ) => {
    return (
      <FieldWrapper key={sectionKey} title={formatCamelCase(sectionKey)}>
        {Array.isArray(fields)
          ? fields?.map((nestedField, i) =>
              renderFields(
                `Item ${i + 1}`,
                nestedField,
                nestedField?.id,
                Array.isArray(fields) ? sectionKey : undefined
              )
            )
          : Object.entries(fields || {}).map(([fieldKey, fieldValue]) => {
              const isApproved = fieldValue?.approved;
              const disableApprove = isApproved;
              const buttonText = isApproved
                ? MESSAGES.NOTIFICATION.APPROVED
                : MESSAGES.NOTIFICATION.APPROVE;
              const isFieldObject = typeof fieldValue === 'object';
              return isFieldObject ? (
                <ExtractedField
                  key={fieldKey}
                  title={formatCamelCase(fieldKey)}
                  placeholder={`Enter ${formatCamelCase(fieldKey)}`}
                  value={fieldValue?.value || ''}
                  confidenceScore={fieldValue?.confidenceScore}
                  onChange={(e) =>
                    handleChange(
                      sectionKey,
                      fieldKey,
                      e.target.value,
                      arrParentKey,
                      id
                    )
                  }
                  onApproveClick={(_, newFieldValue) => {
                    setFieldKeyToApprove(`${fieldKey}_${newFieldValue}`);
                    handleOnApprove(
                      sectionKey,
                      fieldKey,
                      newFieldValue,
                      arrParentKey,
                      id
                    );
                  }}
                  disableApprove={disableApprove}
                  approveButtonText={buttonText}
                  approveButtonLoading={
                    fieldKeyToApprove === `${fieldKey}_${fieldValue?.value}`
                  }
                />
              ) : null;
            })}
      </FieldWrapper>
    );
  };
  if (loading && !fieldKeyToApprove) return <TextLoader />;

  return (
    <div className="extracted-data">
      {Object.entries(data || {}).map(([sectionKey, fields]) =>
        renderFields(sectionKey, fields)
      )}
    </div>
  );
};

export default ExtractedFields;
