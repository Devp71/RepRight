import { motion } from 'framer-motion';

interface SvgBodyProps {
  hoveredId: string | null;
  selectedId: string | null;
  onInteract: (id: string, type: 'hover' | 'click') => void;
}

export function SvgBodyBack({ hoveredId, selectedId, onInteract }: SvgBodyProps) {
  const getStyle = (id: string) => {
    const isSelected = selectedId === id;
    const isHovered = hoveredId === id;
    
    if (isSelected) {
      return "fill-white stroke-black stroke-[2px] filter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]";
    }
    if (isHovered) {
      return "fill-white/80 stroke-white stroke-[1.5px] filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]";
    }
    return "fill-black stroke-white/40 stroke-[1px] hover:stroke-white transition-all duration-300";
  };

  const interactiveProps = (id: string) => ({
    onMouseEnter: () => onInteract(id, 'hover'),
    onMouseLeave: () => onInteract('', 'hover'),
    onClick: () => onInteract(id, 'click'),
    className: `cursor-crosshair transition-all duration-200 ${getStyle(id)}`,
  });

  return (
    <motion.svg
      viewBox="0 0 300 600"
      className="w-full h-full drop-shadow-2xl"
      animate={{ y: [0, -5, 0] }}
      transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }} // Slight delay to offset from front breathing
    >
      <g id="posterior-body">
        {/* Head/Neck - Non-interactive Base */}
        <polygon points="150,20 135,40 135,70 165,70 165,40" className="fill-black stroke-white/20 stroke-[1px]" />
        <polygon points="135,70 115,90 185,90 165,70" className="fill-black stroke-white/20 stroke-[1px]" />
        
        {/* Shoulders (Posterior) */}
        <path d="M 115 90 L 80 110 L 70 140 L 100 130 Z" {...interactiveProps('shoulders')} />
        <path d="M 185 90 L 220 110 L 230 140 L 200 130 Z" {...interactiveProps('shoulders')} />

        {/* Back (Lats/Traps combined) */}
        <path d="M 115 90 L 150 120 L 150 200 L 105 180 L 100 130 Z" {...interactiveProps('back')} />
        <path d="M 185 90 L 150 120 L 150 200 L 195 180 L 200 130 Z" {...interactiveProps('back')} />

        {/* Lower Back */}
        <path d="M 105 180 L 150 200 L 150 260 L 110 260 Z" {...interactiveProps('back')} />
        <path d="M 195 180 L 150 200 L 150 260 L 190 260 Z" {...interactiveProps('back')} />

        {/* Triceps */}
        <path d="M 70 140 L 55 190 L 85 185 L 100 150 L 100 130 Z" {...interactiveProps('triceps')} />
        <path d="M 230 140 L 245 190 L 215 185 L 200 150 L 200 130 Z" {...interactiveProps('triceps')} />

        {/* Forearms (Non-interactive) */}
        <polygon points="55,190 40,260 65,250 85,185" className="fill-black stroke-white/20 stroke-[1px]" />
        <polygon points="245,190 260,260 235,250 215,185" className="fill-black stroke-white/20 stroke-[1px]" />
        
        {/* Hands (Non-interactive) */}
        <polygon points="40,260 30,300 55,290 65,250" className="fill-black stroke-white/20 stroke-[1px]" />
        <polygon points="260,260 270,300 245,290 235,250" className="fill-black stroke-white/20 stroke-[1px]" />

        {/* Glutes */}
        <path d="M 110 260 L 150 260 L 150 320 L 100 320 L 90 290 Z" {...interactiveProps('glutes')} />
        <path d="M 190 260 L 150 260 L 150 320 L 200 320 L 210 290 Z" {...interactiveProps('glutes')} />

        {/* Hamstrings */}
        <path d="M 100 320 L 150 320 L 140 410 L 90 410 Z" {...interactiveProps('hamstrings')} />
        <path d="M 200 320 L 150 320 L 160 410 L 210 410 Z" {...interactiveProps('hamstrings')} />

        {/* Knees Base (Posterior) */}
        <polygon points="90,410 140,410 135,440 95,440" className="fill-black stroke-white/20 stroke-[1px]" />
        <polygon points="210,410 160,410 165,440 205,440" className="fill-black stroke-white/20 stroke-[1px]" />

        {/* Calves */}
        <path d="M 95 440 L 135 440 L 115 540 L 90 530 Z" {...interactiveProps('calves')} />
        <path d="M 205 440 L 165 440 L 185 540 L 210 530 Z" {...interactiveProps('calves')} />

        {/* Feet Base (Heels) */}
        <polygon points="90,530 115,540 110,570 85,560" className="fill-black stroke-white/20 stroke-[1px]" />
        <polygon points="210,530 185,540 190,570 215,560" className="fill-black stroke-white/20 stroke-[1px]" />
      </g>

      {/* Decorative Overlays */}
      <rect x="149" y="10" width="2" height="580" fill="white" opacity="0.1" />
    </motion.svg>
  );
}
