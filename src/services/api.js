import axios from 'axios';

const API = axios.create({
  // Your provided Render backend URL
  baseURL: 'https://bricks-backend-7wnv.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});

export const userAPI = {
  // Get all users
  getAll: () => API.get('/users'),
  // Get departments for the dropdown
  getDepartments: () => API.get('/departments'),
  // Create new user (includes email)
  create: (userData) => API.post('/users', userData),
  // Update existing user
  update: (id, userData) => API.put(`/users/${id}`, userData),
  // Delete user
  delete: (id) => API.delete(`/users/${id}`),
};

export default API;