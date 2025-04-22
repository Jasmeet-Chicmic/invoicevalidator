/* eslint-disable no-case-declarations */
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import useNotification from '../../../Hooks/useNotification';
import { CommonErrorResponse } from '../../../Services/Api/Constants';
import {
  useDeleteInvoiceMutation,
  useExportToLocalMutation,
  useExportToTallyMutation,
  useGetAllInvoiceQuery,
} from '../../../Services/Api/module/fileApi';
import {
  MESSAGES,
  MODAL_MESSAGES,
  ROUTES,
  STRINGS,
} from '../../../Shared/Constants';
import { STATUS } from '../../../Shared/enum';
import { formatCurrency } from '../../../Shared/functions';
import RetryButton from '../../Atoms/RetryButton';
import TextLoader from '../../Atoms/TextLoader';
import CommonModal from '../CommonModal';
import {
  actionButtons,
  ConfirmationPopupDefaultValue,
  filterTabs,
} from './helpers/constants';
import {
  ButtonActions,
  ListingStatus,
  ListingStatusPayload,
} from './helpers/enum';
import { generateStatusPayload } from './helpers/utils';
import './InvoiceList.scss';

export interface Invoice {
  id: number;
  invoiceNo: string;
  vendor: string;
  amount: number;
  date: string;
  status: ListingStatusPayload;
}
export interface StatusType {
  APPROVED: 'Approved';
  PENDING: 'Pending';
}

interface PopupType {
  isOpen: boolean;
  title: string;
  type: ButtonActions | null;
  data: {
    invoiceId?: number;
    invoiceIds?: number[];
  };
}
const filterList = [
  ListingStatus.All,
  ListingStatus.Pending,
  ListingStatus.Approved,
];

const ITEMS_PER_PAGE = 10;

const InvoiceList: React.FC = () => {
  const navigate = useNavigate();
  const [deleteInvoice] = useDeleteInvoiceMutation();
  const [exportToTally] = useExportToTallyMutation();
  const [exportToLocal] = useExportToLocalMutation();
  const [filterStatus, setFilterStatus] = useState<ListingStatus>(
    ListingStatus.All
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedApprovedIds, setSelectedApprovedIds] = useState<number[]>([]);

  const notify = useNotification();
  const [confirmationModal, setConfirmationModal] = useState<PopupType>(
    ConfirmationPopupDefaultValue
  );

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

  const handleEdit = (invoiceId: number) => {
    navigate(`${ROUTES.EDIT}/${invoiceId}`);
  };

  const handleDelete = (id: number, action: ButtonActions) => {
    setConfirmationModal({
      isOpen: true,
      title: MODAL_MESSAGES.DELETE_CONFIRMATION,
      type: action,
      data: {
        invoiceId: id,
      },
    });
  };

  const handleExport = (id: number, action: ButtonActions) => {
    setConfirmationModal({
      isOpen: true,
      title: MODAL_MESSAGES.EXPORT_CONFIRMATION,
      type: action,
      data: {
        invoiceId: id,
      },
    });
  };

  const handleDownload = (id: number, action: ButtonActions) => {
    setConfirmationModal({
      isOpen: true,
      title: MODAL_MESSAGES.DOWNLOAD_CONFIRMATION,
      type: action,
      data: {
        invoiceId: id,
      },
    });
  };

  const handleListAction = (action: ButtonActions, id: number) => {
    switch (action) {
      case ButtonActions.Edit:
        return handleEdit(id);
      case ButtonActions.Delete:
        return handleDelete(id, action);
      case ButtonActions.ExportToTally:
        return handleExport(id, action);
      case ButtonActions.ExportToLocal:
        return handleDownload(id, action);
      default:
        return null;
    }
  };

  const handleActionBtnDisablity = (action: ButtonActions, status: number) => {
    switch (action) {
      case ButtonActions.ExportToTally:
        return status === ListingStatusPayload.pending;
      default:
        return false;
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = data?.data?.map((invoice: Invoice) => invoice.id) || [];
      const approvedIds = data?.data?.fileter(
        (invoice: Invoice) => invoice.status === ListingStatusPayload.approved
      );
      setSelectedIds(allIds);
      setSelectedApprovedIds(approvedIds);
    } else {
      setSelectedIds([]);
      setSelectedApprovedIds([]);
    }
  };

  const handleCheckboxChange = (id: number) => {
    const invoice = data?.data?.find((inv: Invoice) => inv.id === id);
    const isApproved = invoice?.status === ListingStatusPayload.approved;

    // Toggle selectedIds
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

    // Toggle selectedApprovedIds without nested ternary
    setSelectedApprovedIds((prev) => {
      const isAlreadySelected = prev.includes(id);

      if (isAlreadySelected) {
        return prev.filter((i) => i !== id);
      }

      if (isApproved) {
        return [...prev, id];
      }

      return prev;
    });
  };

  const handleHeaderActions = (actionType: ButtonActions) => {
    switch (actionType) {
      case ButtonActions.Delete:
        if (selectedIds.length > 0) {
          setConfirmationModal({
            isOpen: true,
            title: MODAL_MESSAGES.DELETE_ALL_CONFIRMATION,
            type: actionType,
            data: {
              invoiceIds: selectedIds,
            },
          });
        }
        break;
      case ButtonActions.ExportToTally:
        setConfirmationModal({
          isOpen: true,
          title: selectedIds?.length
            ? MODAL_MESSAGES.EXPORT_SELECTED_APPROVED_CONFIRMATION
            : MODAL_MESSAGES.EXPORT_ALL_APPROVED_CONFIRMATION,
          type: actionType,
          data: {
            invoiceIds: selectedApprovedIds,
          },
        });
        break;
      case ButtonActions.ExportToLocal:
        setConfirmationModal({
          isOpen: true,
          title: selectedIds?.length
            ? MODAL_MESSAGES.EXPORT_SELECTED_APPROVED_TO_LOCAL_CONFIRMATION
            : MODAL_MESSAGES.EXPORT_ALL_APPROVED_TO_LOCAL_CONFIRMATION,
          type: actionType,
          data: {
            invoiceIds: selectedIds,
          },
        });
        break;
      default:
        setConfirmationModal({
          isOpen: false,
          title: STRINGS.EMPTY_STRING,
          type: null,
          data: {},
        });
    }
  };
  const getStatusText = (status: number): string => {
    switch (status) {
      case ListingStatusPayload.approved:
        return ListingStatus.Approved;
      case ListingStatusPayload.pending:
        return ListingStatus.Pending;
      default:
        return '';
    }
  };
  const getStatusClass = (status: number): string => {
    return `status-badge status-${getStatusText(status).toLowerCase()}`;
  };
  // `status-badge status-${status.toLowerCase()}`;

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const onRetry = () => {
    refetch();
  };

  const onModalOk = async () => {
    try {
      switch (confirmationModal.type) {
        case ButtonActions.Delete:
          if (
            !confirmationModal.data?.invoiceId &&
            !confirmationModal.data?.invoiceIds?.length
          )
            return;
          await deleteInvoice({
            invoiceId: confirmationModal.data.invoiceId,
            invoiceIds: confirmationModal.data.invoiceIds,
          }).unwrap();
          notify(MESSAGES.NOTIFICATION.INVOICE_DELETED_SUCCESSFULLY);
          refetch();
          break;
        case ButtonActions.ExportToTally:
          if (
            !confirmationModal.data?.invoiceId &&
            !confirmationModal.data?.invoiceIds?.length
          )
            return;
          await exportToTally({
            invoiceId: confirmationModal.data.invoiceId,
            // invoiceIds: confirmationModal.data.invoiceIds,
          }).unwrap();
          notify(MESSAGES.NOTIFICATION.INVOICE_EXPORTED_TO_TALLY_SUCCESSFULLY);
          break;
        case ButtonActions.ExportToLocal:
          if (
            !confirmationModal.data?.invoiceId &&
            !confirmationModal.data?.invoiceIds?.length
          )
            return;

          const localDownloadResponse = await exportToLocal({
            invoiceId: confirmationModal.data.invoiceId,
            invoiceIds: confirmationModal.data.invoiceIds,
          }).unwrap();

          localDownloadResponse?.downloads?.forEach(
            async (invoice: { invoice_id: number; download_url: string }) => {
              try {
                const response = await fetch(invoice.download_url);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = `invoice_${invoice.invoice_id}.txt`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url); // Clean up
              } catch (err) {
                console.error(
                  `Failed to download invoice ${invoice.invoice_id}`,
                  err
                );
              }
            }
          );
          notify(MESSAGES.NOTIFICATION.INVOICE_EXPORTED_TO_LOCAL_SUCCESSFULLY);
          break;
        default:
          setConfirmationModal(ConfirmationPopupDefaultValue);
      }
      setSelectedIds([]);
      setSelectedApprovedIds([]);
      setCurrentPage(0);
      setConfirmationModal(ConfirmationPopupDefaultValue);
    } catch (error) {
      const errorObj = error as unknown as CommonErrorResponse;
      notify(errorObj.data.message, { type: STATUS.error });
    }
  };

  const onModalClose = () => {
    setConfirmationModal(ConfirmationPopupDefaultValue);
  };

  const showingTheListItemCounter = () => {
    const startIndex = currentPage * ITEMS_PER_PAGE + 1;
    const endIndex = Math.min(
      (currentPage + 1) * ITEMS_PER_PAGE,
      data?.total || 0
    );
    return `${startIndex}-${endIndex} of ${data?.total}`;
  };

  function getFilterStatusClass(currentStatus: string, targetStatus: string) {
    if (currentStatus === targetStatus) {
      return `active ${currentStatus}`;
    }
    return STRINGS.EMPTY_STRING;
  }

  const isAllSelected =
    data?.data?.length > 0 && selectedIds.length === data?.data.length;
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
            {filterTabs(selectedIds, selectedApprovedIds).map(
              ({ className, icon, alt, label, disabled, actionType }) => (
                <button
                  key={className}
                  type="button"
                  className={`${className}`}
                  disabled={disabled}
                  onClick={() => handleHeaderActions(actionType)}
                >
                  <span className="btn-icon">
                    <img src={icon} alt={alt} />
                  </span>
                  {label}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="invoice-list__table-container">
        <table className="invoice-list__table">
          <thead>
            <tr>
              <th>
                <div className="checkbox-invoice custom-checkbox">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    aria-label="Select all invoices"
                  />
                </div>
              </th>
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
                  <td>
                    <div className="checkbox-invoice custom-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(invoice.id)}
                        onChange={() => handleCheckboxChange(invoice.id)}
                        aria-label={`Select invoice ${invoice.invoiceNo}`}
                      />
                    </div>
                  </td>
                  <td>{invoice.invoiceNo || STRINGS.HYPHEN}</td>
                  <td>{invoice.vendor || STRINGS.HYPHEN}</td>
                  <td>{formatCurrency(invoice.amount)}</td>
                  <td>{invoice.date || STRINGS.HYPHEN}</td>
                  <td>
                    <span className={getStatusClass(invoice.status)}>
                      {getStatusText(invoice.status)}
                    </span>
                  </td>
                  <td className="invoice-list__actions">
                    {actionButtons.map(({ key, icon, alt, className }) => (
                      <button
                        key={key}
                        type="button"
                        className={`invoice-list__action-button ${className}`}
                        onClick={() => handleListAction(key, invoice.id)}
                        disabled={handleActionBtnDisablity(key, invoice.status)}
                      >
                        <img src={icon} alt={alt} />
                      </button>
                    ))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center' }}>
                  <div className="no-text-outer">
                    <h5 className="no-text">No invoices found.</h5>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data?.total > ITEMS_PER_PAGE && (
        <div className="listing-pagination">
          <div className="page-show">
            <span>
              Showing <strong>{showingTheListItemCounter()}</strong>
            </span>
          </div>
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
        </div>
      )}

      <CommonModal
        isOpen={confirmationModal.isOpen}
        onRequestClose={onModalClose}
        onOk={onModalOk}
        message={confirmationModal.title}
      />
    </div>
  );
};

export default InvoiceList;
