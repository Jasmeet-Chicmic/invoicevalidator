import { ListingStatus, ListingStatusPayload } from './enum';

export const generateStatusPayload = (filterStatus: string) => {
  let statusPayload: ListingStatusPayload | undefined;

  switch (filterStatus) {
    case ListingStatus.All:
      statusPayload = undefined;
      break;
    case ListingStatus.Approved:
      statusPayload = ListingStatusPayload.approved;
      break;
    default:
      statusPayload = ListingStatusPayload.pending;
  }
  return statusPayload;
};
