"use client"

import { Card } from "@/components/ui/card"
import { Brain, Lightbulb, TrendingUp, AlertCircle } from "lucide-react"

interface AIInsightsProps {
  stats: {
    avgProgress: number
    bestGoal: string
    totalImprovements: number
    projectedDate: string
  }
}

export function AIInsights({ stats }: AIInsightsProps) {
  const insights = [
    {
      type: "positive",
      icon: "++",
      title: "ACCELERATED KINEMATICS",
      description: "STRENGTH GAIN VELOCITY ABOVE MEDIAN. MAINTAIN CURRENT VECTOR.",
    },
    {
      type: "suggestion",
      icon: "//",
      title: "FORM OPTIMIZATION",
      description: "SQUAT GEOMETRY DELTA +6%. OPTIMIZE Z-AXIS DEPTH METRICS.",
    },
    {
      type: "warning",
      icon: "!!",
      title: "FATIGUE WARNING",
      description: "ZERO RECOVERY CYCLES DETECTED IN 120 HOURS. INITIATE DELOAD PHASE.",
    },
  ]

  return (
    <div className="space-y-6 h-full flex flex-col">
      <Card className="bg-transparent border border-white/20 p-8 rounded-none flex-1">
        <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/10 opacity-80">
          <Brain className="w-5 h-5 text-white animate-pulse" />
          <h3 className="text-xl font-bold text-white font-mono tracking-widest uppercase">Neural Insights</h3>
        </div>

        <div className="space-y-4">
          {insights.map((insight, idx) => (
            <div key={idx} className="bg-black border border-white/10 rounded-none p-4 group hover:border-white/30 transition-colors relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-white/20 group-hover:bg-white transition-colors"></div>
              <div className="flex items-start gap-4 pl-2">
                <div className={`font-mono font-bold text-lg mt-1 ${insight.type === 'warning' ? 'text-white' : 'text-white/40'}`}>
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <p className="text-white font-mono font-bold tracking-wider uppercase text-sm">{insight.title}</p>
                  <p className="text-gray-400 font-mono text-[10px] tracking-widest uppercase mt-2 leading-relaxed">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-white text-black border border-white p-6 rounded-none relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-8 h-8 bg-black/10 transition-transform group-hover:scale-150 rounded-bl-full"></div>
        <h4 className="text-black font-mono font-bold tracking-widest uppercase mb-4 flex items-center gap-2 border-b border-black/10 pb-3">
          <Lightbulb className="w-4 h-4 text-black" />
          Execution Protocols
        </h4>
        <ul className="space-y-3 text-black/70 font-mono text-[10px] tracking-widest uppercase">
          <li className="flex items-start gap-3">
            <span className="font-bold text-black mt-0.5">{'>'}</span>
            <span>INCREASE LOWER BODY TELEMETRY LOGS</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-black mt-0.5">{'>'}</span>
            <span>INITIATE OPTICAL SCAN FOR NEXT SESSION</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-black mt-0.5">{'>'}</span>
            <span>SCHEDULE SYSTEM STANDBY (REST DAY)</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
