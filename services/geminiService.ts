import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Quest, QuestType, Rarity, StatType } from "../types";

const generateId = () => Math.random().toString(36).substr(2, 9);

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema definitions need to align with the localized Enums
const questSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Название квеста на русском языке" },
    description: { type: Type.STRING, description: "Краткое описание задачи на русском" },
    rarity: { type: Type.STRING, enum: [Rarity.COMMON, Rarity.RARE, Rarity.EPIC, Rarity.LEGENDARY] },
    xpReward: { type: Type.INTEGER, description: "XP от 50 до 500" },
    statFocus: { 
      type: Type.STRING, 
      enum: Object.values(StatType),
      description: "Основной навык"
    },
    statValue: { type: Type.INTEGER, description: "Очки навыка от 1 до 5" }
  },
  required: ["title", "description", "rarity", "xpReward", "statFocus", "statValue"],
};

export const generateAIQuest = async (userLevel: number, userFocus: string): Promise<Quest> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Создай один RPG-квест для реальной жизни для человека ${userLevel} уровня. 
      Текущий фокус развития: ${userFocus}. 
      Задача должна быть выполнима за 1-2 часа. 
      Название должно звучать эпично. Язык: Русский.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: questSchema,
        systemInstruction: "Ты Гейм-Мастер (GM) для LifeCraft. Ты создаешь мотивирующие, полезные и интересные задачи для саморазвития."
      },
    });

    const data = JSON.parse(response.text || "{}");
    
    return {
      id: generateId(),
      title: data.title,
      description: data.description,
      type: QuestType.AI_GENERATED,
      rarity: data.rarity as Rarity,
      xpReward: data.xpReward,
      statRewards: {
        [data.statFocus]: data.statValue
      },
      isCompleted: false,
      verificationRequired: 'text'
    };
  } catch (error) {
    console.error("Failed to generate quest", error);
    return {
      id: generateId(),
      title: "Ментальная Перезагрузка",
      description: "Медитируйте 15 минут, чтобы очистить разум (Резервный квест).",
      type: QuestType.AI_GENERATED,
      rarity: Rarity.COMMON,
      xpReward: 50,
      statRewards: { [StatType.INTELLECT]: 1 },
      isCompleted: false,
      verificationRequired: 'check'
    };
  }
};

export const verifyQuestSubmission = async (questTitle: string, userNote: string): Promise<{ valid: boolean; feedback: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Квест: "${questTitle}". Отчет пользователя: "${userNote}". 
      Является ли это валидным выполнением задания? Если да, дай короткий поздравляющий ответ в стиле RPG на русском. Если нет, объясни почему кратко.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            valid: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING }
          },
          required: ["valid", "feedback"]
        }
      }
    });
    
    const data = JSON.parse(response.text || "{}");
    return data;
  } catch (e) {
    return { valid: true, feedback: "Магические энергии подтверждают твой подвиг." };
  }
};