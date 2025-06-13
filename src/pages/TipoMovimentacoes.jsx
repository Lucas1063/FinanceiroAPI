import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { tipoMovimentacaoService } from '../services/tipoMovimentacaoService'
import Modal from '../components/Modal'
import LoadingSpinner from '../components/LoadingSpinner'

const TipoMovimentacoes = () => {
  const [tipos, setTipos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTipo, setEditingTipo] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    loadTipos()
  }, [])

  const loadTipos = async () => {
    try {
      setLoading(true)
      const response = await tipoMovimentacaoService.getAll()
      setTipos(response.data)
    } catch (error) {
      toast.error('Erro ao carregar tipos de movimentação')
      console.error('Erro ao carregar tipos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (tipo = null) => {
    setEditingTipo(tipo)
    if (tipo) {
      reset({
        nome: tipo.nome
      })
    } else {
      reset({
        nome: ''
      })
    }
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingTipo(null)
    reset()
  }

  const onSubmit = async (data) => {
    try {
      if (editingTipo) {
        await tipoMovimentacaoService.update(editingTipo.id, data)
        toast.success('Tipo de movimentação atualizado com sucesso!')
      } else {
        await tipoMovimentacaoService.create(data)
        toast.success('Tipo de movimentação criado com sucesso!')
      }
      
      handleCloseModal()
      loadTipos()
    } catch (error) {
      toast.error('Erro ao salvar tipo de movimentação')
      console.error('Erro ao salvar tipo:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este tipo de movimentação?')) {
      try {
        await tipoMovimentacaoService.delete(id)
        toast.success('Tipo de movimentação excluído com sucesso!')
        loadTipos()
      } catch (error) {
        toast.error('Erro ao excluir tipo de movimentação')
        console.error('Erro ao excluir tipo:', error)
      }
    }
  }

  const filteredTipos = tipos.filter(tipo =>
    tipo.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-2xl font-bold text-gray-900">Tipos de Movimentação</h1>
          <p className="text-gray-600">Gerencie os tipos de movimentação (Receita, Despesa, etc.)</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Tipo
        </button>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar tipos..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTipos.map((tipo) => (
                <tr key={tipo.id} className="hover:bg-gray-50">
                  <td className="font-medium">{tipo.id}</td>
                  <td>{tipo.nome}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenModal(tipo)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tipo.id)}
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
          
          {filteredTipos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum tipo de movimentação encontrado
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingTipo ? 'Editar Tipo de Movimentação' : 'Novo Tipo de Movimentação'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              className="input"
              placeholder="Ex: Receita, Despesa"
              {...register('nome', { required: 'Nome é obrigatório' })}
            />
            {errors.nome && (
              <p className="text-sm text-danger-600 mt-1">{errors.nome.message}</p>
            )}
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
              {editingTipo ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default TipoMovimentacoes