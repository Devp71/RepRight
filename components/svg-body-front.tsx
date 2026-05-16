import { motion } from 'framer-motion';

interface SvgBodyProps {
  hoveredId: string | null;
  selectedId: string | null;
  onInteract: (id: string, type: 'hover' | 'click') => void;
}

export function SvgBodyFront({ hoveredId, selectedId, onInteract }: SvgBodyProps) {
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
      transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
    >
      <g id="anterior-body">
        {/* Head/Neck - Non-interactive Base */}
        <polygon points="150,20 135,40 135,70 165,70 165,40" className="fill-black stroke-white/20 stroke-[1px]" />
        <polygon points="135,70 115,90 185,90 165,70" className="fill-black stroke-white/20 stroke-[1px]" />
        
        {/* Shoulders */}
        <path d="M 115 90 L 80 110 L 70 140 L 100 130 Z" {...interactiveProps('shoulders')} />
        <path d="M 185 90 L 220 110 L 230 140 L 200 130 Z" {...interactiveProps('shoulders')} />

        {/* Chest */}
        <path d="M 115 90 L 150 100 L 150 160 L 100 150 L 100 130 Z" {...interactiveProps('chest')} />
        <path d="M 185 90 L 150 100 L 150 160 L 200 150 L 200 130 Z" {...interactiveProps('chest')} />

        {/* Abs/Core */}
        <path d="M 100 150 L 150 160 L 150 250 L 110 260 L 105 200 Z" {...interactiveProps('abs')} />
        <path d="M 200 150 L 150 160 L 150 250 L 190 260 L 195 200 Z" {...interactiveProps('abs')} />

        {/* Biceps */}
        <path d="M 70 140 L 55 190 L 85 185 L 100 150 Z" {...interactiveProps('biceps')} />
        <path d="M 230 140 L 245 190 L 215 185 L 200 150 Z" {...interactiveProps('biceps')} />

        {/* Forearms (Non-interactive) */}
        <polygon points="55,190 40,260 65,250 85,185" className="fill-black stroke-white/20 stroke-[1px]" />
        <polygon points="245,190 260,260 235,250 215,185" className="fill-black stroke-white/20 stroke-[1px]" />
        
        {/* Hands (Non-interactive) */}
        <polygon points="40,260 30,300 55,290 65,250" className="fill-black stroke-white/20 stroke-[1px]" />
        <polygon points="260,260 270,300 245,290 235,250" className="fill-black stroke-white/20 stroke-[1px]" />

        {/* Pelvis Base */}
        <polygon points="110,260 150,250 190,260 160,310 140,310" className="fill-black stroke-white/20 stroke-[1px]" />

        {/* Quads */}
        <path d="M 110 260 L 140 310 L 130 420 L 90 410 L 80 320 Z" {...interactiveProps('quads')} />
        <path d="M 190 260 L 160 310 L 170 420 L 210 410 L 220 320 Z" {...interactiveProps('quads')} />

        {/* Knees Base */}
        <polygon points="90,410 130,420 125,450 95,440" className="fill-black stroke-white/20 stroke-[1px]" />
        <polygon points="210,410 170,420 175,450 205,440" className="fill-black stroke-white/20 stroke-[1px]" />

        {/* Calves (Anterior Tibialis view) */}
        <path d="M 95 440 L 125 450 L 115 540 L 90 530 Z" {...interactiveProps('calves')} />
        <path d="M 205 440 L 175 450 L 185 540 L 210 530 Z" {...interactiveProps('calves')} />

        {/* Feet Base */}
        <polygon points="90,530 115,540 120,580 80,570" className="fill-black stroke-white/20 stroke-[1px]" />
        <polygon points="210,530 185,540 180,580 220,570" className="fill-black stroke-white/20 stroke-[1px]" />
      </g>

      {/* Decorative Overlays */}
      <circle cx="150" cy="50" r="3" fill="white" className="animate-pulse" />
      <line x1="150" y1="10" x2="150" y2="30" stroke="white" strokeWidth="0.5" opacity="0.5" />
    </motion.svg>
  );
}
