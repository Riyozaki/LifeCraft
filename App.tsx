import React, { useState, useEffect, Component, ErrorInfo } from 'react';
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
import { Blacksmith } from './components/Blacksmith';
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
  ChevronUp,
  Hammer,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

// Error Boundary to catch crashes
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    clearUser();
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a120b] text-[#d7ccc8] p-6 text-center">
          <AlertTriangle size={64} className="text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Критическая ошибка магического ядра</h1>
          <p className="mb-6 text-sm opacity-70 font-mono bg-black/30 p-2 rounded max-w-md overflow-auto">
            {this.state.error?.message}
          </p>
          <button 
            onClick={this.handleReset}
            className="bg-red-900 border border-red-600 text-white px-6 py-3 rounded font-bold hover:bg-red-800 transition-colors"
          >
            Сбросить прогресс и перезагрузить
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const COOLDOWNS_MS = {
  [QuestType.DAILY]: 24 * 60 * 60 * 1000,
  [QuestType.WEEKLY]: 7 * 24 * 60 * 60 * 1000,
  [QuestType.MONTHLY]: 30 * 24 * 60 * 60 * 1000,
  [QuestType.ONE_TIME]: Infinity, // Never appear again
  [QuestType.AI_GENERATED]: 0,
  [QuestType.EVENT]: 0
};

const AppContent = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'quests' | 'board' | 'social' | 'shop' | 'inventory' | 'dungeon' | 'blacksmith'>('quests');
  const [user, setUser] = useState<User | null>(null);
  const [feed, setFeed] = useState<SocialEvent[]>(MOCK_FEED);
  
  const [availableQuests, setAvailableQuests] = useState<Quest[]>([]);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({ [QuestCategory.FITNESS]: true });
  
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null); 
  const [verificationText, setVerificationText] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // INITIAL LOAD & MIGRATION
  useEffect(() => {
    try {
      const savedUser = loadUser();
      if (savedUser) {
        // Equipment Migration
        if (!savedUser.equipment) {
          savedUser.equipment = { weapon: null, helmet: null, chest: null, legs: null, boots: null };
        }
        // Validate equipment slots individually
        ['helmet', 'chest', 'legs', 'boots', 'weapon'].forEach(slot => {
             // @ts-ignore
             if (!savedUser.equipment[slot] && savedUser.equipment[slot] !== null) {
                 // @ts-ignore
                 savedUser.equipment[slot] = null;
             }
        });
        
        // Quest Safety Migration
        if (savedUser.activeQuests) {
          savedUser.activeQuests = savedUser.activeQuests.map(q => ({
             ...q,
             statRewards: q.statRewards || {},
             rarity: q.rarity || Rarity.COMMON,
             type: q.type || QuestType.ONE_TIME
          }));
        }
        
        // History Migration
        if (!savedUser.completedHistory) {
            savedUser.completedHistory = {};
        }

        setUser(savedUser);
      }
    } catch (e) {
      console.error("Critical error loading user:", e);
    }
  }, []);

  useEffect(() => {
    if (user) saveUser(user);
  }, [user]);

  // Timed Quest Ticker & Filter Logic
  useEffect(() => {
    if (!user) return;

    const filterQuests = () => {
        const now = Date.now();
        const currentIds = user.activeQuests.map(q => q.id);
        
        const filtered = QUEST_POOL.filter(q => {
            // 1. Check if already active
            if (currentIds.includes(q.id)) return false;
            
            // 2. Check hard expiration (for timed events)
            if (q.expiresAt && now > q.expiresAt) return false;

            // 3. Check Cooldowns from completion history
            if (user.completedHistory && user.completedHistory[q.id]) {
                const finishedAt = user.completedHistory[q.id];
                const cooldown = COOLDOWNS_MS[q.type] || 0;
                
                // If it's a one-time quest and finished, hide forever
                if (cooldown === Infinity) return false;

                // If cooldown hasn't passed, hide
                if (now - finishedAt < cooldown) return false;
            }

            return true;
        });
        setAvailableQuests(filtered);
    };

    filterQuests();
    const interval = setInterval(filterQuests, 5000); 
    return () => clearInterval(interval);
  }, [user?.activeQuests, user?.completedHistory]);

  const handleOnboardingComplete = (newUser: User) => setUser(newUser);
  const handleTutorialClose = () => {
      if (user) setUser({ ...user, tutorialCompleted: true });
      setShowTutorial(false);
  };

  const checkLevelUp = (currentUser: User) => {
    let u = { ...currentUser };
    let leveledUp = false;

    while (u.xp >= u.maxXp) {
       u.xp -= u.maxXp;
       u.level += 1;
       u.maxXp = Math.floor(u.maxXp * 1.5);
       u.maxHp += 10;
       u.hp = u.maxHp; 
       u.energy = u.maxEnergy;
       leveledUp = true;
    }
    
    if (leveledUp) {
      setTimeout(() => alert(`🎉 УРОВЕНЬ ПОВЫШЕН! Теперь вы уровень ${u.level}! Здоровье восстановлено.`), 100);
    }
    return u;
  };

  const handleUserUpdate = (updatedUser: User) => {
      const finalUser = checkLevelUp(updatedUser);
      setUser(finalUser);
  };

  const acceptQuest = (quest: Quest) => {
    if (!user) return;
    if (user.activeQuests.length >= 5) {
      alert("Журнал заданий полон!");
      return;
    }
    
    if (user.activeQuests.find(q => q.id === quest.id)) return;

    // Optimistic UI update
    setAvailableQuests(prev => prev.filter(q => q.id !== quest.id));
    
    setUser({ ...user, activeQuests: [...user.activeQuests, quest] });
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

    let newInventory = [...user.inventory];
    if (activeQuest.itemRewardId) {
       const rewardItemTemplate = ITEMS_POOL.find(i => i.id === activeQuest.itemRewardId);
       if (rewardItemTemplate) {
         newInventory.push({ ...rewardItemTemplate, id: Math.random().toString() });
         alert(`Вы получили предмет: ${rewardItemTemplate.name}!`);
       }
    }

    const goldReward = activeQuest.coinsReward || (activeQuest.rarity === Rarity.LEGENDARY ? 100 : activeQuest.rarity === Rarity.EPIC ? 50 : 25);

    // Update History
    const newHistory = { ...user.completedHistory, [activeQuest.id]: Date.now() };

    let updatedUser = {
      ...user,
      xp: user.xp + activeQuest.xpReward,
      stats: updatedStats,
      coins: user.coins + goldReward,
      energy: Math.min(user.maxEnergy, user.energy + 15), 
      activeQuests: user.activeQuests.filter(q => q.id !== activeQuest.id),
      inventory: newInventory,
      completedHistory: newHistory
    };
    
    handleUserUpdate(updatedUser);
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
    handleUserUpdate(updatedUser);
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
       if (newEquip.weapon) newInv.push(newEquip.weapon);
       newEquip.weapon = item;
    } else if (item.type === ItemType.HELMET) {
       if (newEquip.helmet) newInv.push(newEquip.helmet);
       newEquip.helmet = item;
    } else if (item.type === ItemType.CHEST) {
       if (newEquip.chest) newInv.push(newEquip.chest);
       newEquip.chest = item;
    } else if (item.type === ItemType.LEGS) {
       if (newEquip.legs) newInv.push(newEquip.legs);
       newEquip.legs = item;
    } else if (item.type === ItemType.BOOTS) {
       if (newEquip.boots) newInv.push(newEquip.boots);
       newEquip.boots = item;
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

  const handleSellItem = (item: Item) => {
    if (!user) return;
    const sellPrice = Math.floor(item.price / 2);
    setUser({
        ...user,
        coins: user.coins + sellPrice,
        inventory: user.inventory.filter(i => i.id !== item.id)
    });
  };

  const handleDeleteItem = (item: Item) => {
    if (!user || !confirm(`Выбросить ${item.name}?`)) return;
    setUser({
        ...user,
        inventory: user.inventory.filter(i => i.id !== item.id)
    });
  };

  const handleCraftItem = (resultItem: Item, cost: number, materials: {itemId: string, count: number}[]) => {
     if (!user) return;
     let currentInv = [...user.inventory];
     
     for (const mat of materials) {
         const template = ITEMS_POOL.find(i => i.id === mat.itemId);
         let countToRemove = mat.count;
         currentInv = currentInv.filter(invItem => {
             if (countToRemove > 0 && invItem.name === template?.name) {
                 countToRemove--;
                 return false;
             }
             return true;
         });
     }

     const craftedItem = { ...resultItem, id: Math.random().toString() };
     
     setUser({
         ...user,
         coins: user.coins - cost,
         inventory: [...currentInv, craftedItem]
     });
     alert(`Вы создали: ${resultItem.name}!`);
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

  const calculateTotalStats = (u: User) => {
    const total = { ...u.stats };
    Object.values(u.equipment).forEach(item => {
        if (item?.statBonus) {
            Object.entries(item.statBonus).forEach(([k, v]) => {
                total[k as StatType] = (total[k as StatType] || 0) + v;
            });
        }
    });
    return total;
  };

  if (!user) return <Onboarding onComplete={handleOnboardingComplete} />;
  
  if (activeTab === 'dungeon') {
      return (
        <Dungeon 
            user={user} 
            onUpdateUser={handleUserUpdate} 
            onExit={() => setActiveTab('quests')} 
        />
      );
  }

  const renderQuestBoard = () => {
    const categories = Object.values(QuestCategory);
    return (
      <div className="space-y-4 pb-20">
        <div className="bg-[#2d1b13] p-4 rounded border-l-4 border-[#ffb74d] shadow-lg sticky top-0 z-20">
          <h2 className="text-xl font-serif font-bold text-[#ffb74d] mb-1">Доска Объявлений</h2>
          <p className="text-xs text-[#a1887f]">Задания обновляются и пропадают со временем.</p>
        </div>
        {categories.map(cat => {
          const questsInCat = availableQuests.filter(q => 
            q.category === cat && 
            !user.activeQuests.some(uq => uq.id === q.id)
          );
          
          const isOpen = openCategories[cat];
          return (
             <div key={cat} className="bg-[#1a120b] border border-[#3e2723] rounded-lg overflow-hidden">
                <button onClick={() => toggleCategory(cat)} className="w-full flex justify-between items-center p-3 bg-[#2d1b13] hover:bg-[#3e2723] transition-colors">
                   <span className="font-bold text-[#d7ccc8] flex items-center gap-2">{cat} <span className="text-xs bg-black/40 px-2 rounded-full text-[#a1887f]">{questsInCat.length}</span></span>
                   {isOpen ? <ChevronUp size={16} className="text-[#ffb74d]" /> : <ChevronDown size={16} className="text-[#8d6e63]" />}
                </button>
                {isOpen && (
                  <div className="p-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {questsInCat.length === 0 ? <div className="text-[#5d4037] text-xs italic p-2">Пусто...</div> : questsInCat.map(q => <QuestCard key={q.id} quest={q} onAction={acceptQuest} actionLabel="Принять" />)}
                  </div>
                )}
             </div>
          );
        })}
      </div>
    );
  };

  const renderHeader = () => {
    if (!user) return null;
    const pathInfo = PATH_DESCRIPTIONS[user.path];
    const pathTitle = pathInfo ? pathInfo.title : "Неизвестный";
    
    return (
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
            <span className="text-xs text-[#a1887f] uppercase font-bold tracking-wider">{user.title} | {pathTitle}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 text-[#ffca28] text-sm font-bold bg-black/30 px-2 py-1 rounded border border-[#ff6f00]/30">
            <Trophy size={14} />
            <span>{user.coins} G</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowTutorial(true)} className="text-[#8d6e63] hover:text-[#ffb74d] p-1"><HelpCircle size={16}/></button>
            <button onClick={handleLogout} className="text-[#8d6e63] hover:text-red-400 p-1"><LogOut size={16} /></button>
          </div>
        </div>
      </div>
       <div className="grid grid-cols-3 gap-2 mb-1 text-[9px] font-bold uppercase text-[#a1887f]">
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
    </div>
  )};

  const totalStats = user ? calculateTotalStats(user) : {} as Record<StatType, number>;

  return (
    <div className="flex flex-col h-screen font-sans selection:bg-[#ffb74d] selection:text-[#3e2723] overflow-hidden">
      {renderHeader()}
      <main className="flex-1 overflow-y-auto p-4 max-w-5xl mx-auto w-full custom-scrollbar relative z-10">
        {activeTab === 'quests' && user && (
           <div className="space-y-6 pb-20">
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
        {activeTab === 'board' && user && renderQuestBoard()}
        {activeTab === 'profile' && user && (
           <div className="space-y-6 pb-20">
             <div className="flex justify-between items-center border-b border-[#3e2723] pb-2"><h2 className="text-xl font-serif font-bold text-[#efebe9]">Характеристики</h2><button onClick={() => setActiveTab('inventory')} className="text-xs text-[#ffb74d] underline">Сменить снаряжение</button></div>
             <StatRadar stats={totalStats} />
             <div className="grid grid-cols-2 gap-3 mt-6">{Object.entries(totalStats).map(([k,v]) => <div key={k} className="bg-[#2d1b13] border border-[#3e2723] p-3 rounded flex justify-between items-center"><span className="text-[#a1887f] text-xs font-bold uppercase">{k}</span><span className="text-xl font-serif text-[#ffcc80] font-bold">{v}</span></div>)}</div>
           </div>
        )}
        {activeTab === 'shop' && user && <Shop user={user} onBuy={handleBuyItem} />}
        {activeTab === 'inventory' && user && <Inventory user={user} onEquip={handleEquipItem} onUse={handleUseItem} onSell={handleSellItem} onDelete={handleDeleteItem} />}
        {activeTab === 'blacksmith' && user && <Blacksmith user={user} onCraft={handleCraftItem} />}
        {activeTab === 'social' && user && (
           <div className="space-y-6 pb-20">
             <h2 className="text-xl font-serif font-bold text-[#efebe9] mb-4 flex items-center gap-2"><Trophy className="text-[#ffb74d]" /> Герои Королевства</h2>
             <div className="bg-[#2d1b13] border border-[#3e2723] rounded">{MOCK_LEADERBOARD.map(e => <div key={e.rank} className="flex items-center p-3 gap-3 border-b border-[#3e2723]"><div className="w-6 font-bold text-[#8d6e63]">#{e.rank}</div><div className="w-8 h-8 flex items-center justify-center bg-[#1a120b] rounded">{e.avatar}</div><div className="flex-1"><div className="font-bold text-[#d7ccc8]">{e.name}</div></div><div className="text-sm font-bold text-[#ffcc80]">{e.level}</div></div>)}</div>
             <h2 className="text-xl font-serif font-bold text-[#efebe9] mt-6">Слухи</h2>
             <div className="space-y-3">{feed.map(e => <div key={e.id} className="bg-[#2d1b13] border border-[#3e2723] p-3 rounded flex gap-3 animate-fadeIn"><div className="w-8 h-8 flex items-center justify-center bg-[#1a120b] rounded shrink-0">{e.avatar}</div><div className="flex-1 text-sm text-[#d7ccc8]"><span className="font-bold text-[#ffcc80]">{e.user}</span> {e.action}</div></div>)}</div>
           </div>
        )}
      </main>

      {user && (
      <nav className="fixed bottom-0 w-full bg-[#2d1b13] border-t-4 border-[#3e2723] pb-safe p-2 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] overflow-x-auto">
        <div className="flex justify-between items-center min-w-[350px] px-2 gap-1">
          {['quests', 'board', 'dungeon', 'shop', 'blacksmith', 'inventory', 'social'].map(t => {
            const icons = {quests: Swords, board: Scroll, dungeon: Skull, shop: ShoppingBag, inventory: Backpack, social: Users, blacksmith: Hammer};
            const labels = {quests: 'Журнал', board: 'Доска', dungeon: 'В Бой!', shop: 'Лавка', inventory: 'Сумка', social: 'Гильдия', blacksmith: 'Кузня'};
            const Icon = icons[t as keyof typeof icons];
            return (
              <button key={t} onClick={() => { if(t==='dungeon' && user.energy < 5) return alert('Нужно 5 энергии'); setActiveTab(t as any) }} className={`flex flex-col items-center p-2 rounded transition-colors ${activeTab === t ? 'text-[#ffb74d] bg-black/20' : (t === 'dungeon' ? 'text-red-500 hover:bg-red-900/20' : 'text-[#8d6e63]')}`}>
                <Icon size={18} /> <span className="text-[8px] mt-1 font-bold uppercase">{labels[t as keyof typeof labels]}</span>
              </button>
            )
          })}
        </div>
      </nav>
      )}

      {showTutorial && <Tutorial onClose={handleTutorialClose} />}
      
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

const App = () => (
  <ErrorBoundary>
    <AppContent />
  </ErrorBoundary>
);

export default App;