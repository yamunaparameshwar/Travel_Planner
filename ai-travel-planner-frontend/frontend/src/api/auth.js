import api from './axios'

export const authService = {
  register: (payload) => api.post('/register/', payload),
  login: (payload) => api.post('/login/', payload),
  logout: (refresh) => api.post('/logout/', { refresh }),
  refreshToken: (refresh) => api.post('/token/refresh/', { refresh }),
  forgotPassword: (email) => api.post('/password/forgot/', { email }),
  resetPassword: (payload) => api.post('/password/reset/', payload),
  getProfile: () => api.get('/profile/'),
  updateProfile: (payload) => api.put('/profile/', payload),
  changePassword: (payload) => api.post('/profile/change-password/', payload),
}
