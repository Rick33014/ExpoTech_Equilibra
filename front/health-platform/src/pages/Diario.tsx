import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Utensils, Activity, Smile, Calendar, Clock, Dumbbell } from 'lucide-react';


interface Meal {
  id: number;
  name: string;
  calories: number;
}

interface Exercise {
  id: number;
  name: string;
  duration: number;
}

interface DailyRecord {
  id: number;
  date: string;
  time: string;
  meals: Meal[];
  exercises: Exercise[];
  mood: number;
}

export default function Diario() {
  
  const [meals, setMeals] = useState<Meal[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [mood, setMood] = useState(5);
  const [tempMeal, setTempMeal] = useState({ name: '', calories: '' });
  const [tempExercise, setTempExercise] = useState({ name: '', duration: '' });
  const [history, setHistory] = useState<DailyRecord[]>(() => {
    const savedHistory = localStorage.getItem('diario_history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  
  
  useEffect(() => {
    const pendingExercise = localStorage.getItem('pending_exercise');
    if (pendingExercise) {
        const exerciseData = JSON.parse(pendingExercise);
        setExercises(prev => [...prev, { 
            id: Date.now(), 
            name: exerciseData.name, 
            duration: exerciseData.duration 
        }]);
        localStorage.removeItem('pending_exercise');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('diario_history', JSON.stringify(history));
  }, [history]);

  const addMeal = () => {
    if (!tempMeal.name || !tempMeal.calories) return;
    setMeals([...meals, { id: Date.now(), name: tempMeal.name, calories: Number(tempMeal.calories) }]);
    setTempMeal({ name: '', calories: '' });
  };

  const addExercise = () => {
    if (!tempExercise.name || !tempExercise.duration) return;
    setExercises([...exercises, { id: Date.now(), name: tempExercise.name, duration: Number(tempExercise.duration) }]);
    setTempExercise({ name: '', duration: '' });
  };

  const handleSave = () => {
    let currentMeals = [...meals];
    let currentExercises = [...exercises];


    if (tempMeal.name && tempMeal.calories) {
        const newMeal = { id: Date.now(), name: tempMeal.name, calories: Number(tempMeal.calories) };
        currentMeals.push(newMeal);
        setMeals(currentMeals);
        setTempMeal({ name: '', calories: '' });
    }

    if (tempExercise.name && tempExercise.duration) {
        const newExercise = { id: Date.now() + 1, name: tempExercise.name, duration: Number(tempExercise.duration) };
        currentExercises.push(newExercise);
        setExercises(currentExercises);
        setTempExercise({ name: '', duration: '' });
    }

    if (currentMeals.length === 0 && currentExercises.length === 0) {
      alert("Adicione pelo menos uma refeição ou exercício antes de salvar.");
      return;
    }

    const newRecord: DailyRecord = {
      id: Date.now(),
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      meals: currentMeals,
      exercises: currentExercises,
      mood: mood,
    };

    setHistory([newRecord, ...history]);
    
    setMeals([]);
    setExercises([]);
    setMood(5);
    
    alert("Diário salvo com sucesso!");
  };

  const clearHistory = () => {
    if (confirm('Tem certeza que deseja apagar todo o histórico?')) {
      setHistory([]);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 pb-20 animate-fadeIn">
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Diário</h1>
        <p className="text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4 text-orange-600 dark:text-orange-400">
          <Utensils />
          <h2 className="text-xl font-bold">Diário Alimentar</h2>
        </div>
        
        <div className="flex gap-3 mb-4">
          <input 
            type="text" 
            placeholder="Ex: Omelete com Queijo" 
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-2 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500/50 transition-all"
            value={tempMeal.name} 
            onChange={e => setTempMeal({...tempMeal, name: e.target.value})}
            onKeyDown={(e) => e.key === 'Enter' && addMeal()}
          />
          <input 
            type="number" 
            placeholder="Kcal" 
            className="w-24 border border-gray-300 dark:border-gray-600 rounded-lg p-2 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500/50 transition-all"
            value={tempMeal.calories} 
            onChange={e => setTempMeal({...tempMeal, calories: e.target.value})}
            onKeyDown={(e) => e.key === 'Enter' && addMeal()}
          />
          <button onClick={addMeal} className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition active:scale-95">
            <Plus size={24} />
          </button>
        </div>

        <div className="space-y-2">
          {meals.map(meal => (
            <div key={meal.id} className="flex justify-between items-center bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-100 dark:border-orange-800/30 animate-fadeIn">
              <span className="font-medium text-gray-700 dark:text-gray-200">{meal.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">{meal.calories} kcal</span>
                <button onClick={() => setMeals(meals.filter(m => m.id !== meal.id))} className="text-red-400 hover:text-red-600 transition">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {meals.length === 0 && <p className="text-gray-400 text-sm italic text-center py-2">Nenhuma refeição registrada agora.</p>}
        </div>
      </div>

      {/* --- SEÇÃO 2: DIÁRIO DE TREINO --- */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
          <Dumbbell />
          <h2 className="text-xl font-bold">Diário de Treino</h2>
        </div>
        
        <div className="flex gap-3 mb-4">
          <input 
            type="text" 
            placeholder="Ex: Corrida na Esteira" 
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-2 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={tempExercise.name} 
            onChange={e => setTempExercise({...tempExercise, name: e.target.value})}
            onKeyDown={(e) => e.key === 'Enter' && addExercise()}
          />
          <input 
            type="number" 
            placeholder="Min" 
            className="w-24 border border-gray-300 dark:border-gray-600 rounded-lg p-2 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={tempExercise.duration} 
            onChange={e => setTempExercise({...tempExercise, duration: e.target.value})}
            onKeyDown={(e) => e.key === 'Enter' && addExercise()}
          />
          <button onClick={addExercise} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition active:scale-95">
            <Plus size={24} />
          </button>
        </div>

        <div className="space-y-2">
          {exercises.map(ex => (
            <div key={ex.id} className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30 animate-fadeIn">
              <span className="font-medium text-gray-700 dark:text-gray-200">{ex.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">{ex.duration} min</span>
                <button onClick={() => setExercises(exercises.filter(e => e.id !== ex.id))} className="text-red-400 hover:text-red-600 transition">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {exercises.length === 0 && <p className="text-gray-400 text-sm italic text-center py-2">Nenhum treino registrado agora.</p>}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4 text-purple-600 dark:text-purple-400">
          <Smile />
          <h2 className="text-xl font-bold">Como você está se sentindo?</h2>
        </div>
        
        <div className="space-y-6">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-2 font-medium">
              <span>😡 Péssimo</span>
              <span>😐 Normal</span>
              <span>🤩 Excelente</span>
            </div>
            
            <div className="relative w-full flex items-center">
              <input 
                type="range" 
                min="1" 
                max="10" 
                step="1"
                value={mood} 
                onChange={(e) => setMood(Number(e.target.value))} 
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="text-center">
              <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">{mood}</span>
              <span className="text-gray-400 text-lg font-medium"> / 10</span>
            </div>
        </div>
      </div>

      <button 
        onClick={handleSave} 
        className="w-full py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-lg transform active:scale-[0.99]"
      >
        <Save /> Salvar Registro do Dia
      </button>

      {history.length > 0 && (
        <div className="pt-8 border-t dark:border-gray-700 animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Calendar className="text-gray-500"/> Histórico Recente
            </h2>
            <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-600 transition-colors font-medium hover:underline">
              Limpar Histórico
            </button>
          </div>
          
          <div className="space-y-4">
            {history.map((record) => (
              <div key={record.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition hover:shadow-md">
                <div className="flex justify-between items-start mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white text-lg">{record.date}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12}/> Registrado às {record.time}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold 
                    ${record.mood >= 7 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : record.mood >= 4 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                    Humor: {record.mood}/10
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                      <Utensils size={12}/> Diário Alimentar
                    </p>
                    {record.meals.length > 0 ? (
                      <ul className="space-y-1">
                        {record.meals.map((m, i) => (
                          <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex justify-between border-b border-gray-100 dark:border-gray-700 last:border-0 pb-1 last:pb-0">
                            <span>{m.name}</span>
                            <span className="text-gray-400 text-xs">{m.calories}kcal</span>
                          </li>
                        ))}
                      </ul>
                    ) : <p className="text-xs text-gray-400 italic">Vazio</p>}
                  </div>


                  <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                      <Dumbbell size={12}/> Diário de Treino
                    </p>
                    {record.exercises.length > 0 ? (
                      <ul className="space-y-1">
                        {record.exercises.map((e, i) => (
                          <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex justify-between border-b border-gray-100 dark:border-gray-700 last:border-0 pb-1 last:pb-0">
                            <span>{e.name}</span>
                            <span className="text-gray-400 text-xs">{e.duration}min</span>
                          </li>
                        ))}
                      </ul>
                    ) : <p className="text-xs text-gray-400 italic">Vazio</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}