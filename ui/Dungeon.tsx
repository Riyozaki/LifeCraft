import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { gameStore } from '../store/gameStore';
import { DungeonArea, Item } from '../types';
import { Sword, Heart, LogOut, Footprints, Zap, Shield, Gift, ChevronUp, Skull } from 'lucide-react';
import { MATERIAL_STYLES } from '../constants';

export const Dungeon: React.FC = () => {
  const user = useSyncExternalStore(gameStore.subscribe, gameStore.getState);
  const logBoxRef = useRef<HTMLDivElement>(null);
  const [animation, setAnimation] = useState('');

  useEffect(() => {
    if (logBoxRef.current) logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
  }, [user?.dungeonState?.logs]);

  if (!user) return null;

  const { dungeonState } = user;
  
  // SELECT AREA STATE
  if (!dungeonState) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-[#1a120b]">
        <h2 className="text-3xl font-serif text-[#ffb74d] mb-8">Вылазка</h2>
        <div className="grid gap-4 w-full max-w-md">
          <button 
            onClick={() => gameStore.dispatch({ type: 'START_DUNGEON', payload: { area: DungeonArea.RUINS } })}
            className="p-6 bg-[#2d1b13] border-4 border-[#5d4037] hover:border-[#ffb74d] rounded-lg"
          >
            <div className="text-4xl mb-2">🏰</div>
            <h3 className="text-xl font-bold text-[#d7ccc8]">{DungeonArea.RUINS}</h3>
          </button>
          
          <button 
            onClick={() => gameStore.dispatch({ type: 'START_DUNGEON', payload: { area: DungeonArea.SUNKEN_CITY } })}
            className="p-6 bg-[#002b36] border-4 border-[#004d40] hover:border-[#42a5f5] rounded-lg"
          >
            <div className="text-4xl mb-2">🌊</div>
            <h3 className="text-xl font-bold text-[#b2dfdb]">{DungeonArea.SUNKEN_CITY}</h3>
          </button>
        </div>
      </div>
    );
  }

  const { activeEnemy, floor, logs, area, hp } = dungeonState;
  const isDead = hp <= 0;

  const handleAttack = () => {
      setAnimation('animate-slash');
      gameStore.dispatch({ type: 'DUNGEON_ATTACK' });
      setTimeout(() => setAnimation(''), 300);
  };

  // COMBAT / LOOT VIEW
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* HEADER */}
      <div className="p-3 flex justify-between items-center bg-[#2d1b13] border-b border-[#3e2723]">
         <div className="flex items-center gap-2 text-red-100">
            <Heart size={16} fill="currentColor"/> <span className="font-bold">{hp}/{user.maxHp}</span>
         </div>
         <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase text-[#a1887f] tracking-widest">{area}</span>
            <div className="text-[#ffb74d] font-bold flex items-center gap-1">Этаж {floor} <ChevronUp size={12}/></div>
         </div>
         <button onClick={() => gameStore.dispatch({ type: 'DUNGEON_FLEE' })} className="p-2 bg-black/40 rounded border border-red-900 text-red-400">
            <Footprints size={16}/>
         </button>
      </div>

      {/* MAIN VIEW */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]">
        
        {isDead && (
            <div className="text-center animate-fadeIn">
                <Skull size={64} className="mx-auto text-red-600 mb-4"/>
                <h2 className="text-3xl font-bold text-red-500 mb-4">ВЫ ПОГИБЛИ</h2>
                <button onClick={() => gameStore.dispatch({ type: 'DUNGEON_LEAVE' })} className="px-6 py-3 bg-red-900 text-white rounded font-bold">Покинуть тело</button>
            </div>
        )}

        {!isDead && !activeEnemy && (
            <div className="text-center animate-fadeIn bg-black/60 p-8 rounded-xl border border-[#ffb74d]">
                <Gift size={48} className="mx-auto text-[#ffb74d] mb-4"/>
                <h2 className="text-2xl font-bold text-white mb-2">Комната зачищена</h2>
                <p className="text-slate-400 mb-6">Отдохните перед следующим боем.</p>
                <button onClick={() => gameStore.dispatch({ type: 'START_DUNGEON', payload: { area } })} className="px-6 py-3 bg-green-700 hover:bg-green-600 text-white font-bold rounded flex items-center gap-2 mx-auto">
                    <Zap size={18}/> Дальше
                </button>
            </div>
        )}

        {!isDead && activeEnemy && (
            <div className={`w-full max-w-xs flex flex-col items-center ${animation}`}>
                <div className="text-8xl mb-6 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)] cursor-pointer active:scale-95 transition-transform" onClick={handleAttack}>
                    {activeEnemy.icon}
                </div>
                
                <div className={`w-full bg-[#1a120b] border-2 p-4 rounded-lg shadow-xl ${MATERIAL_STYLES[activeEnemy.rarity]?.border || 'border-slate-600'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className={`font-bold text-lg ${MATERIAL_STYLES[activeEnemy.rarity]?.text}`}>{activeEnemy.name}</span>
                        <span className="text-[10px] uppercase font-bold bg-white/10 px-2 py-0.5 rounded">{activeEnemy.rarity}</span>
                    </div>
                    
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${(activeEnemy.currentHp / activeEnemy.maxHp) * 100}%` }}></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-slate-400">
                         <span>HP: {activeEnemy.currentHp}/{activeEnemy.maxHp}</span>
                         <span>DMG: {activeEnemy.dmg}</span>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* LOGS & CONTROLS */}
      <div className="h-1/3 min-h-[160px] bg-[#1a120b] border-t-4 border-[#3e2723] flex flex-col">
         <div ref={logBoxRef} className="flex-1 p-3 overflow-y-auto font-mono text-xs text-[#d7ccc8] space-y-1">
            {logs.map((l, i) => <div key={i} className="opacity-80 border-l-2 border-[#5d4037] pl-2">{l}</div>)}
         </div>
         
         {!isDead && activeEnemy && (
             <div className="p-3 bg-[#2d1b13] border-t border-[#3e2723]">
                <button 
                  onClick={handleAttack} 
                  className="w-full py-4 bg-red-900 hover:bg-red-800 border-b-4 border-red-950 text-white font-bold text-lg rounded uppercase tracking-widest active:border-b-0 active:translate-y-1 transition-all flex justify-center gap-2 items-center"
                >
                   <Sword size={24}/> Атака
                </button>
             </div>
         )}
      </div>
    </div>
  );
};
