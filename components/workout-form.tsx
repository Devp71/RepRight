"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface WorkoutFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function WorkoutForm({ onSubmit, onCancel }: WorkoutFormProps) {
  const [formData, setFormData] = useState({
    exerciseName: "",
    duration: "",
    calories: "",
    sets: "",
    reps: "",
    weight: "",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.exerciseName.trim()) {
      onSubmit({
        ...formData,
        duration: Number.parseInt(formData.duration) || 0,
        calories: Number.parseInt(formData.calories) || 0,
        sets: Number.parseInt(formData.sets) || 0,
        reps: Number.parseInt(formData.reps) || 0,
        weight: Number.parseInt(formData.weight) || 0,
      })
      setFormData({
        exerciseName: "",
        duration: "",
        calories: "",
        sets: "",
        reps: "",
        weight: "",
        notes: "",
      })
    }
  }

  return (
    <Card className="bg-transparent border border-white/20 p-8 rounded-none relative">
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/40"></div>
      
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <h2 className="text-lg font-bold text-white font-mono tracking-widest uppercase flex items-center gap-3">
          <div className="w-2 h-2 bg-white animate-pulse"></div>
          Input Telemetry
        </h2>
        <button onClick={onCancel} className="text-white/40 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-white/60 mb-2 uppercase">Exercise Designation</label>
            <input
              type="text"
              name="exerciseName"
              placeholder="E.G., BARBELL SQUAT"
              value={formData.exerciseName}
              onChange={handleChange}
              className="w-full bg-black border border-white/20 rounded-none px-4 py-3 text-white font-mono text-sm placeholder-white/20 focus:outline-none focus:border-white transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-white/60 mb-2 uppercase">Duration (MIN)</label>
            <input
              type="number"
              name="duration"
              placeholder="0"
              value={formData.duration}
              onChange={handleChange}
              className="w-full bg-black border border-white/20 rounded-none px-4 py-3 text-white font-mono text-sm placeholder-white/20 focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-white/60 mb-2 uppercase">Energy Expended (KCAL)</label>
            <input
              type="number"
              name="calories"
              placeholder="0"
              value={formData.calories}
              onChange={handleChange}
              className="w-full bg-black border border-white/20 rounded-none px-4 py-3 text-white font-mono text-sm placeholder-white/20 focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-white/60 mb-2 uppercase">Volume (SETS)</label>
            <input
              type="number"
              name="sets"
              placeholder="0"
              value={formData.sets}
              onChange={handleChange}
              className="w-full bg-black border border-white/20 rounded-none px-4 py-3 text-white font-mono text-sm placeholder-white/20 focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-white/60 mb-2 uppercase">Reps per Set</label>
            <input
              type="number"
              name="reps"
              placeholder="0"
              value={formData.reps}
              onChange={handleChange}
              className="w-full bg-black border border-white/20 rounded-none px-4 py-3 text-white font-mono text-sm placeholder-white/20 focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-white/60 mb-2 uppercase">Resistance (LBS)</label>
            <input
              type="number"
              name="weight"
              placeholder="0"
              value={formData.weight}
              onChange={handleChange}
              className="w-full bg-black border border-white/20 rounded-none px-4 py-3 text-white font-mono text-sm placeholder-white/20 focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-mono tracking-widest text-white/60 mb-2 uppercase">Additional Parameters</label>
          <textarea
            name="notes"
            placeholder="INPUT KINEMATIC OBSERVATIONS OR FATIGUE METRICS..."
            value={formData.notes}
            onChange={handleChange}
            className="w-full bg-black border border-white/20 rounded-none px-4 py-3 text-white font-mono text-sm placeholder-white/20 focus:outline-none focus:border-white transition-colors"
            rows={3}
          />
        </div>

        <div className="flex gap-4 pt-4 border-t border-white/10">
          <Button type="button" onClick={onCancel} className="flex-1 bg-transparent border border-white/30 text-white/70 hover:bg-white/10 hover:text-white rounded-none font-mono text-xs tracking-widest uppercase transition-colors">
            Abort
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-white text-black hover:bg-gray-200 border border-white rounded-none font-mono text-xs tracking-widest uppercase transition-colors"
          >
            Submit Data
          </Button>
        </div>
      </form>
    </Card>
  )
}
