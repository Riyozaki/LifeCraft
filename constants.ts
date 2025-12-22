import { Quest, QuestType, Rarity, StatType, SocialEvent, LeaderboardEntry } from "./types";

// --- Assets ---
export const CLASS_AVATARS = {
  'Athlete': 'https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&q=80&w=200&h=200', // Warrior-like
  'Scholar': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=200&h=200', // Book/Library
  'Socialite': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200', // Charismatic person
  'Creator': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=200&h=200', // Artist
};

export const PATH_DESCRIPTIONS = {
  'Athlete': { title: 'Воин', desc: 'Путь силы и тела. Ты закаляешь себя в битвах с ленью.', icon: '⚔️' },
  'Scholar': { title: 'Маг', desc: 'Путь разума. Твое оружие — знания и логика.', icon: '📜' },
  'Socialite': { title: 'Бард', desc: 'Путь харизмы. Ты вдохновляешь других и ведешь за собой.', icon: 'lute' }, // Using lucide icon mapping in logic
  'Creator': { title: 'Ремесленник', desc: 'Путь созидания. Ты творишь новые миры из пустоты.', icon: '🔨' },
};

// --- Quests Pool ---
export const QUEST_POOL: Quest[] = [
  // --- Athlete (Warrior) Quests ---
  {
    id: "w1",
    title: "Марш-бросок",
    description: "Пройти или пробежать 5 километров.",
    type: QuestType.ONE_TIME,
    rarity: Rarity.RARE,
    xpReward: 200,
    statRewards: { [StatType.ENDURANCE]: 3, [StatType.STRENGTH]: 1 },
    isCompleted: false,
    classSpecific: 'Athlete',
    verificationRequired: 'check'
  },
  {
    id: "w2",
    title: "Стальной Пресс",
    description: "Сделать 3 подхода по 15 скручиваний.",
    type: QuestType.DAILY,
    rarity: Rarity.COMMON,
    xpReward: 50,
    statRewards: { [StatType.STRENGTH]: 1 },
    isCompleted: false,
    classSpecific: 'Athlete',
    verificationRequired: 'check'
  },
  {
    id: "w3",
    title: "Испытание Титана",
    description: "Посетить тренировку в зале или заняться спортом 1 час.",
    type: QuestType.WEEKLY,
    rarity: Rarity.EPIC,
    xpReward: 500,
    statRewards: { [StatType.STRENGTH]: 5, [StatType.ENDURANCE]: 3 },
    isCompleted: false,
    classSpecific: 'Athlete',
    verificationRequired: 'photo'
  },

  // --- Scholar (Mage) Quests ---
  {
    id: "m1",
    title: "Древние Свитки",
    description: "Прочитать главу сложной технической или научной книги.",
    type: QuestType.ONE_TIME,
    rarity: Rarity.RARE,
    xpReward: 150,
    statRewards: { [StatType.INTELLECT]: 3 },
    isCompleted: false,
    classSpecific: 'Scholar',
    verificationRequired: 'text'
  },
  {
    id: "m2",
    title: "Медитация Ясности",
    description: "10 минут полной тишины и концентрации.",
    type: QuestType.DAILY,
    rarity: Rarity.COMMON,
    xpReward: 40,
    statRewards: { [StatType.ORGANIZATION]: 1, [StatType.INTELLECT]: 1 },
    isCompleted: false,
    classSpecific: 'Scholar',
    verificationRequired: 'check'
  },
  {
    id: "m3",
    title: "Изучение Рун",
    description: "Позаниматься иностранным языком 30 минут.",
    type: QuestType.WEEKLY,
    rarity: Rarity.EPIC,
    xpReward: 400,
    statRewards: { [StatType.INTELLECT]: 4, [StatType.CHARISMA]: 1 },
    isCompleted: false,
    classSpecific: 'Scholar',
    verificationRequired: 'text'
  },

  // --- Socialite (Bard) Quests ---
  {
    id: "b1",
    title: "Зов Союзников",
    description: "Позвонить родственнику или старому другу.",
    type: QuestType.ONE_TIME,
    rarity: Rarity.COMMON,
    xpReward: 80,
    statRewards: { [StatType.CHARISMA]: 2 },
    isCompleted: false,
    classSpecific: 'Socialite',
    verificationRequired: 'check'
  },
  {
    id: "b2",
    title: "Ораторское Искусство",
    description: "Выступить на собрании или объяснить кому-то сложную тему.",
    type: QuestType.WEEKLY,
    rarity: Rarity.EPIC,
    xpReward: 450,
    statRewards: { [StatType.CHARISMA]: 5 },
    isCompleted: false,
    classSpecific: 'Socialite',
    verificationRequired: 'text'
  },

  // --- Creator (Crafter) Quests ---
  {
    id: "c1",
    title: "Создание Артефакта",
    description: "Потратить 30 минут на хобби (рисование, код, крафт).",
    type: QuestType.DAILY,
    rarity: Rarity.RARE,
    xpReward: 150,
    statRewards: { [StatType.CREATIVITY]: 3 },
    isCompleted: false,
    classSpecific: 'Creator',
    verificationRequired: 'photo'
  },
  
  // --- General Quests ---
  {
    id: "g1",
    title: "Уборка Подземелья",
    description: "Убрать на рабочем столе или в комнате (15 мин).",
    type: QuestType.ONE_TIME,
    rarity: Rarity.COMMON,
    xpReward: 60,
    statRewards: { [StatType.ORGANIZATION]: 2 },
    isCompleted: false,
    verificationRequired: 'photo'
  },
  {
    id: "g2",
    title: "Эликсир Жизни",
    description: "Выпить 2 литра воды за день.",
    type: QuestType.DAILY,
    rarity: Rarity.COMMON,
    xpReward: 50,
    statRewards: { [StatType.ENDURANCE]: 1 },
    isCompleted: false,
    verificationRequired: 'check'
  },
  {
    id: "g3",
    title: "Ранняя Пташка",
    description: "Встать до 8:00 утра.",
    type: QuestType.DAILY,
    rarity: Rarity.RARE,
    xpReward: 100,
    statRewards: { [StatType.ORGANIZATION]: 3 },
    isCompleted: false,
    verificationRequired: 'check'
  },
  {
    id: "g4",
    title: "Легендарное Планирование",
    description: "Составить план задач на следующую неделю.",
    type: QuestType.WEEKLY,
    rarity: Rarity.EPIC,
    xpReward: 300,
    statRewards: { [StatType.ORGANIZATION]: 5 },
    isCompleted: false,
    verificationRequired: 'text'
  },
    {
    id: "g5",
    title: "Отказ от Яда",
    description: "День без сахара или вредной еды.",
    type: QuestType.ONE_TIME,
    rarity: Rarity.RARE,
    xpReward: 150,
    statRewards: { [StatType.ENDURANCE]: 2, [StatType.STRENGTH]: 1 },
    isCompleted: false,
    verificationRequired: 'check'
  }
];

export const MOCK_FEED: SocialEvent[] = [
  { id: 'e1', user: "Паладин_Олег", action: "выполнил 'Марш-бросок'", timestamp: "2м назад", likes: 12, avatar: CLASS_AVATARS['Athlete'], rarity: Rarity.RARE },
  { id: 'e2', user: "Маг_Лена", action: "получила уровень 11!", timestamp: "15м назад", likes: 45, avatar: CLASS_AVATARS['Scholar'], rarity: Rarity.EPIC },
  { id: 'e3', user: "Бард_Иван", action: "завершил 'Неделю без сахара'", timestamp: "1ч назад", likes: 89, avatar: CLASS_AVATARS['Socialite'], rarity: Rarity.LEGENDARY },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Тень_Ниндзя", level: 42, avatar: CLASS_AVATARS['Creator'], class: "Ремесленник" },
  { rank: 2, name: "Маг_Лена", level: 38, avatar: CLASS_AVATARS['Scholar'], class: "Маг" },
  { rank: 3, name: "Паладин_Олег", level: 35, avatar: CLASS_AVATARS['Athlete'], class: "Воин" },
];

// Material Styles for Cards
export const MATERIAL_STYLES = {
  [Rarity.COMMON]: {
    bg: "bg-[#5d4037]", // Wood
    border: "border-[#3e2723]",
    text: "text-[#efebe9]",
    accent: "text-[#a1887f]",
    texture: "bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]",
    iconColor: "text-[#d7ccc8]"
  },
  [Rarity.RARE]: {
    bg: "bg-[#455a64]", // Stone
    border: "border-[#263238]",
    text: "text-[#eceff1]",
    accent: "text-[#90a4ae]",
    texture: "bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]",
    iconColor: "text-[#cfd8dc]"
  },
  [Rarity.EPIC]: {
    bg: "bg-[#37474f]", // Steel
    border: "border-[#b0bec5]",
    text: "text-white",
    accent: "text-[#81d4fa]",
    texture: "bg-gradient-to-br from-slate-700 to-slate-600",
    iconColor: "text-[#4fc3f7]",
    glow: "shadow-[0_0_15px_rgba(79,195,247,0.3)]"
  },
  [Rarity.LEGENDARY]: {
    bg: "bg-gradient-to-br from-[#ff6f00] to-[#ffca28]", // Gold
    border: "border-[#ff6f00]",
    text: "text-[#3e2723]",
    accent: "text-[#bf360c]",
    texture: "",
    iconColor: "text-[#3e2723]",
    glow: "shadow-[0_0_20px_rgba(255,193,7,0.6)] animate-pulse"
  },
};