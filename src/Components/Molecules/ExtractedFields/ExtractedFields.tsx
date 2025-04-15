import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCamelCase } from '../../../Shared/functions';
import ExtractedField from '../../Atoms/ExtractedField';
import FieldWrapper from '../../Cells/FieldWrapper';
import useNotification from '../../../Hooks/useNotification';
import { MESSAGES, ROUTES } from '../../../Shared/Constants';

type Field = {
  value: string | null;
  confidenceScore: number;
  approved: boolean;
};

type SectionData = {
  [key: string]: Field;
};

type ExtractedData = {
  [sectionKey: string]: SectionData;
};

const ExtractedFields = () => {
  const [data, setData] = useState<ExtractedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const oldStateRef = useRef<ExtractedData | null>(null);
  const notify = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const fetchedData: ExtractedData = {
        invoiceDetails: {
          invoiceNo: { value: 'INV-123', confidenceScore: 85, approved: false },
          date: { value: '2024-04-01', confidenceScore: 90, approved: true },
          modeOfPayment: {
            value: 'Credit Card',
            confidenceScore: 75,
            approved: false,
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
      setData(fetchedData);
      oldStateRef.current = JSON.parse(JSON.stringify(fetchedData));
      setLoading(false);
    }, 1000);
  }, []);

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
    } else {
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
        oldStateRef.current[sectionKey][fieldKey].value = newFieldValue;
      }
    } catch (error) {
      notify(MESSAGES.NOTIFICATION.SOMETHING_WENT_WRONG);
    }
  };

  const handleSave = () => {
    oldStateRef.current = JSON.parse(JSON.stringify(data));
    notify(MESSAGES.NOTIFICATION.SAVED);
    navigate(ROUTES.LISTING);
  };

  if (loading || !data) return <div>Loading extracted fields...</div>;

  return (
    <>
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
      <button onClick={handleSave} type="button">
        Save
      </button>
    </>
  );
};

export default ExtractedFields;
