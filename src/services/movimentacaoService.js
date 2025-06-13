import api from './api'

export const movimentacaoService = {
  getAll: () => api.get('/movimentacao'),
  getById: (id) => api.get(`/movimentacao/${id}`),
  create: (data) => api.post('/movimentacao', data),
  update: (id, data) => api.put(`/movimentacao/${id}`, data),
  delete: (id) => api.delete(`/movimentacao/${id}`),
}