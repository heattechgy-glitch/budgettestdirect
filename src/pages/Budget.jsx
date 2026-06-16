import { useState, useEffect } from 'react';

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: '',
    spent: '0',
    period: 'monthly',
  });

  useEffect(() => {
    const savedBudgets = localStorage.getItem('budgetTestDirect_budgets');
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    } else {
      const defaultBudgets = [
        { id: 1, category: 'Groceries', limit: 500, spent: 320, period: 'monthly' },
        { id: 2, category: 'Entertainment', limit: 200, spent: 185, period: 'monthly' },
        { id: 3, category: 'Transportation', limit: 300, spent: 120, period: 'monthly' },
        { id: 4, category: 'Dining Out', limit: 250, spent: 275, period: 'monthly' },
        { id: 5, category: 'Utilities', limit: 150, spent: 142, period: 'monthly' },
        { id: 6, category: 'Shopping', limit: 400, spent: 89, period: 'monthly' },
      ];
      setBudgets(defaultBudgets);
      localStorage.setItem('budgetTestDirect_budgets', JSON.stringify(defaultBudgets));
    }
  }, []);

  const saveBudgets = (updatedBudgets) => {
    setBudgets(updatedBudgets);
    localStorage.setItem('budgetTestDirect_budgets', JSON.stringify(updatedBudgets));
  };

  const handleAddBudget = () => {
    if (!newBudget.category || !newBudget.limit) return;

    const budget = {
      id: Date.now(),
      category: newBudget.category,
      limit: parseFloat(newBudget.limit),
      spent: parseFloat(newBudget.spent) || 0,
      period: newBudget.period,
    };

    saveBudgets([...budgets, budget]);
    setNewBudget({ category: '', limit: '', spent: '0', period: 'monthly' });
    setShowAddModal(false);
  };

  const handleUpdateBudget = () => {
    if (!editingBudget) return;

    const updatedBudgets = budgets.map((b) =>
      b.id === editingBudget.id
        ? {
            ...editingBudget,
            limit: parseFloat(editingBudget.limit),
            spent: parseFloat(editingBudget.spent),
          }
        : b
    );

    saveBudgets(updatedBudgets);
    setEditingBudget(null);
  };

  const handleDeleteBudget = (id) => {
    saveBudgets(budgets.filter((b) => b.id !== id));
  };

  const getProgressColor = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-[#3b82f6]';
  };

  const getStatusText = (spent, limit) => {
    const remaining = limit - spent;
    if (remaining < 0)
      return { text: `$${Math.abs(remaining).toFixed(2)} over budget`, color: 'text-red-400' };
    if (remaining < limit * 0.2)
      return { text: `$${remaining.toFixed(2)} remaining`, color: 'text-yellow-400' };
    return { text: `$${remaining.toFixed(2)} remaining`, color: 'text-green-400' };
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Budget Settings</h1>
      <div className="mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowAddModal(true)}
        >
          Add New Budget
        </button>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Add New Budget</h2>
            <input
              type="text"
              placeholder="Category"
              className="block border mb-2 p-2 w-full"
              value={newBudget.category}
              onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
            />
            <input
              type="number"
              placeholder="Limit"
              className="block border mb-2 p-2 w-full"
              value={newBudget.limit}
              onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              onClick={handleAddBudget}
            >
              Save
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Monthly Overview</h2>
        <div className="font-semibold mb-2">Total Budget: ${totalBudget}, Total Spent: ${totalSpent}</div>
        {budgets.map((budget) => {
          const progressColor = getProgressColor(budget.spent, budget.limit);
          const statusText = getStatusText(budget.spent, budget.limit);
          return (
            <div key={budget.id} className="mb-4">
              <div className="flex justify-between items-center">
                <div className="font-semibold">{budget.category}</div>
                <div className={`text-sm ${statusText.color}`}>{statusText.text}</div>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${progressColor}`}
                  style={{ width: `${(budget.spent / budget.limit) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Spent: ${budget.spent}</span>
                <span>Limit: ${budget.limit}</span>
              </div>
              <button
                className="mt-2 text-blue-500"
                onClick={() => setEditingBudget(budget)}
              >
                Edit
              </button>
              <button
                className="mt-2 ml-2 text-red-500"
                onClick={() => handleDeleteBudget(budget.id)}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>

      {editingBudget && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Edit Budget</h2>
            <input
              type="text"
              placeholder="Category"
              className="block border mb-2 p-2 w-full"
              value={editingBudget.category}
              onChange={(e) =>
                setEditingBudget({ ...editingBudget, category: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Limit"
              className="block border mb-2 p-2 w-full"
              value={editingBudget.limit}
              onChange={(e) =>
                setEditingBudget({ ...editingBudget, limit: e.target.value })
              }
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              onClick={handleUpdateBudget}
            >
              Save
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setEditingBudget(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}