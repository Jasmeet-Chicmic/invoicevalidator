import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { MODAL_MESSAGES, ROUTES } from '../../../Shared/Constants';
import './InvoiceList.scss';
import CommonModal from '../CommonModal';

export interface Invoice {
  id: string;
  invoiceNo: string;
  vendor: string;
  amount: number;
  date: string;
  status: 'Approved' | 'Pending';
}

const dummyInvoices: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNo: 'INV-34212',
    vendor: 'XYZ Pvt Ltd',
    amount: 812499,
    date: '25/03/2025',
    status: 'Approved',
  },
  {
    id: 'inv-002',
    invoiceNo: 'INV-34890',
    vendor: 'ABC Traders',
    amount: 28540,
    date: '28/03/2025',
    status: 'Approved',
  },
  {
    id: 'inv-003',
    invoiceNo: 'INV-34901',
    vendor: 'Global Industries',
    amount: 156780,
    date: '30/03/2025',
    status: 'Pending',
  },
  {
    id: 'inv-004',
    invoiceNo: 'INV-34915',
    vendor: 'Tech Solutions',
    amount: 45600,
    date: '01/04/2025',
    status: 'Approved',
  },
  {
    id: 'inv-005',
    invoiceNo: 'INV-34928',
    vendor: 'Supply Chain Co',
    amount: 92300,
    date: '03/04/2025',
    status: 'Approved',
  },
  {
    id: 'inv-006',
    invoiceNo: 'INV-34929',
    vendor: 'Aqua Inc.',
    amount: 75200,
    date: '04/04/2025',
    status: 'Pending',
  },
  {
    id: 'inv-007',
    invoiceNo: 'INV-34930',
    vendor: 'Ocean Group',
    amount: 43200,
    date: '05/04/2025',
    status: 'Approved',
  },
];

const ITEMS_PER_PAGE = 5;
type FilterStateType = 'All' | 'Approved' | 'Pending';
const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(dummyInvoices);
  const [filterStatus, setFilterStatus] = useState<FilterStateType>('All');
  const [currentPage, setCurrentPage] = useState(0);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    data: { invoiceId: '' },
  });

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
  const filteredInvoices = invoices.filter((invoice) =>
    filterStatus === 'All' ? true : invoice.status === filterStatus
  );

  const pageCount = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);

  const paginatedInvoices = filteredInvoices.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);

    // For backend pagination, call API here with selected page
    // fetchInvoicesFromServer({ page: selectedItem.selected, filter: filterStatus })
  };

  return (
    <div className="invoice-list">
      <div className="invoice-list__header">
        <h1 className="invoice-list__title">Invoices</h1>

        <div className="invoice-list__filters">
          {['Approved', 'Pending', 'All'].map((status) => (
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

        <button type="button" className="btn-primary">
          Export to Tally
        </button>
        <button type="button" className="btn-primary">
          Download JSON
        </button>
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
                      ✏️
                    </button>
                    <button
                      type="button"
                      className="invoice-list__action-button invoice-list__action-button--delete"
                      onClick={() => handleDelete(invoice.id)}
                      aria-label={`Delete invoice ${invoice.invoiceNo}`}
                    >
                      🗑️
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
          previousLabel="← Previous"
          nextLabel="Next →"
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
