"use client"

import { Card } from "@/components/ui/card"
import { Trash2 } from "lucide-react"

interface Workout {
  id: number
  exerciseName: string
  duration: number
  calories: number
  sets: number
  reps: number
  weight: number
  notes: string
  timestamp: Date
}

interface WorkoutHistoryProps {
  workouts: Workout[]
}

export function WorkoutHistory({ workouts }: WorkoutHistoryProps) {
  const sortedWorkouts = [...workouts].reverse()

  if (workouts.length === 0) {
    return (
      <Card className="bg-transparent border border-white/20 p-12 text-center rounded-none relative group overflow-hidden h-full flex flex-col items-center justify-center min-h-[300px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="w-8 h-px bg-white/20 mb-4"></div>
        <p className="text-gray-400 font-mono text-xs tracking-widest uppercase">NO TELEMETRY RECORDED.</p>
        <p className="text-white/40 font-mono text-[10px] tracking-widest uppercase mt-2">INITIATE SESSION TO BEGIN TRACKING.</p>
      </Card>
    )
  }

  return (
    <Card className="bg-transparent border border-white/20 p-8 rounded-none h-full">
      <div className="flex items-center gap-4 mb-8 opacity-80">
        <h3 className="text-lg font-bold text-white font-mono tracking-widest uppercase">Telemetry Log</h3>
        <div className="flex-1 h-px bg-white/20"></div>
      </div>
      <div className="space-y-4">
        {sortedWorkouts.map((workout) => (
          <div
            key={workout.id}
            className="bg-black border border-white/10 rounded-none p-6 hover:border-white/30 transition-colors group relative"
          >
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-white font-mono font-bold tracking-wider uppercase mb-2">{workout.exerciseName}</h4>
                <div className="flex flex-wrap gap-3 text-[10px] font-mono tracking-widest uppercase mt-2 border-l border-white/20 pl-3">
                  {workout.sets > 0 && <span className="text-white/60">{workout.sets} SETS × {workout.reps} REPS</span>}
                  {workout.weight > 0 && <span className="text-white/80">@ {workout.weight} LBS</span>}
                </div>
                <div className="flex gap-6 mt-4 pt-4 border-t border-white/5 text-[10px] font-mono tracking-widest uppercase">
                  <span className="flex items-center gap-2"><div className="w-1 h-1 bg-white/40"></div>{workout.duration} MIN</span>
                  <span className="flex items-center gap-2 text-white"><div className="w-1 h-1 bg-white"></div>{workout.calories} KCAL</span>
                  {workout.notes && <span className="italic text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">// {workout.notes}</span>}
                </div>
              </div>
              <button className="text-white/20 hover:text-red-500 transition-colors p-2 -mr-2 -mt-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
