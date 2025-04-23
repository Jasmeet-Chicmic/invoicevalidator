import { ListingStatusPayload } from './enum';

export interface Invoice {
  id: number;
  invoiceNo: string;
  vendor: string;
  amount: number;
  date: string;
  createdAt: string;
  status: ListingStatusPayload;
}
