'use client';
 
declare global {
  interface Window {
    UnicornStudio: any;
  }
}


import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export function HeroAscii() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    // Reset state on mount
    setIsScanning(false);
    setTransitioning(false);

    const initUnicorn = () => {
      // If already loaded in window, just trigger init again for the new DOM element
      if (window.UnicornStudio && window.UnicornStudio.isInitialized) {
        if (typeof window.UnicornStudio.init === 'function') {
          window.UnicornStudio.init();
        }
      } else {
        const embedScript = document.createElement('script');
        embedScript.type = 'text/javascript';
        embedScript.textContent = `
          !function(){
            if(!window.UnicornStudio){
              window.UnicornStudio={isInitialized:!1};
              var i=document.createElement("script");
              i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";
              i.onload=function(){
                window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)
              };
              (document.head || document.body).appendChild(i)
            }
          }();
        `;
        document.head.appendChild(embedScript);
      }
    };

    initUnicorn();

    const style = document.createElement('style');
    style.textContent = `
      [data-us-project] {
        position: relative !important;
        overflow: hidden !important;
      }
     
      [data-us-project] canvas {
        clip-path: inset(0 0 10% 0) !important;
      }
     
      [data-us-project] * {
        pointer-events: none !important;
      }
      [data-us-project] a[href*="unicorn"],
      [data-us-project] button[title*="unicorn"],
      [data-us-project] div[title*="Made with"],
      [data-us-project] .unicorn-brand,
      [data-us-project] [class*="brand"],
      [data-us-project] [class*="credit"],
      [data-us-project] [class*="watermark"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
      }
    `;
    document.head.appendChild(style);

    const hideBranding = () => {
      const projectDiv = document.querySelector('[data-us-project]');
      if (projectDiv) {
        const allElements = projectDiv.querySelectorAll('*');
        allElements.forEach(el => {
          const text = (el.textContent || '').toLowerCase();
          if (text.includes('made with') || text.includes('unicorn')) {
            el.remove();
          }
        });
      }
    };

    hideBranding();
    const interval = setInterval(hideBranding, 100);
   
    setTimeout(hideBranding, 1000);
    setTimeout(hideBranding, 3000);
    setTimeout(hideBranding, 5000);

    return () => {
      clearInterval(interval);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const handleBodyClick = () => {
    if (isScanning || transitioning) return;
    
    // 1. Start Scan Animation
    setIsScanning(true);
    
    // 2. Transition to Dark and Route after scan completes
    setTimeout(() => {
      setTransitioning(true);
      setTimeout(() => {
        router.push('/explorer');
      }, 500); // Route after fade out
    }, 1200); // 1.2s total scan animation time
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black w-full neon-streak-horizontal">
      {/* 
        STAGE 1 SCANNER SYSTEM
        Interactive WebGL Overlay and Transitions
      */}
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-40 pointer-events-none"
          >
            {/* Horizontal Scan Line */}
            <motion.div
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              transition={{ duration: 0.8, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-white shadow-[0_0_20px_4px_rgba(0,242,255,0.8)] z-50"
            />
            {/* Scan Emissive Glow Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.2, 0.4, 0] }}
              transition={{ duration: 1.2, times: [0, 0.3, 0.6, 1] }}
              className="absolute inset-0 bg-neon-blue mix-blend-color-dodge z-30"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Fade Out Overlay for Transition */}
      <AnimatePresence>
        {transitioning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black z-[100]"
          />
        )}
      </AnimatePresence>

      {/* Interactive Hitbox over WebGL Model (Right half of screen) */}
      <div 
        className="absolute top-0 right-0 w-full lg:w-1/2 h-full z-30 cursor-crosshair"
        onClick={handleBodyClick}
        onMouseEnter={(e) => {
          if (!isScanning) {
             (e.target as HTMLElement).style.boxShadow = 'inset 0 0 50px rgba(0, 242, 255, 0.05)';
          }
        }}
        onMouseLeave={(e) => {
           (e.target as HTMLElement).style.boxShadow = 'none';
        }}
      >
        {!isScanning && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] tracking-widest text-neon-blue/40 uppercase animate-pulse border border-neon-blue/20 px-4 py-2 pointer-events-none hidden lg:block backdrop-blur-sm">
            INITIATE SCAN
          </div>
        )}
      </div>

      {/* Vitruvian man animation - hidden on mobile */}
      <motion.div 
        animate={{ 
          scale: isScanning ? 1.2 : 1,
          opacity: transitioning ? 0 : 1
        }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="absolute inset-0 w-full h-full hidden lg:block"
      >
        <div
          data-us-project="whwOGlfJ5Rz2rHaEUgHl"
          style={{ width: '100%', height: '100%', minHeight: '100vh' }}
        />
      </motion.div>

      {/* Mobile stars background */}
      <div className="absolute inset-0 w-full h-full lg:hidden stars-bg"></div>

      {/* UI Elements (Fade out on scan) */}
      <motion.div animate={{ opacity: isScanning ? 0 : 1 }} transition={{ duration: 0.4 }}>
        {/* Top Header */}
        <div className="absolute top-0 left-0 right-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur-md">
          <div className="container mx-auto px-4 lg:px-8 py-3 lg:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="font-mono text-white text-xl lg:text-2xl font-bold tracking-widest italic transform -skew-x-12 neon-blue-text">
                REPRIGHT
              </div>
              <div className="h-3 lg:h-4 w-px bg-neon-blue/40"></div>
              <span className="text-white/60 text-[8px] lg:text-[10px] font-mono">EST. 2025</span>
            </div>
          
            <div className="hidden lg:flex items-center gap-3 text-[10px] font-mono text-white/60">
              <span>LAT: 37.7749°</span>
              <div className="w-1 h-1 bg-neon-blue/40 rounded-full"></div>
              <span>LONG: 122.4194°</span>
            </div>
          </div>
        </div>

        {/* Corner Frame Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 lg:w-12 lg:h-12 border-t-2 border-l-2 border-white/20 z-20"></div>
        <div className="absolute top-0 right-0 w-8 h-8 lg:w-12 lg:h-12 border-t-2 border-r-2 border-white/20 z-20"></div>
        <div className="absolute left-0 w-8 h-8 lg:w-12 lg:h-12 border-b-2 border-l-2 border-white/20 z-20" style={{ bottom: '5vh' }}></div>
        <div className="absolute right-0 w-8 h-8 lg:w-12 lg:h-12 border-b-2 border-r-2 border-white/20 z-20" style={{ bottom: '5vh' }}></div>

        <div className="relative z-10 flex min-h-screen items-center pt-16 lg:pt-0" style={{ marginTop: '5vh' }}>
          <div className="container mx-auto px-6 lg:px-16 lg:ml-[10%]">
            <div className="max-w-lg relative">
              {/* Top decorative line */}
              <div className="flex items-center gap-2 mb-3 opacity-60">
                <div className="w-8 h-px bg-neon-blue/60"></div>
                <span className="text-white text-[10px] font-mono tracking-wider">AI.COACH</span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>

              {/* Title with dithered accent */}
              <div className="relative">
                <div className="hidden lg:block absolute -left-3 top-0 bottom-0 w-1 dither-pattern opacity-20"></div>
                <h1 className="text-2xl lg:text-5xl font-bold text-white mb-3 lg:mb-4 leading-tight font-mono tracking-wider glow-subtle" style={{ letterSpacing: '0.1em' }}>
                  AI-POWERED
                  <span className="block text-white mt-1 lg:mt-2 opacity-90">
                    FITNESS
                  </span>
                </h1>
              </div>

              {/* Decorative dots pattern - desktop only */}
              <div className="hidden lg:flex gap-1 mb-3 opacity-40">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} className="w-0.5 h-0.5 bg-neon-blue rounded-full"></div>
                ))}
              </div>

              {/* Description with subtle grid pattern */}
              <div className="relative">
                <p className="text-xs lg:text-base text-gray-300 mb-5 lg:mb-6 leading-relaxed font-mono opacity-80">
                  Real-time form analysis, personalized training plans, and AI-driven insights to transform your workouts. Where geometry meets physical perfection.
                </p>
              
                {/* Technical corner accent - desktop only */}
                <div className="hidden lg:block absolute -right-4 top-1/2 w-3 h-3 border border-neon-blue opacity-30" style={{ transform: 'translateY(-50%)' }}>
                  <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-neon-blue" style={{ transform: 'translate(-50%, -50%)' }}></div>
                </div>
              </div>

              {/* Buttons with technical accents */}
              <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 relative z-50">
                <button className="relative px-5 lg:px-6 py-2 lg:py-2.5 bg-transparent text-white font-mono text-xs lg:text-sm border border-white hover:border-neon-blue hover:text-neon-blue transition-all duration-200 group cursor-pointer pointer-events-auto">
                  <span className="hidden lg:block absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="hidden lg:block absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  GET STARTED
                </button>
              
                <button className="relative px-5 lg:px-6 py-2 lg:py-2.5 bg-transparent border border-white/40 text-white font-mono text-xs lg:text-sm hover:border-neon-blue hover:text-neon-blue transition-all duration-200 cursor-pointer pointer-events-auto" style={{ borderWidth: '1px' }}>
                  LEARN MORE
                </button>
              </div>

              {/* Bottom technical notation - desktop only */}
              <div className="hidden lg:flex items-center gap-2 mt-6 opacity-40">
                <span className="text-neon-blue text-[9px] font-mono">∞</span>
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="text-white text-[9px] font-mono">REPRIGHT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="absolute left-0 right-0 z-20 border-t border-white/10 bg-black/40 backdrop-blur-md" style={{ bottom: '5vh' }}>
          <div className="container mx-auto px-4 lg:px-8 py-2 lg:py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 lg:gap-6 text-[8px] lg:text-[9px] font-mono text-white/50">
              <span className="hidden lg:inline text-neon-blue/60">SYSTEM.ACTIVE</span>
              <span className="lg:hidden text-neon-blue/60">SYS.ACT</span>
              <div className="hidden lg:flex gap-1">
                {[10, 6, 15, 8, 12, 5, 14, 7].map((height, i) => (
                  <div key={i} className="w-1 h-3 bg-neon-blue/20" style={{ height: `${height}px` }}></div>
                ))}
              </div>
              <span>V1.0.0</span>
            </div>
          
            <div className="flex items-center gap-2 lg:gap-4 text-[8px] lg:text-[9px] font-mono text-white/50">
              <span className="hidden lg:inline">◐ RENDERING</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-neon-blue/60 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-neon-blue/40 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-1 bg-neon-blue/20 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="hidden lg:inline">FRAME: ∞</span>
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .dither-pattern {
          background-image:
            repeating-linear-gradient(0deg, transparent 0px, transparent 1px, white 1px, white 2px),
            repeating-linear-gradient(90deg, transparent 0px, transparent 1px, white 1px, white 2px);
          background-size: 3px 3px;
        }
       
        .stars-bg {
          background-image:
            radial-gradient(1px 1px at 20% 30%, white, transparent),
            radial-gradient(1px 1px at 60% 70%, white, transparent),
            radial-gradient(1px 1px at 50% 50%, white, transparent),
            radial-gradient(1px 1px at 80% 10%, white, transparent),
            radial-gradient(1px 1px at 90% 60%, white, transparent),
            radial-gradient(1px 1px at 33% 80%, white, transparent),
            radial-gradient(1px 1px at 15% 60%, white, transparent),
            radial-gradient(1px 1px at 70% 40%, white, transparent);
          background-size: 200% 200%, 180% 180%, 250% 250%, 220% 220%, 190% 190%, 240% 240%, 210% 210%, 230% 230%;
          background-position: 0% 0%, 40% 40%, 60% 60%, 20% 20%, 80% 80%, 30% 30%, 70% 70%, 50% 50%;
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
}
