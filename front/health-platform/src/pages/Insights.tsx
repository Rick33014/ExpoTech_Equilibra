import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, ArrowRight, Info, Brain, X, CheckCircle, Zap, Clock } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function Insights() {
  const navigate = useNavigate();
  
  
  const [activeModal, setActiveModal] = useState<'iron' | 'sleep' | 'training' | null>(null);

  
  const handleAddToDiary = () => {
    
    const workoutData = {
        name: "Cardio Leve + Foco",
        duration: 45
    };
    
    
    localStorage.setItem('pending_exercise', JSON.stringify(workoutData));
    
    
    navigate('/diario');
  };

  const ironData = [
    { day: 'D-7', valor: 15 },
    { day: 'D-6', valor: 14 },
    { day: 'D-5', valor: 12 },
    { day: 'D-4', valor: 10 },
    { day: 'D-3', valor: 8 },
    { day: 'D-2', valor: 6 },
    { day: 'D-1', valor: 5 },
  ];

  const moodData = [
    { day: 'Sem 1', valor: 4 },
    { day: 'Sem 2', valor: 5 },
    { day: 'Sem 3', valor: 7 },
    { day: 'Sem 4', valor: 8 },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 pb-20 relative">
      
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
          <Brain size={32} className="text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Análise de Hábitos (IA)</h1>
          <p className="text-gray-500 dark:text-gray-400">O algoritmo analisou seus últimos 30 dias.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARD 1: RISCO (FERRO) */}
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex gap-4 items-start mb-6">
            <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-full shrink-0">
              <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-800 dark:text-red-300">Risco: Deficiência de Ferro</h3>
              <p className="text-red-700 dark:text-red-400/80 mt-1 text-sm leading-relaxed">
                Seu consumo de ferro caiu <strong>60%</strong> na última semana. O padrão alimentar atual indica risco moderado de anemia se mantido por mais 10 dias.
              </p>
            </div>
          </div>

          <div className="h-32 w-full bg-white dark:bg-gray-800/50 rounded-xl p-2 border border-red-100 dark:border-red-900/30 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ironData}>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} itemStyle={{ color: '#ef4444' }} />
                <Line type="monotone" dataKey="valor" stroke="#ef4444" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <button 
            onClick={() => setActiveModal('iron')} 
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            Ver Alimentos Ricos em Ferro <ArrowRight size={18} />
          </button>
        </div>

        {/* CARD 2: PREVISÃO POSITIVA (TREINO) */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex gap-4 items-start mb-6">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full shrink-0">
              <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Projeção de Bem-estar</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm leading-relaxed">
                A correlação entre seus treinos aeróbicos e o humor está alta. Se mantiver a rotina, prevemos uma redução de <strong>20%</strong> no estresse basal até sexta-feira.
              </p>
            </div>
          </div>

          <div className="h-32 w-full bg-gray-50 dark:bg-gray-900/50 rounded-xl p-2 border border-gray-100 dark:border-gray-700 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} itemStyle={{ color: '#10b981' }} />
                <Line type="monotone" dataKey="valor" stroke="#10b981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <button 
            onClick={() => setActiveModal('training')} 
            className="w-full py-3 border border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            Manter Rotina de Treinos
          </button>
        </div>
      </div>

      {/* CARD 3: SONO */}
      <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 p-6 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full">
            <Info className="text-indigo-600 dark:text-indigo-400" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-indigo-900 dark:text-indigo-200">Padrão de Sono Identificado</h3>
            <p className="text-indigo-700 dark:text-indigo-300/80 text-sm">
              Você tende a dormir 40 minutos a mais nos dias em que não consome cafeína após as 16h.
            </p>
          </div>
        </div>
        <button 
            onClick={() => setActiveModal('sleep')}
            className="hidden md:block text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline"
        >
          Ver análise do sono
        </button>
      </div>

      {/* --- MODAL DE ALIMENTOS (FERRO) --- */}
      {activeModal === 'iron' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X size={24} />
                </button>
                
                <div className="text-center mb-6">
                    <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
                        <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Fontes de Ferro</h3>
                    <p className="text-gray-500 text-sm">Adicione estes itens à sua dieta hoje:</p>
                </div>

                <ul className="space-y-3">
                    <li className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <CheckCircle size={20} className="text-green-500" />
                        <div>
                            <p className="font-bold text-gray-800 dark:text-white">Carne Vermelha Magra</p>
                            <p className="text-xs text-gray-500">Fonte de ferro heme (melhor absorção).</p>
                        </div>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <CheckCircle size={20} className="text-green-500" />
                        <div>
                            <p className="font-bold text-gray-800 dark:text-white">Feijão e Lentilha</p>
                            <p className="text-xs text-gray-500">Combine com Vitamina C (ex: laranja).</p>
                        </div>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <CheckCircle size={20} className="text-green-500" />
                        <div>
                            <p className="font-bold text-gray-800 dark:text-white">Espinafre Escuro</p>
                            <p className="text-xs text-gray-500">Ótimo em saladas ou refogados.</p>
                        </div>
                    </li>
                </ul>

                <button onClick={() => setActiveModal(null)} className="mt-6 w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition">
                    Entendi, vou adicionar!
                </button>
            </div>
        </div>
      )}

      {/* --- MODAL DE TREINO (ATUALIZADO COM AÇÃO) --- */}
      {activeModal === 'training' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X size={24} />
                </button>
                
                <div className="text-center mb-6">
                    <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400">
                        <TrendingUp size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Plano Anti-Estresse</h3>
                    <p className="text-gray-500 text-sm">Sugerido para melhorar seu humor hoje:</p>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/30">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-green-800 dark:text-green-300">Cardio Leve + Foco</h4>
                            <span className="text-xs font-bold bg-white dark:bg-gray-700 px-2 py-1 rounded-full text-green-600">45 min</span>
                        </div>
                        <div className="space-y-2 text-sm text-green-700 dark:text-green-400">
                            <p className="flex items-center gap-2"><CheckCircle size={14}/> 10 min Caminhada Rápida</p>
                            <p className="flex items-center gap-2"><CheckCircle size={14}/> 20 min Corrida Leve</p>
                            <p className="flex items-center gap-2"><CheckCircle size={14}/> 15 min Yoga/Alongamento</p>
                        </div>
                    </div>
                    
                    <p className="text-xs text-center text-gray-400 italic">
                        "A atividade aeróbica libera endorfinas que combatem diretamente o cortisol."
                    </p>
                </div>

                <div className="mt-6 flex gap-3">
                    <button onClick={() => setActiveModal(null)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                        Talvez depois
                    </button>
                    <button 
                        onClick={handleAddToDiary} 
                        className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition"
                    >
                        Adicionar ao Diário
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- MODAL DE SONO --- */}
      {activeModal === 'sleep' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X size={24} />
                </button>
                
                <div className="text-center mb-6">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400">
                        <Brain size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Higiene do Sono</h3>
                    <p className="text-gray-500 text-sm">Dicas personalizadas para você:</p>
                </div>

                <div className="space-y-4">
                    <div className="p-4 border border-indigo-100 dark:border-indigo-900/50 rounded-xl">
                        <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-1">🚫 Cafeína após as 16h</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Seu corpo leva até 6 horas para eliminar metade da cafeína ingerida.</p>
                    </div>
                    <div className="p-4 border border-indigo-100 dark:border-indigo-900/50 rounded-xl">
                        <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-1">📱 Filtro de Luz Azul</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Ative o modo noturno no celular 1h antes de deitar.</p>
                    </div>
                </div>

                <button onClick={() => setActiveModal(null)} className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">
                    Fechar Análise
                </button>
            </div>
        </div>
      )}

    </div>
  );
}