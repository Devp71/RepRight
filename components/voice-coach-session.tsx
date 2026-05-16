"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pause, Play, Volume2, X, ChevronRight } from "lucide-react"

interface VoiceCoachSessionProps {
  exercise: string
  settings: any
  onEnd: () => void
}

export function VoiceCoachSession({ exercise, settings, onEnd }: VoiceCoachSessionProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentSet, setCurrentSet] = useState(1)
  const [currentRep, setCurrentRep] = useState(1)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isMuted, setIsMuted] = useState(false)

  // Mock data for the exercise
  const workoutData = {
    "Barbell Back Squat": { sets: 4, reps: 8, totalTime: 45 },
    Deadlift: { sets: 3, reps: 5, totalTime: 40 },
    "Bench Press": { sets: 4, reps: 6, totalTime: 45 },
    "Barbell Row": { sets: 4, reps: 8, totalTime: 40 },
    "Overhead Press": { sets: 3, reps: 8, totalTime: 30 },
    "Pull-ups": { sets: 3, reps: 10, totalTime: 20 },
  }

  const workout = workoutData[exercise as keyof typeof workoutData]
  const progress =
    (((currentSet - 1) * (workout?.reps || 1) + currentRep) / ((workout?.sets || 1) * (workout?.reps || 1))) * 100

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying) {
      timer = setInterval(() => setTimeElapsed((t) => t + 1), 1000)
    }
    return () => clearInterval(timer)
  }, [isPlaying])

  const voiceMessages: Record<string, string[]> = {
    motivational: [
      "You've got this! Keep pushing!",
      "Great form! You're crushing it!",
      "One more rep, you can do it!",
      "Fantastic effort! Keep the momentum going!",
      "You're stronger than you think!",
    ],
    technical: [
      "Keep your chest up and core tight",
      "Depth looks good, drive through heels",
      "Control the descent, explosive on the way up",
      "Your form is looking solid today",
      "Maintain your breathing pattern",
    ],
  }

  const handleNextRep = () => {
    if (currentRep < (workout?.reps || 1)) {
      setCurrentRep(currentRep + 1)
    } else if (currentSet < (workout?.sets || 1)) {
      setCurrentSet(currentSet + 1)
      setCurrentRep(1)
    }
  }

  const handleCompleteSet = () => {
    if (currentSet < (workout?.sets || 1)) {
      setCurrentSet(currentSet + 1)
      setCurrentRep(1)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getRandomMessage = (style: string) => {
    const messages = voiceMessages[style as keyof typeof voiceMessages] || voiceMessages.motivational
    return messages[Math.floor(Math.random() * messages.length)]
  }

  return (
    <div className="min-h-screen bg-black relative pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-12 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-4 opacity-60">
              <div className="w-12 h-px bg-white"></div>
              <span className="text-white text-[10px] font-mono tracking-wider">ACTIVE_SESSION</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white font-mono tracking-widest uppercase">{exercise}</h1>
            <p className="text-gray-400 mt-2 font-mono text-xs tracking-wide uppercase">LIVE NEURAL COACHING STREAM IN PROGRESS</p>
          </div>
          <Button onClick={onEnd} className="bg-transparent border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white rounded-none font-mono text-xs tracking-widest uppercase transition-colors h-10">
            <X className="w-4 h-4 mr-2" />
            Abort
          </Button>
        </div>

        {/* Main Session Card */}
        <Card className="bg-black border border-white/20 p-12 mb-8 rounded-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/40"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/40"></div>
          
          <div className="text-center mb-12">
            <div className="text-6xl md:text-8xl font-bold text-white mb-6 font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              S{currentSet}<span className="text-white/20">.</span>R{currentRep}
            </div>
            <p className="text-white/60 font-mono text-sm tracking-widest uppercase flex items-center justify-center gap-3">
              <span className="w-2 h-2 bg-white animate-pulse"></span>
              T+{formatTime(timeElapsed)}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-16">
            <div className="flex justify-between mb-3">
              <span className="text-[10px] font-mono tracking-widest uppercase text-white/40">Protocol Completion</span>
              <span className="text-[10px] font-mono tracking-widest text-white">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/10 h-1 relative">
              <div
                className="absolute top-0 left-0 bg-white h-full transition-all duration-500 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Voice Message Display */}
          <div className="bg-transparent border border-white/20 p-8 mb-12 text-center relative group">
            <div className="absolute left-0 top-0 w-1 h-full bg-white/30 group-hover:bg-white transition-colors"></div>
            <div className="flex items-center justify-center gap-3 mb-4 opacity-70">
              <Volume2 className={`w-4 h-4 ${isMuted ? "text-red-500" : "text-white animate-pulse"}`} />
              <span className="text-[10px] font-mono tracking-widest uppercase text-white">
                {isMuted ? "AUDIO_MUTED" : "RECEIVING_TRANSMISSION..."}
              </span>
            </div>
            <p className="text-white text-lg md:text-xl font-mono tracking-wider uppercase leading-relaxed">
              "{getRandomMessage(settings.voiceStyle)}"
            </p>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-4 mb-12 justify-center">
            <Button 
              onClick={() => setIsPlaying(!isPlaying)} 
              className={`rounded-none font-mono text-xs tracking-widest uppercase transition-colors h-12 px-8 ${
                isPlaying 
                ? "bg-white text-black hover:bg-gray-200 border border-white" 
                : "bg-transparent text-white border border-white/30 hover:bg-white/10"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-3" />
                  HALT
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-3" />
                  RESUME
                </>
              )}
            </Button>

            <Button
              onClick={() => setIsMuted(!isMuted)}
              className="bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-none font-mono text-xs tracking-widest uppercase transition-colors h-12 px-8"
            >
              <Volume2 className="w-4 h-4 mr-3" />
              {isMuted ? "ENABLE_AUDIO" : "MUTE_AUDIO"}
            </Button>
          </div>

          {/* Rep/Set Controls */}
          <div className="grid md:grid-cols-2 gap-6 pt-8 border-t border-white/10">
            <Button
              onClick={handleNextRep}
              disabled={currentSet === workout?.sets && currentRep === workout?.reps}
              className="bg-transparent border border-white/30 text-white hover:bg-white hover:text-black rounded-none font-mono text-xs tracking-widest uppercase transition-colors h-14 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
            >
              LOG REP
              <ChevronRight className="w-4 h-4 ml-3" />
            </Button>

            <Button
              onClick={handleCompleteSet}
              disabled={currentSet === workout?.sets}
              className="bg-white text-black hover:bg-gray-200 border border-white rounded-none font-mono text-xs tracking-widest uppercase transition-colors h-14 disabled:opacity-30 disabled:bg-transparent disabled:text-white"
            >
              FINISH SET
              <ChevronRight className="w-4 h-4 ml-3" />
            </Button>
          </div>
        </Card>

        {/* Workout Info */}
        <div className="grid grid-cols-3 gap-6">
          <Card className="bg-black border border-white/10 p-6 rounded-none text-center">
            <p className="text-white/40 font-mono text-[10px] tracking-widest uppercase mb-3 border-b border-white/10 pb-2">TARGET SETS</p>
            <p className="text-2xl font-bold text-white font-mono">{workout?.sets}</p>
          </Card>

          <Card className="bg-black border border-white/10 p-6 rounded-none text-center">
            <p className="text-white/40 font-mono text-[10px] tracking-widest uppercase mb-3 border-b border-white/10 pb-2">REPS/SET</p>
            <p className="text-2xl font-bold text-white font-mono">{workout?.reps}</p>
          </Card>

          <Card className="bg-black border border-white/10 p-6 rounded-none text-center">
            <p className="text-white/40 font-mono text-[10px] tracking-widest uppercase mb-3 border-b border-white/10 pb-2">EST. TIME</p>
            <p className="text-2xl font-bold text-white font-mono">{workout?.totalTime}<span className="text-sm text-white/30 ml-1">M</span></p>
          </Card>
        </div>
      </div>
    </div>
  )
}
