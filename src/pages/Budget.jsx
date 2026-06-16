import { useState, useEffect } from 'react'

export default function Budget() {
  const [budgets, setBudgets] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: '',
    spent: '0',
    period: 'monthly'
  })

  useEffect(() => {
    const savedBudgets = localStorage.getItem('budgetTestDirect_budgets')
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets))
    } else {
      const defaultBudgets = [
        { id: 1, category: 'Groceries', limit: 500, spent: 320, period: 'monthly' },
        { id: 2, category: 'Entertainment', limit: 200, spent: 185, period: 'monthly' },
        { id: 3, category: 'Transportation', limit: 300, spent: 120, period: 'monthly' },
        { id: 4, category: 'Dining Out', limit: 250, spent: 275, period: 'monthly' },
        { id: 5, category: 'Utilities', limit: 150, spent: 142, period: 'monthly' },
        { id: 6, category: 'Shopping', limit: 400, spent: 89, period: 'monthly' }
      ]
      setBudgets(defaultBudgets)
      localStorage.setItem('budgetTestDirect_budgets', JSON.stringify(defaultBudgets))
    }
  }, [])

  const saveBudgets = (updatedBudgets) => {
    setBudgets(updatedBudgets)
    localStorage.setItem('budgetTestDirect_budgets', JSON.stringify(updatedBudgets))
  }

  const handleAddBudget = () => {
    if (!newBudget.category || !newBudget.limit) return

    const budget = {
      id: Date.now(),
      category: newBudget.category,
      limit: parseFloat(newBudget.limit),
      spent: parseFloat(newBudget.spent) || 0,
      period: newBudget.period
    }

    saveBudgets([...budgets, budget])
    setNewBudget({ category: '', limit: '', spent: '0', period: 'monthly' })
    setShowAddModal(false)
  }

  const handleUpdateBudget = () => {
    if (!editingBudget) return

    const updatedBudgets = budgets.map(b =>
      b.id === editingBudget.id ? {
        ...editingBudget,
        limit: parseFloat(editingBudget.limit),
        spent: parseFloat(editingBudget.spent)
      } : b
    )

    saveBudgets(updatedBudgets)
    setEditingBudget(null)
  }

  const handleDeleteBudget = (id) => {
    saveBudgets(budgets.filter(b => b.id !== id))
  }

  const getProgressColor = (spent, limit) => {
    const percentage = (spent / limit) * 100
    if (percentage >= 100) return 'bg-red-500'
    if (percentage >= 80) return 'bg-yellow-500'
    return 'bg-[#3b82f6]'
  }

  const getStatusText = (spent, limit) => {
    const remaining = limit - spent
    if (remaining < 0) return { text: `$${Math.abs(remaining).toFixed(2)} over budget`, color: 'text-red-400' }
    if (remaining < limit * 0.2) return { text: `$${remaining.toFixed(2)} remaining`, color: 'text-yellow-400' }
    return { text: `$${remaining.toFixed(2)} remaining`, color: 'text-green-400' }
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const overBudgetCount = budgets.filter(b => b.spent > b.limit).length

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Budget Manager</h1>
            <p className="text-slate-400 mt-1">Track and manage your spending limits</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Budget
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <p className="text-slate-400 text-sm">Total Budget</p>
            <p className="text-2xl font-bold text-white mt-1">${totalBudget.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <p className="text-slate-400 text-sm">Total Spent</p>
            <p className="text-2xl font-bold text-[#3b82f6] mt-1">${totalSpent.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <p className="text-slate-400 text-sm">Over Budget</p>
            <p className={`text-2xl font-bold mt-1 ${overBudgetCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {overBudgetCount} {overBudgetCount === 1 ? 'category' : 'categories'}
            </p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 mb-8 border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-sm">Overall Progress</span>
            <span className="text-white font-medium">{((totalSpent / totalBudget) * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(totalSpent, totalBudget)}`}
              style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = Math.min((budget.spent / budget.limit) * 100, 100)
            const status = getStatusText(budget.spent, budget.limit)

            return (
              <div
                key={budget.id}
                className="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getProgressColor(budget.spent, budget.limit)}`} />
                    <h3 className="text-lg font-semibold text-white">{budget.category}</h3>
                    <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded capitalize">
                      {budget.period}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingBudget(budget)}
                      className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-2xl font-bold text-white">${budget.spent.toFixed(2)}</span>
                  <span className="text-slate-400">of ${budget.limit.toFixed(2)}</span>
                </div>

                <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(budget.spent, budget.limit)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className={`text-sm ${status.color}`}>{status.text}</span>
                  <span className="text-sm text-slate-400">{percentage.toFixed(0)}% used</span>
                </div>
              </div>
            )