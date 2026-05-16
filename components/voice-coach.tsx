"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic2, Volume2, Loader, Play } from "lucide-react"

export function VoiceCoach() {
  const [coaching, setCoaching] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const generateCoaching = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/voice-coaching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exercise: "Bicep Curls",
          setNumber: 2,
          repsTarget: 10,
          motivation: "energetic",
        }),
      })

      const data = await response.json()
      setCoaching(data.coachingText)
    } catch (error) {
      console.error("Error generating coaching:", error)
      setCoaching("Error generating coaching text. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const speakCoaching = () => {
    if ("speechSynthesis" in window && coaching) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(coaching)
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Voice Coaching</h2>
        <p className="text-slate-400 mb-6">Real-time audio guidance and motivation during workouts</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {["Bicep Curls", "Squats", "Push-ups"].map((exercise) => (
          <Card
            key={exercise}
            className="bg-slate-800/50 border-blue-500/30 p-4 cursor-pointer hover:border-blue-500 transition-all"
          >
            <p className="text-white font-semibold text-center">{exercise}</p>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-800/50 border-blue-500/30 p-6">
        <Button
          onClick={generateCoaching}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 mb-4"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Mic2 className="w-4 h-4 mr-2" />
              Generate Coaching
            </>
          )}
        </Button>

        {coaching && (
          <>
            <div className="p-4 bg-blue-600/20 border border-blue-500/30 rounded mb-4">
              <p className="text-slate-300">{coaching}</p>
            </div>

            <Button
              onClick={speakCoaching}
              disabled={isSpeaking}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              {isSpeaking ? (
                <>
                  <Volume2 className="w-4 h-4 mr-2 animate-pulse" />
                  Playing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Play Voice Coaching
                </>
              )}
            </Button>
          </>
        )}
      </Card>
    </div>
  )
}
