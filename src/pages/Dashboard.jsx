import React, { useState, useEffect } from 'react'
import { Tag, CreditCard, TrendingUp, TrendingDown } from 'lucide-react'
import { categoriaService } from '../services/categoriaService'
import { movimentacaoService } from '../services/movimentacaoService'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const [stats, setStats] = useState({
    categorias: 0,
    movimentacoes: 0,
    totalReceitas: 0,
    totalDespesas: 0,
    saldo: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentMovimentacoes, setRecentMovimentacoes] = useState([])
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      const [categoriasRes, movimentacoesRes] = await Promise.all([
        categoriaService.getAll(),
        movimentacaoService.getAll()
      ])

      const movimentacoes = movimentacoesRes.data
      const receitas = movimentacoes.filter(m => m.tipoMovimentacao?.nome?.toLowerCase() === 'receita')
      const despesas = movimentacoes.filter(m => m.tipoMovimentacao?.nome?.toLowerCase() === 'despesa')
      
      const totalReceitas = receitas.reduce((sum, m) => sum + m.valor, 0)
      const totalDespesas = despesas.reduce((sum, m) => sum + m.valor, 0)

      setStats({
        categorias: categoriasRes.data.length,
        movimentacoes: movimentacoes.length,
        totalReceitas,
        totalDespesas,
        saldo: totalReceitas - totalDespesas
      })

      // Get recent movimentacoes (last 5)
      const recent = movimentacoes
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .slice(0, 5)
      setRecentMovimentacoes(recent)

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {currentUser?.nome || 'Usuário'}! 👋
        </h1>
        <p className="text-gray-600">Aqui está um resumo das suas finanças</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Tag className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categorias</p>
              <p className="text-2xl font-bold text-gray-900">{stats.categorias}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Movimentações</p>
              <p className="text-2xl font-bold text-gray-900">{stats.movimentacoes}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Receitas</p>
              <p className="text-2xl font-bold text-success-600">{formatCurrency(stats.totalReceitas)}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${stats.saldo >= 0 ? 'bg-success-100' : 'bg-danger-100'}`}>
              {stats.saldo >= 0 ? (
                <TrendingUp className="h-6 w-6 text-success-600" />
              ) : (
                <TrendingDown className="h-6 w-6 text-danger-600" />
              )}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Saldo</p>
              <p className={`text-2xl font-bold ${stats.saldo >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {formatCurrency(stats.saldo)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total de Receitas</span>
              <span className="text-lg font-semibold text-success-600">
                {formatCurrency(stats.totalReceitas)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total de Despesas</span>
              <span className="text-lg font-semibold text-danger-600">
                {formatCurrency(stats.totalDespesas)}
              </span>
            </div>
            <hr />
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-medium">Saldo Final</span>
              <span className={`text-xl font-bold ${stats.saldo >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {formatCurrency(stats.saldo)}
              </span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Movimentações Recentes</h3>
          <div className="space-y-3">
            {recentMovimentacoes.length > 0 ? (
              recentMovimentacoes.map((movimentacao) => (
                <div key={movimentacao.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{movimentacao.descricao}</p>
                    <p className="text-sm text-gray-500">
                      {movimentacao.categoria?.nome} • {formatDate(movimentacao.data)}
                    </p>
                  </div>
                  <span className={`font-semibold ${
                    movimentacao.tipoMovimentacao?.nome?.toLowerCase() === 'receita' 
                      ? 'text-success-600' 
                      : 'text-danger-600'
                  }`}>
                    {movimentacao.tipoMovimentacao?.nome?.toLowerCase() === 'receita' ? '+' : '-'}
                    {formatCurrency(movimentacao.valor)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma movimentação encontrada</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard