import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'lucide-react';

const TransactionList = ({ transactions, onDelete }) => {
  return (
    <div className="transaction-list">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="transaction-item flex justify-between items-center p-4 border-b">
          <div className="transaction-details flex items-center">
            <Badge className="mr-2 text-xs rounded bg-blue-100 text-blue-800">
              {transaction.category}
            </Badge>
            <div className="transaction-info">
              <p className="description font-medium">{transaction.description}</p>
              <p className="date text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="transaction-actions flex items-center">
            <p className="amount text-lg font-bold text-green-600 mr-4">
              ${transaction.amount.toFixed(2)}
            </p>
            <button
              onClick={() => onDelete(transaction.id)}
              className="delete-button bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TransactionList;
