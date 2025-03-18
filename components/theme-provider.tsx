"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useEffect } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Apply saved color theme on mount
  useEffect(() => {
    const savedColorTheme = localStorage.getItem("color-theme")
    if (savedColorTheme) {
      document.documentElement.classList.add(`theme-${savedColorTheme}`)
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

