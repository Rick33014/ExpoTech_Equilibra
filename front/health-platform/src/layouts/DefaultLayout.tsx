import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  User, 
  LogOut, 
  Menu, 
  Moon, 
  Sun, 
  Activity,
  Apple,
  AlertTriangle
} from 'lucide-react';

export default function DefaultLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [userData, setUserData] = useState({
    name: 'Usuário',
    initials: 'U',
    avatarUrl: ''
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('@EquiLibra:user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      
      const firstName = user.name ? user.name.split(' ')[0] : 'Usuário';
      
      let initials = 'U';
      if (user.name) {
          const names = user.name.split(' ');
          if (names.length >= 2) {
              initials = (names[0][0] + names[1][0]).toUpperCase();
          } else {
              initials = user.name.substring(0, 2).toUpperCase();
          }
      }

      setUserData({
        name: firstName,
        initials: initials,
        avatarUrl: user.avatarUrl || ''
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const confirmLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/diario', label: 'Diário', icon: BookOpen },
    { path: '/nutrients', label: 'Guia Nutricional', icon: Apple },
    { path: '/insights', label: 'Insights IA', icon: Activity },
    { path: '/chatbot', label: 'NutriBot', icon: MessageSquare },
    { path: '/perfil', label: 'Meu Perfil', icon: User },
  ];

  // Função para ir direto para a aba de planos dentro do perfil
  const goToPlans = () => {
    navigate('/perfil', { state: { openPlans: true } });
  };

  return (
    <div className={`h-screen w-full flex overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
      <aside 
        className={`
          flex flex-col h-full transition-all duration-300 ease-in-out border-r z-20
          ${isSidebarOpen ? 'w-64' : 'w-20'}
          ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        `}
      >
        <div className="p-6 flex items-center gap-3 h-20 shrink-0">
          <div className="bg-green-500 p-2 rounded-lg shrink-0">
            <Activity className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && (
            <h1 className="font-bold text-2xl text-green-500" style={{ fontFamily: "'Playwrite CU', cursive" }}>
              Equi<span className={darkMode ? 'text-white' : 'text-gray-800'}>Libra</span>
            </h1>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide mt-6">
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group whitespace-nowrap
                  ${isActive 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                    : `hover:bg-green-500/10 ${darkMode ? 'text-white hover:text-green-400' : 'text-gray-600 hover:text-green-600'}`
                  }
                `}
                title={!isSidebarOpen ? item.label : ''}
              >
                <item.icon className={`w-6 h-6 shrink-0 ${isActive ? 'animate-pulse' : ''}`} />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <button 
            onClick={() => setShowLogoutModal(true)}
            className={`
              w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors whitespace-nowrap
              ${darkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}
            `}
          >
            <LogOut className="w-6 h-6 shrink-0" />
            {isSidebarOpen && <span className="font-medium">Sair</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        <header className={`
          h-20 border-b flex items-center justify-between px-8 shrink-0 transition-colors duration-500
          ${darkMode ? 'bg-gray-800/50 border-gray-700 backdrop-blur-md' : 'bg-white/80 border-gray-200 backdrop-blur-md'}
        `}>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className={`
                p-2.5 rounded-full border transition-all duration-300 hover:scale-110
                ${darkMode 
                  ? 'bg-gray-700 border-gray-600 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]' 
                  : 'bg-indigo-50 border-indigo-100 text-indigo-600 shadow-sm'
                }
              `}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-700">
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Olá, {userData.name}
                </p>
                
                {}
                <p 
                  onClick={goToPlans}
                  className="text-xs text-green-500 font-medium flex items-center justify-end gap-1 cursor-pointer hover:underline select-none"
                >
                   Plano Básico
                </p>
              </div>
              
              <div 
                onClick={() => navigate('/perfil')}
                className="cursor-pointer hover:scale-105 transition-transform"
              >
                {userData.avatarUrl ? (
                   <img 
                     src={userData.avatarUrl} 
                     alt="Avatar" 
                     className="w-10 h-10 rounded-full object-cover border-2 border-green-500 shadow-lg"
                   />
                ) : (
                   <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg border-2 border-white dark:border-gray-800">
                     {userData.initials}
                   </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative scrollbar-hide">
          {!darkMode && (
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none fixed"></div>
          )}
          <div className="max-w-7xl mx-auto animate-fadeIn pb-10">
            <Outlet />
          </div>
        </main>

      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className={`
             rounded-2xl p-6 w-full max-w-sm shadow-2xl border scale-100 transition-all
             ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
          `}>
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-full mb-4 ${darkMode ? 'bg-red-900/30 text-red-500' : 'bg-red-100 text-red-600'}`}>
                <AlertTriangle size={32} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Sair da conta?
              </h3>
              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Você terá que fazer login novamente para acessar seus dados.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className={`flex-1 px-4 py-2.5 font-medium rounded-xl transition ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-600/20 transition"
                >
                  Sim, Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}