import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { movimentacaoService } from '../services/movimentacaoService'
import { categoriaService } from '../services/categoriaService'
import { tipoMovimentacaoService } from '../services/tipoMovimentacaoService'
import { usuarioService } from '../services/usuarioService.js'
import Modal from '../components/Modal'
import LoadingSpinner from '../components/LoadingSpinner'

const Movimentacoes = () => {
  const [movimentacoes, setMovimentacoes] = useState([])
  const [categorias, setCategorias] = useState([])
  const [tipos, setTipos] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMovimentacao, setEditingMovimentacao] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterCategoria, setFilterCategoria] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [movimentacoesRes, categoriasRes, tiposRes, usuariosRes] = await Promise.all([
        movimentacaoService.getAll(),
        categoriaService.getAll(),
        tipoMovimentacaoService.getAll(),
        usuarioService.getAll()
      ])
      
      setMovimentacoes(movimentacoesRes.data)
      setCategorias(categoriasRes.data)
      setTipos(tiposRes.data)
      setUsuarios(usuariosRes.data)
    } catch (error) {
      toast.error('Erro ao carregar dados')
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (movimentacao = null) => {
    setEditingMovimentacao(movimentacao)
    if (movimentacao) {
      const dataFormatted = format(new Date(movimentacao.data), 'yyyy-MM-dd')
      reset({
        descricao: movimentacao.descricao,
        valor: movimentacao.valor,
        data: dataFormatted,
        fixo: movimentacao.fixo,
        tipoMovimentacaoId: movimentacao.tipoMovimentacaoId,
        categoriaId: movimentacao.categoriaId,
        usuarioId: movimentacao.usuarioId
      })
    } else {
      reset({
        descricao: '',
        valor: '',
        data: format(new Date(), 'yyyy-MM-dd'),
        fixo: false,
        tipoMovimentacaoId: '',
        categoriaId: '',
        usuarioId: ''
      })
    }
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingMovimentacao(null)
    reset()
  }

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        valor: parseFloat(data.valor),
        data: new Date(data.data).toISOString(),
        tipoMovimentacaoId: parseInt(data.tipoMovimentacaoId),
        categoriaId: parseInt(data.categoriaId),
        usuarioId: parseInt(data.usuarioId)
      }

      if (editingMovimentacao) {
        await movimentacaoService.update(editingMovimentacao.id, payload)
        toast.success('Movimentação atualizada com sucesso!')
      } else {
        await movimentacaoService.create(payload)
        toast.success('Movimentação criada com sucesso!')
      }
      
      handleCloseModal()
      loadData()
    } catch (error) {
      toast.error('Erro ao salvar movimentação')
      console.error('Erro ao salvar movimentação:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta movimentação?')) {
      try {
        await movimentacaoService.delete(id)
        toast.success('Movimentação excluída com sucesso!')
        loadData()
      } catch (error) {
        toast.error('Erro ao excluir movimentação')
        console.error('Erro ao excluir movimentação:', error)
      }
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy')
  }

  const getNome = (array, id) => {
    const item = array.find(item => item.id === id)
    return item ? item.nome : 'N/A'
  }

  const filteredMovimentacoes = movimentacoes.filter(movimentacao => {
    const matchesSearch = movimentacao.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = !filterTipo || movimentacao.tipoMovimentacaoId === parseInt(filterTipo)
    const matchesCategoria = !filterCategoria || movimentacao.categoriaId === parseInt(filterCategoria)
    
    return matchesSearch && matchesTipo && matchesCategoria
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Movimentações</h1>
          <p className="text-gray-600">Gerencie suas receitas e despesas</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Movimentação
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar movimentações..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="input"
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
          >
            <option value="">Todos os tipos</option>
            {tipos.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nome}
              </option>
            ))}
          </select>
          
          <select
            className="input"
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
          >
            <option value="">Todas as categorias</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => {
              setSearchTerm('')
              setFilterTipo('')
              setFilterCategoria('')
            }}
            className="btn btn-secondary"
          >
            <Filter className="h-4 w-4 mr-2" />
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Data</th>
                <th>Tipo</th>
                <th>Categoria</th>
                <th>Usuário</th>
                <th>Fixo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMovimentacoes.map((movimentacao) => (
                <tr key={movimentacao.id} className="hover:bg-gray-50">
                  <td className="font-medium">{movimentacao.id}</td>
                  <td>{movimentacao.descricao}</td>
                  <td>
                    <span className={`font-semibold ${
                      movimentacao.tipoMovimentacao?.nome?.toLowerCase() === 'receita' 
                        ? 'text-success-600' 
                        : 'text-danger-600'
                    }`}>
                      {formatCurrency(movimentacao.valor)}
                    </span>
                  </td>
                  <td>{formatDate(movimentacao.data)}</td>
                  <td>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      movimentacao.tipoMovimentacao?.nome?.toLowerCase() === 'receita'
                        ? 'bg-success-100 text-success-800'
                        : 'bg-danger-100 text-danger-800'
                    }`}>
                      {movimentacao.tipoMovimentacao?.nome || 'N/A'}
                    </span>
                  </td>
                  <td>{movimentacao.categoria?.nome || 'N/A'}</td>
                  <td>{movimentacao.usuario?.nome || 'N/A'}</td>
                  <td>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      movimentacao.fixo
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {movimentacao.fixo ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenModal(movimentacao)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(movimentacao.id)}
                        className="text-danger-600 hover:text-danger-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredMovimentacoes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma movimentação encontrada
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingMovimentacao ? 'Editar Movimentação' : 'Nova Movimentação'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <input
                type="text"
                className="input"
                {...register('descricao', { required: 'Descrição é obrigatória' })}
              />
              {errors.descricao && (
                <p className="text-sm text-danger-600 mt-1">{errors.descricao.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor
              </label>
              <input
                type="number"
                step="0.01"
                className="input"
                {...register('valor', { 
                  required: 'Valor é obrigatório',
                  min: { value: 0.01, message: 'Valor deve ser maior que zero' }
                })}
              />
              {errors.valor && (
                <p className="text-sm text-danger-600 mt-1">{errors.valor.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data
              </label>
              <input
                type="date"
                className="input"
                {...register('data', { required: 'Data é obrigatória' })}
              />
              {errors.data && (
                <p className="text-sm text-danger-600 mt-1">{errors.data.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Movimentação
              </label>
              <select
                className="input"
                {...register('tipoMovimentacaoId', { required: 'Tipo é obrigatório' })}
              >
                <option value="">Selecione um tipo</option>
                {tipos.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nome}
                  </option>
                ))}
              </select>
              {errors.tipoMovimentacaoId && (
                <p className="text-sm text-danger-600 mt-1">{errors.tipoMovimentacaoId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                className="input"
                {...register('categoriaId', { required: 'Categoria é obrigatória' })}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
              {errors.categoriaId && (
                <p className="text-sm text-danger-600 mt-1">{errors.categoriaId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuário
              </label>
              <select
                className="input"
                {...register('usuarioId', { required: 'Usuário é obrigatório' })}
              >
                <option value="">Selecione um usuário</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nome}
                  </option>
                ))}
              </select>
              {errors.usuarioId && (
                <p className="text-sm text-danger-600 mt-1">{errors.usuarioId.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  {...register('fixo')}
                />
                <span className="ml-2 text-sm text-gray-700">Movimentação fixa</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {editingMovimentacao ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Movimentacoes