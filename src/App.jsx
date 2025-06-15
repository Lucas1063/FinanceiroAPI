import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Categorias from './pages/Categorias'
import TipoMovimentacoes from './pages/TipoMovimentacoes'
import Movimentacoes from './pages/Movimentacoes'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in (check localStorage or token)
    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('currentUser')
    
    if (token && user) {
      setIsAuthenticated(true)
    }
    
    setLoading(false)
  }, [])

  const handleLogin = (userData, token) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('currentUser', JSON.stringify(userData))
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    setIsAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-primary-600"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {!isAuthenticated ? (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <Layout onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/tipos-movimentacao" element={<TipoMovimentacoes />} />
              <Route path="/movimentacoes" element={<Movimentacoes />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        )}
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