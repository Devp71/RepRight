import { notFound } from 'next/navigation';
import { MUSCLE_DATABASE } from '@/lib/muscle-data';
import { ChevronLeft, Activity, Target, Zap, Info, Dumbbell } from 'lucide-react';
import Link from 'next/link';

export default async function MusclePage({ params }: { params: Promise<{ muscleId: string }> }) {
  const { muscleId } = await params;
  const muscle = MUSCLE_DATABASE[muscleId];

  if (!muscle) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black w-full relative overflow-hidden pt-8 pb-12 px-6 lg:px-12 flex flex-col neon-streak-horizontal">
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 242, 255, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 242, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Top Navigation */}
      <div className="relative z-10 flex justify-between items-start mb-12">
        <Link 
          href="/explorer"
          className="bg-transparent border border-white/30 text-white hover:bg-neon-blue/20 hover:border-neon-blue/40 rounded-none h-10 w-10 flex items-center justify-center p-0 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="text-right">
          <div className="flex items-center justify-end gap-3 mb-2 opacity-60">
            <div className="w-8 h-px bg-neon-blue/60"></div>
            <span className="text-white text-[10px] font-mono tracking-wider">TARGET.ANALYSIS</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-mono tracking-widest uppercase neon-blue-text">{muscle.group}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        
        {/* Abstract Target Visualizer */}
        <div className="relative w-full aspect-square max-w-[400px] mx-auto border border-neon-blue/20 bg-black/50 flex items-center justify-center group overflow-hidden glow-subtle">
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neon-blue/40"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neon-blue/40"></div>
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.1)_0%,transparent_70%)]"></div>
          
          {/* Mock Abstract representation of the muscle */}
          <div className="relative z-10 font-mono text-center">
            <div className="text-neon-blue/20 text-[100px] font-bold tracking-tighter leading-none group-hover:text-neon-blue/40 transition-colors duration-500 blur-[2px]">
              {muscle.id.slice(0,2).toUpperCase()}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-mono text-sm tracking-[0.5em] bg-black/80 px-4 py-2 border border-neon-blue/30 backdrop-blur-sm shadow-[0_0_15px_rgba(0,242,255,0.2)]">
                {muscle.name.toUpperCase()}
              </span>
            </div>
          </div>
          
          {/* Technical scanning lines */}
          <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,var(--neon-blue)_2px,var(--neon-blue)_4px)] pointer-events-none mix-blend-overlay"></div>
        </div>

        {/* Info & Data */}
        <div className="flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4 opacity-70">
              <Activity className="w-4 h-4 text-neon-blue" />
              <span className="text-white text-[10px] font-mono tracking-widest uppercase">Physiological Profile</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white font-mono tracking-widest uppercase mb-4 leading-tight neon-blue-text">
              {muscle.name}
            </h2>
            <p className="text-gray-400 font-mono text-sm tracking-widest uppercase leading-relaxed border-l border-neon-blue/20 pl-4 py-2">
              {muscle.description}
            </p>
          </div>

          {/* Training Tips Card */}
          <div className="bg-white/5 border border-white/10 p-6 relative">
            <div className="flex items-center gap-3 mb-4 opacity-70">
              <Info className="w-4 h-4 text-neon-blue" />
              <span className="text-white text-[10px] font-mono tracking-widest uppercase">Training Intel</span>
            </div>
            <p className="text-gray-400 font-mono text-xs tracking-wide leading-relaxed">
              {muscle.tips}
            </p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
              <span className="text-white/50 font-mono text-[10px] tracking-widest uppercase">{muscle.sets}</span>
              <span className={`px-3 py-1 border font-mono text-[10px] tracking-widest uppercase ${
                muscle.difficulty === 'Beginner' ? 'border-green-500/40 text-green-400' :
                muscle.difficulty === 'Intermediate' ? 'border-yellow-500/40 text-yellow-400' :
                'border-red-500/40 text-red-400'
              }`}>
                {muscle.difficulty}
              </span>
            </div>
          </div>

          {/* Exercises Card */}
          <div className="bg-white/5 border border-white/10 p-6 relative neon-streak-vertical">
            <div className="flex items-center gap-3 mb-6 opacity-70">
              <Target className="w-4 h-4 text-neon-blue" />
              <span className="text-white text-[10px] font-mono tracking-widest uppercase">Optimal Stimuli Protocols</span>
            </div>
            <ul className="space-y-4">
              {muscle.exercises.map((ex, i) => (
                <li key={i} className="flex items-center gap-4 group">
                  <span className="text-neon-blue/40 font-mono text-xs group-hover:text-neon-blue transition-colors">0{i + 1}</span>
                  <div className="flex-1 h-px bg-white/10 group-hover:bg-neon-blue/30 transition-colors"></div>
                  <span className="text-white font-mono text-xs tracking-widest uppercase group-hover:text-neon-blue transition-colors">{ex}</span>
                </li>
              ))}
            </ul>
          </div>

          <button className="w-full bg-white text-black hover:bg-neon-blue hover:text-black hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] border border-white rounded-none font-mono text-xs tracking-widest uppercase transition-all duration-300 h-14 flex items-center justify-center gap-3">
            <Zap className="w-4 h-4" />
            INITIATE TRAINING PROTOCOL
          </button>
        </div>
      </div>
      
      {/* Decorative Overlays */}
      <div className="absolute bottom-0 right-0 p-8 pointer-events-none hidden lg:block">
         <div className="text-right text-white/20 font-mono text-[9px] tracking-widest uppercase space-y-1">
            <p>TARGET: {muscle.id.toUpperCase()}</p>
            <p className="text-neon-blue/40">STATUS: LOCKED</p>
         </div>
      </div>
    </div>
  );
}
