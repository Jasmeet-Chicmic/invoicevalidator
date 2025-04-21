// eslint-disable-next-line import/prefer-default-export
export const API_BASE_URL: string = import.meta.env.VITE_BASE_URL;
export const API_END_POINTS = {
  FILE_UPLOAD: '/bookkeep/invoice/upload/',
  ON_APPROVE: '/bookkeep/invoice/data/update/',
  INVOICE_DATA: '/bookkeep/invoice/display',
  ALL_INVOICES: 'bookkeep/invoice/list/all/',
  DELETE_IMAGE: 'bookkeep/invoice/delete/',
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
}

export interface GetInvoiceRequest {
  filePath: string;
  invoiceId: string;
  fileType: string;
}

type Field = {
  value: string | null;
  confidenceScore: number;
  approved: boolean;
};

type SectionData = {
  [key: string]: Field;
};

export type ExtractedData = {
  [sectionKey: string]: SectionData;
};

export interface ExtractedDataResponse {
  id: number;
  mediaUrl: string;
  fileUrl: string | null;
  uploadedOn: string; // ISO format string
  approved: boolean;
  data: ExtractedData;
}

export interface ErrorData {
  message: string;
}
export interface CommonErrorResponse {
  status: number;
  data: ErrorData;
}

export interface DeleteImageRequest {
  invoiceId: string;
}

export const API_RESPONSE_STATUS_CODE = {
  NOT_ACCEPTABLE: 406,
};
