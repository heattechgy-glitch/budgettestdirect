export const calculateTotalIncome = (transactions) => {
  return transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const calculateTotalExpenses = (transactions) => {
  return transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const calculateBalance = (transactions) => {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  return totalIncome - totalExpenses;
};

export const calculateCategoryTotals = (transactions) => {
  return transactions.reduce((totals, transaction) => {
    const { category, amount } = transaction;
    if (!totals[category]) {
      totals[category] = 0;
    }
    totals[category] += amount;
    return totals;
  }, {});
};

export const calculateBudgetRemaining = (budget, transactions) => {
  const totalExpenses = calculateTotalExpenses(transactions);
  return budget - totalExpenses;
};