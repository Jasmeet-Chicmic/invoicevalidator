// eslint-disable-next-line import/prefer-default-export
export const API_BASE_URL: string = import.meta.env.VITE_BASE_URL;
export const API_END_POINTS = {
  FILE_UPLOAD: '/bookkeep/invoice/upload/',
};
export const HTTPS_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export interface FileUploadRequest {
  file: FormData;
}
export interface FileUploadResponse {
  message: string;
  file_path: string;
}
