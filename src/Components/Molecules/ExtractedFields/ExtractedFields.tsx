import ExtractedField from '../../Atoms/ExtractedField';
import FieldWrapper from '../../Cells/FieldWrapper';

const ExtractedFields = () => {
  const data = {
    invoiceDetails: {
      invoiceNo: { value: null, confidenceScore: 0 },
      date: { value: null, confidenceScore: 0 },
      modeOfPayment: { value: null, confidenceScore: 0 },
    },
    supplierDetails: {
      name: { value: null, confidenceScore: 0 },
      address: { value: null, confidenceScore: 0 },
      contact: { value: null, confidenceScore: 0 },
      gstin: { value: null, confidenceScore: 0 },
      stateName: { value: null, confidenceScore: 0 },
      code: { value: null, confidenceScore: 0 },
      email: { value: null, confidenceScore: 0 },
    },
    buyerDetails: {
      name: { value: null, confidenceScore: 0 },
      address: { value: null, confidenceScore: 0 },
      gstin: { value: null, confidenceScore: 0 },
      stateName: { value: null, confidenceScore: 0 },
      code: { value: null, confidenceScore: 0 },
    },
  };

  return (
    <div>
      {Object.entries(data).map(([sectionKey, fields]) => (
        <FieldWrapper key={sectionKey} title={sectionKey}>
          {Object.entries(fields).map(([fieldKey, fieldValue]) => (
            <ExtractedField
              key={fieldKey}
              title={fieldKey}
              placeholder={`Enter ${fieldKey}`}
              value={fieldValue.value || ''}
              confidenceScore={fieldValue.confidenceScore}
              onChange={() => {}}
            />
          ))}
        </FieldWrapper>
      ))}
    </div>
  );
};

export default ExtractedFields;
