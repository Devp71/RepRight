"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Terminal } from "lucide-react"
import Link from "next/link"
import { getCurrentUser, logoutUser, getAccessToken, getStoredUser } from "@/lib/api"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      const token = getAccessToken()

      if (!token) {
        router.push("/auth/login")
        return
      }

      try {
        const data = await getCurrentUser()
        setUser(data.user)
      } catch (error) {
        // If API call fails, try stored user as fallback
        const storedUser = getStoredUser()
        if (storedUser) {
          setUser(storedUser)
        } else {
          router.push("/auth/login")
          return
        }
      } finally {
        setLoading(false)
      }
    }

    verifyAuth()
  }, [router])

  const handleLogout = async () => {
    await logoutUser()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border border-white border-t-transparent animate-spin mx-auto mb-6" />
          <p className="text-white font-mono text-xs tracking-widest uppercase">INITIALIZING SYSTEM...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Dashboard Header */}
      <nav className="bg-black border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <Terminal className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
            <h1 className="text-lg font-bold text-white font-mono tracking-[0.3em] uppercase">
              RepRight
            </h1>
          </Link>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-white font-mono text-xs tracking-widest uppercase">
                {user?.name || user?.email}
              </p>
              <p className="text-white/40 font-mono text-[9px] tracking-widest uppercase mt-0.5">
                [{user?.fitnessLevel || "BEGINNER"}]
              </p>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-transparent border border-white/30 text-white/70 hover:bg-white/10 hover:text-white rounded-none font-mono text-[10px] tracking-widest uppercase transition-colors h-9 px-4"
              size="sm"
            >
              <LogOut className="w-3.5 h-3.5 mr-2" />
              EXIT
            </Button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>{children}</main>
    </div>
  )
}
