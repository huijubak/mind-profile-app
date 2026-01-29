import React, { useState, useEffect } from 'react';
import { ArrowLeft, Rocket } from 'lucide-react';
import { SpaceAstronaut } from './SpaceAstronaut';

interface IntroSequenceProps {
  onFinish: () => void;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onFinish }) => {
  const [step, setStep] = useState(0);
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: string; delay: string }[]>([]);

  // Generate random stars for background
  useEffect(() => {
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      delay: `${Math.random() * 3}s`,
    }));
    setStars(newStars);
  }, []);

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0F172A] text-white overflow-hidden font-['Pretendard']">
      {/* Starry Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white opacity-70 animate-twinkle"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-6 h-16">
        {step > 0 ? (
          <button onClick={handlePrev} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </button>
        ) : (
          <div /> /* Spacer */
        )}
        <button 
          onClick={onFinish} 
          className="text-sm font-medium text-gray-400 hover:text-white transition-colors tracking-wide"
        >
          SKIP
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center px-8 pb-20 w-full max-w-md mx-auto">
        
        {/* Scene Container */}
        <div className="flex-1 flex flex-col items-center justify-center w-full">
            {/* Visuals */}
            <div className="mb-12 relative flex justify-center items-center h-72 w-full">
              {/* Decorative Planets for specific steps */}
              {step === 2 && (
                <>
                  <div className="absolute top-0 right-10 w-12 h-12 rounded-full bg-pink-400 opacity-80 blur-sm animate-float-slow"></div>
                  <div className="absolute bottom-10 left-0 w-8 h-8 rounded-full bg-blue-400 opacity-60 blur-sm animate-float-delayed"></div>
                </>
              )}
               {step === 3 && (
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 to-transparent rounded-full blur-3xl scale-150 -z-10"></div>
              )}

              {/* Character: Space Astronaut */}
              <div key={step} className="animate-fade-in-up">
                 <SpaceAstronaut className="w-56 h-56 sm:w-64 sm:h-64 drop-shadow-2xl animate-float" />
              </div>
            </div>

            {/* Text Card */}
            <div key={`text-${step}`} className="text-center space-y-4 animate-fade-in w-full">
              {step === 0 && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
                  <p className="text-lg font-medium leading-relaxed">
                    여러분, 안녕하세요!<br/>
                    저는 <span className="text-indigo-300 font-bold">루미</span>라고 해요.
                  </p>
                </div>
              )}
              {step === 1 && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
                  <p className="text-lg font-medium leading-relaxed">
                    저는 매일 이 광활한 우주에서<br/>
                    <span className="text-yellow-300 font-bold">흥미로운 질문 편지</span>를<br/>
                    여러분에게 배달해 드려요!
                  </p>
                </div>
              )}
              {step === 2 && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
                  <p className="text-lg font-medium leading-relaxed">
                    우리들의 답변이 모여<br/>
                    서로를 이해하는 <span className="text-pink-300 font-bold">새로운 은하</span>가<br/>
                    만들어질 거예요.
                  </p>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold mb-2">우리들의 물음으로<br/>우주를 물들이자.</h2>
                  <p className="text-gray-300 text-sm">준비 되셨나요?</p>
                </div>
              )}
            </div>
        </div>

        {/* Footer Actions */}
        <div className="w-full mt-auto space-y-4">
          {step === 3 ? (
            <div className="space-y-3 animate-fade-in-up flex flex-col gap-2">
              <button 
                onClick={onFinish}
                className="w-full bg-[#FEE500] text-[#191919] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#FDD835] transition-colors shadow-lg shadow-yellow-500/20"
              >
                <Rocket size={20} fill="currentColor" />
                <span>시작하기</span>
              </button>
            </div>
          ) : (
            <div className="flex justify-center pb-4">
                {/* Pagination Dots */}
                <div className="flex gap-2">
                    {Array.from({length: totalSteps}).map((_, i) => (
                        <div 
                            key={i}
                            className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
                        />
                    ))}
                </div>
            </div>
          )}
          
          {step < 3 && (
             <div 
                className="absolute inset-0 z-0" 
                onClick={handleNext} 
                aria-label="Next step"
             ></div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-twinkle {
          animation: twinkle 3s infinite ease-in-out;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-slow 7s ease-in-out infinite 1s;
        }
        .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};