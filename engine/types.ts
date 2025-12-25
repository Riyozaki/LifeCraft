import { Item, Monster, DungeonArea, Quest } from "../types";

export type GameAction =
  | { type: 'TICK'; payload: { delta: number } }
  | { type: 'START_DUNGEON'; payload: { area: DungeonArea } }
  | { type: 'DUNGEON_ATTACK' }
  | { type: 'DUNGEON_FLEE' }
  | { type: 'DUNGEON_LEAVE' }
  | { type: 'USE_ITEM'; payload: { itemId: string } }
  | { type: 'EQUIP_ITEM'; payload: { item: Item } }
  | { type: 'BUY_ITEM'; payload: { item: Item } }
  | { type: 'SELL_ITEM'; payload: { item: Item } }
  | { type: 'CRAFT_ITEM'; payload: { result: Item; cost: number; materials: { itemId: string; count: number }[] } }
  | { type: 'COMPLETE_QUEST'; payload: { questId: string } }
  | { type: 'ACCEPT_QUEST'; payload: { quest: Quest } }
  | { type: 'TUTORIAL_COMPLETE' }
  | { type: 'CREATE_USER'; payload: { name: string; path: string } }
  | { type: 'RESET_GAME' };
