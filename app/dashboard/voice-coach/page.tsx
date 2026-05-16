"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic2, Volume2, Settings, Play, Radio, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { VoiceCoachSession } from "@/components/voice-coach-session"
import { VoiceSettings } from "@/components/voice-settings"

export default function VoiceCoach() {
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<string>("")
  const [coachSettings, setCoachSettings] = useState({
    voiceStyle: "motivational",
    speakingPace: "normal",
    frequency: "every_set",
    includeFormTips: true,
    volume: 80,
  })

  const exercises = [
    { name: "Barbell Back Squat", duration: 45, sets: 4, reps: 8 },
    { name: "Deadlift", duration: 40, sets: 3, reps: 5 },
    { name: "Bench Press", duration: 45, sets: 4, reps: 6 },
    { name: "Barbell Row", duration: 40, sets: 4, reps: 8 },
    { name: "Overhead Press", duration: 30, sets: 3, reps: 8 },
    { name: "Pull-ups", duration: 20, sets: 3, reps: 10 },
  ]

  const handleStartSession = (exercise: string) => {
    setSelectedExercise(exercise)
    setIsSessionActive(true)
  }

  const handleEndSession = () => {
    setIsSessionActive(false)
    setSelectedExercise("")
  }

  if (isSessionActive && selectedExercise) {
    return <VoiceCoachSession exercise={selectedExercise} settings={coachSettings} onEnd={handleEndSession} />
  }

  if (showSettings) {
    return (
      <VoiceSettings
        settings={coachSettings}
        onSettingsChange={setCoachSettings}
        onBack={() => setShowSettings(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-black relative pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-6 border-b border-white/10 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Link href="/dashboard">
              <Button className="bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-none h-12 w-12 flex items-center justify-center p-0 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-4 opacity-60">
                <div className="w-12 h-px bg-white"></div>
                <span className="text-white text-[10px] font-mono tracking-wider">MODULE.04</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white font-mono tracking-widest uppercase flex items-center gap-4">
                <Mic2 className="w-10 h-10 text-white/50" />
                VOICE_COACH
              </h1>
              <p className="text-gray-400 mt-4 font-mono text-xs tracking-wide uppercase">
                REAL-TIME AUDIO GUIDANCE AND NEURAL MOTIVATION INTERFACE.
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setShowSettings(true)} 
            className="bg-transparent text-white font-mono text-[10px] border border-white/30 hover:bg-white/10 transition-colors rounded-none uppercase tracking-widest h-10 mb-2 lg:mb-0"
          >
            <Settings className="w-3 h-3 mr-2" />
            Parameters
          </Button>
        </div>

        {/* Info Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-black border border-white/10 p-8 rounded-none hover:border-white/30 transition-colors relative group">
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
              <Mic2 className="w-5 h-5 text-white/50" />
              <h3 className="text-sm font-bold text-white font-mono tracking-widest uppercase">Live Coaching</h3>
            </div>
            <p className="text-gray-400 font-mono text-[10px] tracking-widest uppercase leading-relaxed">
              REAL-TIME VERBAL INSTRUCTIONS AND FORM FEEDBACK DURING ACTIVE SESSIONS.
            </p>
          </Card>

          <Card className="bg-black border border-white/10 p-8 rounded-none hover:border-white/30 transition-colors relative group">
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
              <Volume2 className="w-5 h-5 text-white/50" />
              <h3 className="text-sm font-bold text-white font-mono tracking-widest uppercase">Adaptive Tone</h3>
            </div>
            <p className="text-gray-400 font-mono text-[10px] tracking-widest uppercase leading-relaxed">
              CUSTOMIZE SYNTHETIC VOCAL TONE FROM AGGRESSIVE MOTIVATION TO TECHNICAL CUES.
            </p>
          </Card>

          <Card className="bg-black border border-white/10 p-8 rounded-none hover:border-white/30 transition-colors relative group">
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
              <Radio className="w-5 h-5 text-white/50" />
              <h3 className="text-sm font-bold text-white font-mono tracking-widest uppercase">Smart Intervals</h3>
            </div>
            <p className="text-gray-400 font-mono text-[10px] tracking-widest uppercase leading-relaxed">
              CONFIGURE COACHING FREQUENCY: EVERY SET, EVERY REP, OR KINEMATIC ALERTS ONLY.
            </p>
          </Card>
        </div>

        {/* Exercise Selection */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8 opacity-80">
            <h2 className="text-xl font-bold text-white font-mono tracking-widest uppercase">Initiate Session</h2>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <Card
                key={exercise.name}
                className="bg-transparent border border-white/20 hover:border-white p-6 transition-colors cursor-pointer rounded-none relative group"
                onClick={() => handleStartSession(exercise.name)}
              >
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h3 className="text-lg font-bold text-white font-mono tracking-widest uppercase mb-4 group-hover:text-white transition-colors">{exercise.name}</h3>
                <div className="space-y-2 font-mono text-[10px] tracking-widest uppercase text-white/60 mb-6 border-l border-white/20 pl-3">
                  <p>DURATION: {exercise.duration} MIN</p>
                  <p>VOLUME: {exercise.sets} SETS × {exercise.reps} REPS</p>
                </div>
                <Button className="w-full bg-white text-black hover:bg-gray-200 border border-white rounded-none font-mono text-xs tracking-widest uppercase transition-colors">
                  <Play className="w-3 h-3 mr-2" />
                  START
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div>
          <div className="flex items-center gap-4 mb-8 opacity-80">
            <h2 className="text-xl font-bold text-white font-mono tracking-widest uppercase">System Capabilities</h2>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-black border border-white/10 p-8 rounded-none">
              <h3 className="text-sm font-bold text-white font-mono tracking-widest uppercase mb-6 flex items-center gap-2 border-b border-white/10 pb-3">
                <div className="w-1.5 h-1.5 bg-white animate-pulse"></div>
                Form Guidance
              </h3>
              <ul className="space-y-4 font-mono text-[10px] tracking-widest uppercase text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="text-white mt-0.5">{'>'}</span>
                  REAL-TIME EXERCISE INSTRUCTIONS
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-0.5">{'>'}</span>
                  FORM CUES AND DEPTH REMINDERS
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-0.5">{'>'}</span>
                  BREATHING TECHNIQUE GUIDANCE
                </li>
              </ul>
            </Card>

            <Card className="bg-black border border-white/10 p-8 rounded-none">
              <h3 className="text-sm font-bold text-white font-mono tracking-widest uppercase mb-6 flex items-center gap-2 border-b border-white/10 pb-3">
                <div className="w-1.5 h-1.5 bg-white animate-pulse"></div>
                Motivation & Tracking
              </h3>
              <ul className="space-y-4 font-mono text-[10px] tracking-widest uppercase text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="text-white mt-0.5">{'>'}</span>
                  PERSONALIZED MOTIVATIONAL PROTOCOLS
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-0.5">{'>'}</span>
                  REP AND SET COUNTDOWNS
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-0.5">{'>'}</span>
                  PERFORMANCE MILESTONES
                </li>
              </ul>
            </Card>

            <Card className="bg-black border border-white/10 p-8 rounded-none">
              <h3 className="text-sm font-bold text-white font-mono tracking-widest uppercase mb-6 flex items-center gap-2 border-b border-white/10 pb-3">
                <div className="w-1.5 h-1.5 bg-white animate-pulse"></div>
                Smart Coaching Modes
              </h3>
              <ul className="space-y-4 font-mono text-[10px] tracking-widest uppercase text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="text-white mt-0.5">{'>'}</span>
                  MOTIVATIONAL: CONSTANT ENCOURAGEMENT
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-0.5">{'>'}</span>
                  TECHNICAL: FORM AND TECHNIQUE FOCUS
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-0.5">{'>'}</span>
                  MINIMAL: CRITICAL ALERTS ONLY
                </li>
              </ul>
            </Card>

            <Card className="bg-black border border-white/10 p-8 rounded-none">
              <h3 className="text-sm font-bold text-white font-mono tracking-widest uppercase mb-6 flex items-center gap-2 border-b border-white/10 pb-3">
                <div className="w-1.5 h-1.5 bg-white animate-pulse"></div>
                Customization
              </h3>
              <ul className="space-y-4 font-mono text-[10px] tracking-widest uppercase text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="text-white mt-0.5">{'>'}</span>
                  ADJUST SYNTHESIS PACE
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-0.5">{'>'}</span>
                  AMPLITUDE CONTROL
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-0.5">{'>'}</span>
                  CUE FREQUENCY MODULATION
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
