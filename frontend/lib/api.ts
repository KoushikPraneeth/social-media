import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),
};

export const posts = {
  getAll: () => api.get('/api/posts'),
  create: (data: FormData) => 
    api.post('/api/posts', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getUserPosts: (userId: number) => api.get(`/api/posts/user/${userId}`),
};

export const trends = {
  getHashtags: () => api.get('/api/trends'),
};

export const users = {
  follow: (userId: number) => api.post(`/api/users/${userId}/follow`),
  unfollow: (userId: number) => api.post(`/api/users/${userId}/unfollow`),
};
