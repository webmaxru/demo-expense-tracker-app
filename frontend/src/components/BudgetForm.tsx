import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { budgetsAPI, categoriesAPI } from '../services/api';
import type { CreateBudgetRequest, Category } from '../types';

interface Props {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const BudgetForm: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const qc = useQueryClient();
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesAPI.getAll,
  });

  const expenseCategories = useMemo(
    () => (categories || []).filter((c: Category) => c.type === 'expense'),
    [categories]
  );

  const [form, setForm] = useState<CreateBudgetRequest>({
    categoryId: '',
    amount: 0,
    period: 'monthly',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString(),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      .toISOString(),
  });

  // Set default category when categories load
  useEffect(() => {
    if (!form.categoryId && expenseCategories.length > 0) {
      setForm((prev) => ({ ...prev, categoryId: expenseCategories[0].id }));
    }
  }, [expenseCategories, form.categoryId]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: budgetsAPI.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['budgets'] });
      if (onSuccess) onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId || form.amount <= 0) return;
    mutate(form);
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Set Budget</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Category</label>
          <select
            className="input"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            {expenseCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Amount</label>
          <input
            className="input"
            type="number"
            step="0.01"
            min={0}
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
          />
        </div>

        <div>
          <label className="label">Period</label>
          <select
            className="input"
            value={form.period}
            onChange={(e) => setForm({ ...form, period: e.target.value as CreateBudgetRequest['period'] })}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Start Date</label>
            <input
              className="input"
              type="date"
              value={new Date(form.startDate).toISOString().slice(0, 10)}
              onChange={(e) => setForm({ ...form, startDate: new Date(e.target.value).toISOString() })}
            />
          </div>
          <div>
            <label className="label">End Date</label>
            <input
              className="input"
              type="date"
              value={new Date(form.endDate).toISOString().slice(0, 10)}
              onChange={(e) => setForm({ ...form, endDate: new Date(e.target.value).toISOString() })}
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {(
              error as unknown as { response?: { data?: { error?: string } } }
            )?.response?.data?.error || 'Failed to create budget'}
          </p>
        )}

        <div className="flex gap-3">
          <button className="btn-primary" type="submit" disabled={isPending}>Save Budget</button>
          {onCancel && (
            <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;
