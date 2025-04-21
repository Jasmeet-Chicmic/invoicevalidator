import React, { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { MODAL_MESSAGES, ROUTES } from '../../../Shared/Constants';
import './InvoiceList.scss';
import CommonModal from '../CommonModal';
import IMAGES from '../../../Shared/Images';
import { useGetAllInvoiceQuery } from '../../../Services/Api/module/fileApi';
import TextLoader from '../../Atoms/TextLoader';
import RetryButton from '../../Atoms/RetryButton';

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
// const dummyInvoices: Invoice[] = [
//   {
//     id: 'inv-001',
//     invoiceNo: 'INV-34212',
//     vendor: 'XYZ Pvt Ltd',
//     amount: 812499,
//     date: '25/03/2025',
//     status: 'Approved',
//   },
//   {
//     id: 'inv-002',
//     invoiceNo: 'INV-34890',
//     vendor: 'ABC Traders',
//     amount: 28540,
//     date: '28/03/2025',
//     status: 'Approved',
//   },
//   {
//     id: 'inv-003',
//     invoiceNo: 'INV-34901',
//     vendor: 'Global Industries',
//     amount: 156780,
//     date: '30/03/2025',
//     status: 'Pending',
//   },
//   {
//     id: 'inv-004',
//     invoiceNo: 'INV-34915',
//     vendor: 'Tech Solutions',
//     amount: 45600,
//     date: '01/04/2025',
//     status: 'Approved',
//   },
//   {
//     id: 'inv-005',
//     invoiceNo: 'INV-34928',
//     vendor: 'Supply Chain Co',
//     amount: 92300,
//     date: '03/04/2025',
//     status: 'Approved',
//   },
//   {
//     id: 'inv-006',
//     invoiceNo: 'INV-34929',
//     vendor: 'Aqua Inc.',
//     amount: 75200,
//     date: '04/04/2025',
//     status: 'Pending',
//   },
//   {
//     id: 'inv-007',
//     invoiceNo: 'INV-34930',
//     vendor: 'Ocean Group',
//     amount: 43200,
//     date: '05/04/2025',
//     status: 'Approved',
//   },
//   {
//     id: 'inv-008',
//     invoiceNo: 'INV-34931',
//     vendor: 'Logix Ltd.',
//     amount: 116000,
//     date: '06/04/2025',
//     status: 'Approved',
//   },
//   {
//     id: 'inv-009',
//     invoiceNo: 'INV-34932',
//     vendor: 'BrightWare',
//     amount: 98340,
//     date: '07/04/2025',
//     status: 'Pending',
//   },
//   {
//     id: 'inv-010',
//     invoiceNo: 'INV-34933',
//     vendor: 'NextGen Systems',
//     amount: 134900,
//     date: '08/04/2025',
//     status: 'Approved',
//   },
//   {
//     id: 'inv-011',
//     invoiceNo: 'INV-34934',
//     vendor: 'Fusion Tech',
//     amount: 58900,
//     date: '09/04/2025',
//     status: 'Pending',
//   },
//   {
//     id: 'inv-012',
//     invoiceNo: 'INV-34935',
//     vendor: 'Alpha Ventures',
//     amount: 120000,
//     date: '10/04/2025',
//     status: 'Approved',
//   },
//   {
//     id: 'inv-013',
//     invoiceNo: 'INV-34936',
//     vendor: 'Urban Supplies',
//     amount: 67850,
//     date: '11/04/2025',
//     status: 'Pending',
//   },
//   {
//     id: 'inv-014',
//     invoiceNo: 'INV-34937',
//     vendor: 'Zenith Logistics',
//     amount: 149999,
//     date: '12/04/2025',
//     status: 'Approved',
//   },
//   {
//     id: 'inv-015',
//     invoiceNo: 'INV-34938',
//     vendor: 'FutureTech',
//     amount: 174800,
//     date: '13/04/2025',
//     status: 'Approved',
//   },
//   {
//     id: 'inv-016',
//     invoiceNo: 'INV-34939',
//     vendor: 'Eco Materials',
//     amount: 83200,
//     date: '14/04/2025',
//     status: 'Pending',
//   },
//   {
//     id: 'inv-017',
//     invoiceNo: 'INV-34940',
//     vendor: 'Nova Systems',
//     amount: 103500,
//     date: '15/04/2025',
//     status: 'Approved',
//   },
// ];

const ITEMS_PER_PAGE = 5;
type FilterStateType = 'All' | 'Approved' | 'Pending';
const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStateType>('All');
  const [currentPage, setCurrentPage] = useState(0);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    data: { invoiceId: '' },
  });
  const {
    data,
    isFetching: isAllInvoiceLoading,
    isError: isAllInvoiceError,
    refetch,
  } = useGetAllInvoiceQuery({});

  useEffect(() => {
    setInvoices(data);
  }, [data]);
  // useEffect(() => {
  //   setInvoices(allInvoicesData);
  // }, [allInvoicesData]);
  const navigate = useNavigate();

  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  const handleEdit = (id: string) => {
    id.concat('test');
    navigate(ROUTES.EDIT); // Update with `ROUTES.EDIT + id` if needed
  };

  const handleDelete = (id: string) => {
    setConfirmationModal({
      isOpen: true,
      data: { invoiceId: id },
    });
  };

  const getStatusClass = (status: string): string =>
    `status-badge status-${status.toLowerCase()}`;

  // Filtered and Paginated Data
  const filteredInvoices = useMemo(() => {
    if (!invoices) {
      return [];
    }

    if (invoices && invoices.length === 0) {
      return [];
    }
    return invoices.filter((invoice) =>
      filterStatus === 'All' ? true : invoice.status === filterStatus
    );
  }, [invoices, filterStatus]);

  const pageCount = useMemo(() => {
    if (filteredInvoices.length === 0) {
      return 0;
    }
    return Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
  }, [filteredInvoices]);

  const paginatedInvoices = useMemo(() => {
    if (filteredInvoices.length === 0) {
      return [];
    }
    return filteredInvoices.slice(
      currentPage * ITEMS_PER_PAGE,
      (currentPage + 1) * ITEMS_PER_PAGE
    );
  }, [filteredInvoices, currentPage]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);

    // For backend pagination, call API here with selected page
    // fetchInvoicesFromServer({ page: selectedItem.selected, filter: filterStatus })
  };
  const onRetry = () => {
    refetch();
  };

  if (isAllInvoiceError) return <RetryButton onClick={onRetry} />;
  if (isAllInvoiceLoading) return <TextLoader showText={false} />;
  return (
    <div className="invoice-list">
      <div className="invoice-list__header">
        <h1 className="invoice-list__title">Invoices</h1>

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
            {['All', 'Pending', 'Approved'].map((status) => (
              <button
                key={status}
                className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                onClick={() => {
                  setFilterStatus(status as FilterStateType);
                  setCurrentPage(0);
                }}
                type="button"
              >
                {status}
              </button>
            ))}
          </div>
          <div className="download-btns">
            <button type="button" className="btn-primary exporttotelly">
              <span className="btn-icon">
                <img src={IMAGES.exportIcon} alt="Export to Tally" />
              </span>
              Export to Tally
            </button>
            <button type="button" className="btn-primary downloadjson">
              <span className="btn-icon">
                <img src={IMAGES.downloadIcon} alt="Download JSON" />
              </span>
              Download JSON
            </button>
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
            {paginatedInvoices.length > 0 ? (
              paginatedInvoices.map((invoice) => (
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
                      onClick={() => handleEdit(invoice.id)}
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

      {filteredInvoices.length > ITEMS_PER_PAGE && (
        <ReactPaginate
          previousLabel="Prev"
          nextLabel="Next"
          pageCount={pageCount}
          onPageChange={handlePageChange}
          containerClassName="pagination"
          activeClassName="active"
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          forcePage={currentPage}
        />
      )}

      <CommonModal
        isOpen={confirmationModal.isOpen}
        onRequestClose={() =>
          setConfirmationModal({ ...confirmationModal, isOpen: false })
        }
        onOk={() => {
          setConfirmationModal({ ...confirmationModal, isOpen: false });
          setInvoices((prev) =>
            prev.filter(
              (invoice) => invoice.id !== confirmationModal.data.invoiceId
            )
          );
        }}
        message={MODAL_MESSAGES.DELETE_CONFIRMATION}
      />
    </div>
  );
};

export default InvoiceList;
