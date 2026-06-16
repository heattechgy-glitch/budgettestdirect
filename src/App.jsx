import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index.jsx';
import Transactions from './pages/Transactions.jsx';
import Budget from './pages/Budget.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
  const [transactions, setTransactions] = useState([
    { id: 1, description: 'Grocery Shopping', amount: -85.50, category: 'Food', date: '2024-01-15' },
    { id: 2, description: 'Salary', amount: 3500.00, category: 'Income', date: '2024-01-01' },
    { id: 3, description: 'Electric Bill', amount: -120.00, category: 'Utilities', date: '2024-01-10' },
    { id: 4, description: 'Netflix Subscription', amount: -15.99, category: 'Entertainment', date: '2024-01-05' },
    { id: 5, description: 'Gas Station', amount: -45.00, category: 'Transportation', date: '2024-01-12' }
  ]);

  const [budgets, setBudgets] = useState([
    { id: 1, category: 'Food', limit: 500, spent: 85.50 },
    { id: 2, category: 'Utilities', limit: 200, spent: 120 },
    { id: 3, category: 'Entertainment', limit: 100, spent: 15.99 },
    { id: 4, category: 'Transportation', limit: 150, spent: 45 }
  ]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now()
    };
    setTransactions([newTransaction, ...transactions]);
    
    if (transaction.amount < 0) {
      setBudgets(budgets.map(budget => 
        budget.category === transaction.category
          ? { ...budget, spent: budget.spent + Math.abs(transaction.amount) }
          : budget
      ));
    }
  };

  const deleteTransaction = (id) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction && transaction.amount < 0) {
      setBudgets(budgets.map(budget =>
        budget.category === transaction.category
          ? { ...budget, spent: Math.max(0, budget.spent - Math.abs(transaction.amount)) }
          : budget
      ));
    }
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const updateBudget = (id, newLimit) => {
    setBudgets(budgets.map(budget =>
      budget.id === id ? { ...budget, limit: newLimit } : budget
    ));
  };

  const addBudget = (budget) => {
    const newBudget = {
      ...budget,
      id: Date.now(),
      spent: 0
    };
    setBudgets([...budgets, newBudget]);
  };

  const deleteBudget = (id) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <Routes>
        <Route path="/" element={
          <Index 
            transactions={transactions} 
            budgets={budgets} 
          />
        } />
        <Route path="/transactions" element={
          <Transactions 
            transactions={transactions}
            addTransaction={addTransaction}
            deleteTransaction={deleteTransaction}
            budgets={budgets}
          />
        } />
        <Route path="/budget" element={
          <Budget 
            budgets={budgets}
            updateBudget={updateBudget}
            addBudget={addBudget}
            deleteBudget={deleteBudget}
          />
        } />
      </Routes>
    </div>
  );
}

export default App;
