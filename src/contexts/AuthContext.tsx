'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, signUp, signIn, getCurrentUser, signOut } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (username: string, nickname: string, password: string) => Promise<void>
  signIn: (username: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    // 초기 사용자 상태 확인
    const initializeAuth = async () => {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const handleSignUp = async (username: string, nickname: string, password: string) => {
    try {
      setLoading(true)
      console.log('AuthContext: Starting signup process')
      
      const userData = await signUp(username, nickname, password)
      console.log('AuthContext: Signup successful', userData)
      
      // 로그인 상태로 설정
      setUser(userData)
      localStorage.setItem('pokeapple_user', JSON.stringify(userData))
    } catch (error: unknown) {
      console.error('AuthContext signup error:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (username: string, password: string) => {
    try {
      setLoading(true)
      const userData = await signIn(username, password)
      
      setUser(userData)
      localStorage.setItem('pokeapple_user', JSON.stringify(userData))
    } catch (error) {
      console.error('Sign in error in context:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      console.log('AuthContext: Starting signout process')
      
      await signOut()
      console.log('AuthContext: Signout successful')
      
      setUser(null)
    } catch (error) {
      console.error('AuthContext signout error:', error)
      // Even if signout fails, clear local state
      setUser(null)
      localStorage.removeItem('pokeapple_user')
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
} 