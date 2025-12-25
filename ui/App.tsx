import React, { useState, useSyncExternalStore } from 'react';
import { gameStore } from '../store/gameStore';
import { Dungeon } from './Dungeon';
import { Inventory } from '../components/Inventory';
import { Shop } from '../components/Shop';
import { Onboarding } from '../components/Onboarding';
import { QuestCard } from '../components/QuestCard';
import { StatRadar } from '../components/StatRadar';
import { HabitTracker } from '../components/HabitTracker';
import { Blacksmith } from '../components/Blacksmith';
import { Swords, ShoppingBag, Backpack, Users, Scroll, Hammer, Trophy, HelpCircle, LogOut } from 'lucide-react';
import { PATH_DESCRIPTIONS } from '../constants';
import { Tutorial } from '../components/Tutorial';
import { DungeonArea } from '../types';

export default function App() {
  const user = useSyncExternalStore(gameStore.subscribe, gameStore.getState);
  const [tab, setTab] = useState('quests');
  const [showTutorial, setShowTutorial] = useState(false);

  if (!user) {
      return <Onboarding onComplete={(u) => gameStore.dispatch({ type: 'CREATE_USER', payload: { name: u.name, path: u.path } })} />;
  }

  if (user.dungeonState) {
      return <Dungeon />;
  }

  const totalStats = (() => {
    const total = { ...user.stats };
    Object.values(user.equipment).forEach(item => {
        if (item?.statBonus) Object.entries(item.statBonus).forEach(([k, v]) => { 
            // @ts-ignore
            total[k] = (total[k] || 0) + v; 
        });
    });
    return total;
  })();

  return (
    <div className="flex flex-col h-screen bg-[#1a120b] text-[#efebe9] font-sans overflow-hidden">
        {/* HEADER */}
        <header className="bg-[#2d1b13] p-4 border-b-4 border-[#3e2723] shadow-lg sticky top-0 z-30">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black/40 rounded border border-[#ffb74d] flex items-center justify-center text-2xl">
                        {user.avatar}
                    </div>
                    <div>
                        <h1 className="font-bold text-[#ffcc80] leading-none">{user.name}</h1>
                        <div className="text-xs text-[#a1887f] font-bold mt-1">Lvl {user.level} • {PATH_DESCRIPTIONS[user.path]?.title || user.path}</div>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                     <div className="flex items-center gap-1 text-[#ffca28] font-bold text-sm bg-black/30 px-2 py-1 rounded border border-[#ff6f00]/30">
                        <Trophy size={14} /> {user.coins} G
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setShowTutorial(true)} className="text-[#8d6e63] hover:text-[#ffb74d] p-1"><HelpCircle size={16}/></button>
                        <button onClick={() => { if(confirm("Сбросить прогресс?")) gameStore.dispatch({ type: 'RESET_GAME' }); }} className="text-[#8d6e63] hover:text-red-400 p-1"><LogOut size={16} /></button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[9px] font-bold uppercase text-[#a1887f]">
                <div className="flex flex-col gap-1">
                    <div className="w-full bg-[#1a120b] h-1.5 rounded-full overflow-hidden border border-[#3e2723]"><div className="bg-gradient-to-r from-red-600 to-red-400 h-full" style={{ width: `${(user.hp / user.maxHp) * 100}%` }}></div></div>
                    <div className="flex justify-between"><span>HP</span><span>{user.hp}/{user.maxHp}</span></div>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="w-full bg-[#1a120b] h-1.5 rounded-full overflow-hidden border border-[#3e2723]"><div className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full" style={{ width: `${(user.energy / user.maxEnergy) * 100}%` }}></div></div>
                    <div className="flex justify-between"><span>ЭН</span><span>{user.energy}/{user.maxEnergy}</span></div>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="w-full bg-[#1a120b] h-1.5 rounded-full overflow-hidden border border-[#3e2723]"><div className="bg-gradient-to-r from-purple-600 to-purple-400 h-full" style={{ width: `${(user.xp / user.maxXp) * 100}%` }}></div></div>
                    <div className="flex justify-between"><span>XP</span><span>{user.xp}/{user.maxXp}</span></div>
                </div>
            </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full pb-24 relative z-0 custom-scrollbar">
            {tab === 'quests' && (
                <div className="space-y-6">
                    <HabitTracker habits={user.habits} onTick={(id) => { /* Logic is handled inside HabitTracker or we need an action */ }} />
                    <h2 className="font-serif font-bold text-xl border-b border-[#3e2723] pb-2 text-[#efebe9]">Текущие задания</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {user.activeQuests.map(q => (
                            <QuestCard 
                                key={q.id} 
                                quest={q} 
                                onAction={() => gameStore.dispatch({ type: 'COMPLETE_QUEST', payload: { questId: q.id } })} 
                                actionLabel="Сдать" 
                            />
                        ))}
                        {user.activeQuests.length === 0 && <div className="text-slate-500 italic p-4 text-center border border-dashed border-[#3e2723] rounded">Журнал заданий пуст.</div>}
                    </div>
                </div>
            )}
            
            {tab === 'inventory' && (
                <Inventory 
                    user={user} 
                    onEquip={(item) => gameStore.dispatch({ type: 'EQUIP_ITEM', payload: { item } })}
                    onUse={(item) => gameStore.dispatch({ type: 'USE_ITEM', payload: { itemId: item.id } })}
                    onSell={(item) => gameStore.dispatch({ type: 'SELL_ITEM', payload: { item } })}
                    onDelete={() => {}} // Deletion usually sells for 0 or drops, simplifying to sell for now
                />
            )}

            {tab === 'shop' && (
                <Shop user={user} onBuy={(item) => gameStore.dispatch({ type: 'BUY_ITEM', payload: { item } })} />
            )}
            
            {tab === 'blacksmith' && (
                <Blacksmith user={user} onCraft={(result, cost, materials) => gameStore.dispatch({ type: 'CRAFT_ITEM', payload: { result, cost, materials } })} />
            )}
            
            {tab === 'profile' && (
                 <div className="space-y-4">
                    <StatRadar stats={totalStats} />
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(totalStats).map(([k,v]) => (
                            <div key={k} className="flex justify-between bg-[#2d1b13] p-2 rounded border border-[#3e2723]">
                                <span className="text-[#a1887f] uppercase text-xs font-bold">{k}</span>
                                <span className="font-bold text-[#ffcc80]">{v}</span>
                            </div>
                        ))}
                    </div>
                 </div>
            )}
        </main>

        {/* BOTTOM NAV */}
        <nav className="fixed bottom-0 w-full bg-[#2d1b13] border-t-4 border-[#3e2723] p-2 flex justify-around z-20 shadow-2xl overflow-x-auto">
            <div className="flex justify-between w-full max-w-lg mx-auto min-w-[320px]">
                <button onClick={() => setTab('quests')} className={`flex flex-col items-center p-2 rounded transition-colors ${tab==='quests' ? 'text-[#ffb74d] bg-black/20' : 'text-[#8d6e63]'}`}><Scroll size={20}/><span className="text-[9px] font-bold mt-1">Квесты</span></button>
                <button onClick={() => gameStore.dispatch({ type: 'START_DUNGEON', payload: { area: DungeonArea.RUINS } })} className="flex flex-col items-center p-2 rounded text-red-500 bg-red-900/10 border border-red-900/30 hover:bg-red-900/20"><Swords size={20}/><span className="text-[9px] font-bold mt-1">В Бой</span></button>
                <button onClick={() => setTab('inventory')} className={`flex flex-col items-center p-2 rounded transition-colors ${tab==='inventory' ? 'text-[#ffb74d] bg-black/20' : 'text-[#8d6e63]'}`}><Backpack size={20}/><span className="text-[9px] font-bold mt-1">Сумка</span></button>
                <button onClick={() => setTab('shop')} className={`flex flex-col items-center p-2 rounded transition-colors ${tab==='shop' ? 'text-[#ffb74d] bg-black/20' : 'text-[#8d6e63]'}`}><ShoppingBag size={20}/><span className="text-[9px] font-bold mt-1">Лавка</span></button>
                <button onClick={() => setTab('blacksmith')} className={`flex flex-col items-center p-2 rounded transition-colors ${tab==='blacksmith' ? 'text-[#ffb74d] bg-black/20' : 'text-[#8d6e63]'}`}><Hammer size={20}/><span className="text-[9px] font-bold mt-1">Кузня</span></button>
                <button onClick={() => setTab('profile')} className={`flex flex-col items-center p-2 rounded transition-colors ${tab==='profile' ? 'text-[#ffb74d] bg-black/20' : 'text-[#8d6e63]'}`}><Users size={20}/><span className="text-[9px] font-bold mt-1">Герой</span></button>
            </div>
        </nav>
        
        {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
    </div>
  );
}
