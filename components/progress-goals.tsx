"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"

interface Goal {
  id: number
  name: string
  target: number
  current: number
  unit: string
  progress: number
}

interface ProgressGoalsProps {
  goals: Goal[]
  onAddGoal: (goal: any) => void
}

export function ProgressGoals({ goals, onAddGoal }: ProgressGoalsProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    target: "",
    unit: "lbs",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.target) {
      onAddGoal({
        name: formData.name,
        target: Number.parseInt(formData.target),
        current: 0,
        unit: formData.unit,
      })
      setFormData({ name: "", target: "", unit: "lbs" })
      setShowForm(false)
    }
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <Card className="bg-transparent border border-white/20 p-8 rounded-none flex-1">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white font-mono tracking-widest uppercase flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-white animate-pulse"></div>
            Target Parameters
          </h2>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-none h-8 w-8 flex items-center justify-center p-0 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Add Goal Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 bg-black border border-white/10 relative">
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40"></div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono tracking-widest text-white/60 mb-2 uppercase">Target Identifier</label>
                <input
                  type="text"
                  placeholder="E.G., DEADLIFT MAX"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-none px-4 py-3 text-white font-mono text-sm placeholder-white/20 focus:outline-none focus:border-white transition-colors"
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[10px] font-mono tracking-widest text-white/60 mb-2 uppercase">Value</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    className="w-full bg-black border border-white/20 rounded-none px-4 py-3 text-white font-mono text-sm placeholder-white/20 focus:outline-none focus:border-white transition-colors"
                    required
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-[10px] font-mono tracking-widest text-white/60 mb-2 uppercase">Metric</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-black border border-white/20 rounded-none px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-white transition-colors appearance-none"
                  >
                    <option value="lbs">LBS</option>
                    <option value="reps">REPS</option>
                    <option value="sessions">SESS</option>
                    <option value="km">KM</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <Button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-transparent text-white/70 hover:bg-white/10 hover:text-white border border-white/30 rounded-none font-mono text-xs tracking-widest uppercase transition-colors"
                >
                  Abort
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-white text-black hover:bg-gray-200 border border-white rounded-none font-mono text-xs tracking-widest uppercase transition-colors"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Goals List */}
        <div className="space-y-6">
          {goals.map((goal) => (
            <div key={goal.id} className="group relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-mono font-bold tracking-wider uppercase mb-1">{goal.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-xs">{goal.current}</span>
                    <span className="text-white/40 font-mono text-[10px]">/</span>
                    <span className="text-white/60 font-mono text-xs">{goal.target} {goal.unit}</span>
                  </div>
                </div>
                <button className="text-white/20 hover:text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-white/40">Vector Completion</span>
                  <span className="text-[10px] font-mono tracking-widest text-white">{goal.progress}%</span>
                </div>
                <div className="w-full bg-white/10 h-px relative">
                  <div
                    className="absolute top-[-0.5px] left-0 bg-white h-[2px] transition-all duration-500 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    style={{ width: `${Math.min(goal.progress, 100)}%` }}
                  />
                  {/* Milestones */}
                  <div className="absolute top-[-2px] left-[25%] w-px h-[5px] bg-white/20"></div>
                  <div className="absolute top-[-2px] left-[50%] w-px h-[5px] bg-white/20"></div>
                  <div className="absolute top-[-2px] left-[75%] w-px h-[5px] bg-white/20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
