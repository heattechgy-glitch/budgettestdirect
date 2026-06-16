import { useState, useEffect } from 'react'

export default function Index() {
  const [transactions, setTransactions] = useState([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('budgetTransactions')
    if (saved) {
      setTransactions(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('budgetTransactions', JSON.stringify(transactions))
  }, [transactions])

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!description.trim() || !amount) return

    const newTransaction = {
      id: editingId || Date.now(),
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      date: new Date().toISOString()
    }

    if (editingId) {
      setTransactions(transactions.map(t => t.id === editingId ? newTransaction : t))
      setEditingId(null)
    } else {
      setTransactions([newTransaction, ...transactions])
    }

    setDescription('')
    setAmount('')
    setType('expense')
  }

  const handleEdit = (transaction) => {
    setDescription(transaction.description)
    setAmount(transaction.amount.toString())
    setType(transaction.type)
    setEditingId(transaction.id)
  }

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setDescription('')
      setAmount('')
      setType('expense')
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-green-200 p-4 rounded-lg">
          <h3 className="font-bold text-lg">Total Income</h3>
          <p className="text-xl">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="bg-red-200 p-4 rounded-lg">
          <h3 className="font-bold text-lg">Total Expenses</h3>
          <p className="text-xl">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="bg-blue-200 p-4 rounded-lg">
          <h3 className="font-bold text-lg">Balance</h3>
          <p className="text-xl">{formatCurrency(balance)}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-4 gap-4">
          <input
            className="border rounded-lg p-2 col-span-1"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <input
            className="border rounded-lg p-2 col-span-1"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
          />
          <select
            className="border rounded-lg p-2 col-span-1"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {editingId ? 'Update' : 'Add Transaction'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setDescription('')
                  setAmount('')
                  setType('expense')
                }}
                className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="bg-slate-800 rounded-xl border border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-xl font-semibold">Transaction History</h2>
        </div>
        {transactions.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-slate-500 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-slate-400">No transactions yet</p>
            <p className="text-slate-500 text-sm">Add your first transaction above</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-700">
            {transactions.map(transaction => (
              <li key={transaction.id} className="p-4 hover:bg-slate-750 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{transaction.description}</p>
                    <p className="text-sm text-slate-400">{formatDate(transaction.date)}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="p-2 text-slate-400 hover:text-[#3b82f6] hover:bg-slate-700 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)} 
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.136 21H7.864a2 2 0 01-1.997-1.858L5 7m5-1V4a3 3 0 013-3h4a3 3 0 013 3v2m-9 0h10" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
