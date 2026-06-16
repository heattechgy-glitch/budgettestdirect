import React from 'react';
import PropTypes from 'prop-types';

const BudgetProgress = ({ currentSpending, budgetLimit }) => {
  const percentageUsed = (currentSpending / budgetLimit) * 100;
  let progressColor = 'bg-green-500';

  if (percentageUsed > 75 && percentageUsed <= 100) {
    progressColor = 'bg-yellow-500';
  } else if (percentageUsed > 100) {
    progressColor = 'bg-red-500';
  }

  return (
    <div className="w-full bg-gray-200 rounded-full h-8">
      <div
        className={`h-8 rounded-full ${progressColor}`}
        style={{ width: `${Math.min(percentageUsed, 100)}%` }}
      />
    </div>
  );
};

BudgetProgress.propTypes = {
  currentSpending: PropTypes.number.isRequired,
  budgetLimit: PropTypes.number.isRequired,
};

export default BudgetProgress;
