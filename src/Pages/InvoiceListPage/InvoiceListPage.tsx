import React from 'react';
import InvoiceList from '../../Components/Molecules/InvoiceList';
import './InvoiceListPage.scss';

const InvoiceListPage: React.FC = () => {
  return (
    <div className="invoice-list-page">
      <div className="invoice-list-page__container">
        <InvoiceList />
      </div>
    </div>
  );
};

export default InvoiceListPage;
