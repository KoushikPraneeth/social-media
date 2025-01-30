import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/auth/AuthContext'
import { ThemeProvider } from './providers/theme-provider'
import { ToastContextProvider } from './contexts/ToastContext'
import { Login } from './components/auth/Login'
import { Register } from './components/auth/Register'
import { ProtectedRoute, PublicOnlyRoute } from './components/shared/ProtectedRoute'
import { Home } from './components/layout/Home'
import { UserProfile } from './components/layout/UserProfile'
import { HashtagView } from './components/layout/HashtagView'
import { Layout } from './components/layout/Layout'
import { TrendingTags } from './components/layout/TrendingTags'
import { ErrorBoundary } from './components/shared/ErrorBoundary'

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
      <div>{children}</div>
      <div className="hidden md:block w-80 space-y-6">
        <TrendingTags />
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ToastContextProvider>
        <AuthProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/login" element={
                  <PublicOnlyRoute>
                    <Login />
                  </PublicOnlyRoute>
                } />
                <Route path="/register" element={
                  <PublicOnlyRoute>
                    <Register />
                  </PublicOnlyRoute>
                } />
                <Route path="/" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Home />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/user/:username" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <UserProfile />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/hashtag/:tag" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <HashtagView />
                    </MainLayout>
                  </ProtectedRoute>
                } />
              </Routes>
            </Layout>
          </BrowserRouter>
        </AuthProvider>
      </ToastContextProvider>
    </ErrorBoundary>
  )
}

export default App
