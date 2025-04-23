/* eslint-disable no-case-declarations */
import React, { useCallback, useMemo, useState } from 'react';
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
import { CustomTable } from '../CustomTable';
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
import { generateStatusPayload, getInvoiceTableColumns } from './helpers/utils';
import './InvoiceList.scss';
import { Invoice } from './helpers/interface';
import { SortDirections } from '../CustomTable/helpers/interface';

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
  const notify = useNotification();
  const [filterStatus, setFilterStatus] = useState<ListingStatus>(
    ListingStatus.All
  );
  const [sortKey, setSortKey] = useState<keyof Invoice | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirections | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedApprovedIds, setSelectedApprovedIds] = useState<number[]>([]);

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
      sortKey,
      sortDirection,
      status: generateStatusPayload(filterStatus),
    },
    { refetchOnMountOrArgChange: true }
  );

  const handleEdit = useCallback(
    (invoiceId: number) => {
      navigate(`${ROUTES.EDIT}/${invoiceId}`);
    },
    [navigate]
  );

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

  const handleListAction = useCallback(
    (action: ButtonActions, id: number) => {
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
    },
    [handleEdit]
  );

  const handleActionBtnDisablity = (action: ButtonActions, status: number) => {
    switch (action) {
      case ButtonActions.ExportToTally:
        return status === ListingStatusPayload.pending;
      default:
        return false;
    }
  };

  const handleSelectAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        const allIds = data?.data?.map((invoice: Invoice) => invoice.id) || [];
        const approvedIds = data?.data?.filter(
          (invoice: Invoice) => invoice.status === ListingStatusPayload.approved
        );
        setSelectedIds(allIds);
        setSelectedApprovedIds(approvedIds);
      } else {
        setSelectedIds([]);
        setSelectedApprovedIds([]);
      }
    },
    [data?.data]
  );

  const handleCheckboxChange = useCallback(
    (id: number) => {
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
    },
    [data?.data]
  );

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
  const getStatusText = useCallback((status: ListingStatusPayload): string => {
    switch (status) {
      case ListingStatusPayload.approved:
        return ListingStatus.Approved;
      case ListingStatusPayload.pending:
        return ListingStatus.Pending;
      default:
        return STRINGS.EMPTY_STRING;
    }
  }, []);

  const getStatusClass = useCallback(
    (status: ListingStatusPayload): string => {
      return `status-badge status-${getStatusText(status).toLowerCase()}`;
    },
    [getStatusText]
  );

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
                link.download = `invoice_${invoice.invoice_id}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url); // Clean up
              } catch (err) {
                notify(
                  `${MESSAGES.NOTIFICATION.FILE_TYPE_NOT_ALLOWED} ${invoice.invoice_id}`
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

  const handleSort = (
    sortingKey: keyof Invoice,
    sortingdirection: SortDirections
  ) => {
    setSortKey(sortingKey);
    setSortDirection(sortingdirection);
    setCurrentPage(0);
  };

  const isAllSelected =
    data?.data?.length > 0 && selectedIds.length === data?.data.length;

  const columns = useMemo(
    () =>
      getInvoiceTableColumns({
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
      }),
    [
      getStatusClass,
      getStatusText,
      handleCheckboxChange,
      handleListAction,
      handleSelectAll,
      isAllSelected,
      selectedIds,
    ]
  );

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
            {filterTabs(selectedIds).map(
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

      <CustomTable
        columns={columns}
        data={data?.data || []}
        rowKey={(row: Invoice) => row.id}
        handleSort={handleSort}
      />

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
