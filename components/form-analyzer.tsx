"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader, Target } from "lucide-react"

export function FormAnalyzer() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [feedback, setFeedback] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formScore, setFormScore] = useState<number | null>(null)
  const [cameraReady, setCameraReady] = useState(false)

  // 🧠 Camera setup
  useEffect(() => {
    async function enableCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setCameraReady(true)
        }
      } catch (err) {
        console.error("Camera access error:", err)
        setFeedback("UNABLE TO ACCESS OPTICAL SENSOR. VERIFY PERMISSIONS.")
      }
    }

    enableCamera()

    // Cleanup camera stream when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  // 🧩 Simulated form analysis request
  const analyzeForm = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/form-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseName: "Bicep Curls",
          angles: { shoulder: 45, elbow: 60, wrist: 0 },
          reps: 8,
          notes: "User maintained good posture throughout",
        }),
      })

      const data = await response.json()
      setFeedback(data.feedback)
      setFormScore(Math.floor(Math.random() * 30 + 70)) // Simulated score
    } catch (error) {
      console.error("Error analyzing form:", error)
      setFeedback("TELEMETRY ERROR. UNABLE TO COMPUTE KINEMATICS. RETRY.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 min-h-screen bg-black pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="flex items-center gap-3 mb-3 opacity-60">
            <div className="w-8 h-px bg-white"></div>
            <span className="text-white text-[10px] font-mono tracking-wider">LIVE_FEED</span>
          </div>
          <h2 className="text-3xl font-bold text-white font-mono tracking-widest uppercase">
            Optical Kinematics
          </h2>
          <p className="text-gray-400 mt-3 font-mono text-xs tracking-wide uppercase">
            REAL-TIME AI FEEDBACK VIA POSE DETECTION AND GEOMETRIC ANALYSIS.
          </p>
        </div>

        <Card className="bg-transparent border border-white/20 p-8 rounded-none relative">
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/40"></div>
          
          <div className="mb-8 relative">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${cameraReady ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
              <span className="text-white font-mono text-[10px] tracking-widest uppercase shadow-black drop-shadow-md">
                {cameraReady ? 'REC' : 'STANDBY'}
              </span>
            </div>
            
            {/* Viewfinder brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/50 z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/50 z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/50 z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/50 z-10 pointer-events-none"></div>
            
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`w-full aspect-video object-cover bg-black border border-white/10 filter ${!cameraReady ? 'opacity-50 grayscale' : 'grayscale-0'}`}
            />
            {!cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-white/50 font-mono text-xs tracking-widest uppercase animate-pulse">
                  AWAITING OPTICAL INPUT...
                </p>
              </div>
            )}
          </div>

          <Button
            onClick={analyzeForm}
            disabled={isLoading || !cameraReady}
            className="w-full bg-white text-black hover:bg-gray-200 border border-white rounded-none font-mono text-xs tracking-widest uppercase transition-all duration-300 h-14"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 mr-3 animate-spin" />
                COMPUTING KINEMATICS...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-3" />
                INITIATE SCAN
              </>
            )}
          </Button>

          {formScore !== null && (
            <div className="mt-8 p-6 bg-black border border-white/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px] animate-[gradient_3s_linear_infinite] pointer-events-none"></div>
              <p className="text-white/50 font-mono text-[10px] tracking-widest uppercase mb-4 border-b border-white/10 pb-2">ALIGNMENT SCORE</p>
              <div className="flex items-center gap-6">
                <div className="text-5xl font-bold text-white font-mono tracking-tighter">
                  {formScore}<span className="text-lg text-white/30 ml-1">/100</span>
                </div>
                <div className="flex-1 bg-white/10 h-1 relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-white transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    style={{ width: `${formScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {feedback && (
          <Card className="mt-8 bg-transparent border border-white/20 p-8 rounded-none relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-white"></div>
            <h3 className="text-sm font-bold text-white mb-6 font-mono tracking-widest uppercase flex items-center gap-3">
              <div className="w-2 h-2 bg-white animate-pulse"></div>
              SYSTEM DIAGNOSTIC
            </h3>
            <p className="text-gray-300 font-mono text-xs tracking-wider uppercase leading-relaxed whitespace-pre-wrap pl-6 border-l border-white/10">
              {feedback}
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
