"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  username: string
  isAdmin: boolean
} | null

type AuthContextType = {
  user: User
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  allowPublicUploads: boolean
  setAllowPublicUploads: (allow: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// In a real app, you would store this securely on the server
// This is just for demonstration purposes
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "password123",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [allowPublicUploads, setAllowPublicUploads] = useState(false)

  // Load user and settings from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("galleryUser")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
      }
    }

    const storedSettings = localStorage.getItem("gallerySettings")
    if (storedSettings) {
      try {
        const settings = JSON.parse(storedSettings)
        setAllowPublicUploads(settings.allowPublicUploads)
      } catch (error) {
        console.error("Error parsing stored settings:", error)
      }
    }
  }, [])

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("gallerySettings", JSON.stringify({ allowPublicUploads }))
  }, [allowPublicUploads])

  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, you would validate credentials against a database
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const newUser = { username, isAdmin: true }
      setUser(newUser)
      localStorage.setItem("galleryUser", JSON.stringify(newUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("galleryUser")
  }

  const updateAllowPublicUploads = (allow: boolean) => {
    setAllowPublicUploads(allow)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        allowPublicUploads,
        setAllowPublicUploads: updateAllowPublicUploads,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

