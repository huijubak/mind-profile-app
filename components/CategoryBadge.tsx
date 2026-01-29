import React from 'react';
import { QuestionCategory } from '../types';

interface CategoryBadgeProps {
  category: QuestionCategory | string;
  isActive?: boolean;
  onClick?: () => void;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, isActive, onClick }) => {
  const getStyle = (cat: string) => {
    switch (cat) {
      case QuestionCategory.RELATIONSHIP: return isActive ? "bg-purple-500 text-white ring-2 ring-purple-300" : "bg-purple-100 text-purple-700 hover:bg-purple-200";
      case QuestionCategory.DAILY: return isActive ? "bg-yellow-500 text-white ring-2 ring-yellow-300" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
      case QuestionCategory.IF: return isActive ? "bg-blue-500 text-white ring-2 ring-blue-300" : "bg-blue-100 text-blue-700 hover:bg-blue-200";
      case QuestionCategory.GROWTH: return isActive ? "bg-green-500 text-white ring-2 ring-green-300" : "bg-green-100 text-green-700 hover:bg-green-200";
      case QuestionCategory.ROMANCE: return isActive ? "bg-pink-500 text-white ring-2 ring-pink-300" : "bg-pink-100 text-pink-700 hover:bg-pink-200";
      default: return isActive ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-700";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${getStyle(category as string)}`}
    >
      {category}
    </button>
  );
};