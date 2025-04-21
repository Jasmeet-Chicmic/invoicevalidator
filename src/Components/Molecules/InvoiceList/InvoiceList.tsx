import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import {
  MESSAGES,
  MODAL_MESSAGES,
  ROUTES,
  STRINGS,
} from '../../../Shared/Constants';
import './InvoiceList.scss';
import CommonModal from '../CommonModal';
import IMAGES from '../../../Shared/Images';
import {
  useDeleteInvoiceMutation,
  useGetAllInvoiceQuery,
} from '../../../Services/Api/module/fileApi';
import TextLoader from '../../Atoms/TextLoader';
import RetryButton from '../../Atoms/RetryButton';
import { CommonErrorResponse } from '../../../Services/Api/Constants';
import useNotification from '../../../Hooks/useNotification';
import { STATUS } from '../../../Shared/enum';
import { formatCurrency } from '../../../Shared/functions';
import { filterTabs } from './helpers/constants';
import { ListingStatus } from './helpers/enum';
import { generateStatusPayload } from './helpers/utils';

export interface Invoice {
  id: string;
  invoiceNo: string;
  vendor: string;
  amount: number;
  date: string;
  status: 'Approved' | 'Pending';
}
export interface StatusType {
  APPROVED: 'Approved';
  PENDING: 'Pending';
}

const filterList = [
  ListingStatus.All,
  ListingStatus.Pending,
  ListingStatus.Approved,
];

const ITEMS_PER_PAGE = 10;

const InvoiceList: React.FC = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<ListingStatus>(
    ListingStatus.All
  );
  const [currentPage, setCurrentPage] = useState(0);
  const notify = useNotification();
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    data: { invoiceId: STRINGS.EMPTY_STRING },
  });

  const {
    data,
    isFetching: isAllInvoiceLoading,
    isError: isAllInvoiceError,
    refetch,
  } = useGetAllInvoiceQuery(
    {
      page: currentPage + 1,
      limit: ITEMS_PER_PAGE,
      status: generateStatusPayload(filterStatus),
    },
    { refetchOnMountOrArgChange: true }
  );

  const [deleteInvoice] = useDeleteInvoiceMutation();

  const handleEdit = (invoiceId: number) => {
    navigate(`${ROUTES.EDIT}/${invoiceId}`);
  };

  const handleDelete = (id: string) => {
    setConfirmationModal({
      isOpen: true,
      data: { invoiceId: id },
    });
  };

  const getStatusClass = (status: string): string =>
    `status-badge status-${status.toLowerCase()}`;

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const onRetry = () => {
    refetch();
  };

  const onModalOk = async () => {
    try {
      await deleteInvoice({
        invoiceId: confirmationModal.data.invoiceId,
      }).unwrap();
      refetch();
      setConfirmationModal({ ...confirmationModal, isOpen: false });
      notify(MESSAGES.NOTIFICATION.INVOICE_DELETED_SUCCESSFULLY);
    } catch (error) {
      const errorObj = error as unknown as CommonErrorResponse;
      notify(errorObj.data.message, { type: STATUS.error });
    }
  };

  const onModalClose = () => {
    setConfirmationModal({ ...confirmationModal, isOpen: false });
  };
  const showingTheListItemCounter = () => {
    const startIndex = currentPage * ITEMS_PER_PAGE + 1;
    const endIndex = Math.min(
      (currentPage + 1) * ITEMS_PER_PAGE,
      data?.total || 0
    );
    return `${startIndex}-${endIndex} of ${data?.total}`;
  };

  function getFilterStatusClass(
    currentStatus: string,
    targetStatus: string
  ): string {
    let className = '';

    if (targetStatus === ListingStatus.Approved) {
      className = 'approved';
    } else if (targetStatus === ListingStatus.Pending) {
      className = 'pending';
    } else {
      className = 'all';
    }

    if (currentStatus === targetStatus) {
      className = `active ${className}`;
    }

    return className;
  }

  if (isAllInvoiceError) return <RetryButton onClick={onRetry} />;
  if (isAllInvoiceLoading) return <TextLoader showText={false} />;

  return (
    <div className="invoice-list">
      <div className="invoice-list__header">
        <h1 className="invoice-list__title">{STRINGS.INVOICES}</h1>

        <div className="hdrright-actions">
          <div className="search-bx">
            <input
              type="text"
              alt="search"
              placeholder="Search"
              className="search-field"
            />
            <button className="saerch-btn">Search</button>
          </div>
          <div className="invoice-list__filters">
            {filterList.map((status) => (
              <button
                key={status}
                className={`filter-btn ${getFilterStatusClass(status, filterStatus)}`}
                onClick={() => {
                  setFilterStatus(status);
                  setCurrentPage(0);
                }}
                type="button"
              >
                {status}
              </button>
            ))}
          </div>
          <div className="download-btns">
            {filterTabs.map(({ className, icon, alt, label }) => (
              <button
                key={className}
                type="button"
                className={`btn-primary ${className}`}
              >
                <span className="btn-icon">
                  <img src={icon} alt={alt} />
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="invoice-list__table-container">
        <table className="invoice-list__table">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.total > 0 ? (
              data?.data?.map((invoice: Invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.invoiceNo}</td>
                  <td>{invoice.vendor}</td>
                  <td>{formatCurrency(invoice.amount)}</td>
                  <td>{invoice.date}</td>
                  <td>
                    <span className={getStatusClass(invoice.status)}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="invoice-list__actions">
                    <button
                      type="button"
                      className="invoice-list__action-button invoice-list__action-button--edit"
                      onClick={() =>
                        handleEdit(invoice.id as unknown as number)
                      }
                      aria-label={`Edit invoice ${invoice.invoiceNo}`}
                    >
                      <img src={IMAGES.editIcon} alt="edit-icon" />
                    </button>
                    <button
                      type="button"
                      className="invoice-list__action-button invoice-list__action-button--delete"
                      onClick={() => handleDelete(invoice.id)}
                      aria-label={`Delete invoice ${invoice.invoiceNo}`}
                    >
                      <img src={IMAGES.deleteIcon} alt="delete-icon" />
                    </button>
                    <button
                      type="button"
                      className="invoice-list__action-button invoice-list__action-button--export"
                      onClick={() => handleDelete(invoice.id)}
                      aria-label={`Export to Telly ${invoice.invoiceNo}`}
                    >
                      <img src={IMAGES.exportIcon} alt="export-icon" />
                    </button>

                    <button
                      type="button"
                      className="invoice-list__action-button invoice-list__action-button--download"
                      aria-label={`Download JSON ${invoice.invoiceNo}`}
                    >
                      <img src={IMAGES.downloadIcon} alt="download-icon" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center' }}>
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data?.total > ITEMS_PER_PAGE && (
        <>
          <span>Showing {showingTheListItemCounter()}</span>
          <ReactPaginate
            previousLabel="Prev"
            nextLabel="Next"
            pageCount={Math.ceil((data && data.total) / ITEMS_PER_PAGE)}
            onPageChange={handlePageChange}
            containerClassName="pagination"
            activeClassName="active"
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            forcePage={currentPage}
          />
        </>
      )}

      <CommonModal
        isOpen={confirmationModal.isOpen}
        onRequestClose={onModalClose}
        onOk={onModalOk}
        message={MODAL_MESSAGES.DELETE_CONFIRMATION}
      />
    </div>
  );
};

export default InvoiceList;
