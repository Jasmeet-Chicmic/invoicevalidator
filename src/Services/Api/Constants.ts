// eslint-disable-next-line import/prefer-default-export
export const API_BASE_URL: string = import.meta.env.VITE_BASE_URL;
export const API_END_POINTS = {
  FILE_UPLOAD: '/bookkeep/invoice/upload/',
  ON_APPROVE: '/bookkeep/invoice/data/update/',
  INVOICE_DATA: '/bookkeep/invoice/display',
  ALL_INVOICES: 'bookkeep/invoice/list/all/',
  DELETE_IMAGE: 'bookkeep/invoice/delete/',
  ON_SUBMIT: 'bookkeep/invoice/details/submit/',
  DELETE_INVOICE: 'bookkeep/invoice/data/delete/',
  EDIT_DATA: 'bookkeep/invoice/data/edit',
};
export const HTTPS_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export interface FileUploadRequest {
  file: FormData;
}
export interface FileUploadData {
  filePath: string;
  invoiceId: string;
}
export interface FileUploadResponse {
  message?: string;
  data: FileUploadData;
}

export interface OnApproveRequest {
  invoiceId: string;
  category: string;
  title: string;
  value: string;
  itemId: string | null;
}

export interface GetInvoiceRequest {
  filePath: string;
  invoiceId: string;
  fileType: string;
}

export interface FieldValue {
  value: string | null;
  confidenceScore: number;
  approved: boolean;
}

export interface ExtractedData {
  [sectionKey: string]: DynamicField;
}

export interface DynamicFieldArrayItem {
  id: number;
  [key: string]: DynamicField | number;
}

export type DynamicField = FieldValue | ExtractedData | DynamicFieldArrayItem[];

export interface ExtractedDataResponse {
  id: number;
  mediaUrl: string;
  fileUrl: string | null;
  createdAt: string;
  type: string;
  approved: boolean;
  data: ExtractedData;
}

export interface ErrorData {
  message: string;
  errorId?: number;
}
export interface CommonErrorResponse {
  status: number;
  data: ErrorData;
}

export interface CRUDRequest {
  invoiceId: string;
}
export interface SubmitRequest {
  invoiceId: string;
  isApproved: boolean;
  data: ExtractedData;
}

export const API_RESPONSE_STATUS_CODE = {
  NOT_ACCEPTABLE: 406,
};
