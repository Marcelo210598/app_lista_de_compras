import React from 'react';
import { Filter, Package, CheckCircle } from 'lucide-react';

interface FilterBarProps {
  filter: string;
  onFilterChange: (filter: string) => void;
  totalItems: number;
  completedItems: number;
  onClearCompleted: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onFilterChange,
  totalItems,
  completedItems,
  onClearCompleted,
}) => {
  const filters = [
    { id: 'all', label: 'Todos', icon: Package },
    { id: 'pending', label: 'Pendentes', icon: Filter },
    { id: 'completed', label: 'Concluídos', icon: CheckCircle },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {totalItems} itens • {completedItems} concluídos
          </span>
        </div>
        
        {completedItems > 0 && (
          <button
            onClick={onClearCompleted}
            className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
          >
            Limpar concluídos
          </button>
        )}
      </div>
      
      <div className="flex gap-2">
        {filters.map((filterOption) => {
          const Icon = filterOption.icon;
          return (
            <button
              key={filterOption.id}
              onClick={() => onFilterChange(filterOption.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === filterOption.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {filterOption.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};