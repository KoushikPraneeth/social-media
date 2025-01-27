export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface Post {
  id: number;
  content: string;
  imageUrl?: string;
  createdAt: string;
  user: User;
  likes: number;
}

export interface AuthResponse {
  token: string;
  username: string;
  message: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreatePostRequest {
  content: string;
  image?: File;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface Notification {
  id: number;
  type: 'like' | 'follow' | 'comment';
  message: string;
  read: boolean;
  createdAt: string;
  user: User;
}

export interface WebSocketMessage {
  type: string;
  payload: any;
}
