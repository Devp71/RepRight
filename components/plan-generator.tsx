"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface PlanGeneratorProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function PlanGenerator({ onSubmit, onCancel }: PlanGeneratorProps) {
  const [formData, setFormData] = useState({
    name: "",
    goal: "muscle_gain",
    fitnessLevel: "intermediate",
    duration: "4",
    frequency: "4",
    focusAreas: ["chest", "back"],
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter((a) => a !== area)
        : [...prev.focusAreas, area],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim()) {
      onSubmit(formData)
      setFormData({
        name: "",
        goal: "muscle_gain",
        fitnessLevel: "intermediate",
        duration: "4",
        frequency: "4",
        focusAreas: ["chest", "back"],
        notes: "",
      })
    }
  }

  const focusAreas = [
    { id: "chest", label: "Chest" },
    { id: "back", label: "Back" },
    { id: "legs", label: "Legs" },
    { id: "shoulders", label: "Shoulders" },
    { id: "arms", label: "Arms" },
    { id: "core", label: "Core" },
  ]

  return (
    <Card className="bg-black/90 backdrop-blur-md border border-white/20 p-8 rounded-none relative">
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/40"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/40"></div>
      
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-white animate-pulse"></div>
          <h2 className="text-xl font-bold text-white font-mono tracking-widest uppercase">INITIALIZE MATRIX</h2>
        </div>
        <button onClick={onCancel} className="text-white/40 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Plan Name */}
        <div>
          <label className="block text-[10px] font-mono tracking-widest text-white/60 mb-2 uppercase">Designation</label>
          <input
            type="text"
            name="name"
            placeholder="E.G., SUMMER STRENGTH PROGRAM"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-transparent border border-white/20 rounded-none px-4 py-3 text-white font-mono text-sm placeholder-white/20 focus:outline-none focus:border-white transition-colors"
            required
          />
        </div>

        {/* Goal Selection */}
        <div>
          <label className="block text-[10px] font-mono tracking-widest text-white/60 mb-2 uppercase">Primary Objective</label>
          <select
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            className="w-full bg-black border border-white/20 rounded-none px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-white transition-colors appearance-none"
          >
            <option value="muscle_gain">MUSCLE GAIN</option>
            <option value="fat_loss">FAT LOSS</option>
            <option value="strength">STRENGTH</option>
            <option value="endurance">ENDURANCE</option>
            <option value="flexibility">FLEXIBILITY</option>
          </select>
        </div>

        {/* Fitness Level */}
        <div>
          <label className="block text-[10px] font-mono tracking-widest text-white/60 mb-2 uppercase">Current Capability</label>
          <select
            name="fitnessLevel"
            value={formData.fitnessLevel}
            onChange={handleChange}
            className="w-full bg-black border border-white/20 rounded-none px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-white transition-colors appearance-none"
          >
            <option value="beginner">BEGINNER</option>
            <option value="intermediate">INTERMEDIATE</option>
            <option value="advanced">ADVANCED</option>
          </select>
        </div>

        {/* Duration and Frequency */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-white/60 mb-2 uppercase">Duration (WKS)</label>
            <input
              type="number"
              name="duration"
              min="2"
              max="24"
              value={formData.duration}
              onChange={handleChange}
              className="w-full bg-transparent border border-white/20 rounded-none px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-white/60 mb-2 uppercase">Sessions / WK</label>
            <input
              type="number"
              name="frequency"
              min="1"
              max="7"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full bg-transparent border border-white/20 rounded-none px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>

        {/* Focus Areas */}
        <div>
          <label className="block text-[10px] font-mono tracking-widest text-white/60 mb-4 uppercase">Target Zones</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {focusAreas.map((area) => (
              <label key={area.id} className="relative flex items-center justify-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.focusAreas.includes(area.id)}
                  onChange={() => handleCheckboxChange(area.id)}
                  className="peer sr-only"
                />
                <div className="w-full border border-white/20 bg-transparent text-white/50 py-2 font-mono text-xs uppercase tracking-widest text-center peer-checked:bg-white peer-checked:text-black peer-checked:border-white transition-all duration-200 group-hover:border-white/50">
                  {area.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[10px] font-mono tracking-widest text-white/60 mb-2 uppercase">Parameters / Constraints</label>
          <textarea
            name="notes"
            placeholder="INPUT INJURIES, LIMITATIONS, OR PROTOCOLS..."
            value={formData.notes}
            onChange={handleChange}
            className="w-full bg-transparent border border-white/20 rounded-none px-4 py-3 text-white font-mono text-sm placeholder-white/20 focus:outline-none focus:border-white transition-colors"
            rows={3}
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-4 border-t border-white/10">
          <Button type="button" onClick={onCancel} className="flex-1 bg-transparent border border-white/30 text-white/70 hover:bg-white/10 hover:text-white rounded-none font-mono text-xs tracking-widest uppercase transition-colors">
            Abort
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-white text-black hover:bg-gray-200 border border-white rounded-none font-mono text-xs tracking-widest uppercase transition-colors"
          >
            Execute Protocol
          </Button>
        </div>
      </form>
    </Card>
  )
}
