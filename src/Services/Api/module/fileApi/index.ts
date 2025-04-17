import api from '../../api';
import {
  API_END_POINTS,
  GetInvoiceRequest,
  HTTPS_METHODS,
  OnApproveRequest,
} from '../../Constants';

export const fileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fileUpload: builder.mutation({
      query: (data: FormData) => ({
        url: API_END_POINTS.FILE_UPLOAD,
        method: HTTPS_METHODS.POST,
        body: data,
      }),
    }),
    onApprove: builder.mutation({
      query: (data: OnApproveRequest) => ({
        url: API_END_POINTS.ON_APPROVE,
        method: HTTPS_METHODS.PATCH,
        body: data,
      }),
    }),
    getInvoice: builder.query({
      query: (data: GetInvoiceRequest) => ({
        url: API_END_POINTS.INVOICE_DATA,
        method: HTTPS_METHODS.GET,
        params: data,
      }),
    }),
    getAllInvoice: builder.query({
      query: () => ({
        url: API_END_POINTS.ALL_INVOICES,
        method: HTTPS_METHODS.GET,
      }),
    }),
  }),
});

export const {
  useFileUploadMutation,
  useOnApproveMutation,
  useLazyGetInvoiceQuery,
  useGetAllInvoiceQuery,
} = fileApi;
