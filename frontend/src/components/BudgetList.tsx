import React from 'react';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { budgetsAPI } from '../services/api';
import type { Budget } from '../types';

const ProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => (
  <div className="w-full bg-gray-200 rounded h-2">
    <div
      className={`h-2 rounded ${percentage >= 100 ? 'bg-red-500' : 'bg-green-500'}`}
      style={{ width: `${Math.min(percentage, 100)}%` }}
    />
  </div>
);

const BudgetList: React.FC = () => {
  const qc = useQueryClient();
  const { data: budgets } = useQuery({
    queryKey: ['budgets'],
    queryFn: budgetsAPI.getAll,
  });

  // Fetch progress for each budget
  const progressQueries = useQueries({
    queries: (budgets || []).map((b: Budget) => ({
      queryKey: ['budget-progress', b.id],
      queryFn: () => budgetsAPI.getProgress(b.id),
      enabled: !!b.id,
    })),
  });

  const { mutate: deleteBudget } = useMutation({
    mutationFn: (id: string) => budgetsAPI.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['budgets'] });
    },
  });

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Budgets</h3>
      <div className="space-y-4">
        {(budgets || []).length === 0 && (
          <p className="text-gray-600">No budgets yet. Create one to track your spending.</p>
        )}
        {(budgets || []).map((b: Budget, idx: number) => {
          const progress = progressQueries[idx]?.data;
          const percentage = progress?.percentage ?? 0;
          const spent = progress?.spent ?? '0.00';
          return (
            <div key={b.id} className="p-4 border border-gray-200 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{b.category?.name}</p>
                  <p className="text-sm text-gray-600">{new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}</p>
                </div>
                <button className="text-red-600 text-sm" onClick={() => deleteBudget(b.id)}>Delete</button>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>Spent ${spent}</span>
                  <span>Budget ${b.amount}</span>
                </div>
                <ProgressBar percentage={percentage} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetList;
