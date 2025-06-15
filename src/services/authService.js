import api from './api'

export const authService = {
  login: (credentials) => {
    // Since you're handling C# authentication externally,
    // this is a placeholder that you can replace with your actual auth logic
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email && credentials.password) {
          resolve({
            user: {
              id: 1,
              nome: credentials.email.split('@')[0],
              email: credentials.email
            },
            token: 'fake-jwt-token-' + Date.now()
          })
        } else {
          reject(new Error('Invalid credentials'))
        }
      }, 1000)
    })
  },

  register: (userData) => {
    // Placeholder for registration - replace with your actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userData.nome && userData.email && userData.senhaHash) {
          resolve({
            message: 'User created successfully'
          })
        } else {
          reject(new Error('Invalid user data'))
        }
      }, 1000)
    })
  },

  logout: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser')
    return user ? JSON.parse(user) : null
  },

  getToken: () => {
    return localStorage.getItem('authToken')
  }
}