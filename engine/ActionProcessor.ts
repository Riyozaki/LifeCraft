import { User, ItemType, StatType, Rarity, DamageType, DungeonArea, Item } from "../types";
import { GameAction } from "./types";
import { MONSTERS, ITEMS_POOL, MATERIAL_STYLES } from "../constants";

// Helper to calculate total stats
export const getTotalStat = (user: User, stat: StatType): number => {
  let val = user.stats[stat];
  Object.values(user.equipment).forEach((item) => {
    if (item?.statBonus?.[stat]) val += item.statBonus[stat]!;
  });
  return val;
};

export const getSpecialEffectValue = (user: User, type: string): number => {
  let total = 0;
  Object.values(user.equipment).forEach((item) => {
    item?.specialEffects?.forEach((effect) => {
      if (effect.type === type) total += effect.value;
    });
  });
  return total;
};

export class ActionProcessor {
  static process(state: User, action: GameAction): User {
    switch (action.type) {
      case 'TICK': {
        // Regen Energy / HP over time could go here
        // For now, simpler tick logic or cooldown management
        return state;
      }

      case 'START_DUNGEON': {
        const { area } = action.payload;
        // Logic to spawn initial enemy moved here
        return this.spawnEnemy(state, area, state.dungeonState?.floor || 1);
      }

      case 'DUNGEON_ATTACK': {
        return this.handleCombatRound(state);
      }

      case 'DUNGEON_FLEE': {
        // Reset dungeon state completely on flee
        return {
          ...state,
          dungeonState: undefined
        };
      }

      case 'DUNGEON_LEAVE': {
        if (state.dungeonState?.activeEnemy) return state; // Can't leave during combat without fleeing
        return { ...state, dungeonState: undefined };
      }

      case 'USE_ITEM': {
        const item = state.inventory.find(i => i.id === action.payload.itemId);
        if (!item) return state;

        let newState = { ...state };
        let consumed = false;

        if (item.effect?.type === 'HEAL' && newState.hp < newState.maxHp) {
            newState.hp = Math.min(newState.maxHp, newState.hp + item.effect.value);
            consumed = true;
        } else if (item.effect?.type === 'RESTORE_ENERGY' && newState.energy < newState.maxEnergy) {
            newState.energy = Math.min(newState.maxEnergy, newState.energy + item.effect.value);
            consumed = true;
        }

        if (consumed) {
            newState.inventory = newState.inventory.filter(i => i.id !== item.id);
        }
        return newState;
      }

      case 'EQUIP_ITEM': {
         const item = action.payload.item;
         let newInv = state.inventory.filter(i => i.id !== item.id);
         let newEquip = { ...state.equipment };

         const slotsMap: Record<string, keyof User['equipment']> = {
            [ItemType.WEAPON]: 'weapon',
            [ItemType.HELMET]: 'helmet',
            [ItemType.CHEST]: 'chest',
            [ItemType.LEGS]: 'legs',
            [ItemType.BOOTS]: 'boots',
            [ItemType.ACCESSORY]: 'accessory'
         };

         // @ts-ignore
         const slot = slotsMap[item.type];
         if (slot) {
             // @ts-ignore
             if (newEquip[slot]) newInv.push(newEquip[slot]);
             // @ts-ignore
             newEquip[slot] = item;
         }
         return { ...state, inventory: newInv, equipment: newEquip };
      }

      case 'BUY_ITEM': {
         const { item } = action.payload;
         if (state.coins < item.price) return state;
         return {
             ...state,
             coins: state.coins - item.price,
             inventory: [...state.inventory, { ...item, id: Math.random().toString(36).substr(2, 9) }]
         };
      }

      case 'SELL_ITEM': {
          const { item } = action.payload;
          return {
              ...state,
              coins: state.coins + Math.floor(item.price / 2),
              inventory: state.inventory.filter(i => i.id !== item.id)
          };
      }
      
      case 'CRAFT_ITEM': {
          const { result, cost, materials } = action.payload;
          if (state.coins < cost) return state;
          
          let currentInv = [...state.inventory];
          let possible = true;
          
          // Verify and consume materials
          for (const mat of materials) {
             const template = ITEMS_POOL.find(i => i.id === mat.itemId);
             if (!template) { possible = false; break; }
             
             let needed = mat.count;
             // Remove items matching name (since IDs are unique)
             currentInv = currentInv.filter(invItem => {
                 if (needed > 0 && invItem.name === template.name) {
                     needed--;
                     return false;
                 }
                 return true;
             });
             
             if (needed > 0) possible = false;
          }
          
          if (!possible) return state;

          return {
              ...state,
              coins: state.coins - cost,
              inventory: [...currentInv, { ...result, id: Math.random().toString(36).substr(2, 9) }]
          };
      }

      case 'COMPLETE_QUEST': {
          const quest = state.activeQuests.find(q => q.id === action.payload.questId);
          if (!quest) return state;

          const updatedStats = { ...state.stats };
          Object.entries(quest.statRewards).forEach(([key, val]) => { 
              if (val) updatedStats[key as StatType] += val; 
          });

          let newInventory = [...state.inventory];
          if (quest.itemRewardId) {
             const rewardItem = ITEMS_POOL.find(i => i.id === quest.itemRewardId);
             if (rewardItem) newInventory.push({ ...rewardItem, id: Math.random().toString() });
          }

          const goldReward = quest.coinsReward || (quest.rarity === Rarity.LEGENDARY ? 100 : 25);
          
          // Add to history
          const newHistory = { ...state.completedHistory, [quest.id]: Date.now() };

          // XP & Level Up Logic
          let newState = {
              ...state,
              xp: state.xp + quest.xpReward,
              coins: state.coins + goldReward,
              stats: updatedStats,
              inventory: newInventory,
              energy: Math.min(state.maxEnergy, state.energy + 15),
              activeQuests: state.activeQuests.filter(q => q.id !== quest.id),
              completedHistory: newHistory
          };
          
          return this.checkLevelUp(newState);
      }

      case 'ACCEPT_QUEST': {
          if (state.activeQuests.length >= 5) return state;
          return { ...state, activeQuests: [...state.activeQuests, action.payload.quest] };
      }

      default:
        return state;
    }
  }

  private static checkLevelUp(state: User): User {
      let u = { ...state };
      while (u.xp >= u.maxXp) {
         u.xp -= u.maxXp;
         u.level += 1;
         u.maxXp = Math.floor(u.maxXp * 1.5);
         u.maxHp += 10;
         u.hp = u.maxHp; 
         u.energy = u.maxEnergy;
      }
      return u;
  }

  // --- COMBAT ENGINE ---

  private static spawnEnemy(state: User, area: DungeonArea, floor: number): User {
    const isBossFloor = floor % 5 === 0;
    
    // Rarity Weights logic similar to original, simplified
    const roll = Math.random() * 100;
    let targetRarity = Rarity.COMMON;
    
    if (isBossFloor) {
        targetRarity = floor >= 25 ? Rarity.LEGENDARY : (floor >= 15 ? Rarity.EPIC : Rarity.RARE);
    } else {
        if (floor > 10 && roll < 20) targetRarity = Rarity.RARE;
        if (floor > 20 && roll < 10) targetRarity = Rarity.EPIC;
    }

    let availableMobs = MONSTERS.filter(m => m.area === area && (isBossFloor ? m.isBoss : !m.isBoss) && m.rarity === targetRarity);
    if (availableMobs.length === 0) availableMobs = MONSTERS.filter(m => m.area === area && (isBossFloor ? m.isBoss : !m.isBoss));
    if (availableMobs.length === 0) availableMobs = MONSTERS; // Fallback

    const template = availableMobs[Math.floor(Math.random() * availableMobs.length)];

    // Scaling
    const scale = Math.pow(1.02, floor); // Smoother scaling
    const lvlMod = 1 + (state.level * 0.05);

    const maxHp = Math.floor(template.baseHp * scale * lvlMod);
    const dmg = Math.floor(template.baseDmg * scale * lvlMod);

    return {
        ...state,
        dungeonState: {
            area,
            floor,
            hp: state.hp,
            activeEnemy: {
                ...template,
                maxHp,
                dmg,
                currentHp: maxHp,
                poisonStacks: 0,
                isFrozen: false
            },
            logs: [`Вы спускаетесь на этаж ${floor}. Впереди ${template.name}!`]
        }
    };
  }

  private static handleCombatRound(state: User): User {
      if (!state.dungeonState?.activeEnemy) return state;

      const enemy = state.dungeonState.activeEnemy;
      const logs = [...(state.dungeonState.logs || [])];
      let userHp = state.hp;
      let enemyHp = enemy.currentHp;

      // 1. PLAYER ATTACK
      const str = getTotalStat(state, StatType.STRENGTH);
      const weapon = state.equipment.weapon;
      const weaponDmg = weapon?.baseDamage || 2;
      const scaler = getTotalStat(state, weapon?.scalingStat || StatType.STRENGTH);
      
      let dmg = Math.floor(weaponDmg * (1 + scaler / 15) + (str / 2));
      
      // Crits
      const critChance = (getTotalStat(state, StatType.CHARISMA) * 0.01) + (getSpecialEffectValue(state, 'CRIT_CHANCE') * 0.01);
      const isCrit = Math.random() < critChance;
      if (isCrit) dmg = Math.floor(dmg * 2);

      // Lifesteal
      const lifesteal = getSpecialEffectValue(state, 'LIFESTEAL');
      if (lifesteal > 0) {
          const heal = Math.floor(dmg * (lifesteal / 100));
          userHp = Math.min(state.maxHp, userHp + heal);
      }

      enemyHp -= dmg;
      logs.push(`Вы нанесли ${dmg} урона ${isCrit ? '(КРИТ!)' : ''}`);

      // Check Win
      if (enemyHp <= 0) {
          return this.resolveVictory(state, logs);
      }

      // 2. ENEMY TURN
      // Poison
      if (enemy.poisonStacks && enemy.poisonStacks > 0) {
          enemyHp -= enemy.poisonStacks;
          logs.push(`Яд наносит ${enemy.poisonStacks} урона врагу.`);
          if (enemyHp <= 0) return this.resolveVictory(state, logs);
      }

      // Enemy Attack
      let incomingDmg = enemy.dmg;
      
      // Dodge
      const dodgeChance = getSpecialEffectValue(state, 'DODGE');
      if (Math.random() * 100 < dodgeChance) {
          logs.push(`Вы уклонились от атаки!`);
          incomingDmg = 0;
      } else {
          // Defense
          const def = (Object.values(state.equipment) as (Item | null)[]).reduce((sum, i) => sum + (i?.defense || 0), 0);
          incomingDmg = Math.max(1, incomingDmg - Math.floor(def * 0.5));
          
          logs.push(`${enemy.name} наносит ${incomingDmg} урона.`);
          userHp -= incomingDmg;
      }

      // Check Loss
      if (userHp <= 0) {
          return {
              ...state,
              hp: 0,
              dungeonState: {
                  ...state.dungeonState,
                  hp: 0,
                  activeEnemy: { ...enemy, currentHp: enemyHp },
                  logs: [...logs, "ВЫ ПОГИБЛИ."]
              }
          };
      }

      return {
          ...state,
          hp: userHp,
          dungeonState: {
              ...state.dungeonState,
              hp: userHp,
              activeEnemy: { ...enemy, currentHp: enemyHp },
              logs: logs.slice(-6) // Keep log size manageable
          }
      };
  }

  private static resolveVictory(state: User, logs: string[]): User {
      const enemy = state.dungeonState!.activeEnemy!;
      const floor = state.dungeonState!.floor;
      
      // Rewards
      const baseGold = 10 * floor;
      const baseXp = 20 * floor;
      const rarityMult = enemy.rarity === Rarity.LEGENDARY ? 10 : (enemy.rarity === Rarity.EPIC ? 5 : 1);
      
      const gold = Math.floor(baseGold * rarityMult);
      const xp = Math.floor(baseXp * rarityMult);

      logs.push(`Победа! Получено ${gold} G и ${xp} XP.`);

      // Loot Drop Logic (Simplified)
      let newInv = [...state.inventory];
      if (Math.random() < 0.3) {
           const drop = ITEMS_POOL[Math.floor(Math.random() * ITEMS_POOL.length)];
           newInv.push({ ...drop, id: Math.random().toString() });
           logs.push(`Найдено: ${drop.name}`);
      }

      // Prepare next floor immediately (or waiting state, but here we just set activeEnemy to null effectively for the UI to show 'Loot')
      // Actually, let's auto-progress or wait. To fit the previous UI flow, we need a "LOOT" state. 
      // In this Engine, we will just clear activeEnemy. The UI will see !activeEnemy and show "Room Cleared".
      
      const newState = {
          ...state,
          coins: state.coins + gold,
          xp: state.xp + xp,
          inventory: newInv,
          dungeonState: {
              ...state.dungeonState!,
              activeEnemy: undefined, // Cleared
              logs: logs.slice(-6)
          }
      };

      return this.checkLevelUp(newState);
  }
}
