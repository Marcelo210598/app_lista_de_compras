import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, ShoppingBag, Calendar, CheckCircle } from 'lucide-react';
import type { ShoppingItem, Category } from '../types';

interface AnalyticsDashboardProps {
  items: ShoppingItem[];
  categories: Category[];
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7', '#6b7280'];

export function AnalyticsDashboard({ items, categories }: AnalyticsDashboardProps) {
  const analytics = useMemo(() => {
    const totalItems = items.length;
    const completedItems = items.filter(item => item.completed).length;
    const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    // Analytics por categoria
    const categoryStats = categories.map(category => {
      const categoryItems = items.filter(item => item.category === category.name);
      const completedInCategory = categoryItems.filter(item => item.completed).length;
      return {
        name: category.name,
        total: categoryItems.length,
        completed: completedInCategory,
        pending: categoryItems.length - completedInCategory,
        rate: categoryItems.length > 0 ? Math.round((completedInCategory / categoryItems.length) * 100) : 0
      };
    }).filter(cat => cat.total > 0);

    // Analytics temporal (últimos 7 dias)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString('pt-BR', { weekday: 'short' });
    }).reverse();

    const temporalStats = last7Days.map((day, index) => {
      const dayItems = items.filter(item => {
        const itemDate = new Date(item.createdAt);
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - (6 - index));
        return itemDate.toDateString() === targetDate.toDateString();
      });
      
      return {
        day,
        items: dayItems.length,
        completed: dayItems.filter(item => item.completed).length
      };
    });

    // Itens mais frequentes
    const itemFrequency = items.reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topItems = Object.entries(itemFrequency)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalItems,
      completedItems,
      completionRate,
      categoryStats,
      temporalStats,
      topItems
    };
  }, [items, categories]);

  const pieData = analytics.categoryStats.map(cat => ({
    name: cat.name,
    value: cat.total,
    completed: cat.completed
  }));

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Itens</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalItems}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Concluídos</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{analytics.completedItems}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Taxa de Conclusão</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analytics.completionRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Categorias Ativas</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{analytics.categoryStats.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Por Categoria */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Itens por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.categoryStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#f3f4f6'
                }} 
              />
              <Bar dataKey="total" fill="#8b5cf6" name="Total" />
              <Bar dataKey="completed" fill="#10b981" name="Concluídos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Pizza - Distribuição */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Distribuição por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#f3f4f6'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Linha - Atividade Temporal */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Atividade dos Últimos 7 Dias</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.temporalStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#f3f4f6'
                }} 
              />
              <Line type="monotone" dataKey="items" stroke="#8b5cf6" strokeWidth={3} name="Itens Criados" />
              <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} name="Itens Concluídos" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Itens Mais Frequentes */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Itens Mais Frequentes</h3>
          <div className="space-y-3">
            {analytics.topItems.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">#{index + 1}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{item.count}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">vezes</span>
                </div>
              </div>
            ))}
            {analytics.topItems.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Adicione mais itens para ver estatísticas detalhadas
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}