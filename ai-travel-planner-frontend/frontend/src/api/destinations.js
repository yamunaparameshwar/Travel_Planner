import api from './axios'

export const destinationService = {
  list: (params) => api.get('/destinations/', { params }),
  get: (id) => api.get(`/destinations/${id}/`),
  create: (payload) => api.post('/destinations/', payload),
  update: (id, payload) => api.put(`/destinations/${id}/`, payload),
  remove: (id) => api.delete(`/destinations/${id}/`),
}
