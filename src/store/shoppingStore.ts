import { create } from 'zustand';
import type { ShoppingItem, Category } from '../types';

interface ShoppingStore {
  items: ShoppingItem[];
  categories: Category[];
  filter: string;
  searchTerm: string;
  
  addItem: (item: Omit<ShoppingItem, 'id' | 'createdAt'>) => void;
  toggleItem: (id: string) => void;
  deleteItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<ShoppingItem>) => void;
  clearCompleted: () => void;
  setFilter: (filter: string) => void;
  setSearchTerm: (term: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Frutas', color: 'bg-green-500' },
  { id: '2', name: 'Vegetais', color: 'bg-emerald-500' },
  { id: '3', name: 'Laticínios', color: 'bg-blue-500' },
  { id: '4', name: 'Carnes', color: 'bg-red-500' },
  { id: '5', name: 'Padaria', color: 'bg-yellow-500' },
  { id: '6', name: 'Bebidas', color: 'bg-cyan-500' },
  { id: '7', name: 'Limpeza', color: 'bg-purple-500' },
  { id: '8', name: 'Outros', color: 'bg-gray-500' },
];

export const useShoppingStore = create<ShoppingStore>((set) => ({
  items: [],
  categories: defaultCategories,
  filter: 'all',
  searchTerm: '',
  
  addItem: (item) => set((state) => ({
    items: [...state.items, {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
    }],
  })),
  
  toggleItem: (id) => set((state) => ({
    items: state.items.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ),
  })),
  
  deleteItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
  })),
  
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    ),
  })),
  
  clearCompleted: () => set((state) => ({
    items: state.items.filter((item) => !item.completed),
  })),
  
  setFilter: (filter) => set({ filter }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  
  addCategory: (category) => set((state) => ({
    categories: [...state.categories, { ...category, id: Date.now().toString() }],
  })),
}));