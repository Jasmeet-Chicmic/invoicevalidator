import { ExtractedData } from '../../../../Services/Api/Constants';

const ExtracetedDummyData: ExtractedData = {
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

export { ExtracetedDummyData };
