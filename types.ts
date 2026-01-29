export enum QuestionCategory {
  RELATIONSHIP = '인간관계',
  ROMANCE = '연애/사랑',
  IF = '만약에',
  DAILY = '일상/생각',
  GROWTH = '성장/가치관'
}

export interface DailyQuestion {
  id: string;
  category: string;
  question: string;
  context?: string; 
  theme?: string; // 'purple', 'blue', 'pink', 'orange', 'green', 'gray'
}

export interface AIReaction {
  comment: string;
  followUpQuestion: string;
  emoji: string;
}

export interface UserProfile {
  id: string;
  nickname: string;
  profileImage?: string;
  email: string;
}

export interface AnswerRecord {
  id: string;
  question: DailyQuestion;
  answer: string;
  date: string; // ISO String or display date
  aiReaction?: AIReaction;
  theme?: string;
}

export interface Friend {
  id: string;
  nickname: string;
  profileImage: string;
  lastInteraction: string; // date string
  status: 'ACTIVE' | 'NEW';
}

export interface Notification {
  id: string;
  type: 'ANSWER' | 'NEW_FRIEND' | 'REMINDER';
  message: string;
  time: string;
  isRead: boolean;
  relatedId?: string; // ID to link to (e.g., friend ID or answer ID)
}

export type ViewState = 'HOME' | 'ANSWER' | 'RESULT' | 'PROFILE' | 'PROFILE_DETAIL' | 'PROFILE_EDIT';