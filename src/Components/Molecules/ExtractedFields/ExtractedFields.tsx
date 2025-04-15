import { useEffect, useState } from 'react';
import { formatCamelCase } from '../../../Shared/functions';
import ExtractedField from '../../Atoms/ExtractedField';
import FieldWrapper from '../../Cells/FieldWrapper';

type Field = {
  value: string | null;
  confidenceScore: number;
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

  useEffect(() => {
    // Simulate fetching data from backend
    setTimeout(() => {
      setData({
        invoiceDetails: {
          invoiceNo: { value: 'INV-123', confidenceScore: 85 },
          date: { value: '2024-04-01', confidenceScore: 90 },
          modeOfPayment: { value: 'Credit Card', confidenceScore: 75 },
        },
        supplierDetails: {
          name: { value: 'ABC Pvt Ltd', confidenceScore: 95 },
          address: { value: '123 Street', confidenceScore: 80 },
          contact: { value: '9876543210', confidenceScore: 70 },
          gstin: { value: '22AAAAA0000A1Z5', confidenceScore: 85 },
          stateName: { value: 'Karnataka', confidenceScore: 88 },
          code: { value: 'KA01', confidenceScore: 60 },
          email: { value: 'abc@example.com', confidenceScore: 92 },
        },
        buyerDetails: {
          name: { value: 'XYZ Traders', confidenceScore: 93 },
          address: { value: '456 Avenue', confidenceScore: 78 },
          gstin: { value: '29BBBBB1111B2Z6', confidenceScore: 82 },
          stateName: { value: 'Maharashtra', confidenceScore: 87 },
          code: { value: 'MH02', confidenceScore: 65 },
        },
      });
      setLoading(false);
    }, 2000);
  }, []);

  const handleChange = (
    sectionKey: string,
    fieldKey: string,
    newValue: string
  ) => {
    if (!data) return;

    setData((prevData) => ({
      ...prevData!,
      [sectionKey]: {
        ...prevData![sectionKey],
        [fieldKey]: {
          ...prevData![sectionKey][fieldKey],
          value: newValue,
        },
      },
    }));
  };

  if (loading || !data) {
    return <div>Loading extracted fields...</div>;
  }

  return (
    <>
      {Object.entries(data).map(([sectionKey, fields]) => (
        <FieldWrapper key={sectionKey} title={formatCamelCase(sectionKey)}>
          {Object.entries(fields).map(([fieldKey, fieldValue]) => (
            <ExtractedField
              key={fieldKey}
              title={formatCamelCase(fieldKey)}
              placeholder={`Enter ${formatCamelCase(fieldKey)}`}
              value={fieldValue.value || ''}
              confidenceScore={fieldValue.confidenceScore}
              onChange={(e) =>
                handleChange(sectionKey, fieldKey, e.target.value)
              }
            />
          ))}
        </FieldWrapper>
      ))}
    </>
  );
};

export default ExtractedFields;
