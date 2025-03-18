"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

type AuthContextType = {
  isAuthenticated: boolean
  isAdmin: boolean
  user: any
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  allowPublicUploads: boolean
  setAllowPublicUploads: (allow: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [allowPublicUploads, setAllowPublicUploads] = useState(false)
  const router = useRouter()

  // Load settings from API on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings")
        if (response.ok) {
          const settings = await response.json()
          setAllowPublicUploads(settings.allowPublicUploads)
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }

    fetchSettings()
  }, [])

  // Save settings to API when they change
  const updateAllowPublicUploads = async (allow: boolean) => {
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ allowPublicUploads: allow }),
      })

      if (response.ok) {
        setAllowPublicUploads(allow)
      }
    } catch (error) {
      console.error("Error updating settings:", error)
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      return result?.ok || false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: status === "authenticated",
        isAdmin: session?.user?.isAdmin || false,
        user: session?.user || null,
        login,
        logout,
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

