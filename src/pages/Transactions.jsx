import { useState, useEffect } from 'react';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'other',
    date: new Date().toISOString().split('T')[0]
  });
  
  const categories = {
    income: ['salary', 'freelance', 'investment', 'gift', 'other'],
    expense: ['food', 'transport', 'utilities', 'entertainment', 'shopping', 'health', 'education', 'other']
  };

  const categoryIcons = {
    salary: '💰',
    freelance: '💻',
    investment: '📈',
    gift: '🎁',
    food: '🍔',
    transport: '🚗',
    utilities: '💡',
    entertainment: '🎬',
    shopping: '🛒',
    health: '🏥',
    education: '📚',
    other: '📌'
  };

  useEffect(() => {
    const stored = localStorage.getItem('budget_transactions');
    if (stored) {
      setTransactions(JSON.parse(stored));
    } else {
      const sampleTransactions = [
        { id: 1, description: 'Monthly Salary', amount: 5000, type: 'income', category: 'salary', date: '2024-01-15' },
        { id: 2, description: 'Grocery Shopping', amount: 150, type: 'expense', category: 'food', date: '2024-01-14' },
        { id: 3, description: 'Electric Bill', amount: 85, type: 'expense', category: 'utilities', date: '2024-01-13' },
        { id: 4, description: 'Freelance Project', amount: 800, type: 'income', category: 'freelance', date: '2024-01-12' },
        { id: 5, description: 'Movie Night', amount: 45, type: 'expense', category: 'entertainment', date: '2024-01-11' },
        { id: 6, description: 'Gas Station', amount: 60, type: 'expense', category: 'transport', date: '2024-01-10' },
        { id: 7, description: 'Online Course', amount: 199, type: 'expense', category: 'education', date: '2024-01-09' },
        { id: 8, description: 'Birthday Gift Received', amount: 100, type: 'income', category: 'gift', date: '2024-01-08' }
      ];
      setTransactions(sampleTransactions);
      localStorage.setItem('budget_transactions', JSON.stringify(sampleTransactions));
    }
  }, []);

  const saveTransactions = (newTransactions) => {
    setTransactions(newTransactions);
    localStorage.setItem('budget_transactions', JSON.stringify(newTransactions));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    if (editingId) {
      const updated = transactions.map(t => 
        t.id === editingId ? { ...formData, id: editingId, amount: parseFloat(formData.amount) } : t
      );
      saveTransactions(updated);
      setEditingId(null);
    } else {
      const newTransaction = {
        ...formData,
        id: Date.now(),
        amount: parseFloat(formData.amount)
      };
      saveTransactions([newTransaction, ...transactions]);
    }

    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: 'other',
      date: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
  };

  const editTransaction = (id) => {
    const transaction = transactions.find(t => t.id === id);
    setFormData(transaction);
    setEditingId(id);
    setShowForm(true);
  };

  const deleteTransaction = (id) => {
    const updated = transactions.filter(t => t.id !== id);
    saveTransactions(updated);
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-300">Transactions</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3b82f6] hover:bg-blue-600 rounded-lg font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
            <span className="text-slate-400 text-sm">Total Income</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
            <span className="text-slate-400 text-sm">Total Expenses</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-red-400">{formatCurrency(totalExpense)}</p>
        </div>
      </div>

      {showForm && (
        <div className="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit Transaction' : 'New Transaction'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent outline-none transition-all"
                  placeholder="Enter description"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent outline-none transition-all"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value, category: 'other' })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent outline-none transition-all"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent outline-none transition-all"
                >
                  {categories[formData.type].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium text-center transition-colors"
            >
              {editingId ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </form>
        </div>
      )}

      <div className="divide-y divide-slate-700">
        {transactions.map(transaction => (
          <div key={transaction.id} className="py-4 flex items-start">
            <div className="mr-4 text-xl" title={transaction.category}> 
              {categoryIcons[transaction.category]} 
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-slate-300">{transaction.description}</p>
              <p className="text-sm text-slate-400">
                {formatCurrency(transaction.amount)} • {transaction.category} • {transaction.date}
              </p>
            </div>
            <button
              onClick={() => editTransaction(transaction.id)}
              className="text-blue-500 hover:text-blue-400 px-2"
            >
              Edit
            </button>
            <button
              onClick={() => deleteTransaction(transaction.id)}
              className="text-red-500 hover:text-red-400 ml-2 px-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}