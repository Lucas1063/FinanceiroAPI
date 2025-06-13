import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Usuarios from './pages/Usuarios'
import Categorias from './pages/Categorias'
import TipoMovimentacoes from './pages/TipoMovimentacoes'
import Movimentacoes from './pages/Movimentacoes'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/tipos-movimentacao" element={<TipoMovimentacoes />} />
            <Route path="/movimentacoes" element={<Movimentacoes />} />
          </Routes>
        </Layout>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App