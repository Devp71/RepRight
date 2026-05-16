"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Volume2 } from "lucide-react"

interface VoiceSettingsProps {
  settings: {
    voiceStyle: string
    speakingPace: string
    frequency: string
    includeFormTips: boolean
    volume: number
  }
  onSettingsChange: (settings: any) => void
  onBack: () => void
}

export function VoiceSettings({ settings, onSettingsChange, onBack }: VoiceSettingsProps) {
  const voiceStyles = [
    { value: "motivational", label: "Motivational", description: "Constant encouragement and hype" },
    { value: "technical", label: "Technical", description: "Focus on form and technique cues" },
    { value: "minimal", label: "Minimal", description: "Only critical tips and countdowns" },
  ]

  const speakingPaces = [
    { value: "slow", label: "Slow", description: "Easier to understand" },
    { value: "normal", label: "Normal", description: "Standard speaking pace" },
    { value: "fast", label: "Fast", description: "Quick and concise" },
  ]

  const frequencies = [
    { value: "every_rep", label: "Every Rep", description: "Coaching on every single rep" },
    { value: "every_set", label: "Every Set", description: "Guidance at the start of each set" },
    { value: "form_tips", label: "Form Tips Only", description: "Only when form improvements needed" },
  ]

  return (
    <div className="min-h-screen bg-black relative pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="flex items-start gap-6 mb-16 border-b border-white/10 pb-8">
          <Button onClick={onBack} className="bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-none h-12 w-12 flex items-center justify-center p-0 transition-colors mt-2">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-4 opacity-60">
              <div className="w-12 h-px bg-white"></div>
              <span className="text-white text-[10px] font-mono tracking-wider">SYSTEM_PREFERENCES</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white font-mono tracking-widest uppercase">AUDIO PARAMETERS</h1>
            <p className="text-gray-400 mt-2 font-mono text-xs tracking-wide uppercase">CONFIGURE SYNTHETIC VOCAL PROTOCOLS</p>
          </div>
        </div>

        {/* Volume Control */}
        <Card className="bg-black border border-white/20 p-8 mb-8 rounded-none relative">
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40"></div>
          <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
            <Volume2 className="w-5 h-5 text-white animate-pulse" />
            <h2 className="text-sm font-bold text-white font-mono tracking-widest uppercase">Output Amplitude</h2>
          </div>
          <div className="flex items-center gap-8">
            <input
              type="range"
              min="0"
              max="100"
              value={settings.volume}
              onChange={(e) => onSettingsChange({ ...settings, volume: Number.parseInt(e.target.value) })}
              className="flex-1 h-px bg-white/20 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-black"
            />
            <span className="text-white font-mono text-xl w-16 text-right tracking-widest">{settings.volume}%</span>
          </div>
        </Card>

        {/* Voice Style */}
        <Card className="bg-black border border-white/20 p-8 mb-8 rounded-none relative">
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40"></div>
          <h2 className="text-sm font-bold text-white font-mono tracking-widest uppercase mb-8 border-b border-white/10 pb-4">Vocal Archetype</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {voiceStyles.map((style) => (
              <div
                key={style.value}
                onClick={() => onSettingsChange({ ...settings, voiceStyle: style.value })}
                className={`p-6 cursor-pointer transition-colors border relative group ${
                  settings.voiceStyle === style.value
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white border-white/20 hover:border-white/60"
                }`}
              >
                <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${settings.voiceStyle === style.value ? "border-black" : "border-white/40"}`}></div>
                <p className={`font-mono font-bold tracking-widest uppercase text-sm mb-2 ${settings.voiceStyle === style.value ? "text-black" : "text-white"}`}>
                  {settings.voiceStyle === style.value ? "> " : ""}{style.label}
                </p>
                <p className={`font-mono text-[10px] tracking-widest uppercase leading-relaxed ${settings.voiceStyle === style.value ? "text-black/70" : "text-white/40"}`}>
                  {style.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Speaking Pace */}
        <Card className="bg-black border border-white/20 p-8 mb-8 rounded-none relative">
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40"></div>
          <h2 className="text-sm font-bold text-white font-mono tracking-widest uppercase mb-8 border-b border-white/10 pb-4">Synthesis Velocity</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {speakingPaces.map((pace) => (
              <div
                key={pace.value}
                onClick={() => onSettingsChange({ ...settings, speakingPace: pace.value })}
                className={`p-6 cursor-pointer transition-colors border relative ${
                  settings.speakingPace === pace.value
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white border-white/20 hover:border-white/60"
                }`}
              >
                <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${settings.speakingPace === pace.value ? "border-black" : "border-white/40"}`}></div>
                <p className={`font-mono font-bold tracking-widest uppercase text-sm mb-2 ${settings.speakingPace === pace.value ? "text-black" : "text-white"}`}>
                  {settings.speakingPace === pace.value ? "> " : ""}{pace.label}
                </p>
                <p className={`font-mono text-[10px] tracking-widest uppercase leading-relaxed ${settings.speakingPace === pace.value ? "text-black/70" : "text-white/40"}`}>
                  {pace.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Coaching Frequency */}
        <Card className="bg-black border border-white/20 p-8 mb-8 rounded-none relative">
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40"></div>
          <h2 className="text-sm font-bold text-white font-mono tracking-widest uppercase mb-8 border-b border-white/10 pb-4">Cue Frequency</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {frequencies.map((freq) => (
              <div
                key={freq.value}
                onClick={() => onSettingsChange({ ...settings, frequency: freq.value })}
                className={`p-6 cursor-pointer transition-colors border relative ${
                  settings.frequency === freq.value
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white border-white/20 hover:border-white/60"
                }`}
              >
                <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${settings.frequency === freq.value ? "border-black" : "border-white/40"}`}></div>
                <p className={`font-mono font-bold tracking-widest uppercase text-sm mb-2 ${settings.frequency === freq.value ? "text-black" : "text-white"}`}>
                  {settings.frequency === freq.value ? "> " : ""}{freq.label}
                </p>
                <p className={`font-mono text-[10px] tracking-widest uppercase leading-relaxed ${settings.frequency === freq.value ? "text-black/70" : "text-white/40"}`}>
                  {freq.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Additional Options */}
        <Card className="bg-black border border-white/20 p-8 mb-12 rounded-none relative">
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40"></div>
          <h2 className="text-sm font-bold text-white font-mono tracking-widest uppercase mb-8 border-b border-white/10 pb-4">Secondary Directives</h2>
          <label className="flex items-start gap-4 cursor-pointer group">
            <div className="relative flex items-center justify-center w-6 h-6 mt-0.5">
              <input
                type="checkbox"
                checked={settings.includeFormTips}
                onChange={(e) => onSettingsChange({ ...settings, includeFormTips: e.target.checked })}
                className="peer sr-only"
              />
              <div className="w-6 h-6 border border-white/40 group-hover:border-white transition-colors peer-checked:bg-white flex items-center justify-center">
                {settings.includeFormTips && <div className="w-3 h-3 bg-black"></div>}
              </div>
            </div>
            <div>
              <span className="text-white font-mono font-bold tracking-widest uppercase text-sm">Include Form Tips</span>
              <p className="text-white/40 font-mono text-[10px] tracking-widest uppercase mt-2">
                ENABLE REAL-TIME KINEMATIC FEEDBACK DURING ACTIVE SESSIONS
              </p>
            </div>
          </label>
        </Card>

        {/* Back Button */}
        <Button
          onClick={onBack}
          className="w-full bg-white text-black hover:bg-gray-200 border border-white rounded-none font-mono text-sm tracking-widest uppercase transition-colors h-14"
        >
          CONFIRM CONFIGURATION
        </Button>
      </div>
    </div>
  )
}
