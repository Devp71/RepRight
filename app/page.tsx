"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ArrowRight, Zap, BarChart3, Mic2, Target, Brain, Home as HomeIcon, User, Settings, Search, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { HeroAscii } from "@/components/ui/hero-ascii"
import { Dock } from "@/components/ui/dock-two"

export default function Home() {
  const router = useRouter()

  const dockItems = [
    { icon: HomeIcon, label: "Home", onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { icon: Brain, label: "AI Plans", onClick: () => router.push("/dashboard/plans") },
    { icon: Target, label: "Form Check", onClick: () => router.push("/dashboard/form-check") },
    { icon: Zap, label: "Analytics", onClick: () => router.push("/dashboard/progress") },
    { icon: Mic2, label: "Voice Coach", onClick: () => router.push("/dashboard/voice-coach") },
    { icon: User, label: "Dashboard", onClick: () => router.push("/dashboard") },
  ]

  return (
    <main className="min-h-screen bg-black relative pb-32">
      <HeroAscii />

      {/* Feature Grid directly below the hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 mt-24">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-black/60 backdrop-blur-md border-white/20 p-8 shadow-2xl rounded-none hover:border-white/40 transition-all group">
            <Brain className="w-10 h-10 text-white mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-white mb-3 font-mono tracking-wider">AI Training Plans</h3>
            <p className="text-gray-400 font-mono text-xs leading-relaxed">Personalized workout recommendations based on your goals</p>
          </Card>
          <Card className="bg-black/60 backdrop-blur-md border-white/20 p-8 shadow-2xl rounded-none hover:border-white/40 transition-all group">
            <Zap className="w-10 h-10 text-white mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-white mb-3 font-mono tracking-wider">Form Analysis</h3>
            <p className="text-gray-400 font-mono text-xs leading-relaxed">Real-time AI feedback on your exercise form</p>
          </Card>
          <Card className="bg-black/60 backdrop-blur-md border-white/20 p-8 shadow-2xl rounded-none hover:border-white/40 transition-all group">
            <BarChart3 className="w-10 h-10 text-white mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-white mb-3 font-mono tracking-wider">Progress Insights</h3>
            <p className="text-gray-400 font-mono text-xs leading-relaxed">AI-powered analytics and progress tracking</p>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-16 opacity-80">
            <div className="w-16 h-px bg-white"></div>
            <h3 className="text-2xl font-bold text-white text-center font-mono tracking-widest">SYSTEM.FEATURES</h3>
            <div className="w-16 h-px bg-white"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-transparent border border-white/10 hover:border-white/30 transition-colors rounded-none p-10 relative group">
              <span className="absolute top-4 right-4 text-[10px] text-white/30 font-mono">01</span>
              <Target className="w-8 h-8 text-white mb-6" />
              <h4 className="text-lg font-bold text-white mb-3 font-mono tracking-wide">Workout Recommendations</h4>
              <p className="text-gray-400 font-mono text-xs leading-relaxed">Get AI-curated workout routines tailored to your fitness level and goals</p>
            </div>
            <div className="bg-transparent border border-white/10 hover:border-white/30 transition-colors rounded-none p-10 relative group">
              <span className="absolute top-4 right-4 text-[10px] text-white/30 font-mono">02</span>
              <Mic2 className="w-8 h-8 text-white mb-6" />
              <h4 className="text-lg font-bold text-white mb-3 font-mono tracking-wide">Voice Coaching</h4>
              <p className="text-gray-400 font-mono text-xs leading-relaxed">Real-time audio guidance and motivation during your workouts</p>
            </div>
            <div className="bg-transparent border border-white/10 hover:border-white/30 transition-colors rounded-none p-10 relative group">
              <span className="absolute top-4 right-4 text-[10px] text-white/30 font-mono">03</span>
              <Zap className="w-8 h-8 text-white mb-6" />
              <h4 className="text-lg font-bold text-white mb-3 font-mono tracking-wide">Real-Time Feedback</h4>
              <p className="text-gray-400 font-mono text-xs leading-relaxed">Instant form corrections and exercise tips powered by AI</p>
            </div>
            <div className="bg-transparent border border-white/10 hover:border-white/30 transition-colors rounded-none p-10 relative group">
              <span className="absolute top-4 right-4 text-[10px] text-white/30 font-mono">04</span>
              <BarChart3 className="w-8 h-8 text-white mb-6" />
              <h4 className="text-lg font-bold text-white mb-3 font-mono tracking-wide">Analytics Dashboard</h4>
              <p className="text-gray-400 font-mono text-xs leading-relaxed">Track your performance with AI-generated insights and recommendations</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative z-10 border-t border-white/10 bg-black/60">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-8 opacity-60">
            <div className="w-8 h-px bg-white"></div>
            <span className="text-white text-[10px] font-mono tracking-wider">INITIATE</span>
            <div className="w-8 h-px bg-white"></div>
          </div>
          <h3 className="text-3xl lg:text-5xl font-bold text-white mb-6 font-mono tracking-widest">START SEQUENCE</h3>
          <p className="text-xs lg:text-sm text-gray-400 mb-12 font-mono tracking-wider uppercase">Transform your fitness with personalized AI guidance.</p>
          <Link href="/auth/signup">
            <button className="relative px-10 py-4 bg-transparent border border-white text-white font-mono text-sm font-bold hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest group">
              <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black opacity-0 group-hover:opacity-100 transition-opacity"></span>
              Enter Dashboard
            </button>
          </Link>
        </div>
      </section>

      {/* Fixed Dock at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center">
        <div className="pointer-events-auto">
          <Dock items={dockItems} className="pb-8 h-auto" />
        </div>
      </div>
    </main>
  )
}
