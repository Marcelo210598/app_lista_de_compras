import { useState, useMemo } from 'react';
import { ShoppingCart, Search, Moon, Sun, List, Settings, Star } from 'lucide-react';
import { AddItemForm } from './components/AddItemForm';
import { FilterBar } from './components/FilterBar';
import { useShoppingStore } from './store/shoppingStore';
import { useHapticFeedback } from './hooks/useMobileFeatures';
import MobileShoppingItem from './components/MobileShoppingItem';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('list');
  
  const { items, toggleItem, deleteItem, updateItem, clearCompleted, addItem } = useShoppingStore();
  const { triggerHaptic } = useHapticFeedback();

  // Categorias com itens essenciais pré-definidos
  const essentialItems = {
    'Frutas': ['🍎 Maçã', '🍌 Banana', '🍊 Laranja', '🍇 Uva', '🍓 Morango'],
    'Verduras/Legumes': ['🥬 Alface', '🍅 Tomate', '🥕 Cenoura', '🧄 Alho', '🧅 Cebola'],
    'Laticínios': ['🥛 Leite', '🧀 Queijo', '🧈 Manteiga', '🥚 Ovos', '🍦 Iogurte'],
    'Padaria': ['🍞 Pão', '🥖 Baguete', '🥐 Croissant', '🍪 Biscoitos', '🧁 Muffin'],
    'Carnes': ['🥩 Carne Bovina', '🍗 Frango', '🐟 Peixe', '🥓 Bacon', '🌭 Salsicha'],
    'Bebidas': ['🥤 Refrigerante', '☕ Café', '🫖 Chá', '🧃 Suco', '💧 Água'],
    'Limpeza': ['🧼 Sabão', '🧽 Esponja', '🧴 Detergente', '🧹 Vassoura', '🧻 Papel Higiênico'],
    'Higiene': ['🪥 Pasta de Dente', '🧴 Shampoo', '🧼 Sabonete', '🪒 Gillette', '🧽 Loção']
  };

  const filteredItems = useMemo(() => {
    let filtered = items;
    
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filter === 'pending') {
      filtered = filtered.filter((item) => !item.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter((item) => item.completed);
    }
    
    return filtered;
  }, [items, searchTerm, filter]);

  const completedItems = items.filter((item) => item.completed).length;
  const totalItems = items.length;

  const handleAddEssentialItem = (category: string, itemName: string) => {
    triggerHaptic('medium');
    addItem({
      name: itemName,
      category,
      quantity: 1,
      completed: false
    });
  };

  const handleTabChange = (tab: string) => {
    triggerHaptic('light');
    setActiveTab(tab);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white' : 'bg-gradient-to-br from-blue-50 to-blue-100 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-4 max-w-md min-h-screen flex flex-col">
        
        {/* Header Premium */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-xl shadow-lg">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent dark:text-white">
                Lista de Compras
              </h1>
            </div>
            <button
              onClick={() => {
                triggerHaptic('light');
                setDarkMode(!darkMode);
              }}
              className="p-3 rounded-xl bg-white/80 dark:bg-blue-800/80 backdrop-blur-sm shadow-lg hover:scale-105 transition-all duration-200"
            >
              {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-blue-600" />}
            </button>
          </div>
        </div>

        {/* Search Bar Premium */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-6 h-6" />
            <input
              type="text"
              placeholder="🔍 Buscar itens na lista..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-blue-200 dark:border-blue-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500 focus:border-transparent bg-white/90 dark:bg-blue-800/90 backdrop-blur-sm text-lg shadow-lg"
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

        {/* Conteúdo Principal */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'list' && (
            <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
              <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
                <span>📋 Minha Lista</span>
                <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
                  {filteredItems.length}
                </span>
              </h2>
              
              {filteredItems.length === 0 ? (
                <div className="text-center py-8 text-blue-500 dark:text-blue-300">
                  <div className="text-6xl mb-2">🛒</div>
                  <p className="text-lg font-medium">Sua lista está vazia!</p>
                  <p className="text-sm">Adicione itens ou escolha dos essenciais abaixo</p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <MobileShoppingItem
                    key={item.id}
                    item={item}
                    onToggle={() => {
                      triggerHaptic('medium');
                      toggleItem(item.id);
                    }}
                    onDelete={() => {
                      triggerHaptic('medium');
                      deleteItem(item.id);
                    }}
                    onUpdateQuantity={(quantity) => updateItem(item.id, { quantity: Number(quantity) })}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'essentials' && (
            <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
              <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-3">
                🌟 Itens Essenciais
              </h2>
              
              {Object.entries(essentialItems).map(([category, items]) => (
                <div key={category} className="bg-white/80 dark:bg-blue-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <h3 className="font-bold text-blue-600 dark:text-blue-300 mb-3 text-lg">{category}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {items.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleAddEssentialItem(category, item)}
                        className="p-3 bg-blue-50 dark:bg-blue-700/50 hover:bg-blue-100 dark:hover:bg-blue-600/50 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-4 bg-white/90 dark:bg-blue-800/90 backdrop-blur-sm rounded-2xl p-2 shadow-2xl">
          <div className="flex justify-around">
            <button
              onClick={() => handleTabChange('list')}
              className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
                activeTab === 'list' 
                  ? 'bg-blue-500 text-white scale-105 shadow-lg' 
                  : 'text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-700'
              }`}
            >
              <List className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Lista</span>
            </button>
            
            <button
              onClick={() => handleTabChange('essentials')}
              className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
                activeTab === 'essentials' 
                  ? 'bg-blue-500 text-white scale-105 shadow-lg' 
                  : 'text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-700'
              }`}
            >
              <Star className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Essenciais</span>
            </button>
            
            <button
              onClick={() => {
                triggerHaptic('light');
                // Aqui poderia ir para uma tela de configurações futura
              }}
              className="flex flex-col items-center p-3 rounded-xl text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-700 transition-all duration-200"
            >
              <Settings className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Ajustes</span>
            </button>
          </div>
        </div>

        {/* Progress Footer */}
        <div className="text-center mt-4 mb-2">
          <div className={`rounded-2xl p-4 ${
            completedItems === totalItems && totalItems > 0
              ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg'
              : 'bg-white/80 dark:bg-blue-800/80 backdrop-blur-sm text-blue-600 dark:text-blue-300'
          }`}>
            {completedItems === totalItems && totalItems > 0 ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">🎉</span>
                <span className="font-bold text-lg">Lista Concluída!</span>
              </div>
            ) : totalItems > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Progresso</span>
                  <span className="font-bold">{Math.round((completedItems / totalItems) * 100)}%</span>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(completedItems / totalItems) * 100}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl">📝</span>
                <span>Comece sua lista de compras!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;