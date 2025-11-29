import React, { useState } from 'react';
import { Droplet, Sun, Bone, Zap, ChevronRight, Info, CheckCircle, XCircle } from 'lucide-react';

export default function Nutrients() {
  const [selectedNutrient, setSelectedNutrient] = useState('ferro');

  // Banco de Dados de Nutrientes
  const nutrientsData = {
    ferro: {
      title: 'Ferro (Fe)',
      icon: <Droplet className="text-red-500" size={32} />,
      description: 'Essencial para a produção de hemoglobina e transporte de oxigênio pelo corpo. Sua falta causa anemia, cansaço e palidez.',
      color: 'red',
      foods: [
        { name: 'Fígado Bovino', amount: '5.8mg', icon: '🥩' },
        { name: 'Feijão Preto', amount: '1.3mg', icon: '🫘' },
        { name: 'Espinafre', amount: '2.7mg', icon: '🥬' },
        { name: 'Lentilha', amount: '3.3mg', icon: '🥣' },
        { name: 'Semente de Abóbora', amount: '3.3mg', icon: '🎃' },
        { name: 'Tofu', amount: '5.4mg', icon: '🧊' },
      ],
      tips: [
        { type: 'good', text: 'Consuma junto com Vitamina C (Laranja, Limão) para triplicar a absorção.' },
        { type: 'bad', text: 'Evite café ou laticínios (Cálcio) logo após as refeições, pois atrapalham a absorção.' }
      ]
    },
    calcio: {
      title: 'Cálcio (Ca)',
      icon: <Bone className="text-slate-500" size={32} />,
      description: 'Fundamental para a saúde dos ossos e dentes, além de atuar na contração muscular e coagulação sanguínea.',
      color: 'slate',
      foods: [
        { name: 'Leite', amount: '125mg', icon: '🥛' },
        { name: 'Queijo Parmesão', amount: '1109mg', icon: '🧀' },
        { name: 'Iogurte Natural', amount: '121mg', icon: '🥣' },
        { name: 'Sardinha', amount: '382mg', icon: '🐟' },
        { name: 'Brócolis', amount: '47mg', icon: '🥦' },
        { name: 'Amêndoas', amount: '264mg', icon: '🥜' },
      ],
      tips: [
        { type: 'good', text: 'A Vitamina D (sol) é necessária para fixar o cálcio nos ossos.' },
        { type: 'bad', text: 'Excesso de sal pode aumentar a perda de cálcio pela urina.' }
      ]
    },
    vitaminaD: {
      title: 'Vitamina D',
      icon: <Sun className="text-yellow-500" size={32} />,
      description: 'Regula a absorção de cálcio e fósforo, vital para o sistema imune e funcionamento cerebral.',
      color: 'yellow',
      foods: [
        { name: 'Salmão', amount: '526 UI', icon: '🍣' },
        { name: 'Ovo (Gema)', amount: '37 UI', icon: '🥚' },
        { name: 'Cogumelos', amount: 'Variável', icon: '🍄' },
        { name: 'Atum em Lata', amount: '268 UI', icon: '🐟' },
      ],
      tips: [
        { type: 'good', text: 'A melhor fonte é o Sol! 15 minutos por dia sem protetor solar (antes das 10h).' },
        { type: 'bad', text: 'Pessoas com pele mais escura precisam de mais tempo de exposição solar.' }
      ]
    },
    energia: {
      title: 'Energia (Carbo)',
      icon: <Zap className="text-orange-500" size={32} />,
      description: 'O combustível principal do cérebro e dos músculos. Prefira os complexos para energia duradoura.',
      color: 'orange',
      foods: [
        { name: 'Batata Doce', amount: '20g', icon: '🍠' },
        { name: 'Aveia', amount: '66g', icon: '🌾' },
        { name: 'Banana', amount: '23g', icon: '🍌' },
        { name: 'Arroz Integral', amount: '23g', icon: '🍚' },
      ],
      tips: [
        { type: 'good', text: 'Consuma antes do treino para garantir performance máxima.' },
        { type: 'bad', text: 'Evite excesso de açúcar refinado, que gera picos de energia seguidos de cansaço.' }
      ]
    }
  };

  // @ts-ignore (Ignorar erro de tipagem rápida)
  const current = nutrientsData[selectedNutrient];

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 min-h-[80vh]">
      
      {/* MENU LATERAL DE NUTRIENTES */}
      <div className="w-full lg:w-1/4 space-y-3">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Guia Nutricional</h2>
        {Object.entries(nutrientsData).map(([key, data]) => (
          <button
            key={key}
            onClick={() => setSelectedNutrient(key)}
            // Classes dinâmicas para cor baseadas na seleção
            className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 border 
              ${selectedNutrient === key 
                ? `bg-gray-100 dark:bg-gray-800 border-gray-400 dark:border-gray-500 shadow-md` 
                : 'bg-white dark:bg-gray-900 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            // Estilo inline para garantir a cor da borda/fundo específica do nutriente selecionado
            style={selectedNutrient === key ? { borderColor: data.color, backgroundColor: `var(--${data.color}-50)` } : {}}
          >
            <div className="flex items-center gap-3">
              {data.icon}
              <span className={`font-bold ${selectedNutrient === key ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                {data.title}
              </span>
            </div>
            {selectedNutrient === key && <ChevronRight size={16} />}
          </button>
        ))}
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          
          {/* Cabeçalho do Nutriente */}
          <div className={`p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm`}>
                {current.icon}
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{current.title}</h1>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Lista de Alimentos */}
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <div className="w-2 h-8 bg-green-500 rounded-full"></div>
              Melhores Fontes (por 100g)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {current.foods.map((food: any, index: number) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-700/30">
                  <div className="text-3xl">{food.icon}</div>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white">{food.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{food.amount}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dicas de Ouro */}
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Info className="text-blue-500" /> Dicas de Absorção
            </h3>
            <div className="grid gap-4">
              {current.tips.map((tip: any, index: number) => (
                <div key={index} className={`p-4 rounded-xl flex gap-4 items-start ${tip.type === 'good' ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'}`}>
                  {tip.type === 'good' ? <CheckCircle className="shrink-0 mt-1" /> : <XCircle className="shrink-0 mt-1" />}
                  <p>{tip.text}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}