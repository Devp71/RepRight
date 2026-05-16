"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff, Terminal } from "lucide-react"
import { signupUser } from "@/lib/api"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    fitnessLevel: "beginner",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("ALL FIELDS REQUIRED")
        setLoading(false)
        return
      }

      if (!formData.email.includes("@")) {
        setError("INVALID EMAIL FORMAT")
        setLoading(false)
        return
      }

      if (formData.password.length < 6) {
        setError("PASSPHRASE MIN 6 CHARACTERS")
        setLoading(false)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError("PASSPHRASE MISMATCH")
        setLoading(false)
        return
      }

      await signupUser(
        formData.name,
        formData.email,
        formData.password,
        formData.fitnessLevel
      )

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "REGISTRATION FAILED. RETRY.")
      setLoading(false)
    }
  }

  const fitnessLevels = [
    { value: "beginner", label: "BEGINNER" },
    { value: "intermediate", label: "INTERMEDIATE" },
    { value: "advanced", label: "ADVANCED" },
  ]

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8 relative overflow-hidden">
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

      {/* Scan lines */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.5)_2px,rgba(255,255,255,0.5)_4px)]" />

      {/* Signup Card */}
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
        <div className="text-center mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center justify-center gap-2 mb-3 opacity-50">
            <div className="w-8 h-px bg-white" />
            <span className="text-white text-[9px] font-mono tracking-widest">REG.MODULE</span>
            <div className="w-8 h-px bg-white" />
          </div>
          <h2 className="text-xl font-bold text-white font-mono tracking-widest uppercase">CREATE ACCESS</h2>
          <p className="text-white/40 mt-2 font-mono text-[10px] tracking-widest uppercase">INITIALIZE NEW OPERATOR PROFILE</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-black border border-white/40 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-white" />
            <p className="text-white font-mono text-xs tracking-widest uppercase pl-3">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-white/50 mb-2 uppercase">Operator Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="FULL NAME"
              className="w-full px-4 py-3 bg-black border border-white/20 text-white font-mono text-sm placeholder-white/15 focus:outline-none focus:border-white transition-colors rounded-none tracking-wide"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-white/50 mb-2 uppercase">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="OPERATOR@REPRIGHT.SYS"
              className="w-full px-4 py-3 bg-black border border-white/20 text-white font-mono text-sm placeholder-white/15 focus:outline-none focus:border-white transition-colors rounded-none tracking-wide"
            />
          </div>

          {/* Fitness Level */}
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-white/50 mb-3 uppercase">Baseline Capability</label>
            <div className="grid grid-cols-3 gap-3">
              {fitnessLevels.map((level) => (
                <label key={level.value} className="relative flex items-center justify-center cursor-pointer group">
                  <input
                    type="radio"
                    name="fitnessLevel"
                    value={level.value}
                    checked={formData.fitnessLevel === level.value}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="w-full border border-white/20 bg-transparent text-white/50 py-2.5 font-mono text-[10px] uppercase tracking-widest text-center peer-checked:bg-white peer-checked:text-black peer-checked:border-white transition-all duration-200 group-hover:border-white/50">
                    {level.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-white/50 mb-2 uppercase">Passphrase</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="MIN 6 CHARACTERS"
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

          {/* Confirm Password Field */}
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-white/50 mb-2 uppercase">Confirm Passphrase</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="RE-ENTER PASSPHRASE"
                className="w-full px-4 py-3 bg-black border border-white/20 text-white font-mono text-sm placeholder-white/15 focus:outline-none focus:border-white transition-colors rounded-none tracking-widest pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-white/30 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Signup Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-gray-200 h-14 font-mono text-xs tracking-[0.3em] uppercase transition-colors rounded-none border border-white disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <div className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin" />
                INITIALIZING...
              </span>
            ) : (
              "CREATE OPERATOR"
            )}
          </Button>
        </form>

        {/* Sign In Link */}
        <p className="text-center text-white/40 mt-8 font-mono text-[10px] tracking-widest uppercase">
          EXISTING OPERATOR?{" "}
          <Link href="/auth/login" className="text-white hover:text-white/80 font-bold transition-colors border-b border-white/40 hover:border-white pb-0.5">
            AUTHENTICATE
          </Link>
        </p>

        {/* Status bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
          <span className="text-[8px] font-mono text-white/20 tracking-widest uppercase">REPRIGHT.REG.v1.0</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white/60 animate-pulse" />
            <span className="text-[8px] font-mono text-white/20 tracking-widest uppercase">ENCRYPTED</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
