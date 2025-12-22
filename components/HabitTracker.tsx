import React from 'react';
import { Habit, StatType } from '../types';
import { Flame, Check, RefreshCw } from 'lucide-react';

interface HabitTrackerProps {
  habits: Habit[];
  onTick: (id: string) => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onTick }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-slate-400 text-sm font-bold uppercase flex items-center gap-2">
        <RefreshCw size={14} /> Ежедневные привычки
      </h3>
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
        {habits.map(habit => (
          <div key={habit.id} className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">{habit.title}</div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Flame size={12} className={habit.streak > 0 ? "text-orange-500" : "text-slate-600"} />
                Серия: {habit.streak} дней
              </div>
            </div>
            
            <button
              onClick={() => onTick(habit.id)}
              disabled={habit.completedToday}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                habit.completedToday 
                  ? 'bg-green-500 text-white' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
              }`}
            >
              <Check size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};