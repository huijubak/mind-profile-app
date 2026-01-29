import React from 'react';

interface SpaceAstronautProps {
  className?: string;
}

export const SpaceAstronaut: React.FC<SpaceAstronautProps> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="visorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="20%" stopColor="#2E2B44" />
          <stop offset="100%" stopColor="#120F24" />
        </linearGradient>
      </defs>

      <g className="animate-float">
        
        {/* === Left Arm (Back Wing) === */}
        {/* Extending left and back - viewed from side */}
        <path 
          d="M60 115 Q 40 115 30 110 C 25 108, 25 125, 35 128 Q 50 130 65 125" 
          fill="#FFFFFF" 
          stroke="#2D2A4A" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* === Left Leg (Back Leg) === */}
        {/* Curled under */}
        <path 
          d="M60 145 Q 40 155 45 170 C 50 185, 70 180, 75 165" 
          fill="#FFFFFF" 
          stroke="#2D2A4A" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        {/* Sole shadow/detail */}
        <path d="M48 175 Q 55 178 65 172" stroke="#2D2A4A" strokeWidth="3" fill="none" opacity="0.3" />

        {/* === Backpack === */}
        <path 
          d="M65 90 Q 45 90 45 115 Q 45 140 75 140" 
          fill="#FFFFFF" 
          stroke="#2D2A4A" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* === Body === */}
        {/* Chubby torso */}
        <path 
          d="M75 100 C 75 100, 130 95, 145 120 C 150 140, 120 160, 95 160 C 75 160, 70 140, 75 120" 
          fill="#FFFFFF" 
          stroke="#2D2A4A" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* === Right Leg (Front Leg) === */}
        <path 
          d="M85 155 Q 80 175 90 185 C 105 195, 115 180, 110 160" 
          fill="#FFFFFF" 
          stroke="#2D2A4A" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        {/* Knee/Suit Detail line */}
        <path d="M92 180 Q 100 185 108 178" stroke="#2D2A4A" strokeWidth="3" fill="none" opacity="0.3" />

        {/* === Chest Unit === */}
        <g transform="translate(90, 130) rotate(10)">
            <rect x="0" y="0" width="35" height="22" rx="4" fill="#F1F5F9" stroke="#2D2A4A" strokeWidth="5" />
            <circle cx="25" cy="11" r="3.5" fill="#3B82F6" />
            <path d="M8 8 L 15 8" stroke="#2D2A4A" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 14 L 12 14" stroke="#2D2A4A" strokeWidth="2" strokeLinecap="round" />
        </g>
        {/* Chest Strap */}
        <path d="M68 128 Q 80 135 90 135" stroke="#2D2A4A" strokeWidth="5" fill="none" />

        {/* === Right Arm (Front Wing) === */}
        {/* Stretching forward/up-right */}
        <path 
          d="M130 115 Q 160 100 180 95 C 190 98, 185 115, 175 120 Q 155 130 135 130" 
          fill="#FFFFFF" 
          stroke="#2D2A4A" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        {/* Glove line */}
        <path d="M165 105 Q 168 112 165 118" stroke="#2D2A4A" strokeWidth="4" fill="none" opacity="0.5" />

        {/* === Helmet === */}
        {/* Main Sphere */}
        <circle cx="110" cy="80" r="48" fill="#FFFFFF" stroke="#2D2A4A" strokeWidth="6" />
        
        {/* Earpiece (Connector) */}
        <ellipse cx="72" cy="90" rx="10" ry="16" fill="#FFFFFF" stroke="#2D2A4A" strokeWidth="6" transform="rotate(-15 72 90)" />
        <ellipse cx="72" cy="90" rx="4" ry="8" fill="#E2E8F0" transform="rotate(-15 72 90)" />

        {/* Visor */}
        <circle cx="118" cy="80" r="36" fill="url(#visorGradient)" stroke="#2D2A4A" strokeWidth="3" />
        
        {/* Visor Reflections */}
        {/* Large swoop at top left of visor */}
        <path 
            d="M 100 60 Q 110 55 125 58 Q 115 65 100 68" 
            fill="white" 
            opacity="0.2"
        />
        {/* Big soft highlight */}
        <ellipse cx="105" cy="68" rx="10" ry="6" fill="white" opacity="0.15" transform="rotate(-30 105 68)" />
        {/* Sharp dot reflections */}
        <circle cx="135" cy="95" r="3" fill="white" opacity="0.8" />
        <circle cx="95" cy="90" r="6" fill="white" opacity="0.1" />

        {/* === Shadow under body (optional for depth) === */}
        <path d="M85 110 Q 110 110 120 120" stroke="#CBD5E1" strokeWidth="3" fill="none" opacity="0.5" />

      </g>
      <style>{`
        .animate-float {
            animation: float 4s ease-in-out infinite;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(2deg); }
            50% { transform: translateY(-12px) rotate(-2deg); }
        }
      `}</style>
    </svg>
  );
};