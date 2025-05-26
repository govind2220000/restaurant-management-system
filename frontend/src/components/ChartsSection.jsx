import React from 'react';
import OrderSummary from './OrderSummary';
import RevenueChart from './RevenueChart';
import TableBooking from './TableBooking';

function ChartsSection({ dashboardData }) {
  return (
    <div className="charts-section">
      <OrderSummary />
      <RevenueChart />
      <TableBooking tables={dashboardData.tables} />
    </div>
  );
}

export default ChartsSection;
