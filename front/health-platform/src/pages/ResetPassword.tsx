import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, CheckCircle, ChevronLeft } from 'lucide-react';
import api from '../services/api'; // Importe sua api

export default function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Imagens de fundo (Copiadas do seu Login para manter o padrão)
  const backgroundImages = [
    "https://images.unsplash.com/photo-1535914254981-b5012eebbd15?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === backgroundImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    setLoading(true);

    try {
      // Chama o backend para trocar a senha
      await api.post('/reset-password', {
        email, 
        newPassword
      });

      alert("Senha alterada com sucesso! Agora faça login.");
      navigate('/login');

    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Erro ao alterar senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* SLIDER DE FUNDO */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src={image} alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      {/* CARD DE VIDRO */}
      <div className="relative z-10 bg-black/30 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 animate-fadeIn">
        
        <button 
          onClick={() => navigate('/login')} 
          className="text-gray-300 hover:text-white flex items-center gap-1 text-sm mb-4 transition-colors"
        >
          <ChevronLeft size={16} /> Voltar ao Login
        </button>

        <div className="text-center mb-6">
          <h1 className="font-bold text-3xl text-green-500 mb-2" style={{ fontFamily: "'Playwrite CU', cursive" }}>
            Nova Senha
          </h1>
          <p className="text-gray-200 text-sm">
            Confirme seu e-mail e crie uma nova senha.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          
          {/* Input de Email (Para confirmar quem é) */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300 uppercase ml-1">Seu E-mail</label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400"><Mail size={20} /></div>
              <input 
                type="email" 
                placeholder="Confirme seu e-mail"
                className="w-full pl-10 pr-4 py-3 bg-white/90 border-0 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 placeholder:text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Nova Senha */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300 uppercase ml-1">Nova Senha</label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400"><Lock size={20} /></div>
              <input 
                type="password" 
                placeholder="Digite a nova senha"
                className="w-full pl-10 pr-4 py-3 bg-white/90 border-0 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 placeholder:text-gray-400"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Confirmar Senha */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300 uppercase ml-1">Confirmar Senha</label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400"><CheckCircle size={20} /></div>
              <input 
                type="password" 
                placeholder="Repita a nova senha"
                className="w-full pl-10 pr-4 py-3 bg-white/90 border-0 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 placeholder:text-gray-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-500 transition shadow-lg shadow-green-600/30 mt-2"
          >
            {loading ? 'Salvando...' : 'Alterar Senha'}
          </button>

        </form>
      </div>
    </div>
  );
}