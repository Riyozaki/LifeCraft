export enum StatType {
  STRENGTH = 'Сила',
  INTELLECT = 'Интеллект',
  CHARISMA = 'Харизма',
  ENDURANCE = 'Выносливость',
  CREATIVITY = 'Творчество',
  ORGANIZATION = 'Дисциплина'
}

export enum Rarity {
  COMMON = 'Обычный', // Дерево
  RARE = 'Редкий',    // Камень
  EPIC = 'Эпический', // Сталь
  LEGENDARY = 'Легендарный' // Золото
}

export enum QuestType {
  ONE_TIME = 'Поручение',
  DAILY = 'Ежедневное',
  WEEKLY = 'Недельное',
  EVENT = 'Событие',
  AI_GENERATED = 'Пророчество'
}

export interface Skill {
  name: string;
  level: number;
  parentStat: StatType;
}

export interface Habit {
  id: string;
  title: string;
  streak: number;
  completedToday: boolean;
  statReward: StatType;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  rarity: Rarity;
  xpReward: number;
  statRewards: Partial<Record<StatType, number>>;
  isCompleted: boolean;
  verificationRequired?: 'text' | 'photo' | 'check';
  classSpecific?: 'Athlete' | 'Scholar' | 'Socialite' | 'Creator'; // Optional filter
}

export interface User {
  id: string;
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  stats: Record<StatType, number>;
  skills: Skill[];
  coins: number;
  avatar: string; // URL or identifier
  title: string;
  path: 'Athlete' | 'Scholar' | 'Socialite' | 'Creator'; // Class
  
  // New Dynamic Stats
  energy: number; // Max 100, spent on tasks
  maxEnergy: number;
  mood: number; // 0-100, affects XP gain
  habits: Habit[];
  activeQuests: Quest[]; // Quests accepted by user
}

export interface SocialEvent {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  likes: number;
  avatar?: string;
  rarity?: Rarity;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  level: number;
  avatar: string;
  class: string;
}