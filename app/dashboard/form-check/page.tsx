"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Target } from "lucide-react"
import Link from "next/link"
import { LiveFormAnalyzer } from "@/components/live-form-analyzer"

export default function FormCheck() {
  const [selectedExercise, setSelectedExercise] = useState<string>("")

  const exercises = [
    { name: "BICEP CURLS", marker: "01", description: "ARM KINEMATICS ANALYSIS" },
    { name: "SQUATS", marker: "02", description: "LOWER BODY GEOMETRY" },
    { name: "PUSH-UPS", marker: "03", description: "UPPER BODY SYMMETRY" },
    { name: "SHOULDER PRESS", marker: "04", description: "DELTOID FORCE VECTOR" },
  ]

  if (selectedExercise) {
    return <LiveFormAnalyzer exerciseName={selectedExercise} onBack={() => setSelectedExercise("")} />
  }

  return (
    <div className="min-h-screen bg-black relative pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header with Back Button */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-16 border-b border-white/10 pb-8">
          <Link href="/dashboard">
            <Button className="bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-none h-12 w-12 flex items-center justify-center p-0 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-3 opacity-60">
              <div className="w-8 h-px bg-white"></div>
              <span className="text-white text-[10px] font-mono tracking-wider">MODULE.02</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white font-mono tracking-widest uppercase flex items-center gap-4">
              <Target className="w-8 h-8 text-white/50" />
              FORM_ANALYSIS
            </h1>
            <p className="text-gray-400 mt-3 font-mono text-xs tracking-wide uppercase">
              REAL-TIME KINEMATIC FEEDBACK VIA LIVE SENSOR FEED.
            </p>
          </div>
        </div>

        {/* Exercise Selection */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-8 opacity-80">
            <h2 className="text-xl font-bold text-white font-mono tracking-widest uppercase">Select Protocol</h2>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {exercises.map((exercise) => (
              <button
                key={exercise.name}
                onClick={() => setSelectedExercise(exercise.name)}
                className="group text-left"
              >
                <Card className="bg-transparent border border-white/20 hover:border-white/50 p-8 h-full transition-colors cursor-pointer rounded-none relative">
                  <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-[10px] font-mono text-white/30 border border-white/10 px-2 py-1 group-hover:border-white/30 transition-colors">
                      {exercise.marker}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white font-mono tracking-widest uppercase mb-2 group-hover:text-white transition-colors">
                    {exercise.name}
                  </h3>
                  <p className="text-gray-500 font-mono text-[10px] tracking-widest uppercase mt-4 border-t border-white/10 pt-4">
                    {exercise.description}
                  </p>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
