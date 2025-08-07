import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { transactionsAPI } from '../services/api';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import type { Transaction } from '../types';

const Dashboard: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch transactions for dashboard stats
  const { data: transactionData } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionsAPI.getAll(),
  });

  const transactions: Transaction[] = transactionData?.data || [];

  // Calculate totals
  const totals = transactions.reduce(
    (acc: { totalIncome: number; totalExpenses: number }, transaction: Transaction) => {
      const amount = parseFloat(transaction.amount);
      if (transaction.type === 'income') {
        acc.totalIncome += amount;
      } else {
        acc.totalExpenses += amount;
      }
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0 }
  );

  const balance = totals.totalIncome - totals.totalExpenses;

  // Get current month transactions
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthTransactions = transactions.filter((t: Transaction) => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  const thisMonthTotal = thisMonthTransactions.reduce((sum: number, t: Transaction) => {
    return sum + (t.type === 'expense' ? parseFloat(t.amount) : 0);
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Personal Expense Tracker
        </h1>
        <p className="text-gray-600 mt-2">
          Take control of your finances with actionable insights
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Dashboard Cards */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Income</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(totals.totalIncome)}
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(totals.totalExpenses)}
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Balance</h3>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">This Month</h3>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(thisMonthTotal)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transaction Form */}
        <div>
          {showAddForm ? (
            <TransactionForm 
              onSuccess={() => setShowAddForm(false)}
              onCancel={() => setShowAddForm(false)}
            />
          ) : (
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary w-full"
                >
                  Add Transaction
                </button>
                <button className="btn-secondary w-full">
                  Set Budget
                </button>
                <button className="btn-secondary w-full">
                  View Reports
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Transaction List */}
        <div>
          <TransactionList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
