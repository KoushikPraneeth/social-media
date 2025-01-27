import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/auth/AuthContext'
import { useTheme } from '../../contexts/theme/ThemeContext'
import { Button } from '../ui/button'
import { Moon, Sun, LogOut } from 'lucide-react'

export function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold">Social Media</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            {isAuthenticated && (
              <>
                <Link to="/create">
                  <Button variant="outline">Create Post</Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {!isAuthenticated && (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
