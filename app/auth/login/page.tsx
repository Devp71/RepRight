"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff, Terminal } from "lucide-react"
import { loginUser } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!email || !password) {
        setError("ALL FIELDS REQUIRED")
        setLoading(false)
        return
      }

      await loginUser(email, password)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "AUTHENTICATION FAILED. RETRY.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Scan line effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.5)_2px,rgba(255,255,255,0.5)_4px)]" />

      {/* Login Card */}
      <Card className="w-full max-w-md bg-black border border-white/20 p-8 relative z-10 rounded-none">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/50" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/50" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/50" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/50" />

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <Terminal className="w-6 h-6 text-white/60" />
          <h1 className="text-2xl font-bold text-white font-mono tracking-[0.3em] uppercase">
            RepRight
          </h1>
        </div>

        {/* Header */}
        <div className="text-center mb-10 border-b border-white/10 pb-6">
          <div className="flex items-center justify-center gap-2 mb-3 opacity-50">
            <div className="w-8 h-px bg-white" />
            <span className="text-white text-[9px] font-mono tracking-widest">AUTH.MODULE</span>
            <div className="w-8 h-px bg-white" />
          </div>
          <h2 className="text-xl font-bold text-white font-mono tracking-widest uppercase">SYSTEM LOGIN</h2>
          <p className="text-white/40 mt-2 font-mono text-[10px] tracking-widest uppercase">ENTER CREDENTIALS TO ACCESS TERMINAL</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-black border border-white/40 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-white" />
            <p className="text-white font-mono text-xs tracking-widest uppercase pl-3">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-white/50 mb-2 uppercase">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="OPERATOR@REPRIGHT.SYS"
              className="w-full px-4 py-3 bg-black border border-white/20 text-white font-mono text-sm placeholder-white/15 focus:outline-none focus:border-white transition-colors rounded-none tracking-wide"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-white/50 mb-2 uppercase">
              Passphrase
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full px-4 py-3 bg-black border border-white/20 text-white font-mono text-sm placeholder-white/15 focus:outline-none focus:border-white transition-colors rounded-none tracking-widest pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-white/30 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-gray-200 h-14 font-mono text-xs tracking-[0.3em] uppercase transition-colors rounded-none border border-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <div className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin" />
                AUTHENTICATING...
              </span>
            ) : (
              "INITIATE SESSION"
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[9px] text-white/30 font-mono tracking-widest">OR</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Demo Login */}
        <Button
          type="button"
          onClick={() => {
            setEmail("demo@repright.com")
            setPassword("password")
          }}
          className="w-full bg-transparent border border-white/30 text-white/70 hover:bg-white/10 hover:text-white font-mono text-[10px] tracking-widest uppercase rounded-none h-12 transition-colors"
        >
          LOAD DEMO CREDENTIALS
        </Button>

        {/* Sign Up Link */}
        <p className="text-center text-white/40 mt-8 font-mono text-[10px] tracking-widest uppercase">
          NO ACCOUNT?{" "}
          <Link href="/auth/signup" className="text-white hover:text-white/80 font-bold transition-colors border-b border-white/40 hover:border-white pb-0.5">
            CREATE ACCESS
          </Link>
        </p>

        {/* Status bar */}
        <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center">
          <span className="text-[8px] font-mono text-white/20 tracking-widest uppercase">REPRIGHT.AUTH.v1.0</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white/60 animate-pulse" />
            <span className="text-[8px] font-mono text-white/20 tracking-widest uppercase">SECURE</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
