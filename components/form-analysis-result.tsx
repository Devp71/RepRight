"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Download, Share2, TrendingUp } from "lucide-react"

interface AnalysisResult {
  id: string
  exercise: string
  timestamp: Date
  score: number
  feedback: string[]
  improvements: string[]
  videoUrl: string
}

interface FormAnalysisResultProps {
  result: AnalysisResult
  onBack: () => void
}

export function FormAnalysisResult({ result, onBack }: FormAnalysisResultProps) {
  const scoreColor =
    result.score >= 80
      ? "from-green-500 to-emerald-500"
      : result.score >= 60
        ? "from-yellow-500 to-orange-500"
        : "from-orange-500 to-red-500"

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={onBack} className="bg-slate-700 hover:bg-slate-600" size="sm">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-white">{result.exercise}</h1>
            <p className="text-slate-300 mt-2">
              {result.timestamp.toLocaleDateString()} at {result.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Score Card */}
        <Card className={`bg-gradient-to-br ${scoreColor}/20 border-${scoreColor.split(" ")[1]}-500/50 p-8 mb-8`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-lg mb-2">Form Score</p>
              <p className={`text-6xl font-bold bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent`}>
                {result.score}%
              </p>
            </div>
            <TrendingUp className={`w-20 h-20 text-${scoreColor.split(" ")[1]}-400`} />
          </div>
        </Card>

        {/* Video */}
        <Card className="bg-slate-800/50 border-blue-500/30 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Your Video</h2>
          <video src={result.videoUrl} controls className="w-full bg-black rounded-lg max-h-96" />
        </Card>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <Card className="bg-slate-800/50 border-blue-500/30 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-green-400">✓</span> Strengths
            </h3>
            <div className="space-y-3">
              {result.feedback.map((item, idx) => (
                <div key={idx} className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-slate-300 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Areas to Improve */}
          <Card className="bg-slate-800/50 border-blue-500/30 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-400">!</span> Areas to Improve
            </h3>
            <div className="space-y-3">
              {result.improvements.map((item, idx) => (
                <div key={idx} className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <p className="text-slate-300 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button className="bg-slate-700 hover:bg-slate-600">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button className="bg-slate-700 hover:bg-slate-600">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  )
}
