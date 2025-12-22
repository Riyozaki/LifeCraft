import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { QUEST_POOL, MOCK_FEED, MOCK_LEADERBOARD, PATH_DESCRIPTIONS, ITEMS_POOL } from './constants';
import { User, Quest, StatType, QuestType, SocialEvent, Habit, Rarity, QuestCategory, Item, ItemType } from './types';
import { QuestCard } from './components/QuestCard';
import { StatRadar } from './components/StatRadar';
import { Onboarding } from './components/Onboarding';
import { HabitTracker } from './components/HabitTracker';
import { Shop } from './components/Shop';
import { Inventory } from './components/Inventory';
import { Dungeon } from './components/Dungeon';
import { Tutorial } from './components/Tutorial';
import { generateAIQuest, verifyQuestSubmission } from './services/geminiService';
import { saveUser, loadUser, clearUser } from './services/storage';
import { 
  User as UserIcon, 
  Map as MapIcon, 
  Users, 
  Sparkles, 
  X, 
  CheckCircle2, 
  Loader2,
  Trophy,
  Swords,
  Heart,
  Battery,
  Smile,
  LogOut,
  Scroll,
  ShoppingBag,
  Backpack,
  Skull,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'quests' | 'board' | 'social' | 'shop' | 'inventory' | 'dungeon'>('quests');
  const [user, setUser] = useState<User | null>(null);
  const [feed, setFeed] = useState<SocialEvent[]>(MOCK_FEED);
  
  const [availableQuests, setAvailableQuests] = useState<Quest[]>([]);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({ [QuestCategory.FITNESS]: true });
  
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null); 
  const [verificationText, setVerificationText] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  useEffect(() => {
    const savedUser = loadUser();
    if (savedUser) setUser(savedUser);
  }, []);

  useEffect(() => {
    if (user) saveUser(user);
  }, [user]);

  // Feed Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const actions = ["сразил Гоблина", "купил новый меч", "изучил заклинание", "выполнил задание 'Медитация'", "отправился в подземелье", "нашел редкий лут"];
      const names = ["Эльф_Лучник", "Гном_Торговец", "Маг_Василий", "Воин_Света", "Тень_Ниндзя"];
      const newEvent: SocialEvent = {
        id: Math.random().toString(),
        user: names[Math.floor(Math.random() * names.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        timestamp: "только что",
        likes: 0,
        avatar: "👤",
        rarity: Rarity.COMMON
      };
      setFeed(prev => [newEvent, ...prev].slice(0, 10));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Filter Quests
  useEffect(() => {
    if (user) {
      const currentIds = user.activeQuests.map(q => q.id);
      // Show all quests that are not active. Remove class filter to allow all categories
      const filtered = QUEST_POOL.filter(q => !currentIds.includes(q.id));
      setAvailableQuests(filtered);
    }
  }, [user?.activeQuests]);

  const handleOnboardingComplete = (newUser: User) => setUser(newUser);
  const handleTutorialClose = () => user && setUser({ ...user, tutorialCompleted: true });

  const handleLevelUp = (currentUser: User) => {
    if (currentUser.xp >= currentUser.maxXp) {
      const remainingXp = currentUser.xp - currentUser.maxXp;
      alert(`🎉 УРОВЕНЬ ПОВЫШЕН! Теперь вы уровень ${currentUser.level + 1}!`);
      return {
        ...currentUser,
        level: currentUser.level + 1,
        xp: remainingXp,
        maxXp: Math.floor(currentUser.maxXp * 1.5),
        maxHp: currentUser.maxHp + 10,
        hp: currentUser.maxHp + 10,
        title: currentUser.level + 1 === 10 ? 'Ветеран' : currentUser.title,
        mood: 100,
        energy: currentUser.maxEnergy
      };
    }
    return currentUser;
  };

  const acceptQuest = (quest: Quest) => {
    if (!user) return;
    if (user.activeQuests.length >= 5) {
      alert("Журнал заданий полон!");
      return;
    }
    setUser({ ...user, activeQuests: [...user.activeQuests, quest] });
    setAvailableQuests(prev => prev.filter(q => q.id !== quest.id));
    setActiveTab('quests'); 
  };

  const completeQuest = async () => {
    if (!activeQuest || !user) return;

    if (activeQuest.verificationRequired === 'text' && verificationText.length > 5) {
      setIsVerifying(true);
      const result = await verifyQuestSubmission(activeQuest.title, verificationText);
      setIsVerifying(false);
      if (!result.valid) {
        alert(result.feedback);
        return;
      }
    }

    const updatedStats = { ...user.stats };
    Object.entries(activeQuest.statRewards).forEach(([key, val]) => {
      if (val) updatedStats[key as StatType] += val;
    });

    // Handle Item Reward
    let newInventory = [...user.inventory];
    if (activeQuest.itemRewardId) {
       const rewardItemTemplate = ITEMS_POOL.find(i => i.id === activeQuest.itemRewardId);
       if (rewardItemTemplate) {
         newInventory.push({ ...rewardItemTemplate, id: Math.random().toString() });
         alert(`Вы получили предмет: ${rewardItemTemplate.name}!`);
       }
    }

    let updatedUser = {
      ...user,
      xp: user.xp + activeQuest.xpReward,
      stats: updatedStats,
      coins: user.coins + (activeQuest.rarity === Rarity.LEGENDARY ? 100 : activeQuest.rarity === Rarity.EPIC ? 50 : 25),
      energy: Math.min(user.maxEnergy, user.energy + 15), 
      activeQuests: user.activeQuests.filter(q => q.id !== activeQuest.id),
      inventory: newInventory
    };
    
    updatedUser = handleLevelUp(updatedUser);
    setUser(updatedUser);
    setActiveQuest(null);
    setVerificationText('');
  };

  const handleHabitTick = (habitId: string) => {
    if (!user) return;
    const habit = user.habits.find(h => h.id === habitId);
    if (!habit || habit.completedToday) return;

    const updatedHabits = user.habits.map(h => 
      h.id === habitId ? { ...h, completedToday: true, streak: h.streak + 1 } : h
    );
    const updatedStats = { ...user.stats };
    updatedStats[habit.statReward] += 1;

    let updatedUser = { ...user, habits: updatedHabits, stats: updatedStats, xp: user.xp + 15 };
    updatedUser = handleLevelUp(updatedUser);
    setUser(updatedUser);
  };

  const handleCreateAIQuest = async () => {
    if (!user) return;
    if (user.energy < 20) {
      alert("Недостаточно энергии!");
      return;
    }
    setIsGenerating(true);
    const newQuest = await generateAIQuest(user.level, PATH_DESCRIPTIONS[user.path].title);
    setUser({ ...user, activeQuests: [newQuest, ...user.activeQuests], energy: user.energy - 20 });
    setIsGenerating(false);
  };

  const handleBuyItem = (item: Item) => {
    if (!user || user.coins < item.price) return;
    const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
    setUser({ ...user, coins: user.coins - item.price, inventory: [...user.inventory, newItem] });
  };

  const handleEquipItem = (item: Item) => {
    if (!user) return;
    let newInv = user.inventory.filter(i => i.id !== item.id);
    let newEquip = { ...user.equipment };

    if (item.type === ItemType.WEAPON) {
      if (user.equipment.weapon) newInv.push(user.equipment.weapon);
      newEquip.weapon = item;
    } else if (item.type === ItemType.ARMOR) {
      if (user.equipment.armor) newInv.push(user.equipment.armor);
      newEquip.armor = item;
    }
    setUser({ ...user, inventory: newInv, equipment: newEquip });
  };

  const handleUseItem = (item: Item) => {
    if (!user || (item.type !== ItemType.POTION && item.type !== ItemType.FOOD)) return;
    
    let updatedUser = { ...user };
    let used = false;

    if (item.effect?.type === 'HEAL') {
      if (user.hp < user.maxHp) {
        updatedUser.hp = Math.min(user.maxHp, user.hp + item.effect.value);
        used = true;
      } else alert("Здоровье полно!");
    } else if (item.effect?.type === 'RESTORE_ENERGY') {
      if (user.energy < user.maxEnergy) {
        updatedUser.energy = Math.min(user.maxEnergy, user.energy + item.effect.value);
        used = true;
      } else alert("Энергия полна!");
    }

    if (used) {
      updatedUser.inventory = user.inventory.filter(i => i.id !== item.id);
      setUser(updatedUser);
    }
  };

  const handleLogout = () => {
    if (confirm("Сбросить прогресс?")) {
      clearUser();
      setUser(null);
    }
  };

  const toggleCategory = (cat: string) => {
    setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  if (!user) return <Onboarding onComplete={handleOnboardingComplete} />;
  if (activeTab === 'dungeon') return <Dungeon user={user} onUpdateUser={setUser} onExit={() => setActiveTab('quests')} />;

  const renderQuestBoard = () => {
    const categories = Object.values(QuestCategory);

    return (
      <div className="space-y-4">
        <div className="bg-[#2d1b13] p-4 rounded border-l-4 border-[#ffb74d] shadow-lg sticky top-0 z-20">
          <h2 className="text-xl font-serif font-bold text-[#ffb74d] mb-1">Доска Объявлений</h2>
          <p className="text-xs text-[#a1887f]">Бери задания из любых категорий, чтобы развиваться гармонично.</p>
        </div>

        {categories.map(cat => {
          const questsInCat = availableQuests.filter(q => q.category === cat);
          const isOpen = openCategories[cat];
          
          return (
             <div key={cat} className="bg-[#1a120b] border border-[#3e2723] rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleCategory(cat)}
                  className="w-full flex justify-between items-center p-3 bg-[#2d1b13] hover:bg-[#3e2723] transition-colors"
                >
                   <span className="font-bold text-[#d7ccc8] flex items-center gap-2">
                     {cat} <span className="text-xs bg-black/40 px-2 rounded-full text-[#a1887f]">{questsInCat.length}</span>
                   </span>
                   {isOpen ? <ChevronUp size={16} className="text-[#ffb74d]" /> : <ChevronDown size={16} className="text-[#8d6e63]" />}
                </button>
                
                {isOpen && (
                  <div className="p-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {questsInCat.length === 0 ? (
                      <div className="text-[#5d4037] text-xs italic p-2">Нет заданий в этой категории.</div>
                    ) : (
                      questsInCat.map(quest => (
                        <QuestCard key={quest.id} quest={quest} onAction={acceptQuest} actionLabel="Принять" />
                      ))
                    )}
                  </div>
                )}
             </div>
          );
        })}
      </div>
    );
  };

  // ... (Other render methods like renderHeader, renderNav, renderActiveQuests, renderProfile, renderSocial remain largely same but compacted for brevity)
  
  const renderHeader = () => (
    <div className="bg-[#2d1b13] border-b-4 border-[#3e2723] p-4 sticky top-0 z-30 shadow-xl">
       <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => setActiveTab('profile')}>
            <div className="w-14 h-14 flex items-center justify-center text-4xl bg-[#1a120b] rounded border-2 border-[#ffb74d] shadow-lg">
               {user.avatar}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#ff6f00] text-white text-[10px] font-bold px-2 py-0.5 rounded border border-[#3e2723]">
              Lvl {user.level}
            </div>
          </div>
          <div>
            <h1 className="font-serif font-bold text-[#ffcc80] text-xl leading-none tracking-wide drop-shadow-sm">{user.name}</h1>
            <span className="text-xs text-[#a1887f] uppercase font-bold tracking-wider">{user.title} | {PATH_DESCRIPTIONS[user.path].title}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 text-[#ffca28] text-sm font-bold bg-black/30 px-2 py-1 rounded border border-[#ff6f00]/30">
            <Trophy size={14} />
            <span>{user.coins} G</span>
          </div>
          <button onClick={handleLogout} className="text-[#8d6e63] hover:text-red-400 p-1">
            <LogOut size={16} />
          </button>
        </div>
      </div>
       <div className="grid grid-cols-3 gap-2 mb-1 text-[9px] font-bold uppercase text-[#a1887f]">
        <div className="flex flex-col gap-1">
          <div className="w-full bg-[#1a120b] h-1.5 rounded-full overflow-hidden border border-[#3e2723]">
             <div className="bg-gradient-to-r from-red-600 to-red-400 h-full" style={{ width: `${(user.hp / user.maxHp) * 100}%` }}></div>
          </div>
          <div className="flex justify-between"><span>HP</span><span>{user.hp}/{user.maxHp}</span></div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-full bg-[#1a120b] h-1.5 rounded-full overflow-hidden border border-[#3e2723]">
             <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full" style={{ width: `${(user.energy / user.maxEnergy) * 100}%` }}></div>
          </div>
           <div className="flex justify-between"><span>ЭН</span><span>{user.energy}/{user.maxEnergy}</span></div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-full bg-[#1a120b] h-1.5 rounded-full overflow-hidden border border-[#3e2723]">
             <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-full" style={{ width: `${(user.xp / user.maxXp) * 100}%` }}></div>
          </div>
          <div className="flex justify-between"><span>XP</span><span>{user.xp}/{user.maxXp}</span></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen font-sans selection:bg-[#ffb74d] selection:text-[#3e2723] overflow-hidden">
      {renderHeader()}
      <main className="flex-1 overflow-y-auto p-4 pb-24 max-w-5xl mx-auto w-full custom-scrollbar relative z-10">
        {activeTab === 'quests' && (
           <div className="space-y-6">
              <HabitTracker habits={user.habits} onTick={handleHabitTick} />
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-serif font-bold text-[#efebe9] flex items-center gap-2 border-b-2 border-[#ffb74d] pb-1 pr-4">Текущие Задачи</h2>
                  <button onClick={handleCreateAIQuest} disabled={isGenerating || user.energy < 20} className="flex items-center gap-2 bg-[#4a148c] border border-[#7b1fa2] hover:bg-[#6a1b9a] text-white px-3 py-1.5 rounded shadow-lg text-xs font-bold disabled:opacity-50">
                    {isGenerating ? <Loader2 className="animate-spin" size={14}/> : <Sparkles size={14} />} Пророчество (-20 эн)
                  </button>
                </div>
                {user.activeQuests.length === 0 ? <div className="text-center p-8 bg-[#2d1b13] rounded border border-[#3e2723] text-[#a1887f]">Журнал пуст.</div> : 
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {user.activeQuests.map(quest => <QuestCard key={quest.id} quest={quest} onAction={(q) => setActiveQuest(q)} actionLabel="Сдать" />)}
                  </div>
                }
              </div>
           </div>
        )}
        {activeTab === 'board' && renderQuestBoard()}
        {activeTab === 'profile' && (
           /* Profile logic simplified for brevity - same as before */
           <div className="space-y-6">
             <div className="flex justify-between items-center border-b border-[#3e2723] pb-2"><h2 className="text-xl font-serif font-bold text-[#efebe9]">Характеристики</h2><button onClick={() => setActiveTab('inventory')} className="text-xs text-[#ffb74d] underline">Сменить снаряжение</button></div>
             <StatRadar stats={user.stats} />
             <div className="grid grid-cols-2 gap-3 mt-6">{Object.entries(user.stats).map(([k,v]) => <div key={k} className="bg-[#2d1b13] border border-[#3e2723] p-3 rounded flex justify-between items-center"><span className="text-[#a1887f] text-xs font-bold uppercase">{k}</span><span className="text-xl font-serif text-[#ffcc80] font-bold">{v + (user.equipment.weapon?.statBonus?.[k as StatType]||0) + (user.equipment.armor?.statBonus?.[k as StatType]||0)}</span></div>)}</div>
           </div>
        )}
        {activeTab === 'social' && (
           <div className="space-y-6">
             <h2 className="text-xl font-serif font-bold text-[#efebe9] mb-4 flex items-center gap-2"><Trophy className="text-[#ffb74d]" /> Герои Королевства</h2>
             {/* Leaderboard & Feed Logic same as before */}
             <div className="bg-[#2d1b13] border border-[#3e2723] rounded">{MOCK_LEADERBOARD.map(e => <div key={e.rank} className="flex items-center p-3 gap-3 border-b border-[#3e2723]"><div className="w-6 font-bold text-[#8d6e63]">#{e.rank}</div><div className="w-8 h-8 flex items-center justify-center bg-[#1a120b] rounded">{e.avatar}</div><div className="flex-1"><div className="font-bold text-[#d7ccc8]">{e.name}</div></div><div className="text-sm font-bold text-[#ffcc80]">{e.level}</div></div>)}</div>
             <h2 className="text-xl font-serif font-bold text-[#efebe9] mt-6">Слухи</h2>
             <div className="space-y-3">{feed.map(e => <div key={e.id} className="bg-[#2d1b13] border border-[#3e2723] p-3 rounded flex gap-3 animate-fadeIn"><div className="w-8 h-8 flex items-center justify-center bg-[#1a120b] rounded shrink-0">{e.avatar}</div><div className="flex-1 text-sm text-[#d7ccc8]"><span className="font-bold text-[#ffcc80]">{e.user}</span> {e.action}</div></div>)}</div>
           </div>
        )}
        {activeTab === 'shop' && <Shop user={user} onBuy={handleBuyItem} />}
        {activeTab === 'inventory' && <Inventory user={user} onEquip={handleEquipItem} onUse={handleUseItem} />}
      </main>

      <nav className="fixed bottom-0 w-full bg-[#2d1b13] border-t-4 border-[#3e2723] pb-safe p-2 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] overflow-x-auto">
        <div className="flex justify-between items-center min-w-[320px] px-2">
          {['quests', 'board', 'dungeon', 'shop', 'inventory', 'social'].map(t => {
            const icons = {quests: Swords, board: Scroll, dungeon: Skull, shop: ShoppingBag, inventory: Backpack, social: Users};
            const labels = {quests: 'Журнал', board: 'Доска', dungeon: 'В Бой!', shop: 'Лавка', inventory: 'Сумка', social: 'Гильдия'};
            const Icon = icons[t as keyof typeof icons];
            return (
              <button key={t} onClick={() => { if(t==='dungeon' && user.energy < 5) return alert('Нужно 5 энергии'); setActiveTab(t as any) }} className={`flex flex-col items-center p-2 rounded transition-colors ${activeTab === t ? 'text-[#ffb74d] bg-black/20' : (t === 'dungeon' ? 'text-red-500 hover:bg-red-900/20' : 'text-[#8d6e63]')}`}>
                <Icon size={20} /> <span className="text-[9px] mt-1 font-bold uppercase">{labels[t as keyof typeof labels]}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {!user.tutorialCompleted && <Tutorial onClose={handleTutorialClose} />}
      {activeQuest && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#2d1b13] border-4 border-[#5d4037] w-full max-w-md rounded-lg p-6 shadow-2xl relative">
            <button onClick={() => { setActiveQuest(null); setVerificationText(''); }} className="absolute top-4 right-4 text-[#8d6e63] hover:text-[#ffcc80]"><X size={24} /></button>
            <h3 className="text-2xl font-serif font-bold text-[#ffcc80] mb-2">{activeQuest.title}</h3>
            <p className="text-[#d7ccc8] mb-6 italic">{activeQuest.description}</p>
            {activeQuest.verificationRequired === 'text' && <textarea value={verificationText} onChange={(e) => setVerificationText(e.target.value)} placeholder="Летопись..." className="w-full bg-[#1a120b] border border-[#3e2723] rounded p-3 text-sm text-[#d7ccc8] min-h-[100px] mb-4"/>}
            <button onClick={completeQuest} disabled={isVerifying || (activeQuest.verificationRequired === 'text' && verificationText.length < 5)} className="w-full bg-green-800 text-white font-bold py-3 rounded flex justify-center gap-2">
              {isVerifying ? <Loader2 className="animate-spin" /> : <CheckCircle2 />} Завершить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const container = document.getElementById('root');
if (container) { const root = createRoot(container); root.render(<App />); }

export default App;