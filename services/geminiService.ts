import { GoogleGenAI, Type } from "@google/genai";
import { QuestionCategory, DailyQuestion, AIReaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-flash-preview'; 

// Fallback data for when API quota is exceeded
const FALLBACK_QUESTIONS: Record<string, { question: string, context: string }[]> = {
  [QuestionCategory.RELATIONSHIP]: [
    { question: "가장 오래된 친구와의 첫 만남 기억나?", context: "소중한 인연" },
    { question: "나에게 가장 큰 영향을 준 사람은?", context: "멘토와 롤모델" },
    { question: "서운했지만 말 못 했던 순간이 있어?", context: "솔직한 마음" },
    { question: "가장 듣고 싶은 위로의 말은?", context: "마음의 온도" }
  ],
  [QuestionCategory.ROMANCE]: [
    { question: "사랑에 빠졌다고 느낀 결정적 순간?", context: "설렘의 시작" },
    { question: "나의 연애 스타일을 한 단어로?", context: "연애관" },
    { question: "이상형과 정반대인 사람에게 끌린 적?", context: "뜻밖의 끌림" },
    { question: "이별 후 가장 힘들었던 순간은?", context: "아픈 기억" }
  ],
  [QuestionCategory.IF]: [
    { question: "내일 지구가 멸망한다면 뭐 먹을래?", context: "최후의 만찬" },
    { question: "투명인간이 된다면 가장 먼저 할 일?", context: "상상력 풀가동" },
    { question: "과거로 돌아갈 수 있다면 언제로?", context: "시간 여행" },
    { question: "로또 1등에 당첨된다면?", context: "행복한 상상" }
  ],
  [QuestionCategory.DAILY]: [
    { question: "오늘 하루 중 가장 행복했던 순간은?", context: "소확행" },
    { question: "요즘 나를 가장 웃게 하는 것은?", context: "나의 비타민" },
    { question: "지금 당장 떠나고 싶은 여행지는?", context: "일상 탈출" },
    { question: "자기 전에 무슨 생각 해?", context: "밤의 생각" }
  ],
  [QuestionCategory.GROWTH]: [
    { question: "올해 꼭 이루고 싶은 목표 하나?", context: "버킷리스트" },
    { question: "나를 가장 성장시킨 실패 경험은?", context: "성장의 발판" },
    { question: "10년 뒤 나는 어떤 모습일까?", context: "미래의 나" },
    { question: "나만의 스트레스 해소법은?", context: "마음 관리" }
  ]
};

const getRandomFallback = (category: QuestionCategory) => {
  const list = FALLBACK_QUESTIONS[category] || FALLBACK_QUESTIONS[QuestionCategory.DAILY];
  return list[Math.floor(Math.random() * list.length)];
};

export const generateQuestion = async (category: QuestionCategory): Promise<DailyQuestion> => {
  const prompt = `
    Create a short, engaging conversation starter question for friends in Korean.
    Category: ${category}
    
    Constraint: The question must be short (under 40 characters) to fit on a mobile card.
    The tone should be sentimental yet trendy, suitable for Gen Z.
    Return JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            question: { type: Type.STRING, description: "The actual question text in Korean (max 40 chars)" },
            context: { type: Type.STRING, description: "A very short subtitle or context (max 15 chars)." }
          },
          required: ["category", "question"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const parsed = JSON.parse(text);
    return {
      id: Date.now().toString(),
      category: parsed.category,
      question: parsed.question,
      context: parsed.context || "오늘의 질문"
    };
  } catch (error) {
    // Gracefully handle quota limits or errors
    console.warn("API Error (likely quota exceeded), using fallback question.");
    const fallback = getRandomFallback(category);
    return {
      id: Date.now().toString(),
      category: category,
      question: fallback.question,
      context: fallback.context
    };
  }
};

export const generateAIReaction = async (question: string, answer: string): Promise<AIReaction> => {
  const prompt = `
    You are a witty, empathetic friend. 
    Analyze this Q&A between friends.
    
    Q: "${question}"
    A: "${answer}"

    Give a very short 1-sentence reaction (Korean) and a matching emoji.
    Also suggest a follow-up question.
    Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            comment: { type: Type.STRING, description: "Short reaction in Korean" },
            followUpQuestion: { type: Type.STRING },
            emoji: { type: Type.STRING }
          },
          required: ["comment", "followUpQuestion", "emoji"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as AIReaction;

  } catch (error) {
    console.warn("API Error (likely quota exceeded), using fallback reaction.");
    // Fallback reaction
    return {
      comment: "친구의 생각이 정말 궁금해지네요!",
      followUpQuestion: "너도 그렇게 생각해?",
      emoji: "✨"
    };
  }
};
