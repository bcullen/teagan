"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { GalleryProvider } from "@/lib/gallery-context-db"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider>
          <GalleryProvider>{children}</GalleryProvider>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}

