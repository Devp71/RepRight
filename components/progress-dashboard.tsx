"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BarChart3, Loader } from "lucide-react"

interface ProgressDashboardProps {
  workoutStats: {
    totalWorkouts: number
    totalReps: number
    caloriesBurned: number
    streak: number
  }
}

export function ProgressDashboard({ workoutStats }: ProgressDashboardProps) {
  const [insights, setInsights] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generateInsights = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/progress-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          progressData: workoutStats,
          workoutHistory: [
            { date: "2024-01-10", exercise: "Bicep Curls", reps: 10, form: 85 },
            { date: "2024-01-09", exercise: "Squats", reps: 12, form: 90 },
            { date: "2024-01-08", exercise: "Push-ups", reps: 15, form: 78 },
          ],
        }),
      })

      const data = await response.json()
      setInsights(data.insights)
    } catch (error) {
      console.error("Error generating insights:", error)
      setInsights("Error generating insights. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Progress Tracking</h2>
        <p className="text-slate-400 mb-6">AI-powered analytics and personalized insights</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-blue-500/30 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Progress</h3>
          <div className="space-y-4">
            <div>
              <p className="text-slate-400 text-sm mb-1">Reps This Week</p>
              <p className="text-2xl font-bold text-cyan-400">128</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Workouts Completed</p>
              <p className="text-2xl font-bold text-cyan-400">5</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Avg Form Score</p>
              <p className="text-2xl font-bold text-cyan-400">87%</p>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-blue-500/30 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-600/20 rounded border border-blue-500/30">
              <span className="text-white">Perfect Form Milestone</span>
              <span className="text-cyan-400 font-semibold">🏆</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-600/20 rounded border border-blue-500/30">
              <span className="text-white">Week 1 Completed</span>
              <span className="text-cyan-400 font-semibold">✓</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-600/20 rounded border border-blue-500/30">
              <span className="text-white">100 Total Reps</span>
              <span className="text-cyan-400 font-semibold">✓</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-blue-500/30 p-6">
        <Button
          onClick={generateInsights}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 mb-4"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Generating Insights...
            </>
          ) : (
            <>
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate AI Insights
            </>
          )}
        </Button>

        {insights && (
          <div className="mt-4 p-4 bg-blue-600/20 border border-blue-500/30 rounded">
            <h4 className="text-cyan-400 font-semibold mb-3">AI Insights & Recommendations</h4>
            <p className="text-slate-300 whitespace-pre-wrap">{insights}</p>
          </div>
        )}
      </Card>
    </div>
  )
}
