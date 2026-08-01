import api from './axios'

export const tripService = {
  list: (params) => api.get('/trips/', { params }),
  get: (id) => api.get(`/trips/${id}/`),
  create: (payload) => api.post('/trips/', payload),
  update: (id, payload) => api.put(`/trips/${id}/`, payload),
  remove: (id) => api.delete(`/trips/${id}/`),
  duplicate: (id) => api.post(`/trips/${id}/duplicate/`),
  archive: (id) => api.post(`/trips/${id}/archive/`),
}

export const budgetService = {
  calculate: (payload) => api.post('/calculate-budget/', payload),
}

export const itineraryService = {
  generate: (payload) => api.post('/generate-itinerary/', payload),
}

export const favoriteService = {
  list: () => api.get('/favorites/'),
  add: (destinationId) => api.post('/favorites/', { destination: destinationId }),
  remove: (id) => api.delete(`/favorites/${id}/`),
}

export const reviewService = {
  list: (params) => api.get('/reviews/', { params }),
  create: (payload) => api.post('/reviews/', payload),
}

export const contactService = {
  send: (payload) => api.post('/contact/', payload),
}
