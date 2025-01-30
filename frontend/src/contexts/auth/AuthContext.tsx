import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { auth } from '../../lib/api'

interface AuthContextType {
  username: string | null
  userId: number | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUsername = localStorage.getItem('username')
    const storedUserId = localStorage.getItem('userId')
    if (token && storedUsername && storedUserId) {
      setIsAuthenticated(true)
      setUsername(storedUsername)
      setUserId(parseInt(storedUserId))
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await auth.login(username, password)
      if (response.data && response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('username', response.data.user.username)
        localStorage.setItem('userId', response.data.user.id.toString())
        setUsername(response.data.user.username)
        setUserId(response.data.user.id)
        setIsAuthenticated(true)
      } else {
        throw new Error('No token received from server')
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      await auth.register(username, email, password)
      // Don't automatically authenticate after registration
      return { success: true, message: 'Registration successful! Please log in.' }
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('userId')
    setUsername(null)
    setUserId(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ username, userId, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
