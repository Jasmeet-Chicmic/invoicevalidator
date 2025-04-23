import moment from 'moment';
import { TableColumn } from '../../CustomTable/helpers/interface';
import { ButtonActions, ListingStatus, ListingStatusPayload } from './enum';
import { Invoice } from './interface';

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

export function getInvoiceTableColumns(params: {
  isAllSelected: boolean;
  selectedIds: number[];
  handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (id: number) => void;
  handleListAction: (action: ButtonActions, id: number) => void;
  handleActionBtnDisablity: (action: ButtonActions, status: number) => boolean;
  formatCurrency: (amount: number) => string;
  getStatusText: (status: ListingStatusPayload) => string;
  getStatusClass: (status: ListingStatusPayload) => string;
  actionButtons: {
    key: ButtonActions;
    icon: string;
    alt: string;
    className?: string;
  }[];
}): TableColumn<Invoice>[] {
  const {
    isAllSelected,
    selectedIds,
    handleSelectAll,
    handleCheckboxChange,
    handleListAction,
    handleActionBtnDisablity,
    formatCurrency,
    getStatusText,
    getStatusClass,
    actionButtons,
  } = params;

  return [
    {
      header: (
        <div className="checkbox-invoice custom-checkbox">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAll}
            aria-label="Select all invoices"
          />
        </div>
      ),
      accessor: 'id',
      render: (row) => (
        <div className="checkbox-invoice custom-checkbox">
          <input
            type="checkbox"
            checked={selectedIds.includes(row.id)}
            onChange={() => handleCheckboxChange(row.id)}
            aria-label={`Select invoice ${row.invoiceNo}`}
          />
        </div>
      ),
    },
    {
      header: 'Invoice Id',
      accessor: 'id',
    },
    {
      header: 'Invoice No',
      accessor: 'invoiceNo',
      sortable: true,
      sortKey: 'invoiceNo',
    },
    {
      header: 'Vendor',
      accessor: 'vendor',
      sortable: true,
      sortKey: 'vendor',
    },
    {
      header: 'Amount',
      render: (row) => `${formatCurrency(row.amount)}`,
      accessor: 'status',
    },
    {
      header: 'Invoice Date',
      accessor: 'date',
    },
    {
      header: 'Uploaded At',
      render: (row) => moment(row.createdAt).format('D MMM YYYY h:mma'),
      accessor: 'createdAt',
      sortable: true,
      sortKey: 'createdAt',
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={getStatusClass(row.status)}>
          {getStatusText(row.status)}
        </span>
      ),
      accessor: 'status',
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="invoice-list__actions">
          {actionButtons.map(({ key, icon, alt, className }) => (
            <button
              key={key}
              type="button"
              className={`invoice-list__action-button ${className}`}
              onClick={() => handleListAction(key, row.id)}
              disabled={handleActionBtnDisablity(key, row.status)}
            >
              <img src={icon} alt={alt} />
            </button>
          ))}
        </div>
      ),
      accessor: 'status',
    },
  ];
}
