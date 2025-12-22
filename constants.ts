import { Quest, QuestType, Rarity, StatType, SocialEvent, LeaderboardEntry, QuestCategory } from "./types";

// --- Assets (Emojis) ---
export const CLASS_AVATARS = {
  'Athlete': '⚔️', 
  'Scholar': '📜', 
  'Socialite': '👑', 
  'Creator': '⚒️', 
};

export const PATH_DESCRIPTIONS = {
  'Athlete': { title: 'Воин', desc: 'Путь силы и тела. Закаляй дух в битвах с ленью.', icon: '⚔️' },
  'Scholar': { title: 'Маг', desc: 'Путь разума. Твое оружие — знания и логика.', icon: '📜' },
  'Socialite': { title: 'Лорд', desc: 'Путь влияния. Вдохновляй и веди за собой.', icon: '👑' },
  'Creator': { title: 'Кузнец', desc: 'Путь созидания. Твори новые миры из пустоты.', icon: '⚒️' },
};

// --- Quests Pool ---
export const QUEST_POOL: Quest[] = [
  // --- Athlete (Warrior) Quests ---
  {
    id: "w1",
    title: "Марш-бросок",
    description: "Пройти или пробежать 5 километров.",
    type: QuestType.ONE_TIME,
    category: QuestCategory.FITNESS,
    rarity: Rarity.RARE,
    xpReward: 200,
    statRewards: { [StatType.ENDURANCE]: 3, [StatType.STRENGTH]: 1 },
    isCompleted: false,
    classSpecific: 'Athlete',
    verificationRequired: 'check',
    deadline: '24ч'
  },
  {
    id: "w2",
    title: "Стальной Пресс",
    description: "Сделать 3 подхода по 15 скручиваний.",
    type: QuestType.DAILY,
    category: QuestCategory.FITNESS,
    rarity: Rarity.COMMON,
    xpReward: 50,
    statRewards: { [StatType.STRENGTH]: 1 },
    isCompleted: false,
    classSpecific: 'Athlete',
    verificationRequired: 'check',
    deadline: '24ч'
  },
  {
    id: "w3",
    title: "Испытание Титана",
    description: "Посетить тренировку в зале или заняться спортом 1 час.",
    type: QuestType.WEEKLY,
    category: QuestCategory.FITNESS,
    rarity: Rarity.EPIC,
    xpReward: 500,
    statRewards: { [StatType.STRENGTH]: 5, [StatType.ENDURANCE]: 3 },
    isCompleted: false,
    classSpecific: 'Athlete',
    verificationRequired: 'photo',
    deadline: '7д'
  },

  // --- Scholar (Mage) Quests ---
  {
    id: "m1",
    title: "Древние Свитки",
    description: "Прочитать главу сложной технической или научной книги.",
    type: QuestType.ONE_TIME,
    category: QuestCategory.MIND,
    rarity: Rarity.RARE,
    xpReward: 150,
    statRewards: { [StatType.INTELLECT]: 3 },
    isCompleted: false,
    classSpecific: 'Scholar',
    verificationRequired: 'text',
    deadline: '48ч'
  },
  {
    id: "m2",
    title: "Медитация Ясности",
    description: "10 минут полной тишины и концентрации.",
    type: QuestType.DAILY,
    category: QuestCategory.MIND,
    rarity: Rarity.COMMON,
    xpReward: 40,
    statRewards: { [StatType.ORGANIZATION]: 1, [StatType.INTELLECT]: 1 },
    isCompleted: false,
    classSpecific: 'Scholar',
    verificationRequired: 'check',
    deadline: '24ч'
  },
  {
    id: "m3",
    title: "Изучение Рун",
    description: "Позаниматься иностранным языком 30 минут.",
    type: QuestType.WEEKLY,
    category: QuestCategory.MIND,
    rarity: Rarity.EPIC,
    xpReward: 400,
    statRewards: { [StatType.INTELLECT]: 4, [StatType.CHARISMA]: 1 },
    isCompleted: false,
    classSpecific: 'Scholar',
    verificationRequired: 'text',
    deadline: '7д'
  },

  // --- Socialite (Lord) Quests ---
  {
    id: "b1",
    title: "Зов Союзников",
    description: "Позвонить родственнику или старому другу.",
    type: QuestType.ONE_TIME,
    category: QuestCategory.SOCIAL,
    rarity: Rarity.COMMON,
    xpReward: 80,
    statRewards: { [StatType.CHARISMA]: 2 },
    isCompleted: false,
    classSpecific: 'Socialite',
    verificationRequired: 'check',
    deadline: '24ч'
  },
  {
    id: "b2",
    title: "Ораторское Искусство",
    description: "Выступить на собрании или объяснить кому-то сложную тему.",
    type: QuestType.WEEKLY,
    category: QuestCategory.SOCIAL,
    rarity: Rarity.EPIC,
    xpReward: 450,
    statRewards: { [StatType.CHARISMA]: 5 },
    isCompleted: false,
    classSpecific: 'Socialite',
    verificationRequired: 'text',
    deadline: '5д'
  },

  // --- Creator (Crafter) Quests ---
  {
    id: "c1",
    title: "Создание Артефакта",
    description: "Потратить 30 минут на хобби (рисование, код, крафт).",
    type: QuestType.DAILY,
    category: QuestCategory.CREATION,
    rarity: Rarity.RARE,
    xpReward: 150,
    statRewards: { [StatType.CREATIVITY]: 3 },
    isCompleted: false,
    classSpecific: 'Creator',
    verificationRequired: 'photo',
    deadline: '24ч'
  },
  
  // --- General Quests ---
  {
    id: "g1",
    title: "Уборка Подземелья",
    description: "Убрать на рабочем столе или в комнате (15 мин).",
    type: QuestType.ONE_TIME,
    category: QuestCategory.ROUTINE,
    rarity: Rarity.COMMON,
    xpReward: 60,
    statRewards: { [StatType.ORGANIZATION]: 2 },
    isCompleted: false,
    verificationRequired: 'photo',
    deadline: '24ч'
  },
  {
    id: "g2",
    title: "Эликсир Жизни",
    description: "Выпить 2 литра воды за день.",
    type: QuestType.DAILY,
    category: QuestCategory.FITNESS,
    rarity: Rarity.COMMON,
    xpReward: 50,
    statRewards: { [StatType.ENDURANCE]: 1 },
    isCompleted: false,
    verificationRequired: 'check',
    deadline: '12ч'
  },
  {
    id: "g3",
    title: "Ранняя Пташка",
    description: "Встать до 8:00 утра.",
    type: QuestType.DAILY,
    category: QuestCategory.ROUTINE,
    rarity: Rarity.RARE,
    xpReward: 100,
    statRewards: { [StatType.ORGANIZATION]: 3 },
    isCompleted: false,
    verificationRequired: 'check',
    deadline: '8ч'
  },
  {
    id: "g4",
    title: "Легендарное Планирование",
    description: "Составить план задач на следующую неделю.",
    type: QuestType.WEEKLY,
    category: QuestCategory.ROUTINE,
    rarity: Rarity.EPIC,
    xpReward: 300,
    statRewards: { [StatType.ORGANIZATION]: 5 },
    isCompleted: false,
    verificationRequired: 'text',
    deadline: '7д'
  },
    {
    id: "g5",
    title: "Отказ от Яда",
    description: "День без сахара или вредной еды.",
    type: QuestType.ONE_TIME,
    category: QuestCategory.FITNESS,
    rarity: Rarity.RARE,
    xpReward: 150,
    statRewards: { [StatType.ENDURANCE]: 2, [StatType.STRENGTH]: 1 },
    isCompleted: false,
    verificationRequired: 'check',
    deadline: '24ч'
  }
];

export const MOCK_FEED: SocialEvent[] = [
  { id: 'e1', user: "Паладин_Олег", action: "выполнил 'Марш-бросок'", timestamp: "2м назад", likes: 12, avatar: CLASS_AVATARS['Athlete'], rarity: Rarity.RARE },
  { id: 'e2', user: "Маг_Лена", action: "получила уровень 11!", timestamp: "15м назад", likes: 45, avatar: CLASS_AVATARS['Scholar'], rarity: Rarity.EPIC },
  { id: 'e3', user: "Бард_Иван", action: "завершил 'Неделю без сахара'", timestamp: "1ч назад", likes: 89, avatar: CLASS_AVATARS['Socialite'], rarity: Rarity.LEGENDARY },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Тень_Ниндзя", level: 42, avatar: CLASS_AVATARS['Creator'], class: "Кузнец" },
  { rank: 2, name: "Маг_Лена", level: 38, avatar: CLASS_AVATARS['Scholar'], class: "Маг" },
  { rank: 3, name: "Паладин_Олег", level: 35, avatar: CLASS_AVATARS['Athlete'], class: "Воин" },
];

// Material Styles for Cards with Better Contrast
export const MATERIAL_STYLES = {
  [Rarity.COMMON]: {
    bg: "bg-[#795548]", // Wood lighter
    border: "border-[#3e2723]",
    text: "text-[#efebe9]",
    accent: "text-[#d7ccc8]",
    texture: "bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]",
    iconColor: "text-[#d7ccc8]",
    glow: "shadow-[0_4px_6px_rgba(0,0,0,0.4)]"
  },
  [Rarity.RARE]: {
    bg: "bg-[#546e7a]", // Stone lighter
    border: "border-[#37474f]",
    text: "text-white",
    accent: "text-[#cfd8dc]",
    texture: "bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]",
    iconColor: "text-[#eceff1]",
    glow: "shadow-[0_0_10px_rgba(144,164,174,0.3)]"
  },
  [Rarity.EPIC]: {
    bg: "bg-[#455a64]", // Steel
    border: "border-[#eceff1]",
    text: "text-white",
    accent: "text-[#81d4fa]",
    texture: "bg-gradient-to-br from-slate-700 to-slate-500",
    iconColor: "text-[#4fc3f7]",
    glow: "shadow-[0_0_15px_rgba(41,182,246,0.5)]"
  },
  [Rarity.LEGENDARY]: {
    bg: "bg-gradient-to-br from-[#ff8f00] to-[#ffca28]", // Gold
    border: "border-[#bf360c]",
    text: "text-[#3e2723]",
    accent: "text-[#bf360c]",
    texture: "",
    iconColor: "text-[#3e2723]",
    glow: "shadow-[0_0_25px_rgba(255,193,7,0.7)] animate-pulse"
  },
};