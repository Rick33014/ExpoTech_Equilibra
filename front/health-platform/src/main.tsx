import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // Importação padrão (sem chaves)
import './index.css'    // Seus estilos do Tailwind

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)