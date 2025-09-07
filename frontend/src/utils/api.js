import axios from 'axios';

const api = axios.create({
  baseURL: `${__API_BASE__}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepts every request to inject the auth token if it exists.
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
