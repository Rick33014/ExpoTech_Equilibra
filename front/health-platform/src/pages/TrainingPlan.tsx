import React from 'react';
import { ChevronLeft, CheckCircle, Clock, Heart, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TrainingPlan() {
  const navigate = useNavigate();
  
  const trainingRoutines = [
    { 
      name: 'Cardio Leve + Foco', 
      type: 'Aeróbico', 
      duration: '45 min', 
      focus: 'Estresse e Foco',
      details: [
        '10 min de caminhada rápida (aquecimento)',
        '20 min de corrida leve (60% da FC máx)',
        '10 min de Yoga/Alongamento (desaceleração)',
        '5 min de respiração profunda (Mindfulness)'
      ],
      intensity: 'low',
    },
    { 
      name: 'Treino de Força Equilibrado', 
      type: 'Musculação', 
      duration: '60 min', 
      focus: 'Força e Postura',
      details: [
        '3 séries de Agachamento (12 rep.)',
        '3 séries de Flexão (máximo rep.)',
        '3 séries de Remada Curvada (15 rep.)',
        '15 min de mobilidade e alongamento'
      ],
      intensity: 'medium',
    },
    { 
      name: 'Circuito Relax', 
      type: 'Funcional', 
      duration: '30 min', 
      focus: 'Mobilidade e Flexibilidade',
      details: [
        'Ciclo de 3 exercícios (30s cada, sem descanso): Burpee adaptado, Mountain Climber lento, Prancha (1 min)',
        'Repetir o ciclo 4 vezes',
        '10 min de meditação guiada'
      ],
      intensity: 'low',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-20">
      
      <button 
        onClick={() => navigate('/insights')} 
        className="flex items-center gap-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors mb-8"
      >
        <ChevronLeft size={20} /> Voltar aos Insights
      </button>

      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 mb-8">
        <Heart size={40} className="text-green-500" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Plano de Treino Sugerido</h1>
          <p className="text-gray-600 dark:text-gray-400">Rotinas otimizadas para reduzir o estresse, conforme sua análise de humor.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainingRoutines.map((routine, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all hover:shadow-2xl 
                                      flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{routine.name}</h3>
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${routine.intensity === 'low' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                {routine.intensity === 'low' ? 'Baixa Int.' : 'Média Int.'}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <p className="flex items-center gap-2"><Clock size={16} className="text-blue-500" /> Duração: {routine.duration}</p>
              <p className="flex items-center gap-2"><Zap size={16} className="text-orange-500" /> Tipo: {routine.type}</p>
              <p className="flex items-center gap-2 text-purple-600 dark:text-purple-400"><Heart size={16} /> Foco: {routine.focus}</p>
            </div>

            <h4 className="font-bold text-gray-700 dark:text-gray-200 mt-4 mb-2 border-t border-gray-100 dark:border-gray-700 pt-3">Passos:</h4>
            <ul className="space-y-1 text-sm flex-grow">
              {routine.details.map((detail, dIndex) => (
                <li key={dIndex} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>

            <button className="w-full mt-6 py-3 bg-green-600 text-white font-bold rounded-xl 
                                hover:bg-green-500 transition-all duration-300 
                                transform hover:scale-[1.03] shadow-lg 
                                hover:shadow-xl hover:shadow-green-500/80 
                                self-end"> 
              Adicionar ao Diário
            </button>
          </div>
        ))}
      </div>
      
    </div>
  );
}