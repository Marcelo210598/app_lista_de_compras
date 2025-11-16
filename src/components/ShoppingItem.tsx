import React from 'react';
import { Trash2, Check, Minus, Plus } from 'lucide-react';
import type { ShoppingItem } from '../types';

interface ShoppingItemProps {
  item: ShoppingItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  categoryColor: string;
}

export const ShoppingItemComponent: React.FC<ShoppingItemProps> = ({
  item,
  onToggle,
  onDelete,
  onUpdateQuantity,
  categoryColor,
}) => {
  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, item.quantity + delta);
    onUpdateQuantity(item.id, newQuantity);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-200 ${
        item.completed ? 'opacity-60' : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(item.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            item.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-500'
          }`}
        >
          {item.completed && <Check className="w-4 h-4" />}
        </button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium text-white ${categoryColor}`}
            >
              {item.category}
            </span>
            <span
              className={`font-medium ${
                item.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {item.name}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};