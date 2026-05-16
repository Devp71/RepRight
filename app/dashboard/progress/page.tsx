"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { TrendingUp, Zap, Calendar, Award, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { ProgressGoals } from "@/components/progress-goals"
import { AIInsights } from "@/components/ai-insights"
import { api } from "@/lib/api"

export default function Progress() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month")
  const [goals, setGoals] = useState<any[]>([])
  const [analyses, setAnalyses] = useState<any[]>([])

  const fetchGoals = useCallback(async () => {
    try {
      const data = await api.get('/api/goals')
      setGoals(data.goals || [])
    } catch (error) {
      console.error('[SYSTEM] Failed to fetch goals:', error)
    }
  }, [])

  const fetchAnalyses = useCallback(async () => {
    try {
      const data = await api.get('/api/form-analysis?limit=50')
      setAnalyses(data.analyses || [])
    } catch (error) {
      console.error('[SYSTEM] Failed to fetch analyses:', error)
    }
  }, [])

  useEffect(() => {
    fetchGoals()
    fetchAnalyses()
  }, [fetchGoals, fetchAnalyses])

  // Calculate stats from real analysis data
  const stats = useMemo(() => {
    if (analyses.length === 0 && goals.length === 0) {
      return { avgScore: 0, bestGoal: '—', totalSessions: 0, totalVolume: 0 }
    }

    const avgScore = analyses.length > 0 
      ? Math.round(analyses.reduce((sum, a) => sum + (a.score || 0), 0) / analyses.length) 
      : 0
      
    const totalSessions = analyses.length
    const totalVolume = analyses.reduce((sum, a) => sum + (a.reps || 0), 0)
    
    let bestGoal = '—'
    if (goals.length > 0) {
      bestGoal = goals.reduce((prev, current) => ((current.progress || 0) > (prev.progress || 0) ? current : prev)).name
    }

    return { avgScore, bestGoal, totalSessions, totalVolume }
  }, [analyses, goals])

  // Monthly progress data mapped from sessions
  const chartData = useMemo(() => {
    if (analyses.length === 0) return []
    // Sort oldest to newest
    const sorted = [...analyses].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    return sorted.map((session, index) => {
      const d = new Date(session.timestamp)
      return {
        name: `S${index + 1}`,
        date: `${d.getDate()}/${d.getMonth() + 1}`,
        score: session.score || 0,
        volume: session.reps || 0
      }
    })
  }, [analyses])

  // Category performance mapped from exercises
  const radarData = useMemo(() => {
    const categories = ["BICEP CURLS", "SQUATS", "PUSH-UPS", "SHOULDER PRESS"]
    return categories.map(cat => {
      const catAnalyses = analyses.filter(a => a.exercise === cat)
      const current = catAnalyses.length > 0 
        ? Math.round(catAnalyses.reduce((sum, a) => sum + (a.score || 0), 0) / catAnalyses.length)
        : 0
      return { category: cat.replace('-', ' '), current, previous: 0 }
    })
  }, [analyses])

  const handleAddGoal = async (goalData: any) => {
    try {
      await api.post('/api/goals', goalData)
      fetchGoals()
    } catch (error) {
      console.error('[SYSTEM] Failed to add goal:', error)
    }
  }

  return (
    <div className="min-h-screen bg-black relative pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-6 border-b border-white/10 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Link href="/dashboard">
              <Button className="bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-none h-12 w-12 flex items-center justify-center p-0 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-4 opacity-60">
                <div className="w-12 h-px bg-white"></div>
                <span className="text-white text-[10px] font-mono tracking-wider">MODULE.03</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white font-mono tracking-widest uppercase flex items-center gap-4">
                <TrendingUp className="w-10 h-10 text-white/50" />
                PROGRESS_TRACKER
              </h1>
              <p className="text-gray-400 mt-4 font-mono text-xs tracking-wide uppercase">
                ANALYZE HISTORICAL TELEMETRY AND PROJECT FUTURE KINEMATICS.
              </p>
            </div>
          </div>
          <div className="flex gap-2 mb-2 lg:mb-0">
            {(["week", "month", "year"] as const).map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`uppercase tracking-widest text-[10px] font-mono rounded-none h-10 ${
                  timeRange === range 
                  ? "bg-white text-black border border-white" 
                  : "bg-transparent text-white border border-white/30 hover:bg-white/10"
                }`}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-black border border-white/10 p-8 rounded-none hover:border-white/30 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase">Avg Form Score</p>
                <p className="text-3xl font-bold text-white mt-4 font-mono">{stats.avgScore}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-white/20" />
            </div>
          </Card>

          <Card className="bg-black border border-white/10 p-8 rounded-none hover:border-white/30 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase">Apex Objective</p>
                <p className="text-sm font-bold text-white mt-4 font-mono tracking-widest uppercase">{stats.bestGoal}</p>
              </div>
              <Award className="w-8 h-8 text-white/20" />
            </div>
          </Card>

          <Card className="bg-black border border-white/10 p-8 rounded-none hover:border-white/30 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase">Total Sessions</p>
                <p className="text-3xl font-bold text-white mt-4 font-mono">{stats.totalSessions}</p>
              </div>
              <Zap className="w-8 h-8 text-white/20" />
            </div>
          </Card>

          <Card className="bg-black border border-white/10 p-8 rounded-none hover:border-white/30 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase">Total Volume</p>
                <p className="text-sm font-bold text-white mt-4 font-mono tracking-widest uppercase">{stats.totalVolume} REPS</p>
              </div>
              <Calendar className="w-8 h-8 text-white/20" />
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Monthly Progress */}
          <Card className="bg-black border border-white/10 p-8 rounded-none">
            <h3 className="text-sm font-bold text-white mb-8 font-mono tracking-widest uppercase border-b border-white/10 pb-4 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-white animate-pulse"></div>
              Temporal Progression
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} tickFormatter={(value) => value.toUpperCase()} axisLine={false} tickLine={false} />
                <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "1px solid #333",
                    borderRadius: "0px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    textTransform: "uppercase"
                  }}
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ color: "#888", marginBottom: "4px" }}
                />
                <Area type="monotone" dataKey="score" stroke="#fff" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 6, fill: '#fff', stroke: '#000', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Performance Radar */}
          <Card className="bg-black border border-white/10 p-8 rounded-none">
            <h3 className="text-sm font-bold text-white mb-8 font-mono tracking-widest uppercase border-b border-white/10 pb-4 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-white animate-pulse"></div>
              Vector Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="category" stroke="#666" tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }} tickFormatter={(value) => value.toUpperCase()} />
                <PolarRadiusAxis stroke="#333" axisLine={false} tick={false} />
                <Radar name="Current Baseline" dataKey="current" stroke="#fff" strokeWidth={2} fill="#fff" fillOpacity={0.1} />
                <Radar name="Previous Epoch" dataKey="previous" stroke="#666" strokeWidth={1} strokeDasharray="3 3" fill="transparent" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "1px solid #333",
                    borderRadius: "0px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    textTransform: "uppercase"
                  }}
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ display: 'none' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Goals and Insights */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="border border-white/10 p-1 bg-black h-full">
              <ProgressGoals goals={goals} onAddGoal={handleAddGoal} />
            </div>
          </div>
          <div>
            <div className="border border-white/10 p-1 bg-black h-full">
              <AIInsights stats={stats} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
