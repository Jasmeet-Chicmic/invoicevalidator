import {
  DynamicField,
  DynamicFieldArrayItem,
  ExtractedData,
  FieldValue,
} from '../Services/Api/Constants';
import { FILE_TYPES } from './Constants';

export const firstLetterUpperCase = (message: string) => {
  if (message && message.length > 0) {
    return (
      message[0].toUpperCase() +
      message.substring(1, message.length).toLowerCase()
    );
  }
  return '';
};

export const isValidFileType = (newFile: File) =>
  newFile.type.startsWith('image/') || newFile.type === 'application/pdf';

export const formatCamelCase = (text: string): string => {
  return text
    .replace(/([A-Z])/g, ' $1') // insert space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // capitalize the first letter
};

export const areAllFieldsApproved = (data: ExtractedData): boolean => {
  const checkApproval = (value: DynamicField | FieldValue): boolean => {
    if (Array.isArray(value)) {
      return value.every((item) =>
        Object.entries(item).every(([_, nested]) => {
          if (typeof nested === 'number') return true;
          return checkApproval(nested);
        })
      );
    }

    if (
      typeof value === 'object' &&
      value !== null &&
      'value' in value &&
      'approved' in value
    ) {
      const field = value as FieldValue;
      const isEmpty = field.value === null || field.value === '';
      return field.approved || isEmpty;
    }

    if (typeof value === 'object' && value !== null) {
      return Object.values(value).every((nested) => checkApproval(nested));
    }

    return true;
  };

  return Object.values(data).every((section) =>
    Object.values(section).every((field) => checkApproval(field))
  );
};
export const approveAllFields = (data: ExtractedData): ExtractedData => {
  const approveField = (value: DynamicField | FieldValue): DynamicField | FieldValue => {
    if (Array.isArray(value)) {
      return value.map((item) => {
        const updatedItem: DynamicFieldArrayItem = { ...item };
        Object.entries(item).forEach(([key, nested]) => {
          if (typeof nested !== 'number') {
            updatedItem[key] = approveField(nested);
          }
        });
        return updatedItem;
      });
    }

    if (
      typeof value === 'object' &&
      value !== null &&
      'value' in value &&
      'approved' in value
    ) {
      const field = value as FieldValue;
      const isEmpty = field.value === null || field.value === '';
      return {
        ...field,
        approved: !isEmpty,
      };
    }

    if (typeof value === 'object' && value !== null) {
      const updatedSection: { [key: string]: DynamicField | FieldValue } = {};
      Object.entries(value).forEach(([key, nested]) => {
        updatedSection[key] = approveField(nested);
      });
      return updatedSection as DynamicField;
    }

    return value;
  };

  const updatedData: ExtractedData = {};

  Object.entries(data).forEach(([sectionKey, section]) => {
    const updatedSection: { [key: string]: DynamicField | FieldValue } = {};
    Object.entries(section).forEach(([fieldKey, fieldValue]) => {
      updatedSection[fieldKey] = approveField(fieldValue);
    });
    updatedData[sectionKey] = updatedSection as DynamicField;
  });

  return updatedData;
};


export const replaceToLowerCase = (text: string): string => {
  return text.replace(/\s+/g, '-').toLowerCase();
};

export const checkFileType = (file: File) => {
  if (file.type.startsWith('image/')) {
    return FILE_TYPES.IMAGE;
  }
  return FILE_TYPES.PDF;
};

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
