import { DynamicField, ExtractedData, FieldValue } from '../Services/Api/Constants';
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
          // Only check nested if it's not a number (e.g., skip `id`)
          if (typeof nested === 'number') return true;
          return checkApproval(nested);
        })
      );
    }

    // Check for FieldValue
    if (
      typeof value === 'object' &&
      value !== null &&
      'value' in value &&
      'approved' in value
    ) {
      return (value as FieldValue).approved;
    }

    // Check for nested ExtractedData
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).every((nested) => checkApproval(nested));
    }

    return true; // For anything else (like null/undefined/number), treat as approved
  };

  return Object.values(data).every((section) =>
    Object.values(section).every((field) => checkApproval(field))
  );
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
