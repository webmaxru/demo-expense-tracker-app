import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionsAPI, categoriesAPI } from '../services/api';
import type { CreateTransactionRequest } from '../types';

interface TransactionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<CreateTransactionRequest>({
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
    categoryId: undefined,
  });

  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesAPI.getAll,
  });

  // Create transaction mutation
  const createMutation = useMutation({
    mutationFn: transactionsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      onSuccess?.();
      // Reset form
      setFormData({
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        categoryId: undefined,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount > 0) {
      createMutation.mutate(formData);
    }
  };

  const handleChange = <K extends keyof CreateTransactionRequest>(field: K, value: CreateTransactionRequest[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Transaction</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={(e) => handleChange('type', e.target.value as 'income' | 'expense')}
                className="mr-2"
              />
              <span className="text-red-600">Expense</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="income"
                checked={formData.type === 'income'}
                onChange={(e) => handleChange('type', e.target.value as 'income' | 'expense')}
                className="mr-2"
              />
              <span className="text-green-600">Income</span>
            </label>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.amount || ''}
            onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
            className="input-field"
            placeholder="0.00"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="input-field"
            placeholder="Enter description..."
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.categoryId || ''}
            onChange={(e) => handleChange('categoryId', e.target.value || undefined)}
            className="input-field"
          >
            <option value="">Select a category</option>
            {categories
              .filter(cat => cat.type === formData.type)
              .map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="input-field"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={createMutation.isPending || formData.amount <= 0}
            className="btn-primary flex-1"
          >
            {createMutation.isPending ? 'Adding...' : 'Add Transaction'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          )}
        </div>

        {createMutation.error && (
          <div className="text-red-600 text-sm mt-2">
            Error: {createMutation.error.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default TransactionForm;
