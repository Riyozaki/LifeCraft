import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Quest, QuestType, Rarity, StatType, QuestCategory } from "../types";

const generateId = () => Math.random().toString(36).substr(2, 9);

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    statValue: { type: Type.INTEGER, description: "Очки навыка от 1 до 5" },
    category: { type: Type.STRING, enum: Object.values(QuestCategory) },
    deadline: { type: Type.STRING, description: "Время на выполнение, например '24ч', '2ч'" }
  },
  required: ["title", "description", "rarity", "xpReward", "statFocus", "statValue", "category", "deadline"],
};

export const generateAIQuest = async (userLevel: number, userPath: string): Promise<Quest> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Создай уникальный RPG-квест для реальной жизни.
      Уровень героя: ${userLevel}.
      Класс/Путь героя: ${userPath} (Учти специфику класса при создании задания!).
      Язык: Русский.
      Задача должна быть мотивирующей.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: questSchema,
        systemInstruction: "Ты Гейм-Мастер (GM) для LifeCraft. Ты создаешь задания, которые помогают игроку развиваться в реальной жизни соответственно его классу."
      },
    });

    const data = JSON.parse(response.text || "{}");
    
    return {
      id: generateId(),
      title: data.title,
      description: data.description,
      type: QuestType.AI_GENERATED,
      category: data.category as QuestCategory || QuestCategory.MIND,
      rarity: data.rarity as Rarity,
      xpReward: data.xpReward,
      statRewards: {
        [data.statFocus]: data.statValue
      },
      isCompleted: false,
      verificationRequired: 'text',
      deadline: data.deadline || '24ч'
    };
  } catch (error) {
    console.error("Failed to generate quest", error);
    return {
      id: generateId(),
      title: "Медитация Пустоты",
      description: "Ваш нейро-мозг перегрелся. Отдохните 10 минут.",
      type: QuestType.AI_GENERATED,
      category: QuestCategory.MIND,
      rarity: Rarity.COMMON,
      xpReward: 50,
      statRewards: { [StatType.INTELLECT]: 1 },
      isCompleted: false,
      verificationRequired: 'check',
      deadline: '1ч'
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