import api from '../../api';
import { API_END_POINTS, HTTPS_METHODS } from '../../Constants';

export const fileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fileUpload: builder.mutation({
      query: (data: FormData) => ({
        url: API_END_POINTS.FILE_UPLOAD,
        method: HTTPS_METHODS.POST,
        body: data,
      }),
    }),
  }),
});

export const { useFileUploadMutation } = fileApi;
