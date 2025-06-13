import api from './api'

export const tipoMovimentacaoService = {
  getAll: () => api.get('/tipomovimentacao'),
  getById: (id) => api.get(`/tipomovimentacao/${id}`),
  create: (data) => api.post('/tipomovimentacao', data),
  update: (id, data) => api.put(`/tipomovimentacao/${id}`, data),
  delete: (id) => api.delete(`/tipomovimentacao/${id}`),
}