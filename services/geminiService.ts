import { Quest, QuestType, QuestCategory, Rarity, StatType } from "../types";

// AI Services have been removed in favor of deterministic game engine logic.
export const generateAIQuest = async (level: number, context: string): Promise<Quest> => { 
  return {
    id: 'ai_' + Date.now(),
    title: "Видение Оракула",
    description: "Судьба туманна, но путь ясен. (AI заглушка)",
    type: QuestType.AI_GENERATED,
    category: QuestCategory.MIND,
    rarity: Rarity.EPIC,
    xpReward: 100,
    statRewards: { [StatType.INTELLECT]: 1 },
    coinsReward: 50,
    isCompleted: false,
    verificationRequired: 'check'
  }; 
};

export const verifyQuestSubmission = async (title: string, proof: string) => { 
  return { valid: true, feedback: "AI Отключен. Задание принято." }; 
};