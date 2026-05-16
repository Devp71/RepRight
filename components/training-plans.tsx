"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Loader } from "lucide-react"

interface TrainingPlansProps {
  userGoals: string
  setUserGoals: (goals: string) => void
}

export function TrainingPlans({ userGoals, setUserGoals }: TrainingPlansProps) {
  const [plan, setPlan] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generatePlan = async () => {
    if (!userGoals.trim()) {
      alert("Please enter your fitness goals")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/workout-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userGoals,
          fitnessLevel: "intermediate",
          exercises: "bicep curls, squats, pushups",
        }),
      })

      const data = await response.json()
      setPlan(data.recommendation)
    } catch (error) {
      console.error("Error generating plan:", error)
      alert("Failed to generate training plan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">AI Training Plans</h2>
        <p className="text-slate-400 mb-6">Get personalized workout plans based on your goals</p>
      </div>

      <Card className="bg-slate-800/50 border-blue-500/30 p-6">
        <label className="block text-white font-semibold mb-3">Your Fitness Goals</label>
        <Textarea
          value={userGoals}
          onChange={(e) => setUserGoals(e.target.value)}
          placeholder="e.g., Build muscle, increase endurance, lose weight, improve flexibility..."
          className="bg-slate-700 border-blue-500/30 text-white mb-4 min-h-24"
        />
        <Button
          onClick={generatePlan}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Generating Plan...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Generate Training Plan
            </>
          )}
        </Button>
      </Card>

      {plan && (
        <Card className="bg-slate-800/50 border-cyan-500/30 p-6">
          <h3 className="text-xl font-semibold text-cyan-400 mb-4">Your Personalized Plan</h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 whitespace-pre-wrap">{plan}</p>
          </div>
        </Card>
      )}
    </div>
  )
}
