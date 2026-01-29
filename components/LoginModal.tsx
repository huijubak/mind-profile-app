import React, { useState } from 'react';
import { Rocket, X } from 'lucide-react';
import { UserProfile } from '../types';
import { SpaceAstronaut } from './SpaceAstronaut';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleStart = () => {
    if (nickname.length < 2) {
      setError('닉네임은 2글자 이상 입력해주세요.');
      return;
    }
    if (nickname.length > 10) {
      setError('닉네임은 10글자 이하로 입력해주세요.');
      return;
    }

    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      nickname: nickname,
      profileImage: `https://api.dicebear.com/9.x/avataaars/svg?seed=${randomNum}&backgroundColor=c0aede`,
      email: '',
    };

    onLoginSuccess(newUser);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStart();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 font-['Pretendard']">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-[#1A1F2C] rounded-3xl shadow-2xl p-8 overflow-hidden animate-fade-in-up border border-white/10">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center mt-4">
          <div className="w-24 h-24 flex items-center justify-center mb-4 animate-float-slow">
             <SpaceAstronaut className="w-full h-full drop-shadow-xl" />
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              반가워요!
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              친구에게 보여질 닉네임을 입력해주세요.
            </p>
          </div>

          <div className="w-full space-y-4">
            <div className="relative">
              <input
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setError('');
                }}
                onKeyDown={handleKeyDown}
                placeholder="닉네임 입력 (2~10자)"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-colors text-center"
                autoFocus
              />
              {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            </div>

            <button
              onClick={handleStart}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              <span>시작하기</span>
              <Rocket size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};