"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Zap, Target, Calendar, Users, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { PlanGenerator } from "@/components/plan-generator"
import { PlanCard } from "@/components/plan-card"
import { PlanDetail } from "@/components/plan-detail"
import { api } from "@/lib/api"

export default function TrainingPlans() {
  const [plans, setPlans] = useState<any[]>([])
  const [showGenerator, setShowGenerator] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)

  const fetchPlans = useCallback(async () => {
    try {
      const data = await api.get('/api/plans')
      setPlans(data.plans || [])
    } catch (error) {
      console.error('[SYSTEM] Failed to fetch plans:', error)
    }
  }, [])

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  const handleCreatePlan = async (planData: any) => {
    try {
      await api.post('/api/plans', {
        ...planData,
        duration: parseInt(planData.duration),
        frequency: parseInt(planData.frequency),
      })
      setShowGenerator(false)
      fetchPlans()
    } catch (error) {
      console.error('[SYSTEM] Failed to create plan:', error)
    }
  }

  const handleDeletePlan = async (planId: string) => {
    try {
      await api.delete(`/api/plans/${planId}`)
      if (selectedPlan?._id === planId) setSelectedPlan(null)
      fetchPlans()
    } catch (error) {
      console.error('[SYSTEM] Failed to delete plan:', error)
    }
  }

  if (selectedPlan) {
    return <PlanDetail plan={selectedPlan} onBack={() => setSelectedPlan(null)} />
  }

  return (
    <div className="min-h-screen bg-black relative pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6 border-b border-white/10 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Link href="/dashboard">
              <Button className="bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-none h-12 w-12 flex items-center justify-center p-0 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-4 opacity-60">
                <div className="w-12 h-px bg-white"></div>
                <span className="text-white text-[10px] font-mono tracking-wider">MODULE.01</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white font-mono tracking-widest uppercase">
                TRAINING_PLANS
              </h1>
              <p className="text-gray-400 mt-4 font-mono text-xs tracking-wide uppercase">AI-generated personalized workout programs based on optimal geometric patterns.</p>
            </div>
          </div>
          <Button
            onClick={() => setShowGenerator(!showGenerator)}
            className="bg-transparent text-white font-mono text-xs border border-white hover:bg-white hover:text-black transition-all duration-300 rounded-none uppercase tracking-widest group px-6 py-6"
          >
            <Plus className="mr-2 w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            Generate Plan
          </Button>
        </div>

        {/* Plan Generator */}
        {showGenerator && (
          <div className="mb-16 border border-white/20 p-1">
            <PlanGenerator onSubmit={handleCreatePlan} onCancel={() => setShowGenerator(false)} />
          </div>
        )}

        {/* Plans Grid */}
        {plans.length === 0 ? (
          <Card className="bg-transparent border border-white/20 p-16 text-center rounded-none relative group overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <Target className="w-16 h-16 text-white/20 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-3 font-mono tracking-widest uppercase">No Training Plans Active</h3>
            <p className="text-gray-400 mb-8 font-mono text-xs tracking-wider uppercase">Initialize your first AI-powered training matrix to commence.</p>
            <Button
              onClick={() => setShowGenerator(true)}
              className="bg-white text-black hover:bg-gray-200 transition-colors rounded-none font-mono text-xs uppercase tracking-widest px-8 py-6"
            >
              Initialize Sequence
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                onSelect={() => setSelectedPlan(plan)}
                onDelete={() => handleDeletePlan(plan._id)}
              />
            ))}
          </div>
        )}

        {/* Featured Plans Section */}
        {plans.length > 0 && (
          <div className="mt-24">
            <div className="flex items-center gap-4 mb-10 opacity-80">
              <h2 className="text-xl font-bold text-white font-mono tracking-widest uppercase">Standard Templates</h2>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Full Body Strength",
                  duration: "4 WKS",
                  difficulty: "INTERMEDIATE",
                  icon: <Zap className="w-6 h-6" />,
                },
                {
                  name: "Muscle Hypertrophy",
                  duration: "8 WKS",
                  difficulty: "ADVANCED",
                  icon: <Users className="w-6 h-6" />,
                },
                {
                  name: "Endurance & Cardio",
                  duration: "6 WKS",
                  difficulty: "INTERMEDIATE",
                  icon: <Calendar className="w-6 h-6" />,
                },
              ].map((template, idx) => (
                <Card
                  key={idx}
                  className="bg-transparent border border-white/10 hover:border-white/30 transition-all duration-300 p-8 cursor-pointer rounded-none relative group"
                >
                  <span className="absolute top-4 right-4 text-[9px] text-white/30 font-mono">0{idx + 1}</span>
                  <div className="border border-white/20 p-3 w-fit mb-6 text-white group-hover:scale-110 transition-transform">
                    {template.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white font-mono tracking-wider uppercase mb-2">{template.name}</h3>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                    <p className="text-gray-400 font-mono text-xs">{template.duration}</p>
                    <p className="text-white/60 font-mono text-[10px] tracking-widest">{template.difficulty}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
