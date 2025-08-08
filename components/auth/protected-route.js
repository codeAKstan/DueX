"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function ProtectedRoute({ children, requiredRole = null }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Wait a bit for localStorage to be available after page load
    const timer = setTimeout(() => {
      checkAuthentication()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (!token || !userData) {
        redirectToLogin()
        return
      }

      const parsedUser = JSON.parse(userData)
      
      // Verify token is still valid by making a test API call
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        // Token is invalid
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        redirectToLogin()
        return
      }

      // Check role-based access
      if (requiredRole && parsedUser.role !== requiredRole) {
        toast.error('Access denied: Insufficient permissions')
        router.push('/login')
        return
      }

      setUser(parsedUser)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Authentication check failed:', error)
      redirectToLogin()
    } finally {
      setIsLoading(false)
    }
  }

  const redirectToLogin = () => {
    toast.error('Please sign in to access this page')
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return children
}