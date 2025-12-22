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

export enum QuestCategory {
  FITNESS = 'Здоровье',
  MIND = 'Разум',
  SOCIAL = 'Общество',
  CREATION = 'Творчество',
  ROUTINE = 'Быт'
}

export enum ItemType {
  WEAPON = 'Оружие',
  ARMOR = 'Броня',
  POTION = 'Зелье',
  FOOD = 'Еда'
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: Rarity;
  icon: string;
  price: number;
  description: string;
  statBonus?: Partial<Record<StatType, number>>; // For gear
  effect?: { type: 'HEAL' | 'RESTORE_ENERGY', value: number }; // For potions
  classReq?: 'Athlete' | 'Scholar' | 'Socialite' | 'Creator';
  dropChance?: number; // 0-1 for loot tables
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  category: QuestCategory;
  rarity: Rarity;
  xpReward: number;
  statRewards: Partial<Record<StatType, number>>;
  itemRewardId?: string; // ID of item to give
  isCompleted: boolean;
  verificationRequired?: 'text' | 'photo' | 'check';
  classSpecific?: 'Athlete' | 'Scholar' | 'Socialite' | 'Creator';
  deadline?: string; 
}

export interface Habit {
  id: string;
  title: string;
  streak: number;
  completedToday: boolean;
  statReward: StatType;
}

export interface User {
  id: string;
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  stats: Record<StatType, number>; // Base stats
  coins: number;
  avatar: string; 
  title: string;
  path: 'Athlete' | 'Scholar' | 'Socialite' | 'Creator';
  
  energy: number; 
  maxEnergy: number;
  hp: number; // Current HP for dungeons
  maxHp: number; 
  mood: number; 
  
  habits: Habit[];
  activeQuests: Quest[];
  
  inventory: Item[];
  equipment: {
    weapon: Item | null;
    armor: Item | null;
  };
  tutorialCompleted: boolean;
  
  // Dungeon Save State
  dungeonState?: {
    floor: number;
    hp: number;
  };
  
  shopState?: {
    lastRefresh: number;
    items: string[]; // IDs
  }
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

export interface Monster {
  name: string;
  icon: string;
  baseHp: number;
  baseDmg: number;
  rarity: Rarity;
  isBoss?: boolean;
}