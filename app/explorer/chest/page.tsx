"use client"

import { ChevronLeft, Zap, Target, Activity, Info, ArrowRight, ShieldCheck, TrendingUp, Layers } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function ChestDeepResearchPage() {
  const chestDivisions = [
    {
      name: "Clavicular Head",
      aka: "Upper Chest",
      focus: "Shoulder Flexion / Adduction",
      exercises: ["Incline Bench Press", "Low-to-High Cable Flyes"],
      color: "text-blue-400",
      border: "border-blue-400/20"
    },
    {
      name: "Sternal Head",
      aka: "Middle Chest",
      focus: "Horizontal Adduction",
      exercises: ["Flat Bench Press", "Dumbbell Flyes"],
      color: "text-neon-blue",
      border: "border-neon-blue/20"
    },
    {
      name: "Costal Head",
      aka: "Lower Chest",
      focus: "Shoulder Extension / Adduction",
      exercises: ["Dips", "High-to-Low Cable Flyes"],
      color: "text-emerald-400",
      border: "border-emerald-400/20"
    }
  ]

  const trainingPrinciples = [
    {
      title: "Stretch Mediated Hypertrophy",
      desc: "The chest responds exceptionally well to being loaded in the lengthened position. Deep flyes and full-range bench press are critical.",
      icon: TrendingUp
    },
    {
      title: "Scapular Retraction",
      desc: "Always pin your shoulder blades back and down. This isolates the pecs and prevents the front delts from taking over.",
      icon: ShieldCheck
    },
    {
      title: "Varying Fiber Directions",
      desc: "Chest fibers run in multiple directions. You MUST hit multiple angles (Incline, Flat, Decline) to achieve a full look.",
      icon: Layers
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-neon-blue selection:text-black overflow-x-hidden">
      {/* Background FX */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.1),transparent_70%)]" />
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/60 backdrop-blur-xl p-6 lg:px-12 flex items-center justify-between">
        <Link 
          href="/explorer"
          className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-neon-blue transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Explorer
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] opacity-40 uppercase tracking-tighter">System.Classification</p>
            <p className="text-xs font-bold text-neon-blue uppercase">Upper Body Push / Primary</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
            <span className="text-xs uppercase tracking-widest">Live Analysis</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Title & Anatomy Visual */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-4"
              >
                <Activity className="w-5 h-5 text-neon-blue" />
                <span className="text-xs font-bold tracking-[0.4em] uppercase opacity-60">Deep Research Module</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl lg:text-8xl font-bold tracking-tighter mb-8 neon-blue-text"
              >
                CHEST
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm lg:text-base leading-relaxed text-gray-400 max-w-md italic border-l-2 border-neon-blue/40 pl-6"
              >
                "The powerhouse of the upper body. Structurally designed for powerful adduction and internal rotation. A properly trained chest provides the mechanical foundation for all push maneuvers."
              </motion.p>
            </div>

            {/* Scientific Breakdown */}
            <div className="space-y-6">
               <h3 className="text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-4 flex items-center gap-2">
                 <Zap className="w-4 h-4 text-neon-blue" />
                 Functional Divisions
               </h3>
               <div className="grid gap-4">
                 {chestDivisions.map((division, i) => (
                   <motion.div 
                     key={division.name}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.1 + 0.3 }}
                     className={`p-6 border ${division.border} bg-white/5 relative group overflow-hidden hover:bg-white/[0.08] transition-colors`}
                   >
                     <div className="flex justify-between items-start mb-4">
                       <div>
                         <h4 className={`text-lg font-bold uppercase ${division.color}`}>{division.name}</h4>
                         <p className="text-[10px] opacity-40 uppercase tracking-widest">{division.aka}</p>
                       </div>
                       <Target className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" />
                     </div>
                     <div className="space-y-4">
                       <div>
                         <p className="text-[9px] uppercase opacity-40 mb-1">Functional Focus</p>
                         <p className="text-xs font-bold text-white">{division.focus}</p>
                       </div>
                       <div>
                         <p className="text-[9px] uppercase opacity-40 mb-1">Key Drivers</p>
                         <div className="flex flex-wrap gap-2">
                           {division.exercises.map(ex => (
                             <span key={ex} className="text-[9px] bg-white/10 px-2 py-1 uppercase tracking-tighter">{ex}</span>
                           ))}
                         </div>
                       </div>
                     </div>
                   </motion.div>
                 ))}
               </div>
            </div>
          </div>

          {/* Right Column: Training Principles & Advanced Data */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Visualizer Frame */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video w-full bg-white/5 border border-white/10 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-transparent pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-2 border-neon-blue border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
                  <p className="text-[10px] uppercase tracking-[0.5em] opacity-40">Loading Anatomy Engine</p>
                </div>
              </div>
              
              {/* Overlay Elements */}
              <div className="absolute top-4 left-4 p-4 border border-white/10 bg-black/40 backdrop-blur-sm">
                <p className="text-[9px] uppercase tracking-widest text-neon-blue">Object: Pectoralis_Major.obj</p>
                <p className="text-[9px] uppercase tracking-widest text-white/40">Status: High Fidelity Rendering</p>
              </div>
              <div className="absolute bottom-4 right-4 text-right p-4">
                <p className="text-[9px] uppercase tracking-widest text-white/40">Vertices: 1.2M</p>
                <p className="text-[9px] uppercase tracking-widest text-white/40">Scale: 1:1 Humanoid</p>
              </div>
            </motion.div>

            {/* Advanced Training Principles */}
            <div className="grid sm:grid-cols-3 gap-6">
               {trainingPrinciples.map((principle, i) => (
                 <motion.div 
                   key={principle.title}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 + 0.6 }}
                   className="space-y-4"
                 >
                   <principle.icon className="w-6 h-6 text-neon-blue" />
                   <h4 className="text-xs font-bold uppercase tracking-widest leading-relaxed">{principle.title}</h4>
                   <p className="text-[10px] leading-relaxed text-gray-500">{principle.desc}</p>
                 </motion.div>
               ))}
            </div>

            {/* Final CTA/Action */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="p-10 border border-white/10 bg-gradient-to-r from-white/[0.03] to-transparent relative overflow-hidden"
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold uppercase tracking-widest mb-4">Ready to initiate training?</h3>
                <p className="text-xs text-gray-400 mb-8 max-w-lg leading-relaxed">
                  The AI Coach is ready to analyze your chest form in real-time. We'll track your clavicular engagement and sternal contraction across every set.
                </p>
                <Link href="/dashboard/form-check">
                  <button className="bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.3em] hover:bg-neon-blue hover:text-black transition-all flex items-center gap-3">
                    Start Session <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
              <Target className="absolute -right-10 -bottom-10 w-64 h-64 opacity-5 rotate-12 pointer-events-none" />
            </motion.div>

          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 border-t border-white/10 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex gap-12 text-[10px] uppercase tracking-widest opacity-40">
           <p>Last Update: May 2026</p>
           <p>Data Source: Biomechanics V4.2</p>
        </div>
        <div className="font-bold text-lg tracking-widest italic transform -skew-x-12 opacity-60">
           REPRIGHT <span className="text-neon-blue">RESEARCH</span>
        </div>
      </footer>
    </div>
  )
}
