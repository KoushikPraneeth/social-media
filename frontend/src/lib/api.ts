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
  getAll: (page = 0, limit = 10) => 
    api.get<PaginatedResponse<any>>('/api/posts', { params: { page, limit } }),
  create: (data: FormData) => 
    api.post('/api/posts', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getUserPosts: (username: string, page = 0, limit = 10) => 
    api.get<PaginatedResponse<any>>(`/api/posts/user/${username}`, { params: { page, limit } }),
  getHashtagPosts: (tag: string, page = 0, limit = 10) =>
    api.get<PaginatedResponse<any>>(`/api/posts/hashtag/${tag}`, { params: { page, limit } }),
  like: (postId: number) => api.post(`/api/posts/${postId}/like`),
  unlike: (postId: number) => api.delete(`/api/posts/${postId}/like`),
  addComment: (postId: number, content: string) =>
    api.post(`/api/posts/${postId}/comments`, { content }),
  getComments: (postId: number, page = 0, limit = 10) =>
    api.get<PaginatedResponse<any>>(`/api/posts/${postId}/comments`, { 
      params: { 
        page,
        limit 
      }
    }),
  share: (postId: number) =>
    api.post(`/api/posts/${postId}/share`),
}

export const trends = {
  getHashtags: () => api.get('/api/trends'),
  getTopPosts: () => api.get('/api/trends/posts'),
}

export const users = {
  getById: (username: string) => api.get(`/api/users/${username}`),
  getProfile: () => api.get('/api/users/me'),
  follow: (username: string) => api.post(`/api/users/${username}/follow`),
  unfollow: (username: string) => api.post(`/api/users/${username}/unfollow`),
  getFollowers: (username: string, page = 0, limit = 10) =>
    api.get(`/api/users/${username}/followers`, { params: { page, limit } }),
  getFollowing: (username: string, page = 0, limit = 10) =>
    api.get(`/api/users/${username}/following`, { params: { page, limit } }),
  updateProfile: (data: FormData) =>
    api.put('/api/users/me', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
}

export const notifications = {
  getAll: (page = 0, limit = 10) =>
    api.get('/api/notifications', { params: { page, limit } }),
  markAsRead: (notificationId: number) =>
    api.put(`/api/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/api/notifications/read-all'),
}
