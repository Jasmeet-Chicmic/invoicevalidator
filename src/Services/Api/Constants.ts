// eslint-disable-next-line import/prefer-default-export
export const API_BASE_URL: string = import.meta.env.VITE_BASE_URL;
export const API_END_POINTS = {
  FILE_UPLOAD: '/bookkeep/invoice/upload/',
  ON_APPROVE: '/bookkeep/invoice/on-approve/',
  INVOICE_DATA: '/bookkeep/invoice/display',
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
interface FileUploadData {
  filePath: string;
  invoiceId: string;
}
export interface FileUploadResponse {
  message: string;
  data: FileUploadData;
}

export interface OnApproveRequest {
  [key: string]: string;
}

export interface GetInvoiceRequest {
  filePath: string;
  invoiceId: string;
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
