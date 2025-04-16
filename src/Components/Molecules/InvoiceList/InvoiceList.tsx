// Library
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Constants
import { MODAL_MESSAGES, ROUTES } from '../../../Shared/Constants';
// Styles
import './InvoiceList.scss';
// Custom Components
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
    id.concat('edit');
    navigate(ROUTES.EDIT);
  };

  const handleDelete = (id: string) => {
    setConfirmationModal({
      isOpen: true,
      data: { invoiceId: id },
    });
  };

  const getStatusClass = (status: string): string =>
    `status-badge status-${status.toLowerCase()}`;

  return (
    <div className="invoice-list">
      <div className="invoice-list__header">
        <h1 className="invoice-list__title">Invoices</h1>
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
            {invoices.map((invoice) => (
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
                    aria-label={`Edit invoice ${invoice.invoiceNo}`}
                    className="invoice-list__action-button invoice-list__action-button--edit"
                    onClick={() => handleEdit(invoice.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete invoice ${invoice.invoiceNo}`}
                    className="invoice-list__action-button invoice-list__action-button--delete"
                    onClick={() => handleDelete(invoice.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="invoice-list__export-button">
        Export
      </button>
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
