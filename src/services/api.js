import axios from 'axios';

const API = axios.create({
  baseURL: 'https://bricks-backend-7wnv.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});

export const userAPI = {
  // Get all users
  getAll: () => API.get('/users'),

  // Search/Filter users (matches your Query button logic)
  query: (params) => API.get('/users/search', { params }),

  // Get departments to populate the dropdown in the User form
  getDepartments: () => API.get('/departments'),

  // Create new user (includes email, userId, etc.)
  create: (userData) => API.post('/users', userData),

  // Update existing user
  update: (id, userData) => API.put(`/users/${id}`, userData),

  // Delete single user
  delete: (id) => API.delete(`/users/${id}`),

  // Delete multiple users (matches your "Delete in batches" button)
  batchDelete: (ids) => API.post('/users/batch-delete', { ids })
};

export default API;