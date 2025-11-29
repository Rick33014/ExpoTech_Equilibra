import React, { useState } from 'react';
import { 
  Flame, Activity, Moon, Droplets, Plus, Minus, 
  GlassWater 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';

// --- COMPONENTE DE LEGENDA ---
const CustomLegend = (props: any) => {
  const { payload } = props;
  if (!payload || payload.length === 0) return null;

  return (
    <div className="flex gap-4 justify-end mb-4">
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center gap-2 text-sm">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600 dark:text-gray-300 font-medium">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  // --- ESTADOS ---
  const [water, setWater] = useState(1250); 
  const [calories, setCalories] = useState(1250); 

  // --- FUNÇÕES DE AÇÃO ---
  const handleAddWater = () => {
    setWater(prev => prev + 250);
  };

  const handleRemoveWater = () => {
    setWater(prev => Math.max(0, prev - 250));
  };

  // --- DADOS MOCKADOS ---
  const dataBar = [
    { name: 'Seg', gasto: 2100, ingestao: 400 },
    { name: 'Ter', gasto: 1800, ingestao: 300 },
    { name: 'Qua', gasto: 2400, ingestao: 500 },
    { name: 'Qui', gasto: 1900, ingestao: 450 },
    { name: 'Sex', gasto: 2300, ingestao: 200 },
    { name: 'Sab', gasto: 2800, ingestao: 100 },
    { name: 'Dom', gasto: 2000, ingestao: calories }, 
  ];

  const dataLine = [
    { name: 'Seg', humor: 6 },
    { name: 'Ter', humor: 7 },
    { name: 'Qua', humor: 5 },
    { name: 'Qui', humor: 8 },
    { name: 'Sex', humor: 9 },
    { name: 'Sab', humor: 9 },
    { name: 'Dom', humor: 8 },
  ];

  const dataMacros = [
    { name: 'Carboidratos', value: 45, color: '#10B981' }, 
    { name: 'Proteínas', value: 30, color: '#8B5CF6' },    
    { name: 'Gorduras', value: 25, color: '#F59E0B' },     
  ];

  return (
    <div className="space-y-6 w-full animate-fadeIn pb-10">
      
      {/* Cabeçalho Simples */}
      <div className="flex items-center mb-2">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
          Visão Geral
        </h2>
      </div>

      {/* --- CARDS SUPERIORES --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="p-4 bg-orange-100 dark:bg-orange-900/40 rounded-full text-orange-600 dark:text-orange-400">
            <Flame size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Calorias Hoje</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {calories.toLocaleString('pt-BR')} <span className="text-sm text-gray-400 font-normal">/ 2.000</span>
            </h3>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/40 rounded-full text-blue-600 dark:text-blue-400">
            <Activity size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Exercício (min)</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              45 <span className="text-sm text-gray-400 font-normal">min</span>
            </h3>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="p-4 bg-indigo-100 dark:bg-indigo-900/40 rounded-full text-indigo-600 dark:text-indigo-400">
            <Moon size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Horas de Sono</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">6h 30m</h3>
          </div>
        </div>
      </div>

      {/* --- GRÁFICOS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 h-[420px] flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Balanço Calórico</h3>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataBar} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Legend content={CustomLegend} verticalAlign="top" />
              <Bar dataKey="gasto" name="Gasto" fill="#F97316" radius={[4, 4, 0, 0]} barSize={12} />
              <Bar dataKey="ingestao" name="Ingestão" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 2 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 h-[420px] flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Variação de Humor</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataLine} margin={{ top: 10, right: 20, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
              <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Line type="monotone" dataKey="humor" stroke="#8B5CF6" strokeWidth={4} dot={{ r: 4, fill: '#8B5CF6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- HIDRATAÇÃO E MACROS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card de Hidratação */}
          <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex flex-col justify-between">
             <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Droplets className="text-blue-500" size={20}/> Hidratação
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Meta diária: 2.500ml</p>
                </div>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{water}ml</span>
             </div>
             
             {/* Visualizador de Copos */}
             <div className="flex justify-between mt-6 px-2">
                {[1,2,3,4,5].map((i) => (
                    <GlassWater 
                        key={i} 
                        size={28} 
                        className={i <= Math.ceil(water / 500) ? "text-blue-500 fill-blue-500 transition-all duration-500" : "text-gray-300 dark:text-gray-600 transition-all duration-500"} 
                    />
                ))}
             </div>

             {/* Botões de Controle */}
             <div className="mt-6 flex gap-3">
                <button 
                    onClick={handleRemoveWater}
                    className="flex-1 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm active:scale-95 flex items-center justify-center gap-1"
                >
                    <Minus size={16} /> 250ml
                </button>
                <button 
                    onClick={handleAddWater}
                    className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 transition shadow-sm active:scale-95 flex items-center justify-center gap-1"
                >
                    <Plus size={16} /> 250ml
                </button>
             </div>
          </div>

          {/* Card de Macros */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 lg:col-span-2 flex flex-col sm:flex-row items-center gap-8">
             <div className="h-48 w-48 shrink-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={dataMacros} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {dataMacros.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xs text-gray-400">Total</span>
                    <span className="text-xl font-bold text-gray-800 dark:text-white">100%</span>
                </div>
             </div>

             <div className="flex-1 w-full space-y-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Distribuição de Macros</h3>
                {dataMacros.map((macro, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} />
                            <span className="text-gray-600 dark:text-gray-300 font-medium">{macro.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${macro.value}%`, backgroundColor: macro.color }} />
                            </div>
                            <span className="text-sm font-bold text-gray-900 dark:text-white w-8 text-right">{macro.value}%</span>
                        </div>
                    </div>
                ))}
             </div>
          </div>

      </div>

    </div>
  );
}