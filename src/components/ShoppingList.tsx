import React from 'react';
import { ShoppingItemComponent } from './ShoppingItem';
import type { ShoppingItem } from '../types';

interface ShoppingListProps {
  items: ShoppingItem[];
  categories: Array<{ id: string; name: string; color: string }>;
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({
  items,
  categories,
  onToggleItem,
  onDeleteItem,
  onUpdateQuantity,
}) => {
  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category?.color || 'bg-gray-500';
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sua lista está vazia</h3>
        <p className="text-gray-500">Adicione itens para começar sua lista de compras!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ShoppingItemComponent
          key={item.id}
          item={item}
          onToggle={onToggleItem}
          onDelete={onDeleteItem}
          onUpdateQuantity={onUpdateQuantity}
          categoryColor={getCategoryColor(item.category)}
        />
      ))}
    </div>
  );
};