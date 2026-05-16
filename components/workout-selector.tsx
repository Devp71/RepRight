"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Zap, Dumbbell, Repeat2 } from "lucide-react"

const EXERCISES = [
  { id: "bicep_curls", name: "Bicep Curls", icon: Dumbbell, reps: 10 },
  { id: "squats", name: "Squats", icon: Repeat2, reps: 12 },
  { id: "pushups", name: "Push-ups", icon: Zap, reps: 15 },
]

export function WorkoutSelector() {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const startWorkout = async (exerciseId: string) => {
    setIsLoading(true)
    const exercise = EXERCISES.find((e) => e.id === exerciseId)

    try {
      // Simulate API call - in real app would connect to video stream
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert(`Starting ${exercise?.name} workout! Make sure your camera is ready for form analysis.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Select an Exercise</h2>
        <p className="text-slate-400 mb-6">Choose from AI-optimized exercises with real-time form analysis</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {EXERCISES.map((exercise) => {
          const Icon = exercise.icon
          return (
            <Card
              key={exercise.id}
              className={`p-6 cursor-pointer transition-all ${
                selectedExercise === exercise.id
                  ? "bg-blue-600/20 border-blue-500 ring-2 ring-blue-500"
                  : "bg-slate-800/50 border-blue-500/30 hover:border-blue-500 hover:bg-slate-800/70"
              }`}
              onClick={() => setSelectedExercise(exercise.id)}
            >
              <Icon className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{exercise.name}</h3>
              <p className="text-slate-400 mb-4">Target: {exercise.reps} reps</p>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  startWorkout(exercise.id)
                }}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                {isLoading ? "Starting..." : "Start Workout"}
              </Button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
