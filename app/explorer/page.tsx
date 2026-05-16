import { MuscleExplorer } from "@/components/muscle-explorer"

export default function ExplorerPage() {
  return (
    <main className="min-h-screen bg-black overflow-hidden relative">
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      <MuscleExplorer />
    </main>
  )
}
