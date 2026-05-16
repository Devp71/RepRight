'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Activity, Target, Dumbbell, Info, Zap, ArrowRight, Lock, Unlock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SvgBodyFront } from './svg-body-front';
import { SvgBodyBack } from './svg-body-back';
import { MUSCLE_DATABASE, MuscleData } from '@/lib/muscle-data';

export function MuscleExplorer() {
  const router = useRouter();
  const [hoveredMuscleId, setHoveredMuscleId] = useState<string | null>(null);
  const [lockedMuscleId, setLockedMuscleId] = useState<string | null>(null);

  // The displayed muscle is the locked one (if any), otherwise the hovered one
  const activeMuscleId = lockedMuscleId || hoveredMuscleId;
  const activeMuscle: MuscleData | null = activeMuscleId ? MUSCLE_DATABASE[activeMuscleId] || null : null;

  const handleMuscleInteraction = (id: string, type: 'hover' | 'click') => {
    if (type === 'hover') {
      // Only update hover if nothing is locked
      if (!lockedMuscleId) {
        setHoveredMuscleId(id || null);
      }
    } else if (type === 'click') {
      if (lockedMuscleId === id) {
        // Clicking the same locked muscle unlocks it
        setLockedMuscleId(null);
      } else {
        // Lock onto this muscle
        setLockedMuscleId(id);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full z-10 flex flex-col pt-8 pb-12 px-6 lg:px-12 neon-streak-horizontal">
      {/* Top Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex justify-between items-start mb-8"
      >
        <button 
          onClick={() => router.push('/')}
          className="bg-transparent border border-white/30 text-white hover:bg-neon-blue/20 hover:border-neon-blue/40 rounded-none h-10 w-10 flex items-center justify-center p-0 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-right">
          <div className="flex items-center justify-end gap-3 mb-2 opacity-60">
            <div className="w-8 h-px bg-neon-blue/60"></div>
            <span className="text-white text-[10px] font-mono tracking-wider">MODULE.EX</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-mono tracking-widest uppercase neon-blue-text">ANATOMY_EXPLORER</h1>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col lg:flex-row items-stretch relative gap-8">
        
        {/* Left Panel: Hover/Locked Info */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="w-full lg:w-[340px] flex-shrink-0 order-2 lg:order-1"
        >
          <AnimatePresence mode="wait">
            {activeMuscle ? (
              <motion.div
                key={activeMuscle.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`border bg-black/80 backdrop-blur-md p-6 relative overflow-hidden ${
                  lockedMuscleId ? 'border-white/40' : 'border-white/20'
                }`}
              >
                {/* Glow accent */}
                <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent ${
                  lockedMuscleId ? 'via-white' : 'via-white/60'
                } to-transparent`}></div>
                <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-white/40"></div>
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-white/40"></div>

                {/* Lock indicator */}
                {lockedMuscleId && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-white/60" />
                    <span className="text-[8px] font-mono text-white/40 tracking-widest uppercase">Locked</span>
                  </div>
                )}

                {/* Muscle Name */}
                <div className="flex items-center gap-2 mb-1 opacity-50">
                  <Activity className="w-3 h-3 text-white" />
                  <span className="text-[9px] font-mono tracking-widest uppercase text-white">{activeMuscle.group}</span>
                </div>
                <h2 className="text-xl font-bold text-white font-mono tracking-widest uppercase mb-4 neon-blue-text">
                  {activeMuscle.name}
                </h2>

                {/* Description */}
                <p className="text-gray-400 font-mono text-[11px] leading-relaxed mb-5 border-l border-white/10 pl-3">
                  {activeMuscle.description}
                </p>

                {/* Training Protocol */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3 opacity-60">
                    <Dumbbell className="w-3 h-3 text-white" />
                    <span className="text-[9px] font-mono tracking-widest uppercase text-white">Best Exercises</span>
                  </div>
                  <ul className="space-y-2">
                    {activeMuscle.exercises.map((ex, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span className="text-white/30 font-mono text-[10px]">0{i + 1}</span>
                        <div className="flex-1 h-px bg-white/10"></div>
                        <span className="text-white font-mono text-[11px] tracking-wider uppercase">{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tips */}
                <div className="bg-white/5 border border-white/10 p-3 mb-4">
                  <div className="flex items-center gap-2 mb-2 opacity-60">
                    <Info className="w-3 h-3 text-white" />
                    <span className="text-[9px] font-mono tracking-widest uppercase text-white">Pro Tips</span>
                  </div>
                  <p className="text-gray-400 font-mono text-[10px] leading-relaxed">
                    {activeMuscle.tips}
                  </p>
                </div>

                {/* Meta Row */}
                <div className="flex items-center justify-between text-[9px] font-mono text-white/40 tracking-widest uppercase mb-4">
                  <span>{activeMuscle.sets}</span>
                  <span className={`px-2 py-0.5 border ${
                    activeMuscle.difficulty === 'Beginner' ? 'border-green-500/40 text-green-400' :
                    activeMuscle.difficulty === 'Intermediate' ? 'border-yellow-500/40 text-yellow-400' :
                    'border-red-500/40 text-red-400'
                  }`}>
                    {activeMuscle.difficulty}
                  </span>
                </div>

                {/* CTA — Only show Deep Analysis for chest */}
                {activeMuscle.id === 'chest' ? (
                  <button 
                    onClick={() => router.push(`/explorer/${activeMuscle.id}`)}
                    className="w-full bg-transparent border border-white/30 text-white hover:bg-white hover:text-black font-mono text-[10px] tracking-widest uppercase transition-all duration-200 h-10 flex items-center justify-center gap-2 group"
                  >
                    DEEP ANALYSIS
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <div className="w-full border border-white/10 text-white/20 font-mono text-[10px] tracking-widest uppercase h-10 flex items-center justify-center gap-2 cursor-not-allowed">
                    <Lock className="w-3 h-3" />
                    DEEP ANALYSIS — COMING SOON
                  </div>
                )}

                {/* Unlock hint */}
                {lockedMuscleId && (
                  <p className="text-center text-white/20 font-mono text-[8px] tracking-widest uppercase mt-3">
                    Click the muscle again to unlock
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border border-white/10 bg-black/40 p-6 flex flex-col items-center justify-center min-h-[300px] text-center"
              >
                <div className="w-2 h-2 bg-white/20 animate-pulse mb-6"></div>
                <p className="text-white/30 font-mono text-xs tracking-widest uppercase mb-2">Awaiting Target Selection</p>
                <p className="text-white/15 font-mono text-[9px] tracking-widest uppercase leading-relaxed max-w-[220px]">
                  Hover over any muscle to preview. Click to lock it in place so you can read and interact.
                </p>
                <div className="flex gap-1 mt-6 opacity-20">
                  {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-3 bg-white"></div>)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Center: Body Models */}
        <div className="flex-1 flex items-center justify-center order-1 lg:order-2">
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full flex items-center justify-center gap-8 lg:gap-20 h-[55vh] lg:h-[75vh]"
          >
            {/* Front Model */}
            <div className="relative w-1/2 max-w-[350px] h-full flex flex-col items-center group">
              <span className="text-white/30 font-mono text-[10px] tracking-widest uppercase mb-4 transition-colors group-hover:text-neon-blue/80">ANTERIOR</span>
              <div className="flex-1 w-full relative">
                <SvgBodyFront 
                  hoveredId={activeMuscleId}
                  selectedId={lockedMuscleId}
                  onInteract={handleMuscleInteraction} 
                />
              </div>
            </div>

            {/* Back Model */}
            <div className="relative w-1/2 max-w-[350px] h-full flex flex-col items-center group">
              <span className="text-white/30 font-mono text-[10px] tracking-widest uppercase mb-4 transition-colors group-hover:text-neon-blue/80">POSTERIOR</span>
              <div className="flex-1 w-full relative">
                <SvgBodyBack 
                  hoveredId={activeMuscleId}
                  selectedId={lockedMuscleId}
                  onInteract={handleMuscleInteraction} 
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Overlays */}
      <div className="absolute top-0 right-0 p-8 pointer-events-none hidden lg:block">
         <div className="text-right text-white/20 font-mono text-[9px] tracking-widest uppercase space-y-1">
            <p>LAT: 37.7749°</p>
            <p>LONG: 122.4194°</p>
            <p className="text-neon-blue/40">SYS.STAT: ONLINE</p>
         </div>
      </div>
      <div className="absolute bottom-0 left-0 p-8 pointer-events-none neon-streak-vertical h-32">
         <div className="flex gap-2 opacity-30">
           {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-4 bg-neon-blue"></div>)}
         </div>
      </div>
    </div>
  );
}
