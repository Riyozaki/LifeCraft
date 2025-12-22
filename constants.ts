import { Quest, QuestType, Rarity, StatType, SocialEvent, LeaderboardEntry, QuestCategory, Item, ItemType, Monster } from "./types";

// --- Assets (Emojis) ---
export const CLASS_AVATARS = {
  'Athlete': '⚔️', 
  'Scholar': '📜', 
  'Socialite': '👑', 
  'Creator': '⚒️', 
};

export const PATH_DESCRIPTIONS = {
  'Athlete': { title: 'Воин', desc: 'Путь силы и тела.', icon: '⚔️' },
  'Scholar': { title: 'Маг', desc: 'Путь разума.', icon: '📜' },
  'Socialite': { title: 'Лорд', desc: 'Путь влияния.', icon: '👑' },
  'Creator': { title: 'Кузнец', desc: 'Путь созидания.', icon: '⚒️' },
};

// --- ITEMS POOL (Shop & Loot) ---
export const ITEMS_POOL: Item[] = [
  // --- Potions & Food ---
  { id: 'p_heal_s', name: 'Малое Зелье', type: ItemType.POTION, rarity: Rarity.COMMON, icon: '🍷', price: 25, description: '+50 HP.', effect: { type: 'HEAL', value: 50 }, dropChance: 0.3 },
  { id: 'p_heal_m', name: 'Среднее Зелье', type: ItemType.POTION, rarity: Rarity.RARE, icon: '🧪', price: 60, description: '+150 HP.', effect: { type: 'HEAL', value: 150 }, dropChance: 0.1 },
  { id: 'p_energy_s', name: 'Эспрессо Гнома', type: ItemType.POTION, rarity: Rarity.COMMON, icon: '☕', price: 40, description: '+20 Энергии.', effect: { type: 'RESTORE_ENERGY', value: 20 }, dropChance: 0.2 },
  { id: 'f_bread', name: 'Черствый Хлеб', type: ItemType.FOOD, rarity: Rarity.COMMON, icon: '🍞', price: 10, description: '+10 HP.', effect: { type: 'HEAL', value: 10 }, dropChance: 0.5 },
  { id: 'f_apple', name: 'Золотое Яблоко', type: ItemType.FOOD, rarity: Rarity.EPIC, icon: '🍎', price: 200, description: '+100% HP.', effect: { type: 'HEAL', value: 500 }, dropChance: 0.05 },

  // --- Weapons ---
  { id: 'w_rust', name: 'Ржавый Нож', type: ItemType.WEAPON, rarity: Rarity.COMMON, icon: '🗡️', price: 30, description: 'Лучше кулаков.', statBonus: { [StatType.STRENGTH]: 2 }, dropChance: 0.4 },
  { id: 'w_club', name: 'Дубина', type: ItemType.WEAPON, rarity: Rarity.COMMON, icon: '🪵', price: 40, description: 'Тяжелая.', statBonus: { [StatType.STRENGTH]: 3 }, dropChance: 0.3 },
  { id: 'w_sword_steel', name: 'Стальной Меч', type: ItemType.WEAPON, rarity: Rarity.RARE, icon: '⚔️', price: 250, description: 'Надежный.', statBonus: { [StatType.STRENGTH]: 8, [StatType.ENDURANCE]: 2 }, dropChance: 0.1 },
  { id: 'w_staff_app', name: 'Посох Ученика', type: ItemType.WEAPON, rarity: Rarity.COMMON, icon: '🦯', price: 50, description: 'Искрит.', statBonus: { [StatType.INTELLECT]: 3 }, dropChance: 0.3 },
  { id: 'w_wand_fire', name: 'Жезл Огня', type: ItemType.WEAPON, rarity: Rarity.RARE, icon: '🔥', price: 300, description: 'Горячий.', statBonus: { [StatType.INTELLECT]: 10 }, dropChance: 0.08 },
  { id: 'w_bow_elf', name: 'Эльфийский Лук', type: ItemType.WEAPON, rarity: Rarity.EPIC, icon: '🏹', price: 800, description: 'Не промахивается.', statBonus: { [StatType.STRENGTH]: 5, [StatType.ENDURANCE]: 5 }, dropChance: 0.02 },
  { id: 'w_hammer_god', name: 'Молот Бури', type: ItemType.WEAPON, rarity: Rarity.LEGENDARY, icon: '⚡', price: 5000, description: 'Оружие богов.', statBonus: { [StatType.STRENGTH]: 20, [StatType.ENDURANCE]: 10 }, dropChance: 0.001 },

  // --- Armor ---
  { id: 'a_shirt', name: 'Рубаха', type: ItemType.ARMOR, rarity: Rarity.COMMON, icon: '👕', price: 20, description: 'Просто ткань.', statBonus: { [StatType.ENDURANCE]: 1 }, dropChance: 0.5 },
  { id: 'a_leather', name: 'Кожанка', type: ItemType.ARMOR, rarity: Rarity.COMMON, icon: '🧥', price: 100, description: 'Защита от ветра.', statBonus: { [StatType.ENDURANCE]: 3 }, dropChance: 0.3 },
  { id: 'a_chain', name: 'Кольчуга', type: ItemType.ARMOR, rarity: Rarity.RARE, icon: '⛓️', price: 300, description: 'Звенит.', statBonus: { [StatType.ENDURANCE]: 8 }, dropChance: 0.1 },
  { id: 'a_plate', name: 'Латы Рыцаря', type: ItemType.ARMOR, rarity: Rarity.EPIC, icon: '🛡️', price: 1200, description: 'Сияют.', statBonus: { [StatType.ENDURANCE]: 15, [StatType.STRENGTH]: 2 }, dropChance: 0.03 },
  { id: 'a_robe', name: 'Мантия Мага', type: ItemType.ARMOR, rarity: Rarity.RARE, icon: '👘', price: 250, description: 'Усиливает ауру.', statBonus: { [StatType.INTELLECT]: 5, [StatType.ENDURANCE]: 2 }, dropChance: 0.1 },
];

export const MONSTERS: Monster[] = [
  // Common
  { name: 'Крыса', icon: '🐀', baseHp: 20, baseDmg: 3, rarity: Rarity.COMMON },
  { name: 'Слизень', icon: '🦠', baseHp: 30, baseDmg: 4, rarity: Rarity.COMMON },
  { name: 'Летучая Мышь', icon: '🦇', baseHp: 25, baseDmg: 5, rarity: Rarity.COMMON },
  // Rare
  { name: 'Гоблин', icon: '👺', baseHp: 50, baseDmg: 8, rarity: Rarity.RARE },
  { name: 'Скелет', icon: '💀', baseHp: 60, baseDmg: 10, rarity: Rarity.RARE },
  { name: 'Орк', icon: '👹', baseHp: 80, baseDmg: 15, rarity: Rarity.RARE },
  // Bosses
  { name: 'Король Слизней', icon: '🤢', baseHp: 200, baseDmg: 12, rarity: Rarity.EPIC, isBoss: true },
  { name: 'Некромант', icon: '🧙‍♂️', baseHp: 180, baseDmg: 25, rarity: Rarity.EPIC, isBoss: true },
  { name: 'Дракон', icon: '🐉', baseHp: 400, baseDmg: 40, rarity: Rarity.LEGENDARY, isBoss: true },
];

// --- EXTENDED QUESTS ---
export const QUEST_POOL: Quest[] = [
  // FITNESS
  {
    id: "f1", title: "Прогулка 5км", description: "Пройти пешком 5000 шагов или 3км.",
    type: QuestType.DAILY, category: QuestCategory.FITNESS, rarity: Rarity.COMMON,
    xpReward: 100, statRewards: { [StatType.ENDURANCE]: 2 }, itemRewardId: 'f_bread',
    isCompleted: false, verificationRequired: 'check', deadline: '24ч'
  },
  {
    id: "f2", title: "Отжимания", description: "3 подхода по 10 раз.",
    type: QuestType.DAILY, category: QuestCategory.FITNESS, rarity: Rarity.COMMON,
    xpReward: 80, statRewards: { [StatType.STRENGTH]: 2 },
    isCompleted: false, verificationRequired: 'check', deadline: '24ч'
  },
  {
    id: "f3", title: "Без Сахара", description: "Весь день без сладкого.",
    type: QuestType.ONE_TIME, category: QuestCategory.FITNESS, rarity: Rarity.RARE,
    xpReward: 150, statRewards: { [StatType.ENDURANCE]: 3 }, itemRewardId: 'p_heal_s',
    isCompleted: false, verificationRequired: 'check', deadline: '24ч'
  },
  
  // MIND
  {
    id: "m1", title: "Чтение (15 мин)", description: "Читать книгу 15 минут.",
    type: QuestType.DAILY, category: QuestCategory.MIND, rarity: Rarity.COMMON,
    xpReward: 60, statRewards: { [StatType.INTELLECT]: 1 },
    isCompleted: false, verificationRequired: 'check', deadline: '24ч'
  },
  {
    id: "m2", title: "Учить слова", description: "Выучить 10 новых иностранных слов.",
    type: QuestType.DAILY, category: QuestCategory.MIND, rarity: Rarity.RARE,
    xpReward: 100, statRewards: { [StatType.INTELLECT]: 2 }, itemRewardId: 'p_energy_s',
    isCompleted: false, verificationRequired: 'text', deadline: '24ч'
  },

  // ROUTINE
  {
    id: "r1", title: "Заправить кровать", description: "Сразу после подъема.",
    type: QuestType.DAILY, category: QuestCategory.ROUTINE, rarity: Rarity.COMMON,
    xpReward: 30, statRewards: { [StatType.ORGANIZATION]: 1 },
    isCompleted: false, verificationRequired: 'check', deadline: '10ч'
  },
  {
    id: "r2", title: "Чистый стол", description: "Убрать все лишнее с рабочего стола.",
    type: QuestType.ONE_TIME, category: QuestCategory.ROUTINE, rarity: Rarity.COMMON,
    xpReward: 50, statRewards: { [StatType.ORGANIZATION]: 2 },
    isCompleted: false, verificationRequired: 'photo', deadline: '24ч'
  },
  {
    id: "r3", title: "План на завтра", description: "Написать список дел с вечера.",
    type: QuestType.DAILY, category: QuestCategory.ROUTINE, rarity: Rarity.COMMON,
    xpReward: 40, statRewards: { [StatType.ORGANIZATION]: 2 },
    isCompleted: false, verificationRequired: 'check', deadline: '24ч'
  },

  // CREATION
  {
    id: "c1", title: "Скетч", description: "Нарисовать быстрый набросок чего угодно.",
    type: QuestType.DAILY, category: QuestCategory.CREATION, rarity: Rarity.COMMON,
    xpReward: 70, statRewards: { [StatType.CREATIVITY]: 2 },
    isCompleted: false, verificationRequired: 'photo', deadline: '24ч'
  },
  {
    id: "c2", title: "Коддинг", description: "Написать функцию или решить задачу (LeetCode).",
    type: QuestType.DAILY, category: QuestCategory.CREATION, rarity: Rarity.RARE,
    xpReward: 120, statRewards: { [StatType.INTELLECT]: 2, [StatType.CREATIVITY]: 1 },
    isCompleted: false, verificationRequired: 'text', deadline: '24ч'
  },

  // SOCIAL
  {
    id: "s1", title: "Комплимент", description: "Сделать искренний комплимент коллеге или другу.",
    type: QuestType.DAILY, category: QuestCategory.SOCIAL, rarity: Rarity.COMMON,
    xpReward: 50, statRewards: { [StatType.CHARISMA]: 2 },
    isCompleted: false, verificationRequired: 'check', deadline: '24ч'
  },
  {
    id: "s2", title: "Звонок близким", description: "Позвонить родителям или бабушке.",
    type: QuestType.WEEKLY, category: QuestCategory.SOCIAL, rarity: Rarity.EPIC,
    xpReward: 300, statRewards: { [StatType.CHARISMA]: 5 }, itemRewardId: 'p_heal_m',
    isCompleted: false, verificationRequired: 'check', deadline: '7д'
  }
];

export const MOCK_FEED: SocialEvent[] = [
  { id: 'e1', user: "Паладин_Олег", action: "убил Дракона!", timestamp: "5м назад", likes: 120, avatar: CLASS_AVATARS['Athlete'], rarity: Rarity.LEGENDARY },
  { id: 'e2', user: "Маг_Лена", action: "нашла Золотое Яблоко", timestamp: "15м назад", likes: 45, avatar: CLASS_AVATARS['Scholar'], rarity: Rarity.EPIC },
  { id: 'e3', user: "Бард_Иван", action: "получил уровень 5", timestamp: "1ч назад", likes: 10, avatar: CLASS_AVATARS['Socialite'], rarity: Rarity.COMMON },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Тень_Ниндзя", level: 42, avatar: CLASS_AVATARS['Creator'], class: "Кузнец" },
  { rank: 2, name: "Маг_Лена", level: 38, avatar: CLASS_AVATARS['Scholar'], class: "Маг" },
  { rank: 3, name: "Паладин_Олег", level: 35, avatar: CLASS_AVATARS['Athlete'], class: "Воин" },
];

export const MATERIAL_STYLES = {
  [Rarity.COMMON]: {
    bg: "bg-[#795548]", 
    border: "border-[#3e2723]",
    text: "text-[#efebe9]",
    accent: "text-[#d7ccc8]",
    texture: "bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]",
    iconColor: "text-[#d7ccc8]",
    glow: "shadow-[0_4px_6px_rgba(0,0,0,0.4)]"
  },
  [Rarity.RARE]: {
    bg: "bg-[#546e7a]", 
    border: "border-[#37474f]",
    text: "text-white",
    accent: "text-[#cfd8dc]",
    texture: "bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]",
    iconColor: "text-[#eceff1]",
    glow: "shadow-[0_0_10px_rgba(144,164,174,0.3)]"
  },
  [Rarity.EPIC]: {
    bg: "bg-[#455a64]", 
    border: "border-[#eceff1]",
    text: "text-white",
    accent: "text-[#81d4fa]",
    texture: "bg-gradient-to-br from-slate-700 to-slate-500",
    iconColor: "text-[#4fc3f7]",
    glow: "shadow-[0_0_15px_rgba(41,182,246,0.5)]"
  },
  [Rarity.LEGENDARY]: {
    bg: "bg-gradient-to-br from-[#ff8f00] to-[#ffca28]", 
    border: "border-[#bf360c]",
    text: "text-[#3e2723]",
    accent: "text-[#bf360c]",
    texture: "",
    iconColor: "text-[#3e2723]",
    glow: "shadow-[0_0_25px_rgba(255,193,7,0.7)] animate-pulse"
  },
};