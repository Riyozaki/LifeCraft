import React, { useState } from 'react';
import { User, StatType, ItemType, Rarity } from '../types';
import { PATH_DESCRIPTIONS, CLASS_AVATARS } from '../constants';
import { Crown } from 'lucide-react';

interface OnboardingProps {
  onComplete: (user: User) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [path, setPath] = useState<keyof typeof PATH_DESCRIPTIONS>('Athlete');

  const handleFinish = () => {
    const baseStats = {
      [StatType.STRENGTH]: 5,
      [StatType.INTELLECT]: 5,
      [StatType.CHARISMA]: 5,
      [StatType.ENDURANCE]: 5,
      [StatType.CREATIVITY]: 5,
      [StatType.ORGANIZATION]: 5,
    };

    // Apply path bonus
    if (path === 'Athlete') { baseStats[StatType.STRENGTH] += 5; baseStats[StatType.ENDURANCE] += 5; }
    if (path === 'Scholar') { baseStats[StatType.INTELLECT] += 5; baseStats[StatType.ORGANIZATION] += 5; }
    if (path === 'Socialite') { baseStats[StatType.CHARISMA] += 5; baseStats[StatType.INTELLECT] += 5; }
    if (path === 'Creator') { baseStats[StatType.CREATIVITY] += 5; baseStats[StatType.STRENGTH] += 2; }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || 'Странник',
      level: 1,
      xp: 0,
      maxXp: 100,
      stats: baseStats,
      coins: 25, // Reduced from 100 to 25
      avatar: CLASS_AVATARS[path],
      title: "Новичок",
      path,
      energy: 100,
      maxEnergy: 100,
      hp: 100,
      maxHp: 100,
      mood: 100,
      activeQuests: [],
      completedHistory: {},
      habits: [
        { id: 'h1', title: 'Испить воды', streak: 0, completedToday: false, statReward: StatType.ENDURANCE },
        { id: 'h2', title: 'Чтение манускрипта', streak: 0, completedToday: false, statReward: StatType.INTELLECT }
      ],
      inventory: [
        { id: 'start_pot', name: 'Зелье Новичка', type: ItemType.POTION, rarity: Rarity.COMMON, icon: '🧪', price: 0, description: 'Первое бесплатно.', effect: { type: 'HEAL', value: 30 } }
      ],
      equipment: { weapon: null, helmet: null, chest: null, legs: null, boots: null },
      tutorialCompleted: false
    };

    onComplete(newUser);
  };

  return (
    <div className="min-h-screen bg-[#1a120b] bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] flex flex-col items-center justify-center p-6 text-[#efebe9]">
      <div className="w-full max-w-md bg-[#2d1b13] border-4 border-[#5d4037] p-8 rounded-lg shadow-2xl shadow-black/60 relative">
        <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-[#ffb74d]"></div>
        <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-[#ffb74d]"></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-[#ffb74d]"></div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-[#ffb74d]"></div>

        <h1 className="text-4xl font-serif font-bold text-center mb-2 text-[#ffb74d] drop-shadow-md">LifeCraft</h1>
        <p className="text-center text-[#a1887f] mb-8 font-serif italic">Начало твоей легенды</p>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-[#d7ccc8]">Имя Героя</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1a120b] border border-[#5d4037] rounded p-3 text-[#ffcc80] font-serif text-lg focus:ring-2 focus:ring-[#ffb74d] outline-none"
                placeholder="Как тебя зовут, путник?"
              />
            </div>
            
            <button onClick={() => setStep(2)} disabled={!name} className="w-full bg-[#4e342e] hover:bg-[#5d4037] text-[#ffcc80] py-3 rounded border border-[#8d6e63] font-bold disabled:opacity-50 uppercase tracking-widest transition-all">
              Далее
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
             <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-[#d7ccc8]">Выбери Предназначение</label>
             <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
               {(Object.keys(PATH_DESCRIPTIONS) as Array<keyof typeof PATH_DESCRIPTIONS>).map((p) => (
                 <div 
                  key={p} 
                  onClick={() => setPath(p)}
                  className={`p-3 rounded border-2 cursor-pointer transition-all flex items-center gap-3 relative overflow-hidden group ${path === p ? 'bg-[#3e2723] border-[#ffb74d]' : 'bg-[#1a120b] border-[#3e2723] opacity-80 hover:opacity-100'}`}
                 >
                   <div className="w-14 h-14 flex items-center justify-center text-4xl bg-[#1a120b] rounded border border-[#5d4037]">
                     {CLASS_AVATARS[p]}
                   </div>
                   <div className="flex-1 z-10">
                     <div className="font-bold text-[#ffcc80] text-lg font-serif">{PATH_DESCRIPTIONS[p].title}</div>
                     <div className="text-xs text-[#d7ccc8]">{PATH_DESCRIPTIONS[p].desc}</div>
                   </div>
                   {path === p && <div className="absolute right-2 top-2 text-[#ffb74d]"><Crown size={16}/></div>}
                 </div>
               ))}
             </div>
             <div className="flex gap-3 pt-4">
               <button onClick={() => setStep(1)} className="flex-1 bg-[#2d1b13] border border-[#5d4037] py-3 rounded font-bold hover:bg-[#3e2723]">Назад</button>
               <button onClick={handleFinish} className="flex-1 bg-gradient-to-b from-green-700 to-green-900 border border-green-600 text-white py-3 rounded font-bold shadow-lg hover:brightness-110">В Путь!</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};