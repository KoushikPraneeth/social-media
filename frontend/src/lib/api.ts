import axios from 'axios'
import type { ApiResponse, PaginatedResponse, AuthResponse } from '../types'

export const BASE_URL = 'http://localhost:8080'

export const api = axios.create({
  baseURL: BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const auth = {
  login: (username: string, password: string) => {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    return api.post<AuthResponse>('/auth/login', formData)
  },
  register: (username: string, email: string, password: string) => {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    return api.post<AuthResponse>('/auth/register', formData)
  },
}

export const posts = {
  getAll: (page = 1, limit = 10) => 
    api.get<PaginatedResponse<any>>('/api/posts', { params: { page, limit } }),
  create: (data: FormData) => 
    api.post('/api/posts', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getUserPosts: (userId: number, page = 1, limit = 10) => 
    api.get<PaginatedResponse<any>>(`/api/posts/user/${userId}`, { params: { page, limit } }),
  getHashtagPosts: (tag: string, page = 1, limit = 10) =>
    api.get<PaginatedResponse<any>>(`/api/posts/hashtag/${tag}`, { params: { page, limit } }),
  like: (postId: number) => api.post(`/api/posts/${postId}/like`),
  unlike: (postId: number) => api.delete(`/api/posts/${postId}/like`),
  addComment: (postId: number, content: string) =>
    api.post(`/api/posts/${postId}/comments`, { content }),
  getComments: (postId: number, page = 1, limit = 10) =>
    api.get(`/api/posts/${postId}/comments`, { params: { page, limit } }),
  share: (postId: number) =>
    api.post(`/api/posts/${postId}/share`),
}

export const trends = {
  getHashtags: () => api.get('/api/trends'),
  getTopPosts: () => api.get('/api/trends/posts'),
}

export const users = {
  getById: (userId: number) => api.get(`/api/users/${userId}`),
  getProfile: () => api.get('/api/users/me'),
  follow: (userId: number) => api.post(`/api/users/${userId}/follow`),
  unfollow: (userId: number) => api.post(`/api/users/${userId}/unfollow`),
  getFollowers: (userId: number, page = 1, limit = 10) =>
    api.get(`/api/users/${userId}/followers`, { params: { page, limit } }),
  getFollowing: (userId: number, page = 1, limit = 10) =>
    api.get(`/api/users/${userId}/following`, { params: { page, limit } }),
  updateProfile: (data: FormData) =>
    api.put('/api/users/me', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
}

export const notifications = {
  getAll: (page = 1, limit = 10) =>
    api.get('/api/notifications', { params: { page, limit } }),
  markAsRead: (notificationId: number) =>
    api.put(`/api/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/api/notifications/read-all'),
}
