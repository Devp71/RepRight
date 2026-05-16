"use client"

import { Card } from "@/components/ui/card"

interface ExerciseSelectorProps {
  exercises: string[]
  selectedExercise: string
  onSelect: (exercise: string) => void
}

export function ExerciseSelector({ exercises, selectedExercise, onSelect }: ExerciseSelectorProps) {
  return (
    <Card className="bg-slate-800/50 border-blue-500/30 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Select Exercise</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {exercises.map((exercise) => (
          <button
            key={exercise}
            onClick={() => onSelect(exercise)}
            className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
              selectedExercise === exercise
                ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                : "bg-slate-700/50 border-slate-600 text-slate-300 hover:border-blue-500"
            }`}
          >
            {exercise}
          </button>
        ))}
      </div>
    </Card>
  )
}
