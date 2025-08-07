import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsAPI } from '../services/api';
import { format } from 'date-fns';
import type { Transaction } from '../types';

const TransactionList: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch transactions
  const { data: transactionData, isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionsAPI.getAll(),
  });

  // Delete transaction mutation
  const deleteMutation = useMutation({
    mutationFn: transactionsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteMutation.mutate(id);
    }
  };

  const formatAmount = (amount: string, type: 'income' | 'expense') => {
    const value = parseFloat(amount);
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
    
    return type === 'income' ? `+${formatted}` : `-${formatted}`;
  };

  const getAmountColor = (type: 'income' | 'expense') => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-red-600">
          Error loading transactions: {error.message}
        </div>
      </div>
    );
  }

  const transactions = transactionData?.data || [];

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Recent Transactions</h3>
        <span className="text-sm text-gray-500">
          {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
        </span>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">No transactions yet</p>
          <p className="text-sm">Add your first transaction to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction: Transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  {transaction.category && (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: transaction.category.color }}
                    ></div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.description || 'No description'}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      {transaction.category && (
                        <span>{transaction.category.name}</span>
                      )}
                      <span>•</span>
                      <span>
                        {format(new Date(transaction.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`font-semibold ${getAmountColor(transaction.type)}`}>
                  {formatAmount(transaction.amount, transaction.type)}
                </span>
                
                <button
                  onClick={() => handleDelete(transaction.id)}
                  disabled={deleteMutation.isPending}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  title="Delete transaction"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
