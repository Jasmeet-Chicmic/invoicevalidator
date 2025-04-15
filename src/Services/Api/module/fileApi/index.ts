import api from '../../api';
import {
  API_END_POINTS,
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
  }),
});

export const { useFileUploadMutation, useOnApproveMutation } = fileApi;
