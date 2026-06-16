export const saveTransactions = (transactions) => {
  try {
    const serializedTransactions = JSON.stringify(transactions);
    localStorage.setItem('transactions', serializedTransactions);
    return true;
  } catch (error) {
    console.error('Failed to save transactions:', error);
    return false;
  }
};

export const getTransactions = () => {
  try {
    const serializedTransactions = localStorage.getItem('transactions');
    return serializedTransactions ? JSON.parse(serializedTransactions) : [];
  } catch (error) {
    console.error('Failed to get transactions:', error);
    return [];
  }
};

export const saveBudget = (budget) => {
  try {
    const serializedBudget = JSON.stringify(budget);
    localStorage.setItem('budget', serializedBudget);
    return true;
  } catch (error) {
    console.error('Failed to save budget:', error);
    return false;
  }
};

export const getBudget = () => {
  try {
    const serializedBudget = localStorage.getItem('budget');
    return serializedBudget ? JSON.parse(serializedBudget) : null;
  } catch (error) {
    console.error('Failed to get budget:', error);
    return null;
  }
};