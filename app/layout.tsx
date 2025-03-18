import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { GalleryProvider } from "@/lib/gallery-context"
import { AuthProvider } from "@/lib/auth-context"
import ThemeSwitcher from "@/components/theme-switcher"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Competition Gallery",
  description: "A gallery of dance competitions and performances",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <GalleryProvider>
              <div className="fixed top-4 right-4 z-50">
                <ThemeSwitcher />
              </div>
              {children}
            </GalleryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'