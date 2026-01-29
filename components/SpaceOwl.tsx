import React from 'react';

interface SpaceOwlProps {
  className?: string;
}

export const SpaceOwl: React.FC<SpaceOwlProps> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(10, 10)">
        {/* --- Left Wing (Waving) --- */}
        <g className="animate-wing-wave origin-[30px_100px]">
          <path d="M35 100 Q10 70 20 45 Q40 40 55 75" fill="#81A1F8" stroke="#6080D0" strokeWidth="2" />
          {/* Feathers */}
          <path d="M22 55 Q28 62 20 68" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="M28 65 Q34 72 26 78" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* --- Feet (Tiny Stubs) --- */}
        <path d="M75 168 Q75 178 70 178 M75 168 Q75 178 80 178" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M105 168 Q105 178 100 178 M105 168 Q105 178 110 178" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* --- Body (Round & Squat) --- */}
        <ellipse cx="90" cy="110" rx="75" ry="70" fill="#81A1F8" />
        
        {/* Ear Tufts (Rounded) */}
        <path d="M40 55 Q30 35 55 45" fill="#81A1F8" />
        <path d="M140 55 Q150 35 125 45" fill="#81A1F8" />

        {/* --- Belly (White & Fluffy) --- */}
        <ellipse cx="90" cy="125" rx="55" ry="50" fill="white" />

        {/* --- Right Wing (Tucked) --- */}
        <path d="M160 100 Q180 120 160 150" fill="#81A1F8" stroke="#6080D0" strokeWidth="2" />
        
        {/* --- Face --- */}
        
        {/* Blush (Pink Cheeks) */}
        <ellipse cx="50" cy="105" rx="10" ry="6" fill="#FDA4AF" opacity="0.6" />
        <ellipse cx="130" cy="105" rx="10" ry="6" fill="#FDA4AF" opacity="0.6" />

        {/* Eyes (Bigger!) */}
        <circle cx="65" cy="85" r="30" fill="white" />
        <circle cx="115" cy="85" r="30" fill="white" />
        
        {/* Glasses (Round Black Rims) */}
        <circle cx="65" cy="85" r="30" fill="none" stroke="#1E293B" strokeWidth="4" />
        <circle cx="115" cy="85" r="30" fill="none" stroke="#1E293B" strokeWidth="4" />
        <path d="M93 85 L87 85" stroke="#1E293B" strokeWidth="4" /> {/* Bridge */}
        <path d="M35 85 L20 80" stroke="#1E293B" strokeWidth="3" /> {/* Left Arm */}
        <path d="M145 85 L160 80" stroke="#1E293B" strokeWidth="3" /> {/* Right Arm */}

        {/* Pupils (Large & Cute) */}
        <g className="animate-blink">
            <circle cx="65" cy="85" r="16" fill="#1E293B" />
            <circle cx="115" cy="85" r="16" fill="#1E293B" />
            
            {/* Big Sparkle */}
            <circle cx="58" cy="78" r="5" fill="white" />
            <circle cx="108" cy="78" r="5" fill="white" />
            {/* Small Sparkle */}
            <circle cx="70" cy="90" r="2" fill="white" />
            <circle cx="120" cy="90" r="2" fill="white" />
        </g>

        {/* Beak (Tiny) */}
        <path d="M85 98 Q90 108 95 98" fill="#F59E0B" />
        
        {/* --- Space Helmet (Bubble) --- */}
        <circle cx="90" cy="95" r="90" fill="rgba(255, 255, 255, 0.1)" stroke="white" strokeWidth="3" />
        
        {/* Helmet Reflections */}
        <path d="M40 50 Q20 80 25 100" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        <circle cx="140" cy="50" r="5" fill="white" opacity="0.4" />
      </g>

      <style>{`
        .animate-wing-wave {
          animation: wingWave 1.5s ease-in-out infinite;
        }
        @keyframes wingWave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-20deg); }
        }
        .animate-blink { animation: blink 3.5s infinite; }
        @keyframes blink {
          0%, 96%, 100% { transform: scaleY(1); }
          98% { transform: scaleY(0.1); }
        }
      `}</style>
    </svg>
  );
};