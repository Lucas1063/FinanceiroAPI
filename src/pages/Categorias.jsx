import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { categoriaService } from '../services/categoriaService'
import { usuarioService } from '../services/usuarioService'
import Modal from '../components/Modal'
import LoadingSpinner from '../components/LoadingSpinner'

const Categorias = () => {
  const [categorias, setCategorias] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [categoriasRes, usuariosRes] = await Promise.all([
        categoriaService.getAll(),
        usuarioService.getAll()
      ])
      setCategorias(categoriasRes.data)
      setUsuarios(usuariosRes.data)
    } catch (error) {
      toast.error('Erro ao carregar dados')
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (categoria = null) => {
    setEditingCategoria(categoria)
    if (categoria) {
      reset({
        nome: categoria.nome,
        usuarioId: categoria.usuarioId || ''
      })
    } else {
      reset({
        nome: '',
        usuarioId: ''
      })
    }
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingCategoria(null)
    reset()
  }

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        usuarioId: data.usuarioId ? parseInt(data.usuarioId) : 0
      }

      if (editingCategoria) {
        await categoriaService.update(editingCategoria.id, payload)
        toast.success('Categoria atualizada com sucesso!')
      } else {
        await categoriaService.create(payload)
        toast.success('Categoria criada com sucesso!')
      }
      
      handleCloseModal()
      loadData()
    } catch (error) {
      toast.error('Erro ao salvar categoria')
      console.error('Erro ao salvar categoria:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await categoriaService.delete(id)
        toast.success('Categoria excluída com sucesso!')
        loadData()
      } catch (error) {
        toast.error('Erro ao excluir categoria')
        console.error('Erro ao excluir categoria:', error)
      }
    }
  }

  const getUsuarioNome = (usuarioId) => {
    const usuario = usuarios.find(u => u.id === usuarioId)
    return usuario ? usuario.nome : 'N/A'
  }

  const filteredCategorias = categorias.filter(categoria =>
    categoria.nome?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-600">Gerencie as categorias de movimentação</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </button>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar categorias..."
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
                <th>Usuário</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategorias.map((categoria) => (
                <tr key={categoria.id} className="hover:bg-gray-50">
                  <td className="font-medium">{categoria.id}</td>
                  <td>{categoria.nome}</td>
                  <td>{getUsuarioNome(categoria.usuarioId)}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenModal(categoria)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(categoria.id)}
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
          
          {filteredCategorias.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma categoria encontrada
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingCategoria ? 'Editar Categoria' : 'Nova Categoria'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              className="input"
              {...register('nome', { required: 'Nome é obrigatório' })}
            />
            {errors.nome && (
              <p className="text-sm text-danger-600 mt-1">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuário
            </label>
            <select
              className="input"
              {...register('usuarioId')}
            >
              <option value="">Selecione um usuário</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nome}
                </option>
              ))}
            </select>
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
              {editingCategoria ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Categorias