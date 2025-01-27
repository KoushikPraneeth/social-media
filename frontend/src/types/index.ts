export interface User {
  id: number
  username: string
  email: string
  createdAt: string
  followersCount?: number
  followingCount?: number
  isFollowing?: boolean
}

export interface Post {
  id: number
  content: string
  imageUrl?: string
  timestamp: string
  user: User
  likesCount: number
  commentsCount: number
  shareCount: number
  isLiked: boolean
}

export interface Comment {
  id: number
  content: string
  createdAt: string
  user: User
  postId: number
}

export interface AuthResponse {
  token: string
  user: User
  message: string
}

export interface AuthRequest {
  username: string
  password: string
}

export interface RegisterRequest extends AuthRequest {
  email: string
}

export interface CreatePostRequest {
  content: string
  image?: File
}

export interface ApiError {
  message: string
  status: number
}

export interface Notification {
  id: number
  type: 'like' | 'follow' | 'comment'
  message: string
  read: boolean
  createdAt: string
  user: User
  post?: Post
}

export interface Hashtag {
  id: number
  name: string
  postsCount: number
}

export type ApiResponse<T> = {
  data: T
  message?: string
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
