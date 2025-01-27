import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/auth/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Get success message from registration if any
    const state = location.state as { message?: string; from?: { pathname: string } }
    if (state?.message) {
      setSuccessMessage(state.message)
    }
  }, [location])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login(username, password)
      // Redirect to the protected page they tried to visit or home
      const state = location.state as { from?: { pathname: string } }
      navigate(state?.from?.pathname || '/')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit">Login</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
