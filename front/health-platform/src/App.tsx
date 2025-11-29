import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- IMPORTAÇÕES ---
import DefaultLayout from './layouts/DefaultLayout';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Diario from './pages/Diario';
import Insights from './pages/Insights';
import Chatbot from './pages/Chatbot';
import Perfil from './pages/Perfil';
import Nutrients from './pages/Nutrients';
import TrainingPlan from './pages/TrainingPlan';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = localStorage.getItem('@EquiLibra:token') !== null || localStorage.getItem('token') !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/" element={
          <PrivateRoute>
            <DefaultLayout />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="diario" element={<Diario />} />
          <Route path="insights" element={<Insights />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="nutrients" element={<Nutrients />} />
          <Route path="training" element={<TrainingPlan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;