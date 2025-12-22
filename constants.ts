import { Quest, QuestType, Rarity, StatType, QuestCategory, Item, ItemType, Monster, DamageType, CraftingRecipe, SocialEvent, LeaderboardEntry } from "./types";

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

// --- MATERIALS ---
const MAT_IRON = { id: 'm_iron', name: 'Железная Руда', type: ItemType.MATERIAL, rarity: Rarity.COMMON, icon: '🪨', price: 5, description: 'Нужна для ковки.', isMaterial: true };
const MAT_LEATHER = { id: 'm_leather', name: 'Толстая Кожа', type: ItemType.MATERIAL, rarity: Rarity.COMMON, icon: '🐄', price: 5, description: 'Для доспехов.', isMaterial: true };
const MAT_ESSENCE = { id: 'm_essence', name: 'Магическая Пыль', type: ItemType.MATERIAL, rarity: Rarity.RARE, icon: '✨', price: 20, description: 'Искрится.', isMaterial: true };
const MAT_DRAGON_SCALE = { id: 'm_scale', name: 'Чешуя Дракона', type: ItemType.MATERIAL, rarity: Rarity.LEGENDARY, icon: '🐲', price: 500, description: 'Горячая на ощупь.', isMaterial: true };
const MAT_WOOD = { id: 'm_wood', name: 'Зачарованное Дерево', type: ItemType.MATERIAL, rarity: Rarity.COMMON, icon: '🪵', price: 10, description: 'Для посохов.', isMaterial: true };

// --- ITEMS POOL ---
export const ITEMS_POOL: Item[] = [
  MAT_IRON, MAT_LEATHER, MAT_ESSENCE, MAT_DRAGON_SCALE, MAT_WOOD,

  { id: 'p_heal_s', name: 'Малое Зелье', type: ItemType.POTION, rarity: Rarity.COMMON, icon: '🍷', price: 50, description: '+50 HP.', effect: { type: 'HEAL', value: 50 }, dropChance: 0.3 },
  { id: 'p_heal_m', name: 'Среднее Зелье', type: ItemType.POTION, rarity: Rarity.RARE, icon: '🧪', price: 120, description: '+150 HP.', effect: { type: 'HEAL', value: 150 }, dropChance: 0.1 },
  { id: 'p_energy_s', name: 'Эспрессо', type: ItemType.POTION, rarity: Rarity.COMMON, icon: '☕', price: 80, description: '+20 Энергии.', effect: { type: 'RESTORE_ENERGY', value: 20 }, dropChance: 0.2 },

  { id: 'w_sword1', name: 'Железный Меч', type: ItemType.WEAPON, rarity: Rarity.COMMON, icon: '🗡️', price: 100, description: 'Простой меч.', baseDamage: 5, scalingStat: StatType.STRENGTH, damageType: DamageType.PHYSICAL },
  { id: 'w_staff1', name: 'Посох Искр', type: ItemType.WEAPON, rarity: Rarity.RARE, icon: '🔮', price: 300, description: 'Бьет током.', baseDamage: 8, scalingStat: StatType.INTELLECT, damageType: DamageType.MAGIC },
  
  // --- SPECIAL EFFECT ITEMS ---
  { 
    id: 'w_lifesteal', 
    name: 'Кровавый Жнец', 
    type: ItemType.WEAPON, 
    rarity: Rarity.EPIC, 
    icon: '⚔️', 
    price: 800, 
    description: 'Меч, пьющий жизнь врагов.', 
    baseDamage: 20, 
    scalingStat: StatType.STRENGTH, 
    damageType: DamageType.PHYSICAL,
    specialEffects: [{ type: 'LIFESTEAL', value: 15, description: '15% урона возвращается здоровьем' }]
  },
  { 
    id: 'c_reflect', 
    name: 'Эгида Шипов', 
    type: ItemType.CHEST, 
    rarity: Rarity.EPIC, 
    icon: '🛡️', 
    price: 750, 
    description: 'Возвращает боль атакующему.', 
    defense: 10,
    specialEffects: [{ type: 'REFLECT', value: 25, description: 'Возвращает 25% урона врагу' }]
  },
  { 
    id: 'a_midas', 
    name: 'Амулет Мидаса', 
    type: ItemType.ACCESSORY, 
    rarity: Rarity.LEGENDARY, 
    icon: '🪙', 
    price: 1500, 
    description: 'Все, что ты убиваешь, превращается в золото.', 
    specialEffects: [{ type: 'GOLD_BOOST', value: 50, description: '+50% золота из подземелий' }]
  },
  { 
    id: 'b_dodge', 
    name: 'Сапоги-Скороходы', 
    type: ItemType.BOOTS, 
    rarity: Rarity.RARE, 
    icon: '👟', 
    price: 400, 
    description: 'В них легче уклоняться.', 
    defense: 3,
    specialEffects: [{ type: 'DODGE', value: 15, description: '15% шанс уклониться от удара' }]
  },
  { 
    id: 'a_wisdom', 
    name: 'Кольцо Просвещения', 
    type: ItemType.ACCESSORY, 
    rarity: Rarity.EPIC, 
    icon: '💍', 
    price: 900, 
    description: 'Ускоряет познание мира.', 
    specialEffects: [{ type: 'XP_BOOST', value: 25, description: '+25% опыта за победы' }]
  },

  { id: 'w_axe1', name: 'Секира', type: ItemType.WEAPON, rarity: Rarity.RARE, icon: '🪓', price: 350, description: 'Рубит.', baseDamage: 10, scalingStat: StatType.STRENGTH, damageType: DamageType.PHYSICAL },
  { id: 'w_bow1', name: 'Охотничий Лук', type: ItemType.WEAPON, rarity: Rarity.COMMON, icon: '🏹', price: 120, description: 'Для метких.', baseDamage: 6, scalingStat: StatType.STRENGTH, damageType: DamageType.PHYSICAL },
  { id: 'w_dagger', name: 'Кинжал Тени', type: ItemType.WEAPON, rarity: Rarity.EPIC, icon: '🗡️', price: 600, description: 'Быстрый и смертоносный.', baseDamage: 15, scalingStat: StatType.CHARISMA, damageType: DamageType.PHYSICAL },
  { id: 'w_hammer_god', name: 'Молот Дракона', type: ItemType.WEAPON, rarity: Rarity.LEGENDARY, icon: '🔨', price: 2000, description: 'Пылает яростью.', baseDamage: 40, scalingStat: StatType.STRENGTH, damageType: DamageType.FIRE },

  { id: 'h_leather', name: 'Кожаный Шлем', type: ItemType.HELMET, rarity: Rarity.COMMON, icon: '🧢', price: 50, description: 'Мягкий.', defense: 2, statBonus: { [StatType.ENDURANCE]: 1 } },
  { id: 'h_plate', name: 'Стальной Шлем', type: ItemType.HELMET, rarity: Rarity.RARE, icon: '🪖', price: 200, description: 'Тяжелый.', defense: 5, resistances: { [DamageType.PHYSICAL]: 5 }, statBonus: { [StatType.STRENGTH]: 1 } },
  { id: 'h_wiz', name: 'Шляпа Мага', type: ItemType.HELMET, rarity: Rarity.RARE, icon: '🎩', price: 180, description: 'Стильная.', defense: 1, statBonus: { [StatType.INTELLECT]: 3 } },

  { id: 'c_leather', name: 'Кожаная Куртка', type: ItemType.CHEST, rarity: Rarity.COMMON, icon: '🧥', price: 80, description: 'Удобная.', defense: 4, statBonus: { [StatType.ENDURANCE]: 2 } },
  { id: 'c_plate', name: 'Кираса', type: ItemType.CHEST, rarity: Rarity.EPIC, icon: '🛡️', price: 500, description: 'Блестит.', defense: 12, resistances: { [DamageType.PHYSICAL]: 10 }, statBonus: { [StatType.STRENGTH]: 2 } },
  { id: 'c_robe', name: 'Роба Ученика', type: ItemType.CHEST, rarity: Rarity.COMMON, icon: '🥋', price: 70, description: 'Легкая.', defense: 2, statBonus: { [StatType.INTELLECT]: 2 } },

  { id: 'l_leather', name: 'Кожаные Штаны', type: ItemType.LEGS, rarity: Rarity.COMMON, icon: '👖', price: 60, description: 'Не жмут.', defense: 3, statBonus: { [StatType.ENDURANCE]: 1 } },
  { id: 'l_plate', name: 'Латные Поножи', type: ItemType.LEGS, rarity: Rarity.RARE, icon: '🦵', price: 250, description: 'Гремят при ходьбе.', defense: 6, statBonus: { [StatType.STRENGTH]: 1 } },
  
  { id: 'b_leather', name: 'Сапоги', type: ItemType.BOOTS, rarity: Rarity.COMMON, icon: '👢', price: 40, description: 'Для ходьбы.', defense: 2, statBonus: { [StatType.ENDURANCE]: 1 } },
  { id: 'b_iron', name: 'Железные Ботинки', type: ItemType.BOOTS, rarity: Rarity.RARE, icon: '👟', price: 150, description: 'Тяжелые.', defense: 4, resistances: { [DamageType.FIRE]: 5 } },
];

// --- CRAFTING RECIPES ---
export const RECIPES: CraftingRecipe[] = [
  { resultId: 'w_sword1', materials: [{ itemId: 'm_iron', count: 3 }, { itemId: 'm_leather', count: 1 }], cost: 50 },
  { resultId: 'c_plate', materials: [{ itemId: 'm_iron', count: 10 }, { itemId: 'm_essence', count: 2 }], cost: 200 },
  { resultId: 'p_heal_m', materials: [{ itemId: 'm_essence', count: 1 }], cost: 20 },
  { resultId: 'w_dagger', materials: [{ itemId: 'm_iron', count: 5 }, { itemId: 'm_scale', count: 1 }], cost: 300 },
  { resultId: 'h_wiz', materials: [{ itemId: 'm_leather', count: 3 }, { itemId: 'm_essence', count: 5 }], cost: 150 },
  { resultId: 'w_hammer_god', materials: [{ itemId: 'm_scale', count: 3 }, { itemId: 'm_iron', count: 20 }], cost: 1000 },
  { resultId: 'w_staff1', materials: [{ itemId: 'm_wood', count: 5 }, { itemId: 'm_essence', count: 2 }], cost: 100 },
  { resultId: 'w_bow1', materials: [{ itemId: 'm_wood', count: 4 }, { itemId: 'm_leather', count: 2 }], cost: 80 },
  { resultId: 'w_lifesteal', materials: [{ itemId: 'm_iron', count: 15 }, { itemId: 'm_essence', count: 10 }], cost: 500 },
  { resultId: 'a_midas', materials: [{ itemId: 'm_essence', count: 25 }], cost: 1000 },
];

// --- MONSTERS ---
export const MONSTERS: Monster[] = [
  { name: 'Крыса', icon: '🐀', baseHp: 30, baseDmg: 5, rarity: Rarity.COMMON, damageType: DamageType.PHYSICAL, lootTable: ['m_leather', 'p_heal_s'] },
  { name: 'Слизень', icon: '🦠', baseHp: 35, baseDmg: 4, rarity: Rarity.COMMON, damageType: DamageType.POISON, lootTable: ['m_essence'] },
  { name: 'Огненный Жук', icon: '🐞', baseHp: 40, baseDmg: 8, rarity: Rarity.COMMON, damageType: DamageType.FIRE, lootTable: ['m_essence'] },
  { name: 'Дикий Волк', icon: '🐺', baseHp: 45, baseDmg: 7, rarity: Rarity.COMMON, damageType: DamageType.PHYSICAL, lootTable: ['m_leather'] },
  { name: 'Оживший Пень', icon: '🪵', baseHp: 50, baseDmg: 3, rarity: Rarity.COMMON, damageType: DamageType.PHYSICAL, lootTable: ['m_wood'] },
  { name: 'Гоблин-Воин', icon: '👺', baseHp: 80, baseDmg: 12, rarity: Rarity.RARE, damageType: DamageType.PHYSICAL, lootTable: ['m_iron', 'w_sword1', 'p_heal_s'] },
  { name: 'Темный Маг', icon: '🧙', baseHp: 60, baseDmg: 18, rarity: Rarity.RARE, damageType: DamageType.MAGIC, lootTable: ['m_essence', 'w_staff1'] },
  { name: 'Скелет-Лучник', icon: '💀', baseHp: 70, baseDmg: 15, rarity: Rarity.RARE, damageType: DamageType.PHYSICAL, lootTable: ['w_bow1'] },
  { name: 'Элементаль', icon: '🌪️', baseHp: 90, baseDmg: 10, rarity: Rarity.RARE, damageType: DamageType.MAGIC, lootTable: ['m_essence'] },
  { name: 'Лавовый Голем', icon: '🌋', baseHp: 300, baseDmg: 30, rarity: Rarity.EPIC, isBoss: true, damageType: DamageType.FIRE, lootTable: ['m_iron', 'w_sword_steel', 'c_plate'] },
  { name: 'Король Лич', icon: '🧟', baseHp: 350, baseDmg: 35, rarity: Rarity.EPIC, isBoss: true, damageType: DamageType.MAGIC, lootTable: ['m_essence', 'h_wiz'] },
  { name: 'Древний Дракон', icon: '🐉', baseHp: 800, baseDmg: 60, rarity: Rarity.LEGENDARY, isBoss: true, damageType: DamageType.FIRE, lootTable: ['m_scale', 'w_hammer_god'] },
];

export const QUEST_POOL: Quest[] = [
  { id: "r1", title: "Золотая Лихорадка", description: "Заработать денег или сэкономить на покупке.", type: QuestType.DAILY, category: QuestCategory.ROUTINE, rarity: Rarity.COMMON, xpReward: 50, coinsReward: 150, statRewards: { [StatType.ORGANIZATION]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "r2", title: "Срочная Уборка", description: "Убрать комнату за 20 минут!", type: QuestType.ONE_TIME, category: QuestCategory.ROUTINE, rarity: Rarity.RARE, xpReward: 200, coinsReward: 300, statRewards: { [StatType.ORGANIZATION]: 3 }, isCompleted: false, verificationRequired: 'photo', deadline: '20м', expiresAt: Date.now() + 20 * 60 * 1000 },
  { id: "r3", title: "Властелин Бюджета", description: "Расписать траты на неделю вперед.", type: QuestType.WEEKLY, category: QuestCategory.ROUTINE, rarity: Rarity.RARE, xpReward: 150, coinsReward: 200, statRewards: { [StatType.ORGANIZATION]: 2 }, isCompleted: false, verificationRequired: 'text', deadline: '7д' },
  { id: "r4", title: "Ранняя Пташка", description: "Встать до 8:00 утра.", type: QuestType.DAILY, category: QuestCategory.ROUTINE, rarity: Rarity.COMMON, xpReward: 60, coinsReward: 50, statRewards: { [StatType.ORGANIZATION]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "f1", title: "Марафон", description: "Пробежать 3км.", type: QuestType.WEEKLY, category: QuestCategory.FITNESS, rarity: Rarity.EPIC, xpReward: 500, coinsReward: 1000, statRewards: { [StatType.ENDURANCE]: 5 }, isCompleted: false, verificationRequired: 'check', deadline: '7д' },
  { id: "f2", title: "Силач", description: "Сделать 50 отжиманий за день.", type: QuestType.DAILY, category: QuestCategory.FITNESS, rarity: Rarity.COMMON, xpReward: 100, coinsReward: 100, statRewards: { [StatType.STRENGTH]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "m1", title: "Книжный Червь", description: "Прочитать 30 страниц книги.", type: QuestType.DAILY, category: QuestCategory.MIND, rarity: Rarity.COMMON, xpReward: 80, coinsReward: 50, statRewards: { [StatType.INTELLECT]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
];

export const MATERIAL_STYLES = {
  [Rarity.COMMON]: {
    bg: "bg-[#795548]", 
    border: "border-[#3e2723]",
    text: "text-[#efebe9]",
    accent: "text-[#d7ccc8]",
    texture: "bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]",
  },
  [Rarity.RARE]: {
    bg: "bg-[#546e7a]", 
    border: "border-[#37474f]",
    text: "text-white",
    accent: "text-[#cfd8dc]",
    texture: "bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]",
  },
  [Rarity.EPIC]: {
    bg: "bg-[#455a64]", 
    border: "border-[#eceff1]",
    text: "text-white",
    accent: "text-[#81d4fa]",
    texture: "bg-gradient-to-br from-slate-700 to-slate-500",
  },
  [Rarity.LEGENDARY]: {
    bg: "bg-gradient-to-br from-[#ff8f00] to-[#ffca28]", 
    border: "border-[#bf360c]",
    text: "text-[#3e2723]",
    accent: "text-[#bf360c]",
    texture: "",
  },
};

export const MOCK_FEED: SocialEvent[] = [
  { id: '1', user: 'Alex', action: 'победил Лавового Голема', timestamp: '2m', likes: 5, avatar: '⚔️' },
  { id: '2', user: 'Elena', action: 'скрафтила Кирасу', timestamp: '5m', likes: 12, avatar: '⚒️' },
  { id: '3', user: 'Dmitry', action: 'получил 5 уровень', timestamp: '10m', likes: 8, avatar: '📜' }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'CyberDemon', level: 12, avatar: '👺', class: 'Athlete' },
  { rank: 2, name: 'PixelMage', level: 11, avatar: '🧙', class: 'Scholar' },
  { rank: 3, name: 'CryptoKing', level: 10, avatar: '👑', class: 'Socialite' },
];