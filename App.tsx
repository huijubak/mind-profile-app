import React, { useState, useEffect, useRef } from 'react';
import { QuestionCategory, DailyQuestion, AIReaction, UserProfile, ViewState, AnswerRecord, Friend, Notification } from './types';
import { generateQuestion, generateAIReaction } from './services/geminiService';
import { IntroSequence } from './components/IntroSequence';
import { LoginModal } from './components/LoginModal';
import { SpaceAstronaut } from './components/SpaceAstronaut';
import { 
  MessageCircle, 
  Share2, 
  Sparkles, 
  ChevronLeft,
  ChevronRight,
  Edit3,
  Check,
  RefreshCcw,
  User,
  Send,
  Trash2,
  MoreHorizontal,
  X,
  Settings,
  Bell,
  Camera,
  LogOut,
  UserMinus,
  Users
} from 'lucide-react';

declare global {
  interface Window {
    Kakao: any;
  }
}

// --- Constants & Config ---

const THEMES: Record<string, { gradient: string; shadow: string; border: string; accent: string; ring: string }> = {
  purple: {
    gradient: "from-indigo-400 via-purple-500 to-indigo-600",
    shadow: "shadow-[0_0_50px_rgba(139,92,246,0.4)]",
    border: "border-purple-400",
    accent: "bg-purple-500",
    ring: "ring-purple-300"
  },
  pink: {
    gradient: "from-rose-400 via-pink-500 to-rose-600",
    shadow: "shadow-[0_0_50px_rgba(244,63,94,0.4)]",
    border: "border-pink-400",
    accent: "bg-pink-500",
    ring: "ring-pink-300"
  },
  blue: {
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    shadow: "shadow-[0_0_50px_rgba(59,130,246,0.4)]",
    border: "border-blue-400",
    accent: "bg-blue-500",
    ring: "ring-blue-300"
  },
  orange: {
    gradient: "from-amber-400 via-orange-500 to-red-500",
    shadow: "shadow-[0_0_50px_rgba(249,115,22,0.4)]",
    border: "border-orange-400",
    accent: "bg-orange-500",
    ring: "ring-orange-300"
  },
  green: {
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
    shadow: "shadow-[0_0_50px_rgba(16,185,129,0.4)]",
    border: "border-emerald-400",
    accent: "bg-emerald-500",
    ring: "ring-emerald-300"
  },
  gray: {
    gradient: "from-gray-700 via-gray-600 to-slate-800",
    shadow: "shadow-[0_0_40px_rgba(255,255,255,0.1)]",
    border: "border-gray-500",
    accent: "bg-gray-600",
    ring: "ring-gray-300"
  }
};

// --- Components ---

const SpaceBackground = () => {
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: string; delay: string; opacity: number }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      delay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.7 + 0.3
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#0B0F19]">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: star.delay,
          }}
        />
      ))}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  );
};

const MindProfileLogo = () => (
  <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">
    <defs>
      <linearGradient id="planetGradient" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A78BFA" /> {/* Soft Purple */}
        <stop offset="100%" stopColor="#6366F1" /> {/* Indigo */}
      </linearGradient>
      <linearGradient id="ringGradient" x1="0" y1="50" x2="100" y2="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F472B6" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#C084FC" stopOpacity="0.8" />
      </linearGradient>
    </defs>
    
    {/* Orbit Ring (Back) */}
    <path d="M 15 65 Q 50 85 85 65" stroke="url(#ringGradient)" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
    
    {/* Planet Body */}
    <circle cx="50" cy="50" r="28" fill="url(#planetGradient)" />
    
    {/* Planet Highlight */}
    <ellipse cx="40" cy="40" rx="10" ry="6" fill="white" fillOpacity="0.2" transform="rotate(-45 40 40)" />

    {/* Orbit Ring (Front) */}
    <path d="M 85 65 Q 95 55 85 40 Q 50 20 15 40 Q 5 55 15 65" stroke="url(#ringGradient)" strokeWidth="6" strokeLinecap="round" opacity="0.9" />

    {/* Small Star/Sparkle */}
    <path d="M 80 25 L 82 20 L 84 25 L 89 27 L 84 29 L 82 34 L 80 29 L 75 27 Z" fill="#FDE047" />
  </svg>
);

// --- App Component ---
const App: React.FC = () => {
  // Navigation & Auth
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [view, setView] = useState<ViewState>('HOME');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Data State
  const [dailyQuestions, setDailyQuestions] = useState<DailyQuestion[]>([]);
  const [answerHistory, setAnswerHistory] = useState<AnswerRecord[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<AnswerRecord | null>(null);

  // Social & Notifications
  const [friends, setFriends] = useState<Friend[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'HISTORY' | 'FRIENDS'>('HISTORY');

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);

  // Inputs
  const [customQuestionText, setCustomQuestionText] = useState('');
  const [customTheme, setCustomTheme] = useState<string>('gray');
  const [selectedQuestion, setSelectedQuestion] = useState<DailyQuestion | null>(null);
  const [answer, setAnswer] = useState('');
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null); // For editing logic
  
  // Profile Edit State
  const [editNickname, setEditNickname] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editError, setEditError] = useState('');

  // Results
  const [aiReaction, setAiReaction] = useState<AIReaction | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'NONE' | 'QA' | 'Q' | 'PROFILE'>('NONE');

  // Constants based on Policy
  const MAX_QUESTION_LENGTH = 30; // HM003
  const MAX_ANSWER_LENGTH = 50;   // AS001

  // Initialize
  useEffect(() => {
    loadInitialQuestions();
    loadMockSocialData();
  }, []);

  const loadInitialQuestions = async () => {
    setIsLoadingQuestion(true);
    try {
      // Parallel fetch for diversity
      // Set default themes for initial questions
      const [q1, q2] = await Promise.all([
        generateQuestion(QuestionCategory.RELATIONSHIP),
        generateQuestion(QuestionCategory.IF)
      ]);
      q1.theme = 'purple';
      q2.theme = 'pink';
      setDailyQuestions([q1, q2]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  const loadMockSocialData = () => {
    // Mock Friends (Simulate friends added via answer interaction)
    setFriends([
      {
        id: 'friend1',
        nickname: '우주여행자',
        profileImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4',
        lastInteraction: '2023.10.25',
        status: 'ACTIVE'
      },
      {
        id: 'friend2',
        nickname: '새벽감성',
        profileImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede',
        lastInteraction: '2023.10.24',
        status: 'NEW'
      }
    ]);

    // Mock Notifications
    setNotifications([
      {
        id: 'n1',
        type: 'ANSWER',
        message: '우주여행자님이 내 질문에 답변을 남겼습니다.',
        time: '방금 전',
        isRead: false
      },
      {
        id: 'n2',
        type: 'NEW_FRIEND',
        message: '새벽감성님과 친구가 되었습니다!',
        time: '3시간 전',
        isRead: false
      },
      {
        id: 'n3',
        type: 'REMINDER',
        message: '답변을 못 받은 질문이 1일 이상 지났어요.',
        time: '1일 전',
        isRead: true
      }
    ]);
  };

  // --- Handlers ---

  const handleNextSlide = () => setCurrentSlideIndex((prev) => (prev + 1) % 3);
  const handlePrevSlide = () => setCurrentSlideIndex((prev) => (prev === 0 ? 2 : prev - 1));

  const handleStartAnswering = () => {
    let questionToUse: DailyQuestion | null = null;

    if (currentSlideIndex === 2) {
      if (!customQuestionText.trim()) return;
      questionToUse = {
        id: 'custom',
        category: '직접 작성',
        question: customQuestionText,
        context: 'From. Me',
        theme: customTheme
      };
    } else {
      questionToUse = dailyQuestions[currentSlideIndex];
    }

    if (!questionToUse) return;
    setSelectedQuestion(questionToUse);
    setEditingAnswerId(null); // Reset editing state
    setAnswer('');

    if (!user) {
      setShowLoginModal(true);
    } else {
      setView('ANSWER');
    }
  };

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setShowLoginModal(false);
    if (selectedQuestion && view !== 'PROFILE') {
        setView('ANSWER');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedQuestion || !answer.trim()) return;
    setIsAnalyzing(true);
    
    let reaction: AIReaction | undefined;
    try {
      reaction = await generateAIReaction(selectedQuestion.question, answer);
      setAiReaction(reaction);
    } catch {
      // Ignore error
    } finally {
      setIsAnalyzing(false);
      
      // Save or Update History
      if (editingAnswerId) {
        // Update existing record
        setAnswerHistory(prev => prev.map(item => 
          item.id === editingAnswerId 
            ? { ...item, answer: answer, aiReaction: reaction, theme: selectedQuestion.theme }
            : item
        ));
      } else {
        // Create new record
        const newRecord: AnswerRecord = {
          id: Date.now().toString(),
          question: selectedQuestion,
          answer: answer,
          date: new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }),
          aiReaction: reaction,
          theme: selectedQuestion.theme
        };
        setAnswerHistory(prev => [newRecord, ...prev]);
      }

      setView('RESULT');
    }
  };

  const handleShareQA = async () => {
    const question = selectedQuestion?.question || selectedHistoryItem?.question.question;
    const ans = answer || selectedHistoryItem?.answer;
    
    const text = `[마음프로필]\n\nQ. ${question}\n\nA. ${ans}\n\n나의 답변이야, 너는 어떻게 생각해?`;
    
    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: '마음프로필',
          text: text,
          url: window.location.href,
        });
        return;
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    }

    // Fallback to Clipboard
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('QA');
      setTimeout(() => setCopyStatus('NONE'), 2000);
    } catch (err) {
      alert('공유하기를 지원하지 않는 환경입니다.');
    }
  };

  const handleShareQuestionOnly = async () => {
    const question = selectedQuestion?.question || selectedHistoryItem?.question.question;
    const text = `[마음프로필]\n\nQ. ${question}\n\n이 질문에 너의 답을 듣고 싶어!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '마음프로필',
          text: text,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // ignore
      }
    }
    
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('Q');
      setTimeout(() => setCopyStatus('NONE'), 2000);
    } catch (err) {
      // ignore
    }
  };

  const handleFriendShare = async () => {
      // Re-using the same logic as Share QA but just ensuring it triggers the intent clearly
      await handleShareQA();
  };

  const handleShareProfile = async () => {
    const text = `[마음프로필] ${user?.nickname}님의 프로필을 확인해보세요!\nhttps://mindprofile.app/u/${user?.id}`;
    
    try {
        await navigator.clipboard.writeText(text);
        setCopyStatus('PROFILE');
        setTimeout(() => setCopyStatus('NONE'), 2000);
    } catch (err) {
        alert('주소 복사에 실패했습니다.');
    }
  };

  const handleHomeClick = () => {
    if (view === 'ANSWER' && answer.length > 0) {
      if (!window.confirm('홈으로 돌아가시겠습니까? 작성 중인 내용은 사라집니다.')) return;
    }
    resetState();
    setView('HOME');
  };

  const handleProfileClick = () => {
    if (user) {
        setView('PROFILE');
    } else {
        setShowLoginModal(true);
    }
  };

  // --- Specific Answer Actions ---
  
  const handleEditAnswer = () => {
      if (!selectedHistoryItem) return;
      
      // Set state to edit mode
      setSelectedQuestion(selectedHistoryItem.question);
      setAnswer(selectedHistoryItem.answer);
      setEditingAnswerId(selectedHistoryItem.id);
      
      setView('ANSWER');
  };

  const handleDeleteAnswer = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까? 삭제된 기록은 복구할 수 없습니다.')) {
        setAnswerHistory(prev => prev.filter(item => item.id !== id));
        setView('PROFILE');
    }
  };

  const resetState = () => {
    setAnswer('');
    setCustomQuestionText('');
    setAiReaction(null);
    setSelectedQuestion(null);
    setSelectedHistoryItem(null);
    setEditingAnswerId(null);
    setCustomTheme('gray');
  };

  const handleLogout = () => {
      if(window.confirm('로그아웃 하시겠습니까?')) {
          setUser(null);
          setShowSettings(false);
          setView('HOME');
      }
  };

  const handleWithdraw = () => {
      if(window.confirm('정말로 탈퇴하시겠습니까? 모든 기록과 친구 목록이 삭제됩니다.')) {
          alert('탈퇴가 완료되었습니다.');
          setUser(null);
          setAnswerHistory([]);
          setFriends([]);
          setNotifications([]);
          setShowSettings(false);
          setView('HOME');
      }
  };

  // --- Profile Edit Handlers ---
  const handleStartEditProfile = () => {
      if (user) {
          setEditNickname(user.nickname);
          setEditImage(user.profileImage || '');
          setEditError('');
          setView('PROFILE_EDIT');
      }
  };

  const handleGenerateRandomProfileImage = () => {
      const seed = Math.floor(Math.random() * 10000);
      setEditImage(`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=c0aede`);
  };

  const handleSaveProfile = () => {
      // Policy check
      if (editNickname.length < 2) {
          setEditError('닉네임은 최소 2글자 이상이어야 합니다.');
          return;
      }
      if (editNickname.length > 10) {
          setEditError('닉네임은 최대 10글자까지 가능합니다.');
          return;
      }
      const regex = /^[가-힣a-zA-Z0-9]+$/;
      if (!regex.test(editNickname)) {
          setEditError('한글, 영문, 숫자만 사용할 수 있습니다. (특수문자/공백 불가)');
          return;
      }

      if (user) {
          setUser({ ...user, nickname: editNickname, profileImage: editImage });
          setView('PROFILE');
      }
  };

  // --- Render Sections ---

  const renderPlanet = (index: number) => {
    const sizeClasses = "w-48 h-48 sm:w-56 sm:h-56";
    let themeKey = 'gray';

    if (index === 2) {
        themeKey = customTheme;
    } else {
        themeKey = dailyQuestions[index]?.theme || (index === 0 ? 'purple' : 'pink');
    }

    const theme = THEMES[themeKey] || THEMES['gray'];
    const showEditIcon = index === 2 && !customQuestionText;

    return (
      <div className={`${sizeClasses} rounded-full bg-gradient-to-br ${theme.gradient} ${theme.shadow} flex items-center justify-center relative animate-float transition-all duration-500`}>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 mix-blend-overlay rounded-full"></div>
          
          {index === 2 && (
             <div className="absolute inset-4 rounded-full border border-dashed border-white/20"></div>
          )}

          {/* Ring for index 1 */}
          {index === 1 && (
             <div className="absolute w-[140%] h-[20%] border-[4px] border-white/10 rounded-[100%] rotate-[-20deg]"></div>
          )}

          {/* Icon */}
          {showEditIcon ? (
              <Edit3 className="text-white/30 w-16 h-16" />
          ) : (
             <div className="absolute -right-4 top-0 w-16 h-16 animate-float-delayed z-10">
                <SpaceAstronaut />
             </div>
          )}
      </div>
    );
  };

  const renderHome = () => (
    <div className="flex-1 flex flex-col w-full h-full relative z-10 animate-fade-in">
      {/* Carousel */}
      <div className="flex-1 flex flex-col justify-center items-center relative px-6">
        
        {/* Navigation */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 pointer-events-none">
          <button onClick={handlePrevSlide} className="pointer-events-auto p-3 text-white/30 hover:text-white transition-colors">
            <ChevronLeft size={36} />
          </button>
          <button onClick={handleNextSlide} className="pointer-events-auto p-3 text-white/30 hover:text-white transition-colors">
            <ChevronRight size={36} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center w-full max-w-xs text-center z-10">
          
          <div className="mb-8 transform transition-transform duration-500 hover:scale-105">
            {renderPlanet(currentSlideIndex)}
          </div>

          <div className="w-full min-h-[160px] flex flex-col items-center">
            {/* Tag */}
            <div className="mb-4">
              {currentSlideIndex === 2 ? (
                <span className="px-3 py-1 rounded-full border border-white/30 text-white/70 text-xs font-medium">
                  #직접_작성
                </span>
              ) : (
                <div className="flex gap-2">
                   <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-medium">
                     #{dailyQuestions[currentSlideIndex]?.category || '...'}
                   </span>
                   {/* Removed Refresh Button as requested */}
                </div>
              )}
            </div>

            {/* Question Text */}
            {currentSlideIndex === 2 ? (
              <div className="w-full relative group flex flex-col items-center">
                <textarea
                  value={customQuestionText}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_QUESTION_LENGTH) setCustomQuestionText(e.target.value);
                  }}
                  placeholder="오늘 가장 듣고 싶은 말은?"
                  className="w-full bg-transparent border-b-2 border-white/20 text-center text-xl font-bold text-white placeholder-white/20 focus:outline-none focus:border-white pb-4 resize-none transition-colors"
                  rows={2}
                />
                <div className={`w-full text-right text-xs mt-2 transition-colors ${customQuestionText.length >= MAX_QUESTION_LENGTH ? 'text-red-400 font-bold' : 'text-white/40'}`}>
                  {customQuestionText.length} / {MAX_QUESTION_LENGTH}
                </div>

                {/* Color Palette */}
                <div className="mt-6 flex gap-3 p-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
                    {Object.keys(THEMES).filter(k => k !== 'gray').map((colorKey) => (
                        <button
                            key={colorKey}
                            onClick={() => setCustomTheme(colorKey)}
                            className={`w-6 h-6 rounded-full transition-all duration-200 ${THEMES[colorKey].accent} ${customTheme === colorKey ? 'scale-125 ring-2 ring-white' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                            aria-label={`Select ${colorKey} theme`}
                        />
                    ))}
                     <button
                        onClick={() => setCustomTheme('gray')}
                        className={`w-6 h-6 rounded-full bg-gray-600 transition-all duration-200 ${customTheme === 'gray' ? 'scale-125 ring-2 ring-white' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                        aria-label="Select gray theme"
                    />
                </div>
              </div>
            ) : (
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed break-keep drop-shadow-lg">
                {dailyQuestions[currentSlideIndex]?.question || "질문을 불러오고 있어요..."}
              </h2>
            )}
            
            {/* Context/Subtitle */}
            {currentSlideIndex < 2 && (
              <p className="mt-4 text-sm text-white/50 font-light">
                {dailyQuestions[currentSlideIndex]?.context}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Footer Button */}
      <div className="p-6 w-full max-w-md mx-auto">
        <button 
          onClick={handleStartAnswering}
          disabled={currentSlideIndex === 2 && !customQuestionText.trim()}
          className="w-full bg-white text-[#0B0F19] font-bold text-lg py-4 rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {currentSlideIndex === 2 ? '이 질문으로 시작' : '답변 작성하기'}
        </button>
      </div>
    </div>
  );

  const renderAnswer = () => {
    const theme = selectedQuestion?.theme ? THEMES[selectedQuestion.theme] : THEMES['gray'];

    return (
        <div className="flex-1 flex flex-col w-full h-full relative z-10 p-6 animate-fade-in-up max-w-md mx-auto">
          
          {/* Top: Question Card Preview */}
          <div className={`backdrop-blur-md rounded-2xl p-6 border mb-6 shadow-xl relative overflow-hidden transition-colors duration-500 bg-gradient-to-br from-white/10 to-white/5 ${theme.border}`}>
             {/* Decoration */}
             <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-20 ${theme.accent}`}></div>
             
             <div className="relative z-10 text-center">
                <span className="text-xs text-white/60 block mb-2 opacity-80">
                  #{selectedQuestion?.category}
                </span>
                <h3 className="text-lg font-bold text-white leading-relaxed">
                  {selectedQuestion?.question}
                </h3>
             </div>
          </div>
    
          {/* Answer Input */}
          <div className="flex-1">
             <label className="text-sm text-gray-400 mb-2 block ml-1">
                 {editingAnswerId ? '답변 수정하기' : '나의 답변'}
             </label>
             <div className="bg-[#1A1F2C] rounded-2xl p-4 border border-white/10 focus-within:border-white/40 transition-colors h-48 flex flex-col relative">
                <textarea
                  value={answer}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_ANSWER_LENGTH) setAnswer(e.target.value);
                  }}
                  placeholder="내 생각을 자유롭게 적어보세요..."
                  className="flex-1 bg-transparent text-white placeholder-gray-600 resize-none focus:outline-none text-lg leading-relaxed"
                />
                
                {/* Character Count */}
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                   <span className={`text-xs ${answer.length >= MAX_ANSWER_LENGTH ? 'text-red-400' : 'text-gray-500'}`}>
                     {answer.length} / {MAX_ANSWER_LENGTH}자
                   </span>
                   <SpaceAstronaut className="w-8 h-8 opacity-50" />
                </div>
             </div>
             
             <p className="text-center text-xs text-gray-500 mt-4">
               답변은 친구에게 공유할 수 있어요.
             </p>
          </div>
    
          {/* Action */}
          <button 
            onClick={handleSubmitAnswer}
            disabled={!answer.trim() || isAnalyzing}
            className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 mt-auto flex items-center justify-center gap-2 bg-gradient-to-r ${theme.gradient}`}
          >
            {isAnalyzing ? (
               <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>생성 중...</span>
               </>
            ) : (
              <>
                <span>{editingAnswerId ? '수정 완료' : '완료 및 카드 만들기'}</span>
                <Sparkles size={18} />
              </>
            )}
          </button>
        </div>
      );
  };

  const renderResult = () => {
    const theme = selectedQuestion?.theme ? THEMES[selectedQuestion.theme] : THEMES['gray'];

    return (
        <div className="flex-1 flex flex-col w-full h-full relative z-10 p-6 animate-fade-in max-w-md mx-auto items-center justify-center">
          
          {/* Title Area */}
          <div className="text-center mb-10 mt-6 animate-fade-in">
             <h2 className="text-2xl font-bold text-white mb-2">{editingAnswerId ? '수정 완료!' : '답변 완료!'}</h2>
             <p className="text-gray-300 text-lg">친구에게도 질문을 보내보세요.</p>
          </div>

          {/* Card View */}
          <div className="w-full max-w-[320px] aspect-[4/5] relative rounded-3xl overflow-hidden shadow-2xl animate-float-slow">
            {/* Card Background */}
            <div className={`absolute inset-0 bg-gradient-to-b from-[#2a3042] to-[#0f1219]`}>
               {/* Planet Graphic in Background */}
               <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-br ${theme.gradient} blur-xl opacity-40`}></div>
               <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-br ${theme.gradient} opacity-80 shadow-[0_0_60px_rgba(255,255,255,0.2)]`}></div>
               
               {/* Stars overlay on card */}
               <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center z-10">
               {/* Tags */}
               <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <span className="text-sm font-medium text-white/70">#{selectedQuestion?.category}</span>
                  <span className="text-sm font-medium text-white/70">#{user?.nickname}</span>
               </div>
               
               {/* Question */}
               <h3 className="text-2xl font-bold text-white leading-relaxed break-keep drop-shadow-lg mb-8">
                  {selectedQuestion?.question}
               </h3>

               {/* From */}
               <div className="mt-auto ml-auto text-sm text-white/80 font-medium">
                  From. {user?.nickname}
               </div>
            </div>
          </div>
    
          {/* Bottom Fixed Button */}
          <div className="w-full mt-auto pt-10 pb-4">
             <button 
               onClick={handleFriendShare}
               className="w-full bg-white text-gray-900 font-bold text-xl py-4 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:bg-gray-100 transition-all active:scale-95 flex items-center justify-center gap-2"
             >
               {window.Kakao && window.Kakao.isInitialized() ? (
                  <MessageCircle size={22} fill="currentColor" className="text-yellow-500" />
               ) : (
                  <Share2 size={22} />
               )}
               <span>친구에게 질문 보내기</span>
             </button>
             
             <button 
                onClick={() => {
                   resetState();
                   setView('PROFILE');
                }}
                className="w-full mt-4 text-gray-500 text-sm hover:text-gray-300 transition-colors"
             >
                내 프로필로 가기
             </button>
          </div>
    
        </div>
      );
  };

  const renderProfile = () => (
    <div className="flex-1 flex flex-col w-full h-full relative z-10 p-6 animate-fade-in max-w-md mx-auto">
        {/* Header Title for Profile */}
        <div className="mb-6 flex justify-between items-center">
             <h2 className="text-2xl font-bold">마이 (MY)</h2>
             <div className="flex gap-4">
                 <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="text-gray-400 hover:text-white relative p-2"
                 >
                    <Bell size={24} />
                    {notifications.some(n => !n.isRead) && (
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#0B0F19]"></span>
                    )}
                 </button>
                 <button onClick={() => setShowSettings(!showSettings)} className="text-gray-400 hover:text-white p-2">
                    <Settings size={24} />
                 </button>
             </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-8 flex flex-col items-center relative">
            <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-indigo-400 overflow-hidden mb-3 shadow-[0_0_20px_rgba(129,140,248,0.3)]">
                    <img src={user?.profileImage} alt="Profile" className="w-full h-full object-cover" />
                </div>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-bold">{user?.nickname}</h3>
                <button 
                    onClick={handleStartEditProfile} 
                    className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                    <Edit3 size={14} />
                </button>
            </div>

            <button 
                onClick={handleShareProfile}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors border border-white/5"
            >
                {copyStatus === 'PROFILE' ? <Check size={14} /> : <Share2 size={14} />}
                <span>프로필 공유</span>
            </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 mb-4">
            <button 
                onClick={() => setActiveProfileTab('HISTORY')}
                className={`flex-1 py-3 text-sm font-bold transition-colors relative ${activeProfileTab === 'HISTORY' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
                나의 기록 ({answerHistory.length})
                {activeProfileTab === 'HISTORY' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full"></div>
                )}
            </button>
            <button 
                onClick={() => setActiveProfileTab('FRIENDS')}
                className={`flex-1 py-3 text-sm font-bold transition-colors relative ${activeProfileTab === 'FRIENDS' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
                친구 목록 ({friends.length})
                {activeProfileTab === 'FRIENDS' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 rounded-t-full"></div>
                )}
            </button>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pb-20 pr-1 -mr-1 custom-scrollbar">
            
            {/* HISTORY TAB */}
            {activeProfileTab === 'HISTORY' && (
                <div className="space-y-3">
                    {answerHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-500 gap-4 opacity-50">
                            <SpaceAstronaut className="w-24 h-24 grayscale" />
                            <p className="text-sm">아직 작성된 기록이 없어요.</p>
                        </div>
                    ) : (
                        answerHistory.map((item) => {
                            const itemTheme = item.theme ? THEMES[item.theme] : THEMES['gray'];
                            return (
                                <div 
                                    key={item.id}
                                    onClick={() => {
                                        setSelectedHistoryItem(item);
                                        setView('PROFILE_DETAIL');
                                    }}
                                    className="bg-[#1A1F2C] hover:bg-[#232936] rounded-xl p-4 border border-white/5 cursor-pointer transition-all active:scale-98 flex gap-4 group"
                                >
                                    {/* Icon Placeholder */}
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-2xl transition-colors bg-white/5 ${itemTheme.ring} ring-1 ring-opacity-20`}>
                                        {item.question.category === QuestionCategory.ROMANCE ? '💖' : 
                                        item.question.category === QuestionCategory.IF ? '🌙' : '✨'}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs text-gray-400 font-medium">#{item.question.category}</span>
                                            <span className="text-xs text-gray-600">{item.date}</span>
                                        </div>
                                        <h4 className="font-bold text-white truncate mb-1">{item.question.question}</h4>
                                        <p className="text-sm text-gray-400 truncate">{item.answer}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* FRIENDS TAB */}
            {activeProfileTab === 'FRIENDS' && (
                <div className="space-y-3">
                    {friends.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-500 gap-4 opacity-50">
                            <Users className="w-16 h-16 mb-2" />
                            <p className="text-sm">아직 연결된 친구가 없어요.</p>
                            <p className="text-xs mt-1">질문을 공유하고 답변을 받아보세요!</p>
                        </div>
                    ) : (
                        friends.map((friend) => (
                             <div key={friend.id} className="bg-[#1A1F2C] rounded-xl p-4 border border-white/5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                                    <img src={friend.profileImage} alt={friend.nickname} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white flex items-center gap-2">
                                        {friend.nickname}
                                        {friend.status === 'NEW' && <span className="text-[10px] bg-pink-500 text-white px-1.5 rounded-sm">N</span>}
                                    </h4>
                                    <p className="text-xs text-gray-500">최근 교류: {friend.lastInteraction}</p>
                                </div>
                                <button className="p-2 text-gray-500 hover:text-white">
                                    <MessageCircle size={20} />
                                </button>
                             </div>
                        ))
                    )}
                </div>
            )}
        </div>

        {/* Notifications Overlay */}
        {showNotifications && (
            <div className="absolute top-16 right-4 w-72 bg-[#1A1F2C] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in-up">
                <div className="p-3 border-b border-white/5 bg-black/20">
                    <span className="text-sm font-bold">알림</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-gray-500">알림이 없습니다.</div>
                    ) : (
                        notifications.map(note => (
                            <div key={note.id} className={`p-3 border-b border-white/5 hover:bg-white/5 ${!note.isRead ? 'bg-indigo-900/10' : ''}`}>
                                <div className="flex items-start gap-2">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" style={{opacity: note.isRead ? 0 : 1}}></div>
                                    <div>
                                        <p className="text-xs text-white leading-snug">{note.message}</p>
                                        <span className="text-[10px] text-gray-500 mt-1 block">{note.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}

        {/* Settings Bottom Sheet (Simulated) */}
        {showSettings && (
            <>
                <div 
                    className="absolute inset-0 bg-black/60 z-40"
                    onClick={() => setShowSettings(false)}
                ></div>
                <div className="absolute bottom-0 left-0 right-0 bg-[#1A1F2C] rounded-t-3xl z-50 p-6 animate-fade-in-up border-t border-white/10">
                    <h3 className="font-bold text-lg mb-4">설정</h3>
                    <div className="space-y-1">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl text-gray-300 hover:text-white transition-colors"
                        >
                            <LogOut size={20} />
                            <span>로그아웃</span>
                        </button>
                        <button 
                            onClick={handleWithdraw}
                            className="w-full flex items-center gap-3 p-3 hover:bg-red-500/10 rounded-xl text-red-400 hover:text-red-300 transition-colors"
                        >
                            <UserMinus size={20} />
                            <span>회원 탈퇴</span>
                        </button>
                    </div>
                </div>
            </>
        )}
    </div>
  );

  const renderProfileEdit = () => (
      <div className="flex-1 flex flex-col w-full h-full relative z-10 p-6 animate-fade-in max-w-md mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
              <button 
                  onClick={() => setView('PROFILE')}
                  className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
              >
                  <ChevronLeft size={28} />
              </button>
              <span className="font-bold text-lg">프로필 수정</span>
              <button 
                  onClick={handleSaveProfile}
                  className="text-indigo-400 font-bold hover:text-indigo-300 text-sm"
              >
                  완료
              </button>
          </div>

          <div className="flex flex-col items-center space-y-8">
              {/* Avatar Edit */}
              <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-[#1A1F2C] shadow-xl overflow-hidden bg-gray-800">
                      <img src={editImage} alt="Profile Preview" className="w-full h-full object-cover" />
                  </div>
                  <button 
                      onClick={handleGenerateRandomProfileImage}
                      className="absolute bottom-1 right-1 bg-white text-gray-900 p-2.5 rounded-full shadow-lg hover:bg-gray-200 transition-colors active:scale-90"
                  >
                      <RefreshCcw size={18} />
                  </button>
              </div>

              {/* Form Fields */}
              <div className="w-full space-y-6">
                  <div className="space-y-2">
                      <label className="text-sm text-gray-400 ml-1">닉네임</label>
                      <div className="relative">
                        <input 
                            type="text"
                            value={editNickname}
                            onChange={(e) => {
                                setEditNickname(e.target.value);
                                setEditError(''); // Clear error on type
                            }}
                            className={`w-full bg-[#1A1F2C] border ${editError ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors`}
                            placeholder="닉네임을 입력해주세요"
                        />
                      </div>
                      <div className="flex justify-between px-1">
                          <span className={`text-xs ${editError ? 'text-red-400' : 'text-gray-500'}`}>
                              {editError || '한글, 영문, 숫자 사용 가능'}
                          </span>
                          <span className="text-xs text-gray-600">{editNickname.length}/10</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderProfileDetail = () => {
      if (!selectedHistoryItem) return null;
      const theme = selectedHistoryItem.theme ? THEMES[selectedHistoryItem.theme] : THEMES['gray'];

      return (
        <div className="flex-1 flex flex-col w-full h-full relative z-10 p-6 animate-fade-in max-w-md mx-auto">
             {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <button 
                    onClick={() => setView('PROFILE')}
                    className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ChevronLeft size={28} />
                </button>
                <span className="font-bold">기록 상세</span>
                <div className="w-10"></div> {/* Spacer for balance */}
            </div>

            {/* Card Content (Similar to Result) */}
            <div className="flex-1 flex flex-col justify-center">
                <div className="bg-gradient-to-b from-[#1A1F2C] to-[#0F1219] rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
                    {/* Background Effects */}
                    <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.gradient}`}></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="mb-2 text-xs text-gray-400 border border-white/10 px-3 py-1 rounded-full">
                            {selectedHistoryItem.date}
                        </div>
                        
                        <h3 className="text-white font-bold text-xl mb-8 leading-relaxed">
                        "{selectedHistoryItem.question.question}"
                        </h3>

                        <div className="w-full bg-white/5 rounded-xl p-6 mb-6 backdrop-blur-sm border border-white/5 relative">
                        <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1A1F2C] rotate-45 border-l border-t border-white/5"></div>
                        <p className="text-gray-200 font-medium leading-relaxed whitespace-pre-wrap">
                            {selectedHistoryItem.answer}
                        </p>
                        </div>

                        {selectedHistoryItem.aiReaction && (
                            <div className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-900/30 px-3 py-1.5 rounded-full border border-indigo-500/30">
                                <span>{selectedHistoryItem.aiReaction.emoji} AI: {selectedHistoryItem.aiReaction.comment}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 3 Action Buttons */}
            <div className="mt-8 grid grid-cols-3 gap-3">
                <button 
                    onClick={handleShareQuestionOnly}
                    className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors gap-1"
                >
                     <Share2 size={20} className="text-indigo-400" />
                     <span className="text-xs text-gray-300">질문 공유</span>
                </button>
                <button 
                    onClick={handleEditAnswer}
                    className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors gap-1"
                >
                     <Edit3 size={20} className="text-emerald-400" />
                     <span className="text-xs text-gray-300">수정하기</span>
                </button>
                <button 
                    onClick={() => handleDeleteAnswer(selectedHistoryItem.id)}
                    className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors gap-1"
                >
                     <Trash2 size={20} className="text-red-400" />
                     <span className="text-xs text-gray-300">삭제하기</span>
                </button>
            </div>
            
            {/* Share Answer (Main) */}
            <div className="mt-3">
                 <button 
                    onClick={handleShareQA}
                    className="w-full bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                     {copyStatus === 'QA' ? <Check size={20} /> : <Share2 size={20} />}
                    <span>카드로 전체 공유하기</span>
                </button>
            </div>
        </div>
      );
  };

  if (showIntro) {
    return <IntroSequence onFinish={() => {
      setShowIntro(false);
      // Removed automatic login modal trigger since user might just browse questions first.
      // But if user clicks Answer, login modal will show.
    }} />;
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col max-w-lg mx-auto shadow-2xl overflow-hidden relative font-['Pretendard']">
      <SpaceBackground />
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />

      {/* Header */}
      <header className="px-6 py-5 relative z-20 flex justify-between items-center">
        <button onClick={handleHomeClick} className="flex items-center gap-3 group">
          <MindProfileLogo />
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-200 via-white to-pink-200 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
            마음프로필
          </span>
        </button>

        {user ? (
          <button 
             onClick={handleProfileClick}
             className="flex items-center gap-2 bg-white/10 pl-1 pr-3 py-1 rounded-full border border-white/10 hover:bg-white/20 transition-all"
          >
             <img src={user.profileImage} alt="" className="w-6 h-6 rounded-full" />
             <span className="text-xs font-bold max-w-[80px] truncate">{user.nickname}</span>
          </button>
        ) : (
          <button 
            onClick={() => setShowLoginModal(true)}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <User size={18} />
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {view === 'HOME' && renderHome()}
        {view === 'ANSWER' && renderAnswer()}
        {view === 'RESULT' && renderResult()}
        {view === 'PROFILE' && renderProfile()}
        {view === 'PROFILE_EDIT' && renderProfileEdit()}
        {view === 'PROFILE_DETAIL' && renderProfileDetail()}
      </main>

      {/* Global Styles */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-twinkle { animation: twinkle 3s infinite ease-in-out; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 7s ease-in-out infinite 2s; }
        .animate-float-slow { animation: float 8s ease-in-out infinite; }

        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05); 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2); 
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.4); 
        }
      `}</style>
    </div>
  );
};

export default App;