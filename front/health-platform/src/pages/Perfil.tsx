import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Mail, Shield, Bell, LogOut, AlertCircle, 
  ChevronLeft, Camera, Save, Lock, CreditCard, 
  CheckCircle, XCircle, Star, Target, Trophy, 
  Activity, HelpCircle, ChevronDown, ChevronUp, History, MessageSquare, Trash2 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api'; 

export default function Perfil() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados de Navegação
  const [currentView, setCurrentView] = useState('hub');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Estados para troca de senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loadingPass, setLoadingPass] = useState(false);

  // Estado para Planos (Mensal/Anual)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Estado para Accordion do FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    initials: 'U',
    avatarUrl: '',
    // Dados para metas
    height: '',
    weight: '',
    goal: 'perder'
  });

  const [goalsHistory, setGoalsHistory] = useState(() => {
    const savedGoals = localStorage.getItem('@EquiLibra:goalsHistory');
    if (savedGoals) {
      return JSON.parse(savedGoals);
    }
    // Dados iniciais caso não tenha nada salvo (apenas na primeira vez)
    return [
      { id: 1, date: '10/10/2025', weight: '75', height: '175', goal: 'Perder Peso' },
      { id: 2, date: '15/11/2025', weight: '72', height: '175', goal: 'Perder Peso' }
    ];
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (location.state && (location.state as any).openPlans) {
      setCurrentView('plans');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    const storedUser = localStorage.getItem('@EquiLibra:user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      loadUserData(user);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('@EquiLibra:goalsHistory', JSON.stringify(goalsHistory));
  }, [goalsHistory]);

  function loadUserData(user: any) {
    const getInitials = (name: string) => {
        if (!name) return 'U';
        const names = name.split(' ');
        if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    setUserData(prev => ({
      ...prev,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',       
      birthDate: user.birthDate || '', 
      initials: getInitials(user.name),
      avatarUrl: user.avatarUrl || ''
    }));
  }

  // --- FUNÇÕES AUXILIARES ---

  // Função para Alterar Senha
  async function handleChangePassword() {
    if (!currentPassword || !newPassword) {
      alert("Por favor, preencha a senha atual e a nova senha.");
      return;
    }

    setLoadingPass(true);

    try {
      await api.put('/change-password', {
        email: userData.email, 
        currentPassword: currentPassword,
        newPassword: newPassword
      });

      alert("Senha alterada com sucesso!");
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Erro ao alterar senha.");
    } finally {
      setLoadingPass(false);
    }
  }

  const handleUpdateGoals = () => {
    if(!userData.weight || !userData.height) {
        alert("Preencha peso e altura!");
        return;
    }

    const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString('pt-BR'),
        weight: userData.weight,
        height: userData.height,
        goal: userData.goal === 'perder' ? 'Perder Peso' : userData.goal === 'manter' ? 'Manter Peso' : 'Ganhar Massa'
    };

    // Adiciona ao histórico (o mais recente primeiro)
    setGoalsHistory([newEntry, ...goalsHistory]);
    alert("Metas atualizadas e salvas no histórico!");
  };

  // --- DELETAR REGISTRO ---
  const handleDeleteGoal = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      const updatedHistory = goalsHistory.filter((item: any) => item.id !== id);
      setGoalsHistory(updatedHistory);
      // O useEffect vai salvar automaticamente no localStorage
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
      };
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        setPreviewImage(compressedImage);
      } catch (err) {
        console.error(err);
        alert("Erro ao processar imagem.");
      }
    }
  };

  async function handleSavePhoto() {
    if (!previewImage) return;
    setLoadingPhoto(true);
    try {
      await api.put('/users/avatar', {
        email: userData.email,
        avatarUrl: previewImage
      });
      updateLocalStorage({ avatarUrl: previewImage });
      alert("Foto atualizada com sucesso!");
      setCurrentView('hub');
    } catch (error: any) {
      console.error(error);
      alert(`Erro: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoadingPhoto(false);
    }
  }

  async function handleSaveData() {
    setLoadingData(true);
    try {
        const response = await api.put('/users/profile', {
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            birthDate: userData.birthDate
        });
        updateLocalStorage(response.data.user);
        alert("Dados atualizados com sucesso!");
        setCurrentView('hub');
    } catch (error) {
        console.error(error);
        alert("Erro ao atualizar dados.");
    } finally {
        setLoadingData(false);
    }
  }

  function updateLocalStorage(newData: any) {
    const current = JSON.parse(localStorage.getItem('@EquiLibra:user') || '{}');
    const updated = { ...current, ...newData };
    localStorage.setItem('@EquiLibra:user', JSON.stringify(updated));
    loadUserData(updated);
  }

  function confirmLogout() {
    localStorage.clear();
    navigate('/login');
  }

  // --- DADOS DOS PLANOS ---
  const plans = [
    {
      name: 'Básico',
      priceMonthly: 0,
      priceYearly: 0,
      description: 'Seu plano atual. Recursos essenciais.',
      features: [
        { name: 'Diário Alimentar Básico', included: true },
        { name: 'Contador de Calorias', included: true },
        { name: 'NutriBot (Limitado)', included: false },
        { name: 'Sem Anúncios', included: false },
      ],
      highlight: false,
      current: true 
    },
    {
      name: 'Pro',
      priceMonthly: 29.90,
      priceYearly: 299.90,
      description: 'O melhor custo-benefício.',
      features: [
        { name: 'Diário Completo', included: true },
        { name: 'Contador de Macros', included: true },
        { name: 'NutriBot Ilimitado', included: true },
        { name: 'Sem Anúncios', included: false },
      ],
      highlight: true, 
      current: false
    },
    {
      name: 'Premium',
      priceMonthly: 49.90,
      priceYearly: 499.90,
      description: 'Para alta performance.',
      features: [
        { name: 'Tudo do plano Pro', included: true },
        { name: 'Consultoria Nutricional', included: true },
        { name: 'Treinos Personalizados', included: true },
        { name: 'Sem Anúncios', included: true },
      ],
      highlight: false,
      current: false
    }
  ];

  // --- DADOS FAQ ---
  const faqData = [
    { question: "Como cancelo minha assinatura?", answer: "Você pode cancelar a qualquer momento indo na aba 'Planos e Assinaturas' e clicando em 'Gerenciar Assinatura'. O cancelamento será efetivado no próximo ciclo." },
    { question: "O NutriBot substitui um nutricionista?", answer: "Não. O NutriBot é uma ferramenta de auxílio baseada em IA. Para diagnósticos e tratamentos específicos, sempre consulte um profissional de saúde." },
    { question: "Como exportar meus dados?", answer: "Atualmente essa função está em desenvolvimento e estará disponível na próxima atualização do sistema." },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 relative min-h-[80vh] animate-fadeIn">
      
      {/* --- TELA: PLANOS E ASSINATURAS --- */}
      {currentView === 'plans' && (
        <div className="animate-fadeIn space-y-8">
          <button onClick={() => setCurrentView('hub')} className="flex items-center gap-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors mb-4">
            <ChevronLeft size={20} /> Voltar ao Perfil
          </button>

          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Planos e Assinaturas</h2>
            <div className="flex justify-center items-center pt-4 pb-8">
              <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex items-center relative">
                <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-2 rounded-lg text-sm font-medium transition-all z-10 ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white shadow-sm bg-white dark:bg-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>Mensal</button>
                <button onClick={() => setBillingCycle('yearly')} className={`px-6 py-2 rounded-lg text-sm font-medium transition-all z-10 flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-gray-900 dark:text-white shadow-sm bg-white dark:bg-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>Anual <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">-20%</span></button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div key={index} className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 border transition-all hover:-translate-y-1 duration-300
                ${plan.highlight 
                  ? 'border-green-500 shadow-[0_0_25px_rgba(34,197,94,0.15)] z-10 scale-105 md:-mt-2 dark:shadow-[0_0_25px_rgba(34,197,94,0.1)]' 
                  : 'border-gray-200 dark:border-gray-700 shadow-lg'} 
                ${plan.current ? 'opacity-80' : ''}`}>
                
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-[0_0_15px_rgba(34,197,94,0.6)] flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> Popular
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 h-8">{plan.description}</p>
                </div>
                <div className="text-center mb-6">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">R$ {billingCycle === 'monthly' ? plan.priceMonthly.toFixed(2).replace('.', ',') : (plan.priceYearly / 12).toFixed(2).replace('.', ',')}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">/mês</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      {feature.included ? <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" /> : <XCircle size={14} className="text-gray-300 dark:text-gray-600 shrink-0 mt-0.5" />}
                      <span className={feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}>{feature.name}</span>
                    </li>
                  ))}
                </ul>
                <button disabled={plan.current} className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-300
                  ${plan.current 
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-default' 
                    : plan.highlight 
                      ? 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_30px_rgba(34,197,94,0.7)]' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                  {plan.current ? 'Plano Atual' : 'Assinar'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- VIEW PESSOAL --- */}
      {currentView === 'personal' && (
        <div className="animate-fadeIn space-y-6">
          <button onClick={() => setCurrentView('hub')} className="flex items-center gap-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors mb-4">
            <ChevronLeft size={20} /> Voltar ao Perfil
          </button>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dados Pessoais</h2>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
                <input type="text" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} className="w-full p-3 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-green-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
                <input type="email" value={userData.email} disabled className="w-full p-3 rounded-lg border dark:border-gray-600 bg-gray-200 dark:bg-gray-800 dark:text-gray-400 text-gray-500 cursor-not-allowed outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
                <input type="tel" placeholder="(11) 99999-9999" value={userData.phone} onChange={(e) => setUserData({...userData, phone: e.target.value})} className="w-full p-3 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-green-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data de Nascimento</label>
                <input type="date" value={userData.birthDate} onChange={(e) => setUserData({...userData, birthDate: e.target.value})} className="w-full p-3 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-green-500 transition-colors" />
              </div>
            </div>
            <div className="pt-4">
              <button onClick={handleSaveData} disabled={loadingData} className={`bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2 shadow-lg shadow-green-600/20 ${loadingData ? 'opacity-70' : ''}`}>
                {loadingData ? 'Salvando...' : <><Save size={20} /> Salvar Alterações</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- VIEW METAS CORPORAIS (ATUALIZADA) --- */}
      {currentView === 'goals' && (
        <div className="animate-fadeIn space-y-6">
          <button onClick={() => setCurrentView('hub')} className="flex items-center gap-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors mb-4">
            <ChevronLeft size={20} /> Voltar ao Perfil
          </button>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Metas Corporais</h2>
          
          {/* Formulário */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Altura (cm)</label>
                    <input type="number" value={userData.height} onChange={(e) => setUserData({...userData, height: e.target.value})} placeholder="ex: 175" className="w-full p-3 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-green-500 transition-colors" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Peso Atual (kg)</label>
                    <input type="number" value={userData.weight} onChange={(e) => setUserData({...userData, weight: e.target.value})} placeholder="ex: 70" className="w-full p-3 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-green-500 transition-colors" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Objetivo</label>
                    <select value={userData.goal} onChange={(e) => setUserData({...userData, goal: e.target.value})} className="w-full p-3 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-green-500 transition-colors">
                        <option value="perder">Perder Peso</option>
                        <option value="manter">Manter Peso</option>
                        <option value="ganhar">Ganhar Massa</option>
                    </select>
                </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3 text-blue-800 dark:text-blue-300 text-sm">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p>Esses dados são usados para calcular sua Taxa Metabólica Basal e sugerir a quantidade ideal de calorias diárias no NutriBot.</p>
            </div>
            <button onClick={handleUpdateGoals} className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2 shadow-lg shadow-green-600/20">
                <Save size={20} /> Atualizar Metas
            </button>
          </div>

          {/* Histórico de Metas */}
          <div className="space-y-4 pt-4">
             <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2"><History size={20} /> Histórico de Registros</h3>
             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Data</th>
                            <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Peso (kg)</th>
                            <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Altura (cm)</th>
                            <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Objetivo</th>
                            <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {goalsHistory.map((item: any) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="p-4 text-sm text-gray-700 dark:text-gray-300 font-medium">{item.date}</td>
                                <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{item.weight}</td>
                                <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{item.height}</td>
                                <td className="p-4 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.goal === 'Perder Peso' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : item.goal === 'Ganhar Massa' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                                        {item.goal}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-right">
                                    <button onClick={() => handleDeleteGoal(item.id)} className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors" title="Excluir registro">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {goalsHistory.length === 0 && (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">Nenhum registro encontrado.</div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* --- VIEW CONQUISTAS --- */}
      {currentView === 'achievements' && (
        <div className="animate-fadeIn space-y-6">
          <button onClick={() => setCurrentView('hub')} className="flex items-center gap-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors mb-4">
            <ChevronLeft size={20} /> Voltar ao Perfil
          </button>
          <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Minhas Conquistas</h2>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold">Nível 3</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center gap-2 opacity-100 hover:scale-105 transition-transform">
                    <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center text-yellow-500 mb-2 shadow-sm">
                        <Trophy size={32} />
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm">Primeiros Passos</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Completou o perfil</p>
                </div>
            ))}
             {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center gap-2 opacity-50 grayscale">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 mb-2">
                        <Lock size={32} />
                    </div>
                    <h3 className="font-bold text-gray-700 dark:text-gray-300 text-sm">Mestre da Dieta</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Bloqueado</p>
                </div>
            ))}
          </div>
        </div>
      )}

      {/* --- VIEW PRIVACIDADE --- */}
      {currentView === 'privacy' && (
        <div className="animate-fadeIn space-y-6">
          <button onClick={() => setCurrentView('hub')} className="flex items-center gap-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors mb-4">
            <ChevronLeft size={20} /> Voltar ao Perfil
          </button>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Privacidade</h2>
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><Lock size={20} className="text-green-500"/> Alterar Senha</h3>
              <div className="space-y-3 max-w-md">
                
                {/* Input Senha Atual */}
                <input 
                  type="password" 
                  placeholder="Senha Atual" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-green-500 transition-colors" 
                />
                
                {/* Input Nova Senha */}
                <input 
                  type="password" 
                  placeholder="Nova Senha" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-green-500 transition-colors" 
                />
                
                <button 
                  onClick={handleChangePassword} 
                  disabled={loadingPass}
                  className={`text-sm font-bold mt-2 transition-colors ${loadingPass ? 'text-gray-400' : 'text-green-600 dark:text-green-400 hover:underline'}`}
                >
                  {loadingPass ? 'Atualizando...' : 'Atualizar Senha'}
                </button>

              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Shield size={20} className="text-blue-500"/> Preferências de Dados
              </h3>
              <div className="space-y-4">
                <div onClick={() => setPublicProfile(!publicProfile)} className="flex items-center justify-between cursor-pointer select-none">
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-200">Perfil Público</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{publicProfile ? 'Visível' : 'Oculto'}</p>
                  </div>
                  <div className={`w-12 h-7 rounded-full relative transition-colors duration-300 ease-in-out ${publicProfile ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 left-1 shadow-sm transition-transform duration-300 ease-in-out ${publicProfile ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- VIEW AJUDA E SUPORTE (NOVO) --- */}
      {currentView === 'help' && (
        <div className="animate-fadeIn space-y-6">
            <button onClick={() => setCurrentView('hub')} className="flex items-center gap-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors mb-4">
                <ChevronLeft size={20} /> Voltar ao Perfil
            </button>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Ajuda e Suporte</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* FAQ */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                         <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2"><HelpCircle size={20} className="text-green-500"/> Perguntas Frequentes</h3>
                    </div>
                    <div>
                        {faqData.map((item, index) => (
                            <div key={index} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                                <button onClick={() => toggleFaq(index)} className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">{item.question}</span>
                                    {openFaq === index ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
                                </button>
                                {openFaq === index && (
                                    <div className="px-4 pb-4 text-sm text-gray-500 dark:text-gray-400 animate-fadeIn">
                                        {item.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contato */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><MessageSquare size={20} className="text-blue-500"/> Fale Conosco</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Não encontrou o que procurava? Nossa equipe de suporte está pronta para te ajudar.
                        </p>
                        <button className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex justify-center items-center gap-2">
                             Entrar em Contato
                        </button>
                    </div>
                     <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-900/30">
                        <h3 className="text-sm font-bold text-green-800 dark:text-green-300 mb-2">Dica Pro</h3>
                        <p className="text-xs text-green-700 dark:text-green-400">
                            Assinantes Premium têm prioridade no atendimento e acesso ao chat ao vivo com nutricionistas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- VIEW FOTO --- */}
      {currentView === 'photo' && (
        <div className="animate-fadeIn space-y-6 flex flex-col items-center">
          <button onClick={() => { setCurrentView('hub'); setPreviewImage(null); }} className="self-start flex items-center gap-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors mb-4">
            <ChevronLeft size={20} /> Voltar ao Perfil
          </button>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Alterar Foto</h2>
          <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center gap-6 w-full max-w-md">
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} hidden accept="image/*"/>
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {(previewImage || userData.avatarUrl) ? (
                <img src={previewImage || userData.avatarUrl} alt="Perfil" className="w-40 h-40 rounded-full object-cover border-4 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
              ) : (
                <div className="w-40 h-40 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-5xl font-bold border-4 border-green-500 shadow-xl">{userData.initials}</div>
              )}
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="text-white" size={32} /></div>
            </div>
            <div className="flex gap-3 w-full mt-4">
              <button onClick={() => { setCurrentView('hub'); setPreviewImage(null); }} className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
              <button onClick={handleSavePhoto} disabled={!previewImage || loadingPhoto} className={`flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 ${loadingPhoto ? 'opacity-70' : ''}`}>{loadingPhoto ? 'Salvando...' : 'Salvar Foto'}</button>
            </div>
          </div>
        </div>
      )}

      {/* --- VIEW HUB (PRINCIPAL) --- */}
      {currentView === 'hub' && (
        <div className="animate-fadeIn space-y-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Meu Perfil</h1>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center gap-6">
            {userData.avatarUrl ? (
                <img src={userData.avatarUrl} alt="Perfil" className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md" />
            ) : (
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-3xl font-bold border-4 border-white dark:border-gray-800 shadow-md">{userData.initials}</div>
            )}
            <div className="text-center md:text-left space-y-1 flex-1">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{userData.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2"><Mail size={16} /> {userData.email}</p>
              <div className="flex gap-2 mt-2 justify-center md:justify-start">
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Plano Básico</span>
              </div>
            </div>
            <button onClick={() => setCurrentView('photo')} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">Editar Foto</button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
            
            {/* DADOS PESSOAIS */}
            <div onClick={() => setCurrentView('personal')} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition group">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg group-hover:text-green-600 transition-colors"><User size={20} className="text-gray-600 dark:text-gray-300 group-hover:text-green-600"/></div>
                <div><p className="font-medium text-gray-700 dark:text-gray-200">Dados Pessoais</p><p className="text-xs text-gray-500 dark:text-gray-400">Alterar nome, telefone, data de nasc.</p></div>
              </div>
            </div>

             {/* METAS (ATUALIZADA) */}
             <div onClick={() => setCurrentView('goals')} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition group">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg group-hover:text-green-600 transition-colors"><Activity size={20} className="text-gray-600 dark:text-gray-300 group-hover:text-green-600"/></div>
                <div><p className="font-medium text-gray-700 dark:text-gray-200">Metas Corporais</p><p className="text-xs text-gray-500 dark:text-gray-400">Peso, altura e objetivos</p></div>
              </div>
            </div>

             {/* CONQUISTAS */}
             <div onClick={() => setCurrentView('achievements')} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition group">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg group-hover:text-green-600 transition-colors"><Trophy size={20} className="text-gray-600 dark:text-gray-300 group-hover:text-green-600"/></div>
                <div><p className="font-medium text-gray-700 dark:text-gray-200">Conquistas</p><p className="text-xs text-gray-500 dark:text-gray-400">Veja seu progresso e medalhas</p></div>
              </div>
            </div>

            {/* PLANOS E ASSINATURAS */}
            <div onClick={() => setCurrentView('plans')} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition group">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg group-hover:text-green-600 transition-colors"><CreditCard size={20} className="text-gray-600 dark:text-gray-300 group-hover:text-green-600"/></div>
                <div><p className="font-medium text-gray-700 dark:text-gray-200">Planos e Assinaturas</p><p className="text-xs text-gray-500 dark:text-gray-400">Gerenciar meu plano atual</p></div>
              </div>
            </div>

            {/* NOTIFICAÇÕES */}
            <div onClick={() => setNotificationsEnabled(!notificationsEnabled)} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition select-none group">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg group-hover:text-green-600 transition-colors"><Bell size={20} className="text-gray-600 dark:text-gray-300 group-hover:text-green-600"/></div>
                <div><p className="font-medium text-gray-700 dark:text-gray-200">Notificações</p><p className="text-xs text-gray-500 dark:text-gray-400">{notificationsEnabled ? 'Ativadas' : 'Desativadas'}</p></div>
              </div>
              <div className={`w-12 h-7 rounded-full relative transition-colors duration-300 ease-in-out ${notificationsEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}><div className={`w-5 h-5 bg-white rounded-full absolute top-1 left-1 shadow-sm transition-transform duration-300 ease-in-out ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div></div>
            </div>

            {/* PRIVACIDADE */}
            <div onClick={() => setCurrentView('privacy')} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition group">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg group-hover:text-green-600 transition-colors"><Shield size={20} className="text-gray-600 dark:text-gray-300 group-hover:text-green-600"/></div>
                <div><p className="font-medium text-gray-700 dark:text-gray-200">Privacidade e Dados</p><p className="text-xs text-gray-500 dark:text-gray-400">Senhas e visibilidade</p></div>
              </div>
            </div>

            {/* AJUDA (ATUALIZADA) */}
             <div onClick={() => setCurrentView('help')} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition group">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg group-hover:text-green-600 transition-colors"><HelpCircle size={20} className="text-gray-600 dark:text-gray-300 group-hover:text-green-600"/></div>
                <div><p className="font-medium text-gray-700 dark:text-gray-200">Ajuda e Suporte</p><p className="text-xs text-gray-500 dark:text-gray-400">FAQ e Contato</p></div>
              </div>
            </div>

            {/* SAIR */}
            <div onClick={() => setShowLogoutModal(true)} className="p-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition group">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 p-2 rounded-lg"><LogOut size={20} className="text-red-600 dark:text-red-400"/></div>
                <p className="font-medium text-red-600 dark:text-red-400">Sair da Conta</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Sair da conta?</h3>
            <div className="flex gap-3 w-full">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg dark:text-white">Cancelar</button>
              <button onClick={confirmLogout} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Sair</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}