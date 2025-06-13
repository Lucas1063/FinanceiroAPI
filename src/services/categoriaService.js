import api from './api'

export const categoriaService = {
  getAll: () => api.get('/categoria'),
  getById: (id) => api.get(`/categoria/${id}`),
  create: (data) => api.post('/categoria', data),
  update: (id, data) => api.put(`/categoria/${id}`, data),
  delete: (id) => api.delete(`/categoria/${id}`),
}