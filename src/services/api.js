import axios from 'axios';

const API = axios.create({
  // Ensure no trailing slash here to avoid 404s with double slashes
  baseURL: 'https://bricks-backend-7wnv.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});

export const userAPI = {
  // 1. Get all users
  getAll: () => API.get('/users'),

  // 2. Search/Filter users (Used by the "Query" button)
  // This sends params like ?userId=101&dept=4444
  query: (params) => API.get('/users/search', { params }),

  // 3. Get departments (Populates your dropdown with "4444", etc.)
  getDepartments: () => API.get('/departments'),

  // 4. Create new user
  create: (userData) => API.post('/users', userData),

  // 5. Update existing user (Uses the MongoDB _id)
  update: (id, userData) => API.put(`/users/${id}`, userData),

  // 6. Delete single user
  delete: (id) => API.delete(`/users/${id}`),

  // 7. Delete multiple users (Batch Delete)
  // Note: We use POST because some firewalls block DELETE requests with a Body
  batchDelete: (ids) => API.post('/users/batch-delete', { ids })
};

export default API;