"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Download, Share2, Edit, Save, X, Plus, Trash2 } from "lucide-react"
import { api } from "@/lib/api"

interface WorkoutDay {
  day: string
  focus: string
  exercises: Array<{
    name: string
    sets: number
    reps: string
    rest: number
  }>
}

interface PlanDetailProps {
  plan: any
  onBack: () => void
}

export function PlanDetail({ plan, onBack }: PlanDetailProps) {
  // Default fallback workout split if plan doesn't have one
  const defaultWorkoutSplit: WorkoutDay[] = [
    {
      day: "Monday",
      focus: "Chest & Triceps",
      exercises: [
        { name: "Barbell Bench Press", sets: 4, reps: "6-8", rest: 180 },
        { name: "Incline Dumbbell Press", sets: 3, reps: "8-10", rest: 120 },
        { name: "Cable Flyes", sets: 3, reps: "10-12", rest: 90 },
        { name: "Tricep Rope Pushdown", sets: 3, reps: "10-12", rest: 90 },
        { name: "Skull Crushers", sets: 3, reps: "8-10", rest: 120 },
      ],
    },
    {
      day: "Tuesday",
      focus: "Back & Biceps",
      exercises: [
        { name: "Barbell Bent Over Rows", sets: 4, reps: "6-8", rest: 180 },
        { name: "Weighted Pull-ups", sets: 3, reps: "6-8", rest: 150 },
        { name: "Barbell Curls", sets: 3, reps: "8-10", rest: 120 },
        { name: "Lat Pulldown", sets: 3, reps: "10-12", rest: 90 },
        { name: "Dumbbell Curls", sets: 3, reps: "10-12", rest: 90 },
      ],
    },
    {
      day: "Wednesday",
      focus: "Legs",
      exercises: [
        { name: "Barbell Back Squats", sets: 4, reps: "6-8", rest: 180 },
        { name: "Romanian Deadlifts", sets: 3, reps: "8-10", rest: 150 },
        { name: "Leg Press", sets: 3, reps: "8-10", rest: 120 },
        { name: "Leg Curls", sets: 3, reps: "10-12", rest: 90 },
        { name: "Leg Extensions", sets: 3, reps: "10-12", rest: 90 },
      ],
    },
  ]

  const [currentPlan, setCurrentPlan] = useState<any>(() => ({
    ...plan,
    workoutSplit: plan?.workoutSplit?.length ? plan.workoutSplit : defaultWorkoutSplit,
  }))

  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleStartEdit = () => {
    // Make a deep clone for editing
    setEditForm(JSON.parse(JSON.stringify(currentPlan)))
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditForm(null)
  }

  const handleSaveEdit = async () => {
    setIsSaving(true)
    try {
      const planId = currentPlan._id || currentPlan.id
      if (planId && typeof planId === 'string') {
        // Save to backend API if it's a real MongoDB document
        const res = await api.put(`/api/plans/${planId}`, {
          name: editForm.name,
          goal: editForm.goal,
          fitnessLevel: editForm.fitnessLevel,
          duration: Number(editForm.duration),
          frequency: Number(editForm.frequency),
          workoutSplit: editForm.workoutSplit,
        })
        if (res?.plan) {
          setCurrentPlan(res.plan)
        } else {
          setCurrentPlan(editForm)
        }
      } else {
        // Local only fallback update
        setCurrentPlan(editForm)
      }
      setIsEditing(false)
    } catch (error) {
      console.error('[SYSTEM] Override update failed:', error)
      // Save locally anyway for robust offline UX experience
      setCurrentPlan(editForm)
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExerciseChange = (dayIdx: number, exIdx: number, field: string, val: any) => {
    const updated = { ...editForm }
    updated.workoutSplit[dayIdx].exercises[exIdx][field] = val
    setEditForm(updated)
  }

  const handleAddExercise = (dayIdx: number) => {
    const updated = { ...editForm }
    updated.workoutSplit[dayIdx].exercises.push({
      name: "NEW EXERCISE",
      sets: 3,
      reps: "8-10",
      rest: 90,
    })
    setEditForm(updated)
  }

  const handleDeleteExercise = (dayIdx: number, exIdx: number) => {
    const updated = { ...editForm }
    updated.workoutSplit[dayIdx].exercises.splice(exIdx, 1)
    setEditForm(updated)
  }

  const handleDownloadPdf = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-black relative pb-32">
      {/* Print-specific style sheet to format page perfectly as a standalone PDF matrix */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body {
              background-color: #000 !important;
              color: #fff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print {
              display: none !important;
            }
            .print-card {
              border: 1px solid rgba(255, 255, 255, 0.4) !important;
              break-inside: avoid;
              margin-bottom: 20px !important;
            }
          }
        `
      }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-8">
          <div className="flex items-center gap-6">
            <Button onClick={onBack} className="no-print bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-none h-12 w-12 flex items-center justify-center p-0 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-2 opacity-60">
                <div className="w-8 h-px bg-white"></div>
                <span className="text-white text-[10px] font-mono tracking-wider">
                  {isEditing ? "PROTOCOL.OVERRIDE" : "PROTOCOL.VIEW"}
                </span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="bg-black border border-white/40 text-white font-mono text-2xl font-bold px-3 py-1 uppercase tracking-widest w-full max-w-md focus:border-white outline-none"
                />
              ) : (
                <h1 className="text-3xl font-bold text-white font-mono tracking-widest uppercase">{currentPlan.name}</h1>
              )}
              <p className="text-gray-400 mt-2 font-mono text-xs tracking-wider uppercase flex items-center gap-2">
                {isEditing ? (
                  <>
                    <input
                      type="number"
                      value={editForm.duration}
                      onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                      className="bg-black border border-white/30 text-white w-12 px-1 text-center font-mono"
                      min="1"
                      max="52"
                    /> WKS • 
                    <input
                      type="number"
                      value={editForm.frequency}
                      onChange={(e) => setEditForm({ ...editForm, frequency: e.target.value })}
                      className="bg-black border border-white/30 text-white w-12 px-1 text-center font-mono"
                      min="1"
                      max="7"
                    /> SESS/WK
                  </>
                ) : (
                  `${currentPlan.duration || 4} WKS • ${currentPlan.frequency || 3} SESS/WK`
                )}
              </p>
            </div>
          </div>

          {/* Edit Controls */}
          {isEditing && (
            <div className="flex items-center gap-3">
              <Button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-none font-mono text-xs tracking-widest uppercase px-4 h-10"
              >
                <X className="w-3.5 h-3.5 mr-1.5" /> Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="bg-white text-black hover:bg-gray-200 rounded-none font-mono text-xs tracking-widest uppercase px-4 h-10"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" /> {isSaving ? "SAVING..." : "COMMIT"}
              </Button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!isEditing && (
          <div className="flex gap-4 mb-12 no-print">
            <Button 
              onClick={handleDownloadPdf}
              className="bg-white text-black hover:bg-gray-200 border border-white rounded-none font-mono text-xs uppercase tracking-widest px-6 h-12 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Matrix (PDF)
            </Button>
            <Button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: currentPlan.name, url: window.location.href })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                  alert("Link copied to clipboard.")
                }
              }}
              className="bg-transparent text-white border border-white/30 hover:bg-white/10 rounded-none font-mono text-xs uppercase tracking-widest px-6 h-12 transition-colors"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button 
              onClick={handleStartEdit}
              className="bg-transparent text-white border border-white/30 hover:bg-white/10 rounded-none font-mono text-xs uppercase tracking-widest px-6 h-12 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Override
            </Button>
          </div>
        )}

        {/* Plan Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="print-card bg-transparent border border-white/20 p-8 rounded-none relative">
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40"></div>
            <h3 className="text-sm font-bold text-white mb-6 font-mono tracking-widest uppercase border-b border-white/10 pb-4">Parameters</h3>
            <div className="space-y-4">
              <div>
                <p className="text-white/50 text-[10px] font-mono tracking-widest uppercase mb-1">Primary Objective</p>
                {isEditing ? (
                  <select
                    value={editForm.goal || "muscle_gain"}
                    onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })}
                    className="bg-black border border-white/30 text-white font-mono text-xs uppercase p-1.5 w-full outline-none"
                  >
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="fat_loss">Fat Loss</option>
                    <option value="strength">Strength</option>
                    <option value="endurance">Endurance</option>
                    <option value="flexibility">Flexibility</option>
                  </select>
                ) : (
                  <p className="text-white font-mono text-sm tracking-wide uppercase">{(currentPlan.goal || "muscle_gain").replace("_", " ")}</p>
                )}
              </div>
              <div>
                <p className="text-white/50 text-[10px] font-mono tracking-widest uppercase mb-1">Baseline Requirement</p>
                {isEditing ? (
                  <select
                    value={editForm.fitnessLevel || "intermediate"}
                    onChange={(e) => setEditForm({ ...editForm, fitnessLevel: e.target.value })}
                    className="bg-black border border-white/30 text-white font-mono text-xs uppercase p-1.5 w-full outline-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                ) : (
                  <p className="text-white font-mono text-sm tracking-wide uppercase">{currentPlan.fitnessLevel || "INTERMEDIATE"}</p>
                )}
              </div>
              <div>
                <p className="text-white/50 text-[10px] font-mono tracking-widest uppercase mb-2">Target Zones</p>
                <div className="flex flex-wrap gap-2">
                  {(currentPlan.focusAreas || ["FULL BODY", "CORE"]).map((area: string) => (
                    <span key={area} className="text-[10px] border border-white/20 text-gray-300 px-2 py-1 font-mono tracking-widest uppercase">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="print-card bg-transparent border border-white/20 p-8 rounded-none relative">
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40"></div>
            <h3 className="text-sm font-bold text-white mb-6 font-mono tracking-widest uppercase border-b border-white/10 pb-4">Core Principles</h3>
            <ul className="space-y-4 text-gray-300 font-mono text-xs tracking-wider uppercase">
              <li className="flex gap-3 items-start">
                <span className="text-white font-bold opacity-70">01</span>
                Progressive overload protocol active
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-white font-bold opacity-70">02</span>
                Optimal volume distribution computed
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-white font-bold opacity-70">03</span>
                Recovery-centric rest intervals
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-white font-bold opacity-70">04</span>
                Compound multi-joint emphasis
              </li>
            </ul>
          </Card>
        </div>

        {/* Workout Split */}
        <div>
          <div className="flex items-center gap-4 mb-8 opacity-80">
            <h2 className="text-xl font-bold text-white font-mono tracking-widest uppercase">Execution Matrix</h2>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>
          <div className="space-y-6">
            {(isEditing ? editForm.workoutSplit : currentPlan.workoutSplit).map((day: WorkoutDay, idx: number) => (
              <Card key={idx} className="print-card bg-transparent border border-white/10 hover:border-white/30 transition-colors p-8 rounded-none group relative">
                <span className="absolute top-4 right-4 text-[9px] text-white/30 font-mono">DAY.{idx + 1}</span>
                
                {isEditing ? (
                  <div className="mb-6 border-b border-white/10 pb-4 space-y-3">
                    <input
                      type="text"
                      value={day.day}
                      onChange={(e) => {
                        const updated = { ...editForm }
                        updated.workoutSplit[idx].day = e.target.value
                        setEditForm(updated)
                      }}
                      className="bg-black border border-white/30 text-white font-mono text-sm uppercase px-2 py-1 outline-none block w-full max-w-xs"
                      placeholder="Day Name (e.g. MONDAY)"
                    />
                    <input
                      type="text"
                      value={day.focus}
                      onChange={(e) => {
                        const updated = { ...editForm }
                        updated.workoutSplit[idx].focus = e.target.value
                        setEditForm(updated)
                      }}
                      className="bg-black border border-white/20 text-white/70 font-mono text-xs uppercase px-2 py-1 outline-none block w-full max-w-xs"
                      placeholder="Focus (e.g. CHEST & TRICEPS)"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-white mb-2 font-mono tracking-widest uppercase">{day.day}</h3>
                    <p className="text-white/60 mb-6 font-mono text-xs tracking-wider uppercase border-b border-white/10 pb-4">{day.focus}</p>
                  </>
                )}

                <div className="space-y-4">
                  {day.exercises.map((exercise, exIdx) => (
                    <div key={exIdx} className="bg-black border border-white/10 p-4 rounded-none group-hover:border-white/20 transition-colors relative">
                      {isEditing ? (
                        <div className="space-y-3 pr-8">
                          <input
                            type="text"
                            value={exercise.name}
                            onChange={(e) => handleExerciseChange(idx, exIdx, 'name', e.target.value)}
                            className="bg-black border border-white/30 text-white font-mono text-xs uppercase px-2 py-1 outline-none w-full"
                          />
                          <div className="flex flex-wrap gap-3">
                            <label className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                              SETS: 
                              <input
                                type="number"
                                value={exercise.sets}
                                onChange={(e) => handleExerciseChange(idx, exIdx, 'sets', Number(e.target.value))}
                                className="bg-black border border-white/20 text-white w-10 text-center p-0.5 outline-none"
                                min="1"
                              />
                            </label>
                            <label className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                              REPS: 
                              <input
                                type="text"
                                value={exercise.reps}
                                onChange={(e) => handleExerciseChange(idx, exIdx, 'reps', e.target.value)}
                                className="bg-black border border-white/20 text-white w-16 text-center p-0.5 outline-none"
                              />
                            </label>
                            <label className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                              REST(S): 
                              <input
                                type="number"
                                value={exercise.rest}
                                onChange={(e) => handleExerciseChange(idx, exIdx, 'rest', Number(e.target.value))}
                                className="bg-black border border-white/20 text-white w-12 text-center p-0.5 outline-none"
                                step="10"
                              />
                            </label>
                          </div>
                          <button
                            onClick={() => handleDeleteExercise(idx, exIdx)}
                            className="absolute top-3 right-3 text-white/30 hover:text-red-500 transition-colors"
                            title="Remove Exercise"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="text-white font-mono text-sm tracking-wide uppercase">{exercise.name}</p>
                          <div className="flex flex-wrap gap-4 mt-3 text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                            <span className="flex items-center gap-1"><div className="w-1 h-1 bg-white/50"></div>{exercise.sets} SETS</span>
                            <span className="flex items-center gap-1"><div className="w-1 h-1 bg-white/50"></div>{exercise.reps} REPS</span>
                            <span className="flex items-center gap-1"><div className="w-1 h-1 bg-white/50"></div>{exercise.rest}S REST</span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {isEditing && (
                    <Button
                      onClick={() => handleAddExercise(idx)}
                      size="sm"
                      className="w-full bg-transparent border border-dashed border-white/20 text-white/60 hover:text-white hover:border-white/40 rounded-none font-mono text-[10px] tracking-widest uppercase mt-2"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5" /> Append Exercise
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
