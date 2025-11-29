import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X, Calculator, Activity, Trash2 } from 'lucide-react';
import api from '../services/api'; 

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function NutriBot() {
  const [input, setInput] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  

  const inputRef = useRef<HTMLInputElement>(null);
  

  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMsgs = localStorage.getItem('@EquiLibra:chatHistory');
    if (savedMsgs) {
      return JSON.parse(savedMsgs);
    }
    return [
      { role: 'assistant', content: 'Olá! Sou o NutriBot. Posso tirar dúvidas ou calcular sua meta calórica com nossa IA. Como posso ajudar?' }
    ];
  });

  const [showMlModal, setShowMlModal] = useState(false);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [mlResult, setMlResult] = useState<string | null>(null);
  const [loadingMl, setLoadingMl] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('@EquiLibra:chatHistory', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [messages, loadingChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  
  const handleClearHistory = () => {
    if (confirm("Deseja apagar todo o histórico da conversa?")) {
      const initialMsg: Message[] = [{ role: 'assistant', content: 'Histórico apagado. Vamos começar de novo! Como posso ajudar?' }];
      setMessages(initialMsg);
      localStorage.setItem('@EquiLibra:chatHistory', JSON.stringify(initialMsg));
    }
  };

  
  async function handleSendMessage() {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setLoadingChat(true);

    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      
      const response = await api.post('/chat', { message: userMessage });
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ops! Tive um problema de conexão. Tente novamente.' }]);
    } finally {
      setLoadingChat(false);
    }
  }

  
  async function handlePredictCalories() {
    if (!weight || !height) {
        alert("Preencha peso e altura!");
        return;
    }
    setLoadingMl(true);
    setMlResult(null);

    try {
        const response = await api.post('/ai/predict', { 
            weight: Number(weight), 
            height: Number(height) 
        });
        setMlResult(response.data.predicted_calories);
    } catch (error) {
        console.error(error);
        alert("Erro ao calcular. Verifique o backend.");
    } finally {
        setLoadingMl(false);
    }
  }

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="flex flex-col h-[calc(100vh-6rem)] w-full max-w-5xl mx-auto p-4 overflow-hidden relative">
        
        <div className="flex justify-between items-center mb-4 shrink-0">
          <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">NutriBot</h1>
              <p className="text-gray-500 text-sm">IA integrada com Dialogflow & Python</p>
          </div>
          
          <div className="flex gap-2">
              <button 
                onClick={handleClearHistory}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                title="Limpar Conversa"
              >
                  <Trash2 size={20} />
              </button>

              <button onClick={() => setShowMlModal(true)} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all hover:scale-105">
                  <Sparkles size={18} /> Calcular Meta (IA)
              </button>
          </div>
        </div>

        <div className="flex-1 bg-white dark:bg-gray-800 rounded-t-2xl border border-b-0 border-gray-200 dark:border-gray-700 p-4 overflow-y-auto no-scrollbar space-y-4 shadow-inner">
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
              
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 shrink-0 mt-1">
                  <Bot size={18} />
                </div>
              )}

              <div className={`max-w-[85%] md:max-w-[70%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-green-600 text-white rounded-tr-none' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
                }`}
              >
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 shrink-0 mt-1">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}
          
          {loadingChat && (
            <div className="flex gap-3 justify-start animate-pulse">
               <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600"><Bot size={18} /></div>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl text-gray-500 text-xs flex items-center">Digitando...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 rounded-b-2xl border border-t-0 border-gray-200 dark:border-gray-700 flex items-center gap-2 shadow-lg shrink-0">
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Digite sua mensagem..." 
            className="flex-1 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl outline-none text-gray-800 dark:text-white placeholder-gray-400 border border-transparent focus:border-green-500 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            autoFocus
          />
          <button 
            onClick={handleSendMessage}
            disabled={loadingChat || !input.trim()}
            className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            <Send size={20} />
          </button>
        </div>

        {/* MODAL ML (MANTIDO) */}
        {showMlModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative border border-gray-100 dark:border-gray-700">
                  <button onClick={() => { setShowMlModal(false); setMlResult(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <X size={24} />
                  </button>
                  <div className="text-center mb-6">
                      <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600 dark:text-purple-400">
                          <Calculator size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Cálculo de TMB (IA)</h3>
                      <p className="text-gray-500 text-sm">Nosso modelo Python analisa seus dados:</p>
                  </div>
                  {!mlResult ? (
                      <div className="space-y-4">
                          <div>
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Peso (kg)</label>
                              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full p-3 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none" placeholder="Ex: 70" />
                          </div>
                          <div>
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Altura (cm)</label>
                              <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full p-3 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none" placeholder="Ex: 175" />
                          </div>
                          <button onClick={handlePredictCalories} disabled={loadingMl} className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition flex justify-center items-center gap-2 disabled:opacity-70">
                              {loadingMl ? 'Processando...' : 'Calcular com Python'}
                          </button>
                      </div>
                  ) : (
                      <div className="text-center animate-fadeIn">
                          <p className="text-gray-500 mb-2">Sua meta diária sugerida:</p>
                          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-4">{mlResult} kcal</div>
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-xs text-purple-700 dark:text-purple-300 mb-4">
                              <Activity size={14} className="inline mr-1 mb-0.5"/> Cálculo baseado em Regressão Linear (Scikit-Learn)
                          </div>
                          <button onClick={() => { setShowMlModal(false); setMlResult(null); }} className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Fechar</button>
                      </div>
                  )}
              </div>
          </div>
        )}
      </div>
    </>
  );
}