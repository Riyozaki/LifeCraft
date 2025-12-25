import { User } from "../types";
import { GameAction } from "../engine/types";
import { ActionProcessor } from "../engine/ActionProcessor";
import { loadUser, saveUser } from "../services/storage";

class GameStore {
  private state: User | null = null;
  private listeners: Set<() => void> = new Set();
  private tickInterval: number | null = null;

  constructor() {
    this.state = loadUser();
    this.startLoop();
  }

  // Changed to arrow function to bind 'this'
  getState = () => {
    return this.state;
  }

  dispatch = (action: GameAction) => {
    if (!this.state && action.type !== 'CREATE_USER' && action.type !== 'RESET_GAME') return;

    if (action.type === 'RESET_GAME') {
        this.state = null;
        saveUser(null as any); // Clear storage
        this.notify();
        return;
    }

    if (action.type === 'CREATE_USER') {
        this.state = this.createInitialUser(action.payload.name, action.payload.path);
        saveUser(this.state);
        this.notify();
        return;
    }

    if (this.state) {
        const newState = ActionProcessor.process(this.state, action);
        if (newState !== this.state) {
            this.state = newState;
            saveUser(this.state);
            this.notify();
        }
    }
  };

  // Changed to arrow function to bind 'this'
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  private startLoop() {
    if (typeof window === 'undefined') return;
    this.tickInterval = window.setInterval(() => {
        this.dispatch({ type: 'TICK', payload: { delta: 1000 } });
    }, 1000);
  }

  private createInitialUser(name: string, path: string): User {
      return {
          id: 'user_' + Date.now(),
          name,
          level: 1,
          xp: 0,
          maxXp: 100,
          stats: { 'Сила': 5, 'Интеллект': 5, 'Харизма': 5, 'Выносливость': 5, 'Творчество': 5, 'Дисциплина': 5 },
          coins: 50,
          avatar: '👤',
          title: 'Новичок',
          path: path as any,
          energy: 100,
          maxEnergy: 100,
          hp: 100,
          maxHp: 100,
          mood: 100,
          activeQuests: [],
          completedHistory: {},
          habits: [],
          inventory: [],
          equipment: { weapon: null, helmet: null, chest: null, legs: null, boots: null },
          tutorialCompleted: false
      };
  }
}

export const gameStore = new GameStore();
