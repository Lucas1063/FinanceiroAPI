import api from './api'

export const usuarioService = {
  getAll: () => api.get('/usuario'),
  getById: (id) => api.get(`/usuario/${id}`),
  create: (data) => api.post('/usuario', data),
  update: (id, data) => api.put(`/usuario/${id}`, data),
  delete: (id) => api.delete(`/usuario/${id}`),
}