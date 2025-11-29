import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, ChevronLeft, CheckCircle } from 'lucide-react';
// Garante que o caminho está correto baseando-se na estrutura src/pages -> src/services
import api from '../services/api'; 

export default function Login() {
  const navigate = useNavigate();

  type ViewState = 'login' | 'register' | 'forgot';

  const [view, setView] = useState<ViewState>('login'); 
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const backgroundImages = [
    "https://images.unsplash.com/photo-1535914254981-b5012eebbd15?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2070&auto=format&fit=crop",
    "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg",
    "https://images.pexels.com/photos/864939/pexels-photo-864939.jpeg",
    "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=1887&auto=format&fit=crop"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // --- LOGIN ---
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/login', { email, password });

      localStorage.setItem('@EquiLibra:token', response.data.token);
      
      // Salva TODOS os dados para usar no perfil
      localStorage.setItem('@EquiLibra:user', JSON.stringify({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          avatarUrl: response.data.avatarUrl,
          phone: response.data.phone,
          birthDate: response.data.birthDate
      }));

      navigate('/dashboard'); 

    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  }

  // --- CADASTRO ---
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/users', { name, email, password });
      alert("Conta criada com sucesso! Faça login.");
      setView('login');
      setPassword(''); 
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  }

  // --- ESQUECI SENHA ---
  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/forgot-password', { email });
      alert("Se o e-mail existir, enviamos o link.");
      setView('login');
    } catch (error: any) {
      console.error(error);
      alert("Erro ao solicitar recuperação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* Estilos Inline para garantir funcionamento */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playwrite+CU:wght@100..400&display=swap');
        .font-playwrite { font-family: 'Playwrite CU', cursive; }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src={image} alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      <div className="relative z-10 flex flex-col items-center w-full max-w-md transition-all duration-300">
        <div className="text-center mb-6">
          <h1 className="font-playwrite text-7xl font-bold text-green-500 mb-2 drop-shadow-[0_4px_4px_rgba(22,163,74,0.8)]">
            Equi<span className="text-white">Libra</span>
          </h1>
          <p className="text-gray-100 text-lg font-medium drop-shadow-md">Acesse sua central de saúde</p>
        </div>

        <div className="bg-black/30 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full border border-white/20">
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">E-mail</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400"><Mail size={20} /></div>
                  <input type="email" placeholder="seu@email.com" className="w-full pl-10 pr-4 py-3 bg-white/90 border-transparent rounded-xl outline-none text-gray-800" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Senha</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400"><Lock size={20} /></div>
                  <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-white/90 border-transparent rounded-xl outline-none text-gray-800" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-500 transition flex items-center justify-center gap-2">
                {loading ? 'Entrando...' : (<>Entrar no Sistema <ArrowRight size={20} /></>)}
              </button>
              <div className="text-center text-sm text-gray-300 mt-4 space-y-2">
                <button type="button" onClick={() => setView('forgot')} className="block w-full hover:text-green-400 transition">Esqueci minha senha</button>
                <p>Não tem conta? <button type="button" onClick={() => setView('register')} className="text-green-400 font-bold hover:underline transition">Crie agora</button></p>
              </div>
            </form>
          )}

          {view === 'register' && (
            <form onSubmit={handleRegister} className="space-y-6 animate-fadeIn">
              <button type="button" onClick={() => setView('login')} className="text-gray-300 hover:text-white flex items-center gap-1 text-sm mb-2"><ChevronLeft size={16} /> Voltar</button>
              <h2 className="text-xl font-bold text-white text-center mb-4">Criar Nova Conta</h2>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Nome Completo</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400"><User size={20} /></div>
                  <input type="text" placeholder="Seu Nome" className="w-full pl-10 pr-4 py-3 bg-white/90 rounded-xl outline-none text-gray-800" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">E-mail</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400"><Mail size={20} /></div>
                  <input type="email" placeholder="seu@email.com" className="w-full pl-10 pr-4 py-3 bg-white/90 rounded-xl outline-none text-gray-800" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Senha</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400"><Lock size={20} /></div>
                  <input type="password" placeholder="Crie uma senha forte" className="w-full pl-10 pr-4 py-3 bg-white/90 rounded-xl outline-none text-gray-800" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-500 transition flex items-center justify-center gap-2">
                {loading ? 'Criando...' : (<>Cadastrar-se <CheckCircle size={20} /></>)}
              </button>
              <div className="text-center text-sm text-gray-300 mt-4">Já tem conta? <button type="button" onClick={() => setView('login')} className="text-green-400 font-bold hover:underline">Entrar</button></div>
            </form>
          )}

          {view === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-6 animate-fadeIn">
              <button type="button" onClick={() => setView('login')} className="text-gray-300 hover:text-white flex items-center gap-1 text-sm mb-2"><ChevronLeft size={16} /> Voltar</button>
              <h2 className="text-xl font-bold text-white text-center mb-2">Recuperar Senha</h2>
              <p className="text-gray-300 text-center text-sm mb-4">Digite seu e-mail para redefinir a senha.</p>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">E-mail Cadastrado</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400"><Mail size={20} /></div>
                  <input type="email" placeholder="seu@email.com" className="w-full pl-10 pr-4 py-3 bg-white/90 rounded-xl outline-none text-gray-800" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-500 transition flex items-center justify-center gap-2">
                {loading ? 'Enviando...' : (<>Enviar Link <Mail size={20} /></>)}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}