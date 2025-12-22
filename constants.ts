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
  // Materials
  MAT_IRON, MAT_LEATHER, MAT_ESSENCE, MAT_DRAGON_SCALE, MAT_WOOD,

  // Consumables (Potions)
  { id: 'p_heal_s', name: 'Малое Зелье', type: ItemType.POTION, rarity: Rarity.COMMON, icon: '🍷', price: 50, description: '+50 HP.', effect: { type: 'HEAL', value: 50 }, dropChance: 0.3 },
  { id: 'p_heal_m', name: 'Среднее Зелье', type: ItemType.POTION, rarity: Rarity.RARE, icon: '🧪', price: 120, description: '+150 HP.', effect: { type: 'HEAL', value: 150 }, dropChance: 0.1 },
  { id: 'p_energy_s', name: 'Эспрессо', type: ItemType.POTION, rarity: Rarity.COMMON, icon: '☕', price: 80, description: '+20 Энергии.', effect: { type: 'RESTORE_ENERGY', value: 20 }, dropChance: 0.2 },

  // Weapons
  { id: 'w_sword1', name: 'Железный Меч', type: ItemType.WEAPON, rarity: Rarity.COMMON, icon: '🗡️', price: 100, description: 'Простой меч.', baseDamage: 5, scalingStat: StatType.STRENGTH, damageType: DamageType.PHYSICAL },
  { id: 'w_staff1', name: 'Посох Искр', type: ItemType.WEAPON, rarity: Rarity.RARE, icon: '🔮', price: 300, description: 'Бьет током.', baseDamage: 8, scalingStat: StatType.INTELLECT, damageType: DamageType.MAGIC },
  { id: 'w_axe1', name: 'Секира', type: ItemType.WEAPON, rarity: Rarity.RARE, icon: '🪓', price: 350, description: 'Рубит.', baseDamage: 10, scalingStat: StatType.STRENGTH, damageType: DamageType.PHYSICAL },
  { id: 'w_bow1', name: 'Охотничий Лук', type: ItemType.WEAPON, rarity: Rarity.COMMON, icon: '🏹', price: 120, description: 'Для метких.', baseDamage: 6, scalingStat: StatType.STRENGTH, damageType: DamageType.PHYSICAL },
  { id: 'w_dagger', name: 'Кинжал Тени', type: ItemType.WEAPON, rarity: Rarity.EPIC, icon: '🗡️', price: 600, description: 'Быстрый и смертоносный.', baseDamage: 15, scalingStat: StatType.CHARISMA, damageType: DamageType.PHYSICAL },
  { id: 'w_hammer_god', name: 'Молот Дракона', type: ItemType.WEAPON, rarity: Rarity.LEGENDARY, icon: '🔨', price: 2000, description: 'Пылает яростью.', baseDamage: 40, scalingStat: StatType.STRENGTH, damageType: DamageType.FIRE },

  // Helmets
  { id: 'h_leather', name: 'Кожаный Шлем', type: ItemType.HELMET, rarity: Rarity.COMMON, icon: '🧢', price: 50, description: 'Мягкий.', defense: 2, statBonus: { [StatType.ENDURANCE]: 1 } },
  { id: 'h_plate', name: 'Стальной Шлем', type: ItemType.HELMET, rarity: Rarity.RARE, icon: '🪖', price: 200, description: 'Тяжелый.', defense: 5, resistances: { [DamageType.PHYSICAL]: 5 }, statBonus: { [StatType.STRENGTH]: 1 } },
  { id: 'h_wiz', name: 'Шляпа Мага', type: ItemType.HELMET, rarity: Rarity.RARE, icon: '🎩', price: 180, description: 'Стильная.', defense: 1, statBonus: { [StatType.INTELLECT]: 3 } },

  // Chests
  { id: 'c_leather', name: 'Кожаная Куртка', type: ItemType.CHEST, rarity: Rarity.COMMON, icon: '🧥', price: 80, description: 'Удобная.', defense: 4, statBonus: { [StatType.ENDURANCE]: 2 } },
  { id: 'c_plate', name: 'Кираса', type: ItemType.CHEST, rarity: Rarity.EPIC, icon: '🛡️', price: 500, description: 'Блестит.', defense: 12, resistances: { [DamageType.PHYSICAL]: 10 }, statBonus: { [StatType.STRENGTH]: 2 } },
  { id: 'c_robe', name: 'Роба Ученика', type: ItemType.CHEST, rarity: Rarity.COMMON, icon: '🥋', price: 70, description: 'Легкая.', defense: 2, statBonus: { [StatType.INTELLECT]: 2 } },

  // Legs
  { id: 'l_leather', name: 'Кожаные Штаны', type: ItemType.LEGS, rarity: Rarity.COMMON, icon: '👖', price: 60, description: 'Не жмут.', defense: 3, statBonus: { [StatType.ENDURANCE]: 1 } },
  { id: 'l_plate', name: 'Латные Поножи', type: ItemType.LEGS, rarity: Rarity.RARE, icon: '🦵', price: 250, description: 'Гремят при ходьбе.', defense: 6, statBonus: { [StatType.STRENGTH]: 1 } },
  
  // Boots
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
];

// --- MONSTERS ---
export const MONSTERS: Monster[] = [
  // Common
  { name: 'Крыса', icon: '🐀', baseHp: 30, baseDmg: 5, rarity: Rarity.COMMON, damageType: DamageType.PHYSICAL, lootTable: ['m_leather', 'p_heal_s'] },
  { name: 'Слизень', icon: '🦠', baseHp: 35, baseDmg: 4, rarity: Rarity.COMMON, damageType: DamageType.POISON, lootTable: ['m_essence'] },
  { name: 'Огненный Жук', icon: '🐞', baseHp: 40, baseDmg: 8, rarity: Rarity.COMMON, damageType: DamageType.FIRE, lootTable: ['m_essence'] },
  { name: 'Дикий Волк', icon: '🐺', baseHp: 45, baseDmg: 7, rarity: Rarity.COMMON, damageType: DamageType.PHYSICAL, lootTable: ['m_leather'] },
  { name: 'Оживший Пень', icon: '🪵', baseHp: 50, baseDmg: 3, rarity: Rarity.COMMON, damageType: DamageType.PHYSICAL, lootTable: ['m_wood'] },
  
  // Rare
  { name: 'Гоблин-Воин', icon: '👺', baseHp: 80, baseDmg: 12, rarity: Rarity.RARE, damageType: DamageType.PHYSICAL, lootTable: ['m_iron', 'w_sword1', 'p_heal_s'] },
  { name: 'Темный Маг', icon: '🧙', baseHp: 60, baseDmg: 18, rarity: Rarity.RARE, damageType: DamageType.MAGIC, lootTable: ['m_essence', 'w_staff1'] },
  { name: 'Скелет-Лучник', icon: '💀', baseHp: 70, baseDmg: 15, rarity: Rarity.RARE, damageType: DamageType.PHYSICAL, lootTable: ['w_bow1'] },
  { name: 'Элементаль', icon: '🌪️', baseHp: 90, baseDmg: 10, rarity: Rarity.RARE, damageType: DamageType.MAGIC, lootTable: ['m_essence'] },
  
  // Bosses
  { name: 'Лавовый Голем', icon: '🌋', baseHp: 300, baseDmg: 30, rarity: Rarity.EPIC, isBoss: true, damageType: DamageType.FIRE, lootTable: ['m_iron', 'w_sword_steel', 'c_plate'] },
  { name: 'Король Лич', icon: '🧟', baseHp: 350, baseDmg: 35, rarity: Rarity.EPIC, isBoss: true, damageType: DamageType.MAGIC, lootTable: ['m_essence', 'h_wiz'] },
  { name: 'Древний Дракон', icon: '🐉', baseHp: 800, baseDmg: 60, rarity: Rarity.LEGENDARY, isBoss: true, damageType: DamageType.FIRE, lootTable: ['m_scale', 'w_hammer_god'] },
];

export const QUEST_POOL: Quest[] = [
  // --- ROUTINE (Быт) 15 quests ---
  { id: "r1", title: "Золотая Лихорадка", description: "Заработать денег или сэкономить на покупке.", type: QuestType.DAILY, category: QuestCategory.ROUTINE, rarity: Rarity.COMMON, xpReward: 50, coinsReward: 150, statRewards: { [StatType.ORGANIZATION]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "r2", title: "Срочная Уборка", description: "Убрать комнату за 20 минут!", type: QuestType.ONE_TIME, category: QuestCategory.ROUTINE, rarity: Rarity.RARE, xpReward: 200, coinsReward: 300, statRewards: { [StatType.ORGANIZATION]: 3 }, isCompleted: false, verificationRequired: 'photo', deadline: '20м', expiresAt: Date.now() + 20 * 60 * 1000 },
  { id: "r3", title: "Властелин Бюджета", description: "Расписать траты на неделю вперед.", type: QuestType.WEEKLY, category: QuestCategory.ROUTINE, rarity: Rarity.RARE, xpReward: 150, coinsReward: 200, statRewards: { [StatType.ORGANIZATION]: 2 }, isCompleted: false, verificationRequired: 'text', deadline: '7д' },
  { id: "r4", title: "Ранняя Пташка", description: "Встать до 8:00 утра.", type: QuestType.DAILY, category: QuestCategory.ROUTINE, rarity: Rarity.COMMON, xpReward: 60, coinsReward: 50, statRewards: { [StatType.ORGANIZATION]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "r5", title: "Кулинарный Поединок", description: "Приготовить еду на 3 дня вперед.", type: QuestType.WEEKLY, category: QuestCategory.ROUTINE, rarity: Rarity.EPIC, xpReward: 300, coinsReward: 400, statRewards: { [StatType.ORGANIZATION]: 3 }, isCompleted: false, verificationRequired: 'photo', deadline: '7д' },
  { id: "r6", title: "Чистый Разум", description: "Разобрать рабочий стол/файлы.", type: QuestType.ONE_TIME, category: QuestCategory.ROUTINE, rarity: Rarity.COMMON, xpReward: 50, coinsReward: 50, statRewards: { [StatType.ORGANIZATION]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "r7", title: "Мастер Чистоты", description: "Помыть посуду сразу после еды.", type: QuestType.DAILY, category: QuestCategory.ROUTINE, rarity: Rarity.COMMON, xpReward: 40, coinsReward: 30, statRewards: { [StatType.ORGANIZATION]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "r8", title: "Постирочный День", description: "Запустить стирку и РАЗВЕСИТЬ ее.", type: QuestType.WEEKLY, category: QuestCategory.ROUTINE, rarity: Rarity.COMMON, xpReward: 100, coinsReward: 100, statRewards: { [StatType.ORGANIZATION]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "r9", title: "Оплата Счетов", description: "Оплатить все квитанции вовремя.", type: QuestType.ONE_TIME, category: QuestCategory.ROUTINE, rarity: Rarity.RARE, xpReward: 150, coinsReward: 150, statRewards: { [StatType.ORGANIZATION]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "r10", title: "Уход за Снаряжением", description: "Почистить обувь перед выходом.", type: QuestType.DAILY, category: QuestCategory.ROUTINE, rarity: Rarity.COMMON, xpReward: 50, coinsReward: 50, statRewards: { [StatType.ORGANIZATION]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "r11", title: "Закупка Провизии", description: "Сходить в магазин со списком.", type: QuestType.WEEKLY, category: QuestCategory.ROUTINE, rarity: Rarity.COMMON, xpReward: 80, coinsReward: 60, statRewards: { [StatType.ORGANIZATION]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "r12", title: "Ремонтник", description: "Починить или подклеить что-то дома.", type: QuestType.ONE_TIME, category: QuestCategory.ROUTINE, rarity: Rarity.RARE, xpReward: 120, coinsReward: 100, statRewards: { [StatType.ORGANIZATION]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '7д' },
  { id: "r13", title: "Цифровой Детокс", description: "Удалить 50 старых фото/скриншотов.", type: QuestType.ONE_TIME, category: QuestCategory.ROUTINE, rarity: Rarity.COMMON, xpReward: 60, coinsReward: 40, statRewards: { [StatType.ORGANIZATION]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "r14", title: "Зеленый Друг", description: "Полить цветы/пересадить растение.", type: QuestType.WEEKLY, category: QuestCategory.ROUTINE, rarity: Rarity.COMMON, xpReward: 50, coinsReward: 30, statRewards: { [StatType.ORGANIZATION]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "r15", title: "Бэкап", description: "Сделать резервную копию важных данных.", type: QuestType.MONTHLY, category: QuestCategory.ROUTINE, rarity: Rarity.RARE, xpReward: 200, coinsReward: 150, statRewards: { [StatType.ORGANIZATION]: 3 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },

  // --- FITNESS (Здоровье) 15 quests ---
  { id: "f1", title: "Марафон", description: "Пробежать 3км.", type: QuestType.WEEKLY, category: QuestCategory.FITNESS, rarity: Rarity.EPIC, xpReward: 500, coinsReward: 1000, statRewards: { [StatType.ENDURANCE]: 5 }, isCompleted: false, verificationRequired: 'check', deadline: '7д' },
  { id: "f2", title: "Силач", description: "Сделать 50 отжиманий за день.", type: QuestType.DAILY, category: QuestCategory.FITNESS, rarity: Rarity.COMMON, xpReward: 100, coinsReward: 100, statRewards: { [StatType.STRENGTH]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "f3", title: "Йог", description: "15 минут растяжки.", type: QuestType.DAILY, category: QuestCategory.FITNESS, rarity: Rarity.COMMON, xpReward: 70, coinsReward: 50, statRewards: { [StatType.ENDURANCE]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "f4", title: "Стальные Ноги", description: "100 приседаний.", type: QuestType.DAILY, category: QuestCategory.FITNESS, rarity: Rarity.RARE, xpReward: 150, coinsReward: 150, statRewards: { [StatType.STRENGTH]: 3 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "f5", title: "Водный Баланс", description: "Выпить 2 литра воды за день.", type: QuestType.DAILY, category: QuestCategory.FITNESS, rarity: Rarity.COMMON, xpReward: 50, coinsReward: 50, statRewards: { [StatType.ENDURANCE]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "f6", title: "Планка", description: "Простоять в планке 3 минуты (суммарно).", type: QuestType.DAILY, category: QuestCategory.FITNESS, rarity: Rarity.RARE, xpReward: 120, coinsReward: 100, statRewards: { [StatType.ENDURANCE]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "f7", title: "Пешая Прогулка", description: "Пройти 10,000 шагов.", type: QuestType.DAILY, category: QuestCategory.FITNESS, rarity: Rarity.COMMON, xpReward: 100, coinsReward: 80, statRewards: { [StatType.ENDURANCE]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "f8", title: "Отказ от Сахара", description: "День без сладкого.", type: QuestType.DAILY, category: QuestCategory.FITNESS, rarity: Rarity.RARE, xpReward: 150, coinsReward: 200, statRewards: { [StatType.ENDURANCE]: 3 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "f9", title: "Турникмен", description: "Подтянуться 5 раз.", type: QuestType.DAILY, category: QuestCategory.FITNESS, rarity: Rarity.RARE, xpReward: 150, coinsReward: 150, statRewards: { [StatType.STRENGTH]: 3 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "f10", title: "Сон Героя", description: "Лечь спать до 23:00.", type: QuestType.DAILY, category: QuestCategory.FITNESS, rarity: Rarity.COMMON, xpReward: 80, coinsReward: 50, statRewards: { [StatType.ENDURANCE]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "f11", title: "Берпи", description: "Сделать 20 берпи.", type: QuestType.DAILY, category: QuestCategory.FITNESS, rarity: Rarity.EPIC, xpReward: 200, coinsReward: 200, statRewards: { [StatType.ENDURANCE]: 3, [StatType.STRENGTH]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "f12", title: "Велопрогулка", description: "Кататься на велосипеде 30 минут.", type: QuestType.WEEKLY, category: QuestCategory.FITNESS, rarity: Rarity.RARE, xpReward: 200, coinsReward: 150, statRewards: { [StatType.ENDURANCE]: 3 }, isCompleted: false, verificationRequired: 'check', deadline: '7д' },
  { id: "f13", title: "Лестница", description: "Подняться на 10 этаж пешком.", type: QuestType.DAILY, category: QuestCategory.FITNESS, rarity: Rarity.COMMON, xpReward: 80, coinsReward: 60, statRewards: { [StatType.ENDURANCE]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "f14", title: "Холодный Душ", description: "Принять контрастный душ.", type: QuestType.DAILY, category: QuestCategory.FITNESS, rarity: Rarity.RARE, xpReward: 100, coinsReward: 100, statRewards: { [StatType.ENDURANCE]: 2, [StatType.STRENGTH]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "f15", title: "Тренировка с весом", description: "45 минут в зале или дома.", type: QuestType.WEEKLY, category: QuestCategory.FITNESS, rarity: Rarity.EPIC, xpReward: 300, coinsReward: 300, statRewards: { [StatType.STRENGTH]: 4 }, isCompleted: false, verificationRequired: 'check', deadline: '7д' },

  // --- MIND (Разум) 15 quests ---
  { id: "m1", title: "Книжный Червь", description: "Прочитать 30 страниц книги.", type: QuestType.DAILY, category: QuestCategory.MIND, rarity: Rarity.COMMON, xpReward: 80, coinsReward: 50, statRewards: { [StatType.INTELLECT]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "m2", title: "Полиглот", description: "Заниматься иностранным языком 30 минут.", type: QuestType.DAILY, category: QuestCategory.MIND, rarity: Rarity.RARE, xpReward: 120, coinsReward: 150, statRewards: { [StatType.INTELLECT]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "m3", title: "Стратег Жизни", description: "Поиграть в шахматы или логическую игру.", type: QuestType.DAILY, category: QuestCategory.MIND, rarity: Rarity.COMMON, xpReward: 60, coinsReward: 50, statRewards: { [StatType.INTELLECT]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "m4", title: "Мудрость Древних", description: "Посмотреть документальный фильм.", type: QuestType.ONE_TIME, category: QuestCategory.MIND, rarity: Rarity.COMMON, xpReward: 100, coinsReward: 50, statRewards: { [StatType.INTELLECT]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "m5", title: "Кодекс Мага", description: "Изучить новую статью по профессии.", type: QuestType.DAILY, category: QuestCategory.MIND, rarity: Rarity.RARE, xpReward: 150, coinsReward: 100, statRewards: { [StatType.INTELLECT]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "m6", title: "Медитация Пустоты", description: "10 минут без телефона в тишине.", type: QuestType.DAILY, category: QuestCategory.MIND, rarity: Rarity.COMMON, xpReward: 50, coinsReward: 30, statRewards: { [StatType.INTELLECT]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "m7", title: "Дневник Странника", description: "Записать 3 мысли или идеи за день.", type: QuestType.DAILY, category: QuestCategory.MIND, rarity: Rarity.COMMON, xpReward: 70, coinsReward: 50, statRewards: { [StatType.INTELLECT]: 1 }, isCompleted: false, verificationRequired: 'text', deadline: '24ч' },
  { id: "m8", title: "Словарный Запас", description: "Выучить 5 новых слов.", type: QuestType.DAILY, category: QuestCategory.MIND, rarity: Rarity.COMMON, xpReward: 60, coinsReward: 40, statRewards: { [StatType.INTELLECT]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "m9", title: "Финансовая Грамота", description: "Прочитать статью о финансах.", type: QuestType.ONE_TIME, category: QuestCategory.MIND, rarity: Rarity.RARE, xpReward: 100, coinsReward: 100, statRewards: { [StatType.INTELLECT]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "m10", title: "Курс Алхимии", description: "Пройти урок онлайн-курса.", type: QuestType.WEEKLY, category: QuestCategory.MIND, rarity: Rarity.EPIC, xpReward: 300, coinsReward: 300, statRewards: { [StatType.INTELLECT]: 4 }, isCompleted: false, verificationRequired: 'check', deadline: '7д' },
  { id: "m11", title: "Судоку Мастер", description: "Решить сложную судоку.", type: QuestType.DAILY, category: QuestCategory.MIND, rarity: Rarity.COMMON, xpReward: 50, coinsReward: 30, statRewards: { [StatType.INTELLECT]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "m12", title: "Анализ Дня", description: "Проанализировать, что прошло хорошо, а что нет.", type: QuestType.DAILY, category: QuestCategory.MIND, rarity: Rarity.COMMON, xpReward: 60, coinsReward: 40, statRewards: { [StatType.INTELLECT]: 1 }, isCompleted: false, verificationRequired: 'text', deadline: '24ч' },
  { id: "m13", title: "Слепая Печать", description: "Потренировать быструю печать 15 мин.", type: QuestType.DAILY, category: QuestCategory.MIND, rarity: Rarity.COMMON, xpReward: 70, coinsReward: 50, statRewards: { [StatType.INTELLECT]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "m14", title: "Научный Журнал", description: "Прочитать научную новость.", type: QuestType.DAILY, category: QuestCategory.MIND, rarity: Rarity.COMMON, xpReward: 50, coinsReward: 30, statRewards: { [StatType.INTELLECT]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "m15", title: "Лекция Архимага", description: "Посетить вебинар или лекцию.", type: QuestType.WEEKLY, category: QuestCategory.MIND, rarity: Rarity.EPIC, xpReward: 300, coinsReward: 200, statRewards: { [StatType.INTELLECT]: 3 }, isCompleted: false, verificationRequired: 'check', deadline: '7д' },

  // --- SOCIAL (Общество) 15 quests ---
  { id: "s1", title: "Дипломат", description: "Позвонить старому другу.", type: QuestType.WEEKLY, category: QuestCategory.SOCIAL, rarity: Rarity.RARE, xpReward: 150, coinsReward: 100, statRewards: { [StatType.CHARISMA]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '7д' },
  { id: "s2", title: "Добрый Самаритянин", description: "Помочь кому-то (открыть дверь, подсказать).", type: QuestType.DAILY, category: QuestCategory.SOCIAL, rarity: Rarity.COMMON, xpReward: 50, coinsReward: 50, statRewards: { [StatType.CHARISMA]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "s3", title: "Бард", description: "Рассказать интересную историю или шутку.", type: QuestType.DAILY, category: QuestCategory.SOCIAL, rarity: Rarity.COMMON, xpReward: 60, coinsReward: 40, statRewards: { [StatType.CHARISMA]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "s4", title: "Семейный Совет", description: "Провести вечер с семьей без телефонов.", type: QuestType.WEEKLY, category: QuestCategory.SOCIAL, rarity: Rarity.RARE, xpReward: 200, coinsReward: 100, statRewards: { [StatType.CHARISMA]: 3 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "s5", title: "Комплимент", description: "Сделать искренний комплимент коллеге.", type: QuestType.DAILY, category: QuestCategory.SOCIAL, rarity: Rarity.COMMON, xpReward: 50, coinsReward: 30, statRewards: { [StatType.CHARISMA]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "s6", title: "Нетворкинг", description: "Познакомиться с новым человеком.", type: QuestType.WEEKLY, category: QuestCategory.SOCIAL, rarity: Rarity.EPIC, xpReward: 300, coinsReward: 200, statRewards: { [StatType.CHARISMA]: 4 }, isCompleted: false, verificationRequired: 'check', deadline: '7д' },
  { id: "s7", title: "Волонтер", description: "Сделать доброе дело для сообщества/природы.", type: QuestType.ONE_TIME, category: QuestCategory.SOCIAL, rarity: Rarity.LEGENDARY, xpReward: 500, coinsReward: 500, statRewards: { [StatType.CHARISMA]: 5 }, isCompleted: false, verificationRequired: 'photo', deadline: '7д' },
  { id: "s8", title: "Оратор", description: "Выступить или высказать мнение на собрании.", type: QuestType.ONE_TIME, category: QuestCategory.SOCIAL, rarity: Rarity.RARE, xpReward: 150, coinsReward: 150, statRewards: { [StatType.CHARISMA]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "s9", title: "Благодарность", description: "Написать сообщение с благодарностью.", type: QuestType.DAILY, category: QuestCategory.SOCIAL, rarity: Rarity.COMMON, xpReward: 60, coinsReward: 40, statRewards: { [StatType.CHARISMA]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "s10", title: "Душа Компании", description: "Организовать встречу с друзьями.", type: QuestType.WEEKLY, category: QuestCategory.SOCIAL, rarity: Rarity.EPIC, xpReward: 250, coinsReward: 250, statRewards: { [StatType.CHARISMA]: 3 }, isCompleted: false, verificationRequired: 'check', deadline: '7д' },
  { id: "s11", title: "Активный Слушатель", description: "Выслушать кого-то, не перебивая.", type: QuestType.DAILY, category: QuestCategory.SOCIAL, rarity: Rarity.COMMON, xpReward: 50, coinsReward: 30, statRewards: { [StatType.CHARISMA]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "s12", title: "Подарок", description: "Сделать маленький подарок без повода.", type: QuestType.ONE_TIME, category: QuestCategory.SOCIAL, rarity: Rarity.RARE, xpReward: 100, coinsReward: 50, statRewards: { [StatType.CHARISMA]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "s13", title: "Улыбка", description: "Улыбнуться прохожему или кассиру.", type: QuestType.DAILY, category: QuestCategory.SOCIAL, rarity: Rarity.COMMON, xpReward: 30, coinsReward: 20, statRewards: { [StatType.CHARISMA]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "s14", title: "Командный Игрок", description: "Помочь коллеге с задачей.", type: QuestType.WEEKLY, category: QuestCategory.SOCIAL, rarity: Rarity.RARE, xpReward: 150, coinsReward: 100, statRewards: { [StatType.CHARISMA]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '7д' },
  { id: "s15", title: "Ментор", description: "Научить кого-то чему-то новому.", type: QuestType.ONE_TIME, category: QuestCategory.SOCIAL, rarity: Rarity.EPIC, xpReward: 250, coinsReward: 200, statRewards: { [StatType.CHARISMA]: 3 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },

  // --- CREATION (Творчество) 15 quests ---
  { id: "c1", title: "Творец", description: "Потратить 1 час на хобби.", type: QuestType.DAILY, category: QuestCategory.CREATION, rarity: Rarity.COMMON, xpReward: 100, coinsReward: 80, statRewards: { [StatType.CREATIVITY]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "c2", title: "Художник", description: "Нарисовать скетч за 15 минут.", type: QuestType.DAILY, category: QuestCategory.CREATION, rarity: Rarity.COMMON, xpReward: 60, coinsReward: 40, statRewards: { [StatType.CREATIVITY]: 1 }, isCompleted: false, verificationRequired: 'photo', deadline: '24ч' },
  { id: "c3", title: "Писатель", description: "Написать 500 слов (статья, дневник, книга).", type: QuestType.DAILY, category: QuestCategory.CREATION, rarity: Rarity.RARE, xpReward: 150, coinsReward: 100, statRewards: { [StatType.CREATIVITY]: 2 }, isCompleted: false, verificationRequired: 'text', deadline: '24ч' },
  { id: "c4", title: "Шеф-Повар", description: "Приготовить новое блюдо по рецепту.", type: QuestType.WEEKLY, category: QuestCategory.CREATION, rarity: Rarity.EPIC, xpReward: 250, coinsReward: 300, statRewards: { [StatType.CREATIVITY]: 3 }, isCompleted: false, verificationRequired: 'photo', deadline: '7д' },
  { id: "c5", title: "Фотограф", description: "Сделать красивое фото природы.", type: QuestType.DAILY, category: QuestCategory.CREATION, rarity: Rarity.COMMON, xpReward: 50, coinsReward: 30, statRewards: { [StatType.CREATIVITY]: 1 }, isCompleted: false, verificationRequired: 'photo', deadline: '24ч' },
  { id: "c6", title: "Мастерская", description: "Починить сломанную вещь.", type: QuestType.ONE_TIME, category: QuestCategory.CREATION, rarity: Rarity.RARE, xpReward: 200, coinsReward: 200, statRewards: { [StatType.CREATIVITY]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '7д' },
  { id: "c7", title: "Музыкант", description: "Поиграть на инструменте/попеть 20 мин.", type: QuestType.DAILY, category: QuestCategory.CREATION, rarity: Rarity.RARE, xpReward: 100, coinsReward: 80, statRewards: { [StatType.CREATIVITY]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "c8", title: "Идейный Вдохновитель", description: "Придумать 10 идей для проекта.", type: QuestType.ONE_TIME, category: QuestCategory.CREATION, rarity: Rarity.RARE, xpReward: 150, coinsReward: 100, statRewards: { [StatType.CREATIVITY]: 3 }, isCompleted: false, verificationRequired: 'text', deadline: '24ч' },
  { id: "c9", title: "Декор", description: "Украсить свое рабочее место.", type: QuestType.ONE_TIME, category: QuestCategory.CREATION, rarity: Rarity.COMMON, xpReward: 60, coinsReward: 40, statRewards: { [StatType.CREATIVITY]: 1 }, isCompleted: false, verificationRequired: 'photo', deadline: '24ч' },
  { id: "c10", title: "Код", description: "Написать/изучить кусок кода.", type: QuestType.DAILY, category: QuestCategory.CREATION, rarity: Rarity.RARE, xpReward: 150, coinsReward: 150, statRewards: { [StatType.CREATIVITY]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "c11", title: "Брейншторм", description: "Придумать решение рабочей проблемы.", type: QuestType.ONE_TIME, category: QuestCategory.CREATION, rarity: Rarity.RARE, xpReward: 100, coinsReward: 80, statRewards: { [StatType.CREATIVITY]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
  { id: "c12", title: "Поэзия", description: "Написать четверостишие.", type: QuestType.DAILY, category: QuestCategory.CREATION, rarity: Rarity.COMMON, xpReward: 50, coinsReward: 20, statRewards: { [StatType.CREATIVITY]: 1 }, isCompleted: false, verificationRequired: 'text', deadline: '24ч' },
  { id: "c13", title: "DIY", description: "Сделать что-то своими руками.", type: QuestType.WEEKLY, category: QuestCategory.CREATION, rarity: Rarity.EPIC, xpReward: 300, coinsReward: 200, statRewards: { [StatType.CREATIVITY]: 4 }, isCompleted: false, verificationRequired: 'photo', deadline: '7д' },
  { id: "c14", title: "Визуализация", description: "Создать мудборд или карту желаний.", type: QuestType.ONE_TIME, category: QuestCategory.CREATION, rarity: Rarity.RARE, xpReward: 150, coinsReward: 100, statRewards: { [StatType.CREATIVITY]: 2 }, isCompleted: false, verificationRequired: 'check', deadline: '7д' },
  { id: "c15", title: "Редактор", description: "Отредактировать старый текст или фото.", type: QuestType.DAILY, category: QuestCategory.CREATION, rarity: Rarity.COMMON, xpReward: 60, coinsReward: 40, statRewards: { [StatType.CREATIVITY]: 1 }, isCompleted: false, verificationRequired: 'check', deadline: '24ч' },
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