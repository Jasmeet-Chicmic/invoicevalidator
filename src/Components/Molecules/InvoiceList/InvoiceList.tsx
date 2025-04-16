import React, { useState } from 'react';
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
];

const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(dummyInvoices);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Approved' | 'Pending'>('All');
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
    id.concat("tets")
    navigate(ROUTES.EDIT); // Add ID to route if needed
  };

  const handleDelete = (id: string) => {
    setConfirmationModal({
      isOpen: true,
      data: { invoiceId: id },
    });
  };

  const getStatusClass = (status: string): string =>
    `status-badge status-${status.toLowerCase()}`;

  const filteredInvoices = invoices.filter((invoice) =>
    filterStatus === 'All' ? true : invoice.status === filterStatus
  );

  return (
    <div className="invoice-list">
      <div className="invoice-list__header">
        <h1 className="invoice-list__title">Invoices</h1>

        <div className="invoice-list__filters">
          <button
            className={`filter-btn ${filterStatus === 'Approved' ? 'active' : ''}`}
            onClick={() => setFilterStatus('Approved')}
            type={"button"}
          >
            Approved
          </button>
          <button
            className={`filter-btn ${filterStatus === 'Pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('Pending')}
            type='button'
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filterStatus === 'All' ? 'active' : ''}`}
            onClick={() => setFilterStatus('All')}
            type='button'
          >
            All
          </button>
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
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
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
