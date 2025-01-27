import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { auth } from '../../lib/api'

interface AuthContextType {
  user: null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await auth.login(username, password)
      localStorage.setItem('token', response.data.data.token)
      setIsAuthenticated(true)
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
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
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
