"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Trash2, ChevronRight } from "lucide-react"

interface Plan {
  id: number
  name: string
  goal: string
  fitnessLevel: string
  duration: string
  frequency: string
  focusAreas: string[]
  progress: number
}

interface PlanCardProps {
  plan: Plan
  onSelect: () => void
  onDelete: () => void
}

export function PlanCard({ plan, onSelect, onDelete }: PlanCardProps) {
  const goalIcons: Record<string, string> = {
    muscle_gain: "💪",
    fat_loss: "🔥",
    strength: "⚡",
    endurance: "🏃",
    flexibility: "🧘",
  }

  const difficultyColors: Record<string, string> = {
    beginner: "text-green-400",
    intermediate: "text-yellow-400",
    advanced: "text-red-400",
  }

  return (
    <Card className="bg-transparent border border-white/10 hover:border-white/30 transition-all duration-300 p-6 cursor-pointer rounded-none relative group">
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl opacity-80 filter grayscale">{goalIcons[plan.goal] || "🎯"}</div>
          <div>
            <h3 className="text-lg font-bold text-white font-mono tracking-wide uppercase">{plan.name}</h3>
            <p className={`text-xs font-mono uppercase tracking-wider mt-1 ${
              plan.fitnessLevel === 'beginner' ? 'text-white/60' : 
              plan.fitnessLevel === 'intermediate' ? 'text-white/80' : 'text-white'
            }`}>
              [ {plan.fitnessLevel} ]
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="text-white/40 hover:text-red-500 transition-colors z-10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 mb-6 border-l border-white/10 pl-4">
        <div className="flex items-center gap-3 text-gray-400 text-xs font-mono tracking-wider">
          <Calendar className="w-4 h-4 text-white/50" />
          <span>DUR: {plan.duration} WKS</span>
        </div>
        <div className="flex items-center gap-3 text-gray-400 text-xs font-mono tracking-wider">
          <Users className="w-4 h-4 text-white/50" />
          <span>FREQ: {plan.frequency} SESS/WK</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Progress</span>
          <span className="text-[10px] text-white font-mono">{plan.progress}%</span>
        </div>
        <div className="w-full bg-white/10 h-px relative">
          <div
            className="bg-white h-px absolute top-0 left-0 transition-all duration-500 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{ width: `${plan.progress}%` }}
          />
        </div>
      </div>

      {/* Focus Areas */}
      <div className="flex flex-wrap gap-2 mb-6">
        {plan.focusAreas.slice(0, 3).map((area) => (
          <span key={area} className="text-[9px] border border-white/20 text-gray-300 px-2 py-1 uppercase font-mono tracking-widest">
            {area}
          </span>
        ))}
        {plan.focusAreas.length > 3 && (
          <span className="text-[9px] border border-white/20 text-gray-300 px-2 py-1 uppercase font-mono tracking-widest">+{plan.focusAreas.length - 3}</span>
        )}
      </div>

      <Button
        onClick={onSelect}
        className="w-full bg-transparent border border-white text-white hover:bg-white hover:text-black rounded-none font-mono text-xs uppercase tracking-widest transition-all duration-300 group/btn relative overflow-hidden"
      >
        <span className="relative z-10 flex items-center justify-center">
          INITIATE PLAN
          <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </span>
      </Button>
    </Card>
  )
}
