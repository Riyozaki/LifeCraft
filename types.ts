export enum StatType {
  STRENGTH = 'Сила',
  INTELLECT = 'Интеллект',
  CHARISMA = 'Харизма',
  ENDURANCE = 'Выносливость',
  CREATIVITY = 'Творчество',
  ORGANIZATION = 'Дисциплина'
}

export enum Rarity {
  COMMON = 'Обычный', 
  RARE = 'Редкий',   
  EPIC = 'Эпический',
  LEGENDARY = 'Легендарный'
}

export enum QuestType {
  ONE_TIME = 'Поручение',
  DAILY = 'Ежедневное',
  WEEKLY = 'Недельное',
  MONTHLY = 'Ежемесячное',
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
  HELMET = 'Шлем',
  CHEST = 'Кираса',
  LEGS = 'Штаны',
  BOOTS = 'Сапоги',
  POTION = 'Зелье',
  FOOD = 'Еда',
  MATERIAL = 'Материал',
  ACCESSORY = 'Аксессуар'
}

export enum DamageType {
  PHYSICAL = 'Физический',
  MAGIC = 'Магический',
  FIRE = 'Огонь',
  POISON = 'Яд',
  FROST = 'Холод',
  LIGHTNING = 'Молния'
}

export enum DungeonArea {
  RUINS = 'Древние Руины',
  SUNKEN_CITY = 'Затонувший Город'
}

export type SpecialEffectType = 'LIFESTEAL' | 'REFLECT' | 'DODGE' | 'GOLD_BOOST' | 'XP_BOOST' | 'CRIT_CHANCE' | 'REGEN' | 'EXECUTE' | 'FROST_STRIKE' | 'POISON_BITE' | 'STUN';

export interface SpecialEffect {
  type: SpecialEffectType;
  value: number; // Percentage or absolute value
  description: string;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: Rarity;
  icon: string;
  price: number;
  description: string;
  statBonus?: Partial<Record<StatType, number>>;
  
  // Combat Stats
  scalingStat?: StatType;
  damageType?: DamageType;
  baseDamage?: number;
  
  defense?: number;
  resistances?: Partial<Record<DamageType, number>>;
  
  specialEffects?: SpecialEffect[];
  
  effect?: { type: 'HEAL' | 'RESTORE_ENERGY', value: number };
  classReq?: 'Athlete' | 'Scholar' | 'Socialite' | 'Creator';
  dropChance?: number;
  
  isMaterial?: boolean;
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
  itemRewardId?: string;
  coinsReward?: number;
  isCompleted: boolean;
  verificationRequired?: 'text' | 'photo' | 'check';
  classSpecific?: 'Athlete' | 'Scholar' | 'Socialite' | 'Creator';
  deadline?: string; 
  expiresAt?: number;
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
  stats: Record<StatType, number>;
  coins: number;
  avatar: string; 
  title: string;
  path: 'Athlete' | 'Scholar' | 'Socialite' | 'Creator';
  
  energy: number; 
  maxEnergy: number;
  hp: number; 
  maxHp: number; 
  mood: number; 
  
  habits: Habit[];
  activeQuests: Quest[];
  completedHistory: Record<string, number>;
  
  inventory: Item[];
  equipment: {
    weapon: Item | null;
    helmet: Item | null;
    chest: Item | null;
    legs: Item | null;
    boots: Item | null;
    accessory?: Item | null;
  };
  tutorialCompleted: boolean;
  
  dungeonState?: {
    area: DungeonArea;
    floor: number;
    hp: number;
    activeEnemy?: Monster & { 
      maxHp: number; 
      dmg: number; 
      currentHp: number;
      poisonStacks?: number;
      isFrozen?: boolean;
    };
    logs?: string[];
  };
  
  shopState?: {
    lastRefresh: number;
    items: string[]; 
  }
}

export interface Monster {
  id?: string;
  name: string;
  icon: string;
  baseHp: number;
  baseDmg: number;
  rarity: Rarity;
  isBoss?: boolean;
  damageType: DamageType;
  weakness?: DamageType;
  lootTable?: string[];
  area?: DungeonArea;
}

/** Added missing interfaces for application data structures */
export interface SocialEvent {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  likes: number;
  avatar: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  level: number;
  avatar: string;
  class: string;
}

export interface CraftingRecipe {
  resultId: string;
  materials: { itemId: string; count: number }[];
  cost: number;
}