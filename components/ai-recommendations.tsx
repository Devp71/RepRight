"use client"

import { Card } from "@/components/ui/card"
import { Lightbulb, Brain } from "lucide-react"

export function AIRecommendations() {
  const recommendations = [
    {
      title: "VOLUME ADJUSTMENT",
      description: "UPPER BODY KINEMATICS 20% BELOW OPTIMAL. RECOMMEND +2 SETS.",
      icon: "01",
    },
    {
      title: "RECOVERY PROTOCOL",
      description: "5 CONSECUTIVE ACTIVE DAYS DETECTED. SYSTEM ADVISES IMMEDIATE REST PHASE.",
      icon: "02",
    },
    {
      title: "FORM ANALYSIS",
      description: "UPLOAD SQUAT TELEMETRY FOR NEURAL KINEMATIC REVIEW.",
      icon: "03",
    },
  ]

  return (
    <div className="space-y-6 h-full flex flex-col">
      <Card className="bg-transparent border border-white/20 p-8 rounded-none flex-1">
        <div className="flex items-center gap-4 mb-8 opacity-80 border-b border-white/10 pb-4">
          <Brain className="w-5 h-5 text-white animate-pulse" />
          <h3 className="text-lg font-bold text-white font-mono tracking-widest uppercase">AI Analysis</h3>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="bg-black border border-white/10 rounded-none p-4 group hover:border-white/30 transition-colors relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-white/20 group-hover:bg-white transition-colors"></div>
              <p className="text-white font-mono font-bold tracking-wider uppercase flex items-start gap-3 text-sm">
                <span className="text-[10px] text-white/40 mt-1">[{rec.icon}]</span>
                {rec.title}
              </p>
              <p className="text-gray-400 font-mono text-[10px] tracking-widest uppercase mt-2 ml-8">{rec.description}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-white text-black border border-white p-6 rounded-none relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-8 h-8 bg-black/10 transition-transform group-hover:scale-150 rounded-bl-full"></div>
        <div className="flex items-center gap-3 mb-3 border-b border-black/10 pb-3">
          <Lightbulb className="w-4 h-4 text-black" />
          <h4 className="text-black font-mono font-bold tracking-widest uppercase">Directive</h4>
        </div>
        <p className="text-black/70 font-mono text-[10px] tracking-widest uppercase leading-relaxed">
          CONSISTENT TELEMETRY LOGGING INCREASES NEURAL NETWORK ACCURACY. MAINTAIN DATA INGESTION FOR OPTIMAL PROTOCOL GENERATION.
        </p>
      </Card>
    </div>
  )
}
