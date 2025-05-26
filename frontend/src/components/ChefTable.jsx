import React from 'react';

function ChefTable({ chefs }) {
  return (
    <div className="chef-table-section">
      <div className="chef-table-container">
        <table className="chef-table">
          <thead className="chef-table-head">
            <tr>
              <th className="chef-header-cell">Chef Name</th>
              <th className="chef-header-cell">Order Taken</th>
            </tr>
          </thead>
          <tbody className="chef-table-body">
            {chefs.map((chef, index) => (
              <tr key={index} className="chef-table-row">
                <td className="chef-cell chef-name-cell">
                  {chef.name}
                </td>
                <td className="chef-cell chef-orders-cell">
                  {chef.totalOrders.toString().padStart(2, '0')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ChefTable;
