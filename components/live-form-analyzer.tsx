"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Play, Square, AlertCircle } from "lucide-react"
import { api } from "@/lib/api"

interface LiveFormAnalyzerProps {
  exerciseName: string
  onBack: () => void
}

declare global {
  interface Window {
    Pose: any
    drawConnectors: any
    drawLandmarks: any
    POSE_CONNECTIONS: any
  }
}

export function LiveFormAnalyzer({ exerciseName, onBack }: LiveFormAnalyzerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [repsCount, setRepsCount] = useState(0)
  const [currentFeedback, setCurrentFeedback] = useState("")
  const [currentAngle, setCurrentAngle] = useState(0)
  const [stage, setStage] = useState<string>("IDLE")
  const [cameraError, setCameraError] = useState("")
  const [targetReps] = useState(10)
  const [setComplete, setSetComplete] = useState(false)
  const [mediapipeReady, setMediapipeReady] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)

  const streamRef = useRef<MediaStream | null>(null)
  const detectionLoopRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const poseRef = useRef<any>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Mutable refs for core logic (avoids stale closures in MediaPipe callback)
  const stageRef = useRef<string | null>(null)
  const repsRef = useRef(0)
  const perfectRepsRef = useRef(0)
  const hitPerfectDepthRef = useRef(false)
  const isRecordingRef = useRef(false)
  const feedbackTimeRef = useRef(0)
  const lastFeedbackRef = useRef("")

  // Load MediaPipe scripts
  useEffect(() => {
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve()
          return
        }
        const script = document.createElement("script")
        script.src = src
        script.crossOrigin = "anonymous"
        script.onload = () => resolve()
        script.onerror = () => reject(new Error(`Failed to load: ${src}`))
        document.head.appendChild(script)
      })
    }

    const loadMediaPipe = async () => {
      if (typeof window.Pose !== "undefined") {
        setMediapipeReady(true)
        return
      }

      try {
        await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js")
        await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js")

        let attempts = 0
        const checkReady = setInterval(() => {
          attempts++
          if (typeof window.Pose !== "undefined") {
            clearInterval(checkReady)
            setMediapipeReady(true)
          } else if (attempts > 50) {
            clearInterval(checkReady)
            setCameraError("MEDIAPIPE INITIALIZATION FAILED. REFRESH PAGE.")
          }
        }, 100)
      } catch (err) {
        setCameraError("FAILED TO LOAD MEDIAPIPE SCRIPTS. CHECK NETWORK.")
      }
    }

    loadMediaPipe()
  }, [])

  const calculateAngle = useCallback((a: any, b: any, c: any): number => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
    let angle = Math.abs((radians * 180.0) / Math.PI)
    if (angle > 180.0) angle = 360.0 - angle
    return angle
  }, [])

  const initCamera = async () => {
    try {
      setCameraError("")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => setCameraError("Could not play camera feed."))
        }
        setIsCameraActive(true)
        setTimeout(() => startPoseDetection(), 500)
      }
    } catch (error: any) {
      setCameraError(error.name === "NotFoundError" ? "NO OPTICAL SENSOR DETECTED." : "CAMERA ACCESS DENIED.")
    }
  }

  const startPoseDetection = async () => {
    if (!window.Pose || !videoRef.current || !canvasRef.current) return

    const pose = new window.Pose({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    })
    poseRef.current = pose

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    })

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const video = videoRef.current
    if (!ctx) return

    pose.onResults((results: any) => {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      if (results.poseLandmarks && results.poseLandmarks.length > 0) {
        const landmarks = results.poseLandmarks
        let angle = 0
        let feedback = ""

        try {
          if (exerciseName === "BICEP CURLS") {
            const shoulder = landmarks[11] // LEFT_SHOULDER
            const elbow = landmarks[13]    // LEFT_ELBOW
            const wrist = landmarks[15]    // LEFT_WRIST
            const hip = landmarks[23]      // LEFT_HIP
            
            angle = calculateAngle(shoulder, elbow, wrist)
            const shoulderSwayAngle = calculateAngle(hip, shoulder, elbow)

            if (isRecordingRef.current) {
              // Bicep Curl - Two-tier: regular rep at <55, perfect at <40
              if (angle > 140) {
                stageRef.current = "DOWN"
                hitPerfectDepthRef.current = true
              }
              
              // Elbow sway downgrades from perfect, doesn't block rep
              if (shoulderSwayAngle > 45) {
                hitPerfectDepthRef.current = false
              }
              
              if (angle < 55 && stageRef.current === "DOWN") {
                stageRef.current = "UP"
                repsRef.current += 1
                if (hitPerfectDepthRef.current && angle < 40) {
                  perfectRepsRef.current += 1
                  feedback = "Perfect Curl"
                } else if (!hitPerfectDepthRef.current) {
                  feedback = "Keep Elbow Fixed"
                } else {
                  feedback = "Good Rep"
                }
                hitPerfectDepthRef.current = false
              } else if (angle > 120 && stageRef.current === "UP") {
                feedback = "Lower Slowly"
              }
            }
          } 
          else if (exerciseName === "SQUATS") {
            const shoulder = landmarks[11] // LEFT_SHOULDER
            const hip = landmarks[23]  // LEFT_HIP
            const knee = landmarks[25] // LEFT_KNEE
            const ankle = landmarks[27]// LEFT_ANKLE
            
            angle = calculateAngle(hip, knee, ankle) // Knee angle
            const hipAngle = calculateAngle(shoulder, hip, knee) // Torso/hip angle

            if (isRecordingRef.current) {
              // Squats - Two-tier: regular rep at <110, perfect at <90 with good torso
              if (angle > 150) {
                stageRef.current = "UP"
                hitPerfectDepthRef.current = true
              }
              
              if (hipAngle < 55) {
                hitPerfectDepthRef.current = false
              }
              
              if (angle < 110 && stageRef.current === "UP") {
                stageRef.current = "DOWN"
                repsRef.current += 1
                if (hitPerfectDepthRef.current && angle < 90) {
                  perfectRepsRef.current += 1
                  feedback = "Perfect Squat"
                } else if (!hitPerfectDepthRef.current) {
                  feedback = "Keep Chest Up"
                } else {
                  feedback = "Good Rep"
                }
                hitPerfectDepthRef.current = false
              } else if (angle > 140 && stageRef.current === "DOWN") {
                feedback = "Go Lower"
              }
            }
          }
          else if (exerciseName === "PUSH-UPS") {
            const shoulder = landmarks[11]
            const elbow = landmarks[13]
            const wrist = landmarks[15]
            angle = calculateAngle(shoulder, elbow, wrist)

            if (isRecordingRef.current) {
              // Pushups - Two-tier: regular rep at <110, perfect at <90
              if (angle > 140) {
                stageRef.current = "UP"
              }
              
              if (angle < 110 && stageRef.current === "UP") {
                stageRef.current = "DOWN"
                repsRef.current += 1
                if (angle < 90) {
                  perfectRepsRef.current += 1
                  feedback = "Perfect Pushup"
                } else {
                  feedback = "Good Rep"
                }
              } else if (angle > 120 && stageRef.current === "DOWN") {
                feedback = "Go Lower"
              }
            }
          }
          else if (exerciseName === "SHOULDER PRESS") {
            const shoulder = landmarks[11]
            const elbow = landmarks[13]
            const wrist = landmarks[15]
            angle = calculateAngle(shoulder, elbow, wrist)

            if (isRecordingRef.current) {
              // Shoulder Press - Two-tier: regular rep at >140, perfect at >160
              if (angle < 100) {
                stageRef.current = "DOWN"
              }
              
              if (angle > 140 && stageRef.current === "DOWN") {
                stageRef.current = "UP"
                repsRef.current += 1
                if (angle > 160) {
                  perfectRepsRef.current += 1
                  feedback = "Excellent Press"
                } else {
                  feedback = "Good Rep"
                }
              } else if (angle < 90 && stageRef.current === "UP") {
                feedback = "Lower Weight"
              }
            }
          }

          setCurrentAngle(Math.round(angle))
          
          if (isRecordingRef.current) {
            setStage(stageRef.current || "IDLE")
            
            // React handles repeated sets with the same value efficiently
            setRepsCount(repsRef.current)
            if (repsRef.current >= targetReps) setSetComplete(true)
            
            // Flashing feedback logic
            if (feedback && feedback !== lastFeedbackRef.current) {
              lastFeedbackRef.current = feedback
              setCurrentFeedback(feedback)
              feedbackTimeRef.current = Date.now()
            } else if (!feedback && lastFeedbackRef.current) {
              // Reset ref if user enters a neutral zone, allowing same feedback to trigger again later
              lastFeedbackRef.current = ""
            }
          }
        } catch (e) {
          // Ignore occasional landmark missing errors
        }

        // Draw connections
        if (typeof window.drawConnectors !== "undefined" && window.POSE_CONNECTIONS) {
          window.drawConnectors(ctx, landmarks, window.POSE_CONNECTIONS, { color: "#f57542", lineWidth: 2 })
          window.drawLandmarks(ctx, landmarks, { color: "#f542e6", lineWidth: 2, radius: 2 })
        }
      }
    })

    try {
      await pose.initialize()
    } catch (err) {
      setCameraError("POSE MODEL INITIALIZATION FAILED.")
      return
    }

    const sendFrame = async () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        try {
          await pose.send({ image: videoRef.current })
        } catch (err) {}
      }
      detectionLoopRef.current = setTimeout(sendFrame, 50)
    }
    sendFrame()
  }

  const startRecording = () => {
    isRecordingRef.current = true
    stageRef.current = null
    repsRef.current = 0
    perfectRepsRef.current = 0
    hitPerfectDepthRef.current = false
    setSessionTime(0)
    setIsRecording(true)
    setRepsCount(0)
    setCurrentFeedback("SCANNING INITIATED. BEGIN.")
    setSetComplete(false)
    setStage("IDLE")

    timerRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1)
    }, 1000)
  }

  const stopRecording = async () => {
    isRecordingRef.current = false
    setIsRecording(false)
    setStage("IDLE")
    if (timerRef.current) clearInterval(timerRef.current)
    setCurrentFeedback(`SESSION COMPLETE. TOTAL REPS: ${repsRef.current}`)
    
    // Save to backend
    if (repsRef.current > 0) {
      try {
        const score = Math.min(100, Math.round((perfectRepsRef.current / repsRef.current) * 100))
        await api.post('/api/form-analysis', {
          exercise: exerciseName,
          reps: repsRef.current,
          score: score,
          duration: sessionTime,
          feedback: `Completed. RPM: ${sessionTime > 0 ? ((repsRef.current / sessionTime) * 60).toFixed(1) : 0}. Perfect reps ratio: ${perfectRepsRef.current}/${repsRef.current}.`
        })
      } catch (err) {
        console.error("Failed to save session telemetry", err)
      }
    }
  }

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (detectionLoopRef.current) clearTimeout(detectionLoopRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
    if (videoRef.current) videoRef.current.srcObject = null
    setIsCameraActive(false)
    setIsRecording(false)
    isRecordingRef.current = false
  }, [])

  useEffect(() => { return () => { stopCamera() } }, [stopCamera])

  useEffect(() => {
    if (mediapipeReady && !isCameraActive) initCamera()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediapipeReady])

  const progressPct = Math.min((repsCount / targetReps) * 100, 100)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div className="min-h-screen bg-black pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-6 mb-12 border-b border-white/10 pb-8">
          <Button onClick={onBack} className="bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-none h-12 w-12 p-0">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-3 opacity-60">
              <div className="w-8 h-px bg-white"></div>
              <span className="text-white text-[10px] font-mono tracking-wider">LIVE_FEED</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white font-mono tracking-widest uppercase">
              {exerciseName}
            </h1>
            <p className="text-gray-400 mt-2 font-mono text-xs tracking-wide uppercase">
              REAL-TIME KINEMATIC ANALYSIS VIA MEDIAPIPE POSE DETECTION.
            </p>
          </div>
        </div>

        {/* Error */}
        {cameraError && (
          <Card className="mb-6 bg-transparent border border-red-500/40 p-4 flex items-center gap-3 rounded-none">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400 font-mono text-xs tracking-widest uppercase">{cameraError}</p>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Camera Feed */}
          <div className="lg:col-span-2">
            <Card className="bg-transparent border border-white/20 p-6 rounded-none relative">
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/40"></div>
              
              <div className="relative aspect-video bg-black overflow-hidden border border-white/10">
                {/* Viewfinder brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/50 z-10 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/50 z-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/50 z-10 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/50 z-10 pointer-events-none"></div>

                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : isCameraActive ? 'bg-green-500' : 'bg-white/30 animate-pulse'}`}></div>
                  <span className="text-white font-mono text-[10px] tracking-widest uppercase">
                    {isRecording ? 'REC' : isCameraActive ? 'LIVE' : 'CONNECTING...'}
                  </span>
                </div>

                {isCameraActive && (
                  <div className="absolute top-4 right-4 z-10 bg-black/70 border border-white/20 px-3 py-1.5 flex gap-4">
                    <div>
                      <span className="text-[10px] font-mono text-white/40 tracking-widest block">ANGLE</span>
                      <span className="text-lg font-mono font-bold text-white">{currentAngle}°</span>
                    </div>
                  </div>
                )}

                {/* Main feedback overlay */}
                {isRecording && currentFeedback && Date.now() - feedbackTimeRef.current < 2000 && (
                  <div className="absolute bottom-4 left-4 z-10 bg-black/80 border border-white/20 px-4 py-2">
                    <span className={`font-mono text-sm font-bold tracking-widest ${
                      currentFeedback.includes('Perfect') || currentFeedback.includes('Excellent') || currentFeedback.includes('Good') 
                        ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {currentFeedback.toUpperCase()}
                    </span>
                  </div>
                )}

                {!isCameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-4 animate-pulse">
                      <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    </div>
                    <p className="text-white/40 font-mono text-xs tracking-widest uppercase">
                      {mediapipeReady ? 'ACTIVATING OPTICAL SENSOR...' : 'LOADING MEDIAPIPE...'}
                    </p>
                  </div>
                )}

                {/* Using scaleX(-1) inline style to mirror the video natively in browser */}
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover absolute inset-0" style={{ transform: 'scaleX(-1)' }} />
                <canvas ref={canvasRef} className="w-full h-full relative z-[5]" style={{ transform: 'scaleX(-1)' }} />
              </div>

              {/* Controls */}
              <div className="mt-6 flex gap-3">
                {isCameraActive ? (
                  <>
                    {!isRecording ? (
                      <Button onClick={startRecording} className="flex-1 bg-white text-black hover:bg-gray-200 border border-white rounded-none font-mono text-xs tracking-widest uppercase h-14">
                        <Play className="w-4 h-4 mr-2" /> START SESSION
                      </Button>
                    ) : (
                      <Button onClick={stopRecording} className="flex-1 bg-transparent text-white hover:bg-white/10 border border-white/40 rounded-none font-mono text-xs tracking-widest uppercase h-14">
                        <Square className="w-4 h-4 mr-2" /> END SESSION
                      </Button>
                    )}
                    <Button onClick={() => { stopCamera(); onBack(); }} className="bg-transparent text-white/50 hover:text-white hover:bg-white/10 border border-white/20 rounded-none font-mono text-xs tracking-widest uppercase h-14 px-6">
                      EXIT
                    </Button>
                  </>
                ) : (
                  <Button disabled className="w-full bg-white/10 text-white border border-white/20 rounded-none font-mono text-xs tracking-widest uppercase h-14">
                    INITIALIZING...
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-transparent border border-white/20 p-6 rounded-none relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-white/20"></div>
              <h3 className="text-[10px] font-mono text-white/40 tracking-widest uppercase mb-4 pb-3 border-b border-white/10">
                TELEMETRY
              </h3>
              
              <div className="mb-6">
                <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase block mb-1">REPS DETECTED</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white font-mono">{repsCount}</span>
                  <span className="text-lg text-white/30 font-mono">/{targetReps}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="w-full bg-white/10 h-1 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-white transition-all duration-500 ease-out" style={{ width: `${progressPct}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase block mb-1">STAGE</span>
                  <span className="text-xl font-bold text-white font-mono">{stage}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase block mb-1">SESSION TIME</span>
                  <span className="text-xl font-bold text-white font-mono">{formatTime(sessionTime)}</span>
                </div>
              </div>
            </Card>

            {/* Diagnostic Panel */}
            <Card className="bg-transparent border border-white/20 p-6 rounded-none relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-white"></div>
              <h3 className="text-[10px] font-mono text-white/40 tracking-widest uppercase mb-3 pb-2 border-b border-white/10 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white animate-pulse"></div>
                SYSTEM DIAGNOSTIC
              </h3>
              <p className="text-gray-300 font-mono text-xs tracking-wider uppercase leading-relaxed pl-4 border-l border-white/10">
                {currentFeedback || "AWAITING SENSOR INPUT..."}
              </p>
            </Card>

            {/* Summary Overlay */}
            {setComplete && (
              <Card className="bg-white text-black border border-white p-6 rounded-none">
                <h3 className="font-mono font-bold tracking-widest uppercase text-sm mb-3 border-b border-black/10 pb-2">
                  TARGET ATTAINED
                </h3>
                <p className="font-mono text-xs tracking-widest uppercase text-black/60 mb-2">
                  {repsCount} REPS COMPLETED
                </p>
                <p className="font-mono text-xs tracking-widest uppercase text-black/60">
                  RPM: {sessionTime > 0 ? ((repsCount / sessionTime) * 60).toFixed(1) : 0}
                </p>
                <Button onClick={() => { stopRecording(); setSetComplete(false); }} className="mt-6 w-full bg-black text-white hover:bg-gray-900 rounded-none font-mono text-xs tracking-widest uppercase h-10">
                  CLOSE
                </Button>
              </Card>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
