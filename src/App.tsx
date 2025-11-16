import { useState, useMemo } from 'react';
import { ShoppingCart, Search, Moon, Sun, Save, BarChart3, List } from 'lucide-react';
import { AddItemForm } from './components/AddItemForm';
import { ShoppingList } from './components/ShoppingList';
import { FilterBar } from './components/FilterBar';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { useShoppingStore } from './store/shoppingStore';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'list' | 'analytics'>('list');
  
  const { items, categories, toggleItem, deleteItem, updateItem, clearCompleted } = useShoppingStore();

  const filteredItems = useMemo(() => {
    let filtered = items;
    
    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por status
    if (filter === 'pending') {
      filtered = filtered.filter((item) => !item.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter((item) => item.completed);
    }
    
    return filtered;
  }, [items, searchTerm, filter]);

  const completedItems = items.filter((item) => item.completed).length;
  const totalItems = items.length;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingCart className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Lista de Compras
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Navegação por Abas */}
          <div className="flex justify-center mb-4">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-1 flex gap-1">
              <button
                onClick={() => setActiveTab('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === 'list'
                    ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
                Lista
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === 'analytics'
                    ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Organize suas compras de forma simples e eficiente
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-green-600 dark:text-green-400">
            <Save className="w-4 h-4" />
            <span>Dados salvos automaticamente</span>
          </div>
        </div>

        {/* Conteúdo condicional baseado na aba ativa */}
        {activeTab === 'list' ? (
          <>
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar itens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Filter Bar */}
            <FilterBar
              filter={filter}
              onFilterChange={setFilter}
              totalItems={totalItems}
              completedItems={completedItems}
              onClearCompleted={clearCompleted}
            />

            {/* Add Item Form */}
            <AddItemForm />

            {/* Shopping List */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>Itens da Lista</span>
                <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm px-2 py-1 rounded-full">
                  {filteredItems.length}
                </span>
              </h2>
              
              <ShoppingList
                items={filteredItems}
                categories={categories}
                onToggleItem={toggleItem}
                onDeleteItem={deleteItem}
                onUpdateQuantity={(id, quantity) => updateItem(id, { quantity })}
              />
            </div>
          </>
        ) : (
          /* Analytics Dashboard */
          <div className="mt-6">
            <AnalyticsDashboard items={items} categories={categories} />
          </div>
        )}

        {/* Footer - mostrar apenas na aba de lista */}
        {activeTab === 'list' && (
          <div className="text-center mt-8 text-gray-500 dark:text-gray-400">
            <p className="text-sm">
              {completedItems === totalItems && totalItems > 0
                ? '🎉 Lista concluída!'
                : totalItems > 0
                ? `${Math.round((completedItems / totalItems) * 100)}% completo`
                : 'Adicione itens para começar'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;