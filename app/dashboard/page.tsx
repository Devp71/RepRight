"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Plus, Target, Clock, Flame, TrendingUp, BookOpen, Mic2, Video, Home as HomeIcon, Brain, User, Zap, Activity } from "lucide-react"
import { WorkoutForm } from "@/components/workout-form"
import { WorkoutHistory } from "@/components/workout-history"
import { AIRecommendations } from "@/components/ai-recommendations"
import Link from "next/link"
import { Dock } from "@/components/ui/dock-two"
import { api } from "@/lib/api"

export default function Dashboard() {
  const [workouts, setWorkouts] = useState<any[]>([])
  const [showWorkoutForm, setShowWorkoutForm] = useState(false)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [workoutRes, dashRes] = await Promise.all([
        api.get('/api/workouts?limit=50'),
        api.get('/api/dashboard/stats'),
      ])
      setWorkouts(workoutRes.workouts || [])
      setDashboardData(dashRes)
    } catch (error) {
      console.error('[SYSTEM] Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Derived stats from real data
  const stats = useMemo(() => {
    if (!dashboardData) return { totalSessions: 0, totalDuration: 0, totalReps: 0, streakDays: 0, avgFormScore: 0, formSessions: 0 }
    return {
      totalSessions: dashboardData.totalSessions || 0,
      totalDuration: dashboardData.totalDuration || 0,
      totalReps: dashboardData.totalReps || 0,
      streakDays: dashboardData.streakDays || 0,
      avgFormScore: dashboardData.avgFormScore || 0,
      formSessions: dashboardData.formSessions || 0,
    }
  }, [dashboardData])

  // Volume chart data from real daily aggregation
  const volumeChartData = useMemo(() => {
    if (!dashboardData?.dailyVolume) return []
    return dashboardData.dailyVolume
  }, [dashboardData])

  // Recent sessions chart (reps per session)
  const sessionChartData = useMemo(() => {
    if (!dashboardData?.recentSessions) return []
    return [...dashboardData.recentSessions]
      .reverse()
      .slice(-10)
      .map((s: any, i: number) => ({
        name: `S${i + 1}`,
        reps: s.reps || 0,
        score: s.score || 0,
        exercise: s.exercise,
      }))
  }, [dashboardData])

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const mins = Math.round(seconds / 60)
    if (mins < 60) return `${mins}m`
    const hours = Math.floor(mins / 60)
    const remainMins = mins % 60
    return `${hours}h ${remainMins}m`
  }

  const handleAddWorkout = async (workoutData: any) => {
    try {
      await api.post('/api/workouts', workoutData)
      setShowWorkoutForm(false)
      fetchData()
    } catch (error) {
      console.error('[SYSTEM] Failed to save workout:', error)
    }
  }

  const dockItems = [
    { icon: HomeIcon, label: "Home", onClick: () => window.location.href = "/" },
    { icon: Brain, label: "AI Plans", onClick: () => window.location.href = "/dashboard/plans" },
    { icon: Target, label: "Form Check", onClick: () => window.location.href = "/dashboard/form-check" },
    { icon: TrendingUp, label: "Analytics", onClick: () => window.location.href = "/dashboard/progress" },
    { icon: Mic2, label: "Voice Coach", onClick: () => window.location.href = "/dashboard/voice-coach" },
    { icon: User, label: "Dashboard", onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
  ]

  return (
    <div className="min-h-screen bg-black relative pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-4 opacity-60">
              <div className="w-12 h-px bg-white"></div>
              <span className="text-white text-[10px] font-mono tracking-wider">SYSTEM.CORE</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-mono tracking-widest uppercase">
              DASHBOARD
            </h1>
            <p className="text-gray-400 mt-4 font-mono text-xs tracking-wide uppercase">TELEMETRY, ANALYSIS, AND OPTIMIZATION INTERFACE.</p>
          </div>
          <div className="flex gap-4 flex-wrap justify-start lg:justify-end">
            <Link href="/dashboard/voice-coach">
              <Button className="bg-transparent text-white font-mono text-[10px] border border-white/30 hover:bg-white/10 transition-colors rounded-none uppercase tracking-widest h-10">
                <Mic2 className="mr-2 w-3 h-3" />
                Coach
              </Button>
            </Link>
            <Link href="/dashboard/progress">
              <Button className="bg-transparent text-white font-mono text-[10px] border border-white/30 hover:bg-white/10 transition-colors rounded-none uppercase tracking-widest h-10">
                <TrendingUp className="mr-2 w-3 h-3" />
                Progress
              </Button>
            </Link>
            <Link href="/dashboard/plans">
              <Button className="bg-transparent text-white font-mono text-[10px] border border-white/30 hover:bg-white/10 transition-colors rounded-none uppercase tracking-widest h-10">
                <BookOpen className="mr-2 w-3 h-3" />
                Plans
              </Button>
            </Link>
            <Button
              onClick={() => setShowWorkoutForm(!showWorkoutForm)}
              className="bg-white text-black hover:bg-gray-200 transition-colors rounded-none font-mono text-[10px] uppercase tracking-widest h-10"
            >
              <Plus className="mr-2 w-3 h-3" />
              Add Session
            </Button>
          </div>
        </div>

        {/* Workout Form Modal */}
        {showWorkoutForm && (
          <div className="mb-12 border border-white/20 p-1">
            <WorkoutForm onSubmit={handleAddWorkout} onCancel={() => setShowWorkoutForm(false)} />
          </div>
        )}

        {/* Form Check Prominent Feature */}
        <div className="mb-12">
          <Link href="/dashboard/form-check" className="block group">
            <Card className="bg-transparent border border-white/20 hover:border-white transition-all duration-500 p-8 rounded-none relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/40"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/40"></div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-4 mb-4 font-mono tracking-widest uppercase">
                    <Video className="w-8 h-8 text-white/50 group-hover:text-white transition-colors" />
                    Real-Time Form Analysis
                  </h2>
                  <p className="text-gray-400 text-xs font-mono uppercase tracking-wider max-w-xl leading-relaxed">
                    ENGAGE LIVE CAMERA DETECTION FOR INSTANT KINEMATIC FEEDBACK. ALIGN GEOMETRY. PREVENT INJURY.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-6">
                    <span className="px-3 py-1 border border-white/20 text-white/60 text-[9px] font-mono tracking-widest uppercase">
                      MediaPipe Pose
                    </span>
                    <span className="px-3 py-1 border border-white/20 text-white/60 text-[9px] font-mono tracking-widest uppercase">
                      Neural Feedback
                    </span>
                    <span className="px-3 py-1 border border-white/20 text-white/60 text-[9px] font-mono tracking-widest uppercase flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-white animate-pulse rounded-full"></div>
                      Live Feed
                    </span>
                  </div>
                </div>
                <Button
                  className="bg-transparent border border-white text-white hover:bg-white hover:text-black font-mono text-xs tracking-widest uppercase transition-all duration-300 rounded-none px-8 py-6 w-full md:w-auto"
                >
                  Initiate Scan
                </Button>
              </div>
            </Card>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Sessions */}
          <Card className="bg-black border border-white/10 p-8 rounded-none hover:border-white/30 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase">Total Sessions</p>
                <p className="text-4xl font-bold text-white mt-4 font-mono">{stats.totalSessions}</p>
                <p className="text-white/20 text-[9px] font-mono mt-2 tracking-widest uppercase">{stats.formSessions} form checks</p>
              </div>
              <Target className="w-8 h-8 text-white/20" />
            </div>
          </Card>

          {/* Total Duration */}
          <Card className="bg-black border border-white/10 p-8 rounded-none hover:border-white/30 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase">Total Duration</p>
                <p className="text-4xl font-bold text-white mt-4 font-mono">{formatDuration(stats.totalDuration)}</p>
                <p className="text-white/20 text-[9px] font-mono mt-2 tracking-widest uppercase">Active training time</p>
              </div>
              <Clock className="w-8 h-8 text-white/20" />
            </div>
          </Card>

          {/* Avg Form Score */}
          <Card className="bg-black border border-white/10 p-8 rounded-none hover:border-white/30 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase">Avg Form Score</p>
                <p className="text-4xl font-bold text-white mt-4 font-mono">{stats.avgFormScore}<span className="text-lg text-white/40 ml-1">%</span></p>
                <p className="text-white/20 text-[9px] font-mono mt-2 tracking-widest uppercase">Perfect rep ratio</p>
              </div>
              <Activity className="w-8 h-8 text-white/20" />
            </div>
          </Card>

          {/* Streak */}
          <Card className="bg-black border border-white/10 p-8 rounded-none hover:border-white/30 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase">Streak</p>
                <p className="text-4xl font-bold text-white mt-4 font-mono">{stats.streakDays}<span className="text-lg text-white/40 ml-1">D</span></p>
                <p className="text-white/20 text-[9px] font-mono mt-2 tracking-widest uppercase">Consecutive days</p>
              </div>
              <Zap className="w-8 h-8 text-white/20" />
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Weekly Volume */}
          <Card className="bg-black border border-white/10 p-8 rounded-none">
            <h3 className="text-sm font-bold text-white mb-8 font-mono tracking-widest uppercase border-b border-white/10 pb-4 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-white animate-pulse"></div>
              Weekly Volume
            </h3>
            {volumeChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={volumeChartData}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#333" vertical={false} />
                  <XAxis dataKey="day" stroke="#666" tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#000",
                      border: "1px solid #333",
                      borderRadius: "0px",
                      fontFamily: "monospace",
                      fontSize: "12px",
                      textTransform: "uppercase" as const
                    }}
                    itemStyle={{ color: "#fff" }}
                    labelStyle={{ color: "#888", marginBottom: "4px" }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="volume" fill="#fff" radius={[0, 0, 0, 0]} name="Reps" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-white/20 font-mono text-xs tracking-widest uppercase">
                No session data yet — start a form check
              </div>
            )}
          </Card>

          {/* Session Scores */}
          <Card className="bg-black border border-white/10 p-8 rounded-none">
            <h3 className="text-sm font-bold text-white mb-8 font-mono tracking-widest uppercase border-b border-white/10 pb-4 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-white animate-pulse"></div>
              Session Scores
            </h3>
            {sessionChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={sessionChartData}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#000",
                      border: "1px solid #333",
                      borderRadius: "0px",
                      fontFamily: "monospace",
                      fontSize: "12px",
                      textTransform: "uppercase" as const
                    }}
                    itemStyle={{ color: "#fff" }}
                    labelStyle={{ color: "#888", marginBottom: "4px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#fff"
                    strokeWidth={2}
                    dot={{ fill: "#000", stroke: "#fff", strokeWidth: 2, r: 4 }}
                    activeDot={{ fill: "#fff", stroke: "#fff", r: 6 }}
                    name="Form Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-white/20 font-mono text-xs tracking-widest uppercase">
                No session data yet — start a form check
              </div>
            )}
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="border border-white/10 p-1 bg-black">
               <WorkoutHistory workouts={workouts} />
            </div>
          </div>
          <div>
            <div className="border border-white/10 p-1 bg-black">
               <AIRecommendations />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Dock at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center">
        <div className="pointer-events-auto">
          <Dock items={dockItems} className="pb-8 h-auto" />
        </div>
      </div>
    </div>
  )
}
