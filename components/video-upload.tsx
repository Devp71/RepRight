"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface VideoUploadProps {
  exercise: string
  onUpload: (file: File) => void
  onCancel: () => void
  isAnalyzing: boolean
}

export function VideoUpload({ exercise, onUpload, onCancel, isAnalyzing }: VideoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [recordingMode, setRecordingMode] = useState<"upload" | "camera" | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserUserMedia({ video: true, audio: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setRecordingMode("camera")
      setIsRecording(false)
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Could not access camera. Please check permissions.")
    }
  }

  const startRecording = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" })
        const file = new File([blob], "recorded-form.webm", { type: "video/webm" })
        setSelectedFile(file)
        setRecordingMode(null)
        // Stop camera stream
        const stream = videoRef.current?.srcObject as MediaStream
        stream?.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile)
    }
  }

  if (recordingMode === "camera") {
    return (
      <Card className="bg-slate-800/50 border-blue-500/30 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Record Exercise Form</h2>
        <div className="space-y-4">
          <video ref={videoRef} autoPlay playsInline className="w-full bg-black rounded-lg" />
          <div className="flex gap-3 justify-end">
            <Button onClick={onCancel} className="bg-slate-700 hover:bg-slate-600">
              Cancel
            </Button>
            {!isRecording ? (
              <Button
                onClick={startRecording}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
              >
                Start Recording
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
              >
                Stop Recording
              </Button>
            )}
          </div>
        </div>
      </Card>
    )
  }

  if (selectedFile && !recordingMode) {
    return (
      <Card className="bg-slate-800/50 border-blue-500/30 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Review Your Video</h2>
        <p className="text-slate-300 mb-4">
          Exercise: <span className="text-cyan-400 font-medium">{exercise}</span>
        </p>

        <video src={preview} controls className="w-full bg-black rounded-lg mb-6 max-h-96" />

        <div className="flex gap-3 justify-end">
          <Button
            onClick={() => {
              setSelectedFile(null)
              setPreview("")
              setRecordingMode(null)
            }}
            className="bg-slate-700 hover:bg-slate-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Form"}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-blue-500/30 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Upload Exercise Video</h2>
      <p className="text-slate-300 mb-6">
        Exercise: <span className="text-cyan-400 font-medium">{exercise}</span>
      </p>

      <div className="space-y-4">
        {/* Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
        >
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-white font-medium">Click to upload or drag and drop</p>
          <p className="text-slate-400 text-sm">MP4, WebM, or MOV (max 100MB)</p>
          <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileSelect} className="hidden" />
        </div>

        {/* OR Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 border-t border-slate-600"></div>
          <span className="text-slate-400 text-sm">OR</span>
          <div className="flex-1 border-t border-slate-600"></div>
        </div>

        {/* Camera Option */}
        <Button onClick={startCamera} className="w-full bg-slate-700 hover:bg-slate-600 h-12">
          Record with Camera
        </Button>

        {/* Cancel */}
        <Button onClick={onCancel} className="w-full bg-slate-700 hover:bg-slate-600">
          Cancel
        </Button>
      </div>
    </Card>
  )
}
