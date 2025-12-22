import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { QUEST_POOL, MOCK_FEED, MOCK_LEADERBOARD, PATH_DESCRIPTIONS } from './constants';
import { User, Quest, StatType, QuestType, SocialEvent, Habit, Rarity, QuestCategory } from './types';
import { QuestCard } from './components/QuestCard';
import { StatRadar } from './components/StatRadar';
import { Onboarding } from './components/Onboarding';
import { HabitTracker } from './components/HabitTracker';
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
  Filter
} from 'lucide-react';

const App = () => {
  // State
  const [activeTab, setActiveTab] = useState<'profile' | 'quests' | 'board' | 'social'>('quests');
  const [user, setUser] = useState<User | null>(null);
  
  // "Quest Board" logic
  const [availableQuests, setAvailableQuests] = useState<Quest[]>([]);
  const [boardFilter, setBoardFilter] = useState<QuestType | 'ALL'>('ALL');
  
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null); // For verification modal
  const [verificationText, setVerificationText] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Load user on mount
  useEffect(() => {
    const savedUser = loadUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  // Save user on change
  useEffect(() => {
    if (user) {
      saveUser(user);
    }
  }, [user]);

  // Initial Quest Board Generation
  useEffect(() => {
    if (user) {
      // Show all quests relevant to user + generals, excluding active ones
      const currentIds = user.activeQuests.map(q => q.id);
      
      const filtered = QUEST_POOL.filter(q => {
         const isNotActive = !currentIds.includes(q.id);
         const isClassMatch = !q.classSpecific || q.classSpecific === user.path;
         return isNotActive && isClassMatch;
      });
      
      setAvailableQuests(filtered);
    }
  }, [user?.path, user?.activeQuests]);

  // Handlers
  const handleOnboardingComplete = (newUser: User) => {
    setUser(newUser);
  };

  const handleLevelUp = (currentUser: User) => {
    if (currentUser.xp >= currentUser.maxXp) {
      const remainingXp = currentUser.xp - currentUser.maxXp;
      alert(`🎉 УРОВЕНЬ ПОВЫШЕН! Теперь вы уровень ${currentUser.level + 1}!`);
      return {
        ...currentUser,
        level: currentUser.level + 1,
        xp: remainingXp,
        maxXp: Math.floor(currentUser.maxXp * 1.5),
        title: currentUser.level + 1 === 10 ? 'Ветеран' : currentUser.title,
        mood: 100,
        energy: currentUser.maxEnergy // Refill energy
      };
    }
    return currentUser;
  };

  const acceptQuest = (quest: Quest) => {
    if (!user) return;
    if (user.activeQuests.length >= 5) {
      alert("Журнал заданий полон! Выполните текущие квесты.");
      return;
    }
    
    setUser({
      ...user,
      activeQuests: [...user.activeQuests, quest]
    });
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

    // Apply rewards
    const updatedStats = { ...user.stats };
    Object.entries(activeQuest.statRewards).forEach(([key, val]) => {
      if (val) updatedStats[key as StatType] += val;
    });

    let updatedUser = {
      ...user,
      xp: user.xp + activeQuest.xpReward,
      stats: updatedStats,
      coins: user.coins + (activeQuest.rarity === Rarity.LEGENDARY ? 100 : activeQuest.rarity === Rarity.EPIC ? 50 : 10),
      // NEW MECHANIC: Quests RESTORE energy on completion now
      energy: Math.min(user.maxEnergy, user.energy + 15), 
      activeQuests: user.activeQuests.filter(q => q.id !== activeQuest.id)
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

    let updatedUser = {
      ...user,
      habits: updatedHabits,
      stats: updatedStats,
      xp: user.xp + 15
    };
    updatedUser = handleLevelUp(updatedUser);
    setUser(updatedUser);
  };

  const handleCreateAIQuest = async () => {
    if (!user) return;
    if (user.energy < 20) {
      alert("Недостаточно энергии для провидения!");
      return;
    }
    setIsGenerating(true);
    
    // Use user path for better relevance
    const newQuest = await generateAIQuest(user.level, PATH_DESCRIPTIONS[user.path].title);
    
    setUser({ 
      ...user, 
      activeQuests: [newQuest, ...user.activeQuests],
      energy: user.energy - 20 
    });
    setIsGenerating(false);
  };

  const handleLogout = () => {
    if (confirm("Сбросить прогресс? (Это уничтожит текущего героя)")) {
      clearUser();
      setUser(null);
    }
  };

  // Views
  if (!user) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const renderHeader = () => (
    <div className="bg-[#2d1b13] border-b-4 border-[#3e2723] p-4 sticky top-0 z-20 shadow-xl">
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
      
      {/* Bars - Click to see info logic could be added here */}
      <div className="grid grid-cols-2 gap-4 mb-3 cursor-help" title="Энергия тратится на Пророчества, Настрой влияет на XP">
        <div className="flex flex-col gap-1">
          <div className="w-full bg-[#1a120b] h-2 rounded-full overflow-hidden border border-[#3e2723]">
             <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full" style={{ width: `${(user.energy / user.maxEnergy) * 100}%` }}></div>
          </div>
           <div className="flex justify-between text-[9px] font-bold text-[#a1887f] uppercase">
             <span className="flex items-center gap-1"><Battery size={10}/> Энергия</span>
             <span>{user.energy}/{user.maxEnergy}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-full bg-[#1a120b] h-2 rounded-full overflow-hidden border border-[#3e2723]">
             <div className="bg-gradient-to-r from-pink-600 to-pink-400 h-full" style={{ width: `${user.mood}%` }}></div>
          </div>
          <div className="flex justify-between text-[9px] font-bold text-[#a1887f] uppercase">
             <span className="flex items-center gap-1"><Smile size={10}/> Настрой</span>
             <span>{user.mood}%</span>
          </div>
        </div>
      </div>

      {/* XP Bar */}
      <div className="w-full bg-[#1a120b] h-4 rounded-md overflow-hidden relative border border-[#3e2723]">
        <div 
          className="bg-gradient-to-r from-[#4a148c] to-[#7b1fa2] h-full transition-all duration-500"
          style={{ width: `${(user.xp / user.maxXp) * 100}%` }}
        ></div>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/90 tracking-widest shadow-black drop-shadow-md">
          XP: {user.xp} / {user.maxXp}
        </span>
      </div>
    </div>
  );

  const renderNav = () => (
    <nav className="fixed bottom-0 w-full bg-[#2d1b13] border-t-4 border-[#3e2723] pb-safe p-2 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      <div className="flex justify-around items-center">
        <button 
          onClick={() => setActiveTab('quests')}
          className={`flex flex-col items-center p-2 rounded transition-colors ${activeTab === 'quests' ? 'text-[#ffb74d] bg-black/20' : 'text-[#8d6e63]'}`}
        >
          <Swords size={22} />
          <span className="text-[10px] mt-1 font-bold uppercase">Журнал</span>
        </button>

        <button 
          onClick={() => setActiveTab('board')}
          className={`flex flex-col items-center p-2 rounded transition-colors ${activeTab === 'board' ? 'text-[#ffb74d] bg-black/20' : 'text-[#8d6e63]'}`}
        >
          <Scroll size={22} />
          <span className="text-[10px] mt-1 font-bold uppercase">Доска</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center p-2 rounded transition-colors ${activeTab === 'profile' ? 'text-[#ffb74d] bg-black/20' : 'text-[#8d6e63]'}`}
        >
          <UserIcon size={22} />
          <span className="text-[10px] mt-1 font-bold uppercase">Герой</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('social')}
          className={`flex flex-col items-center p-2 rounded transition-colors ${activeTab === 'social' ? 'text-[#ffb74d] bg-black/20' : 'text-[#8d6e63]'}`}
        >
          <Users size={22} />
          <span className="text-[10px] mt-1 font-bold uppercase">Гильдия</span>
        </button>
      </div>
    </nav>
  );

  const renderActiveQuests = () => (
    <div className="space-y-6">
      <HabitTracker habits={user.habits} onTick={handleHabitTick} />

      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-serif font-bold text-[#efebe9] flex items-center gap-2 border-b-2 border-[#ffb74d] pb-1 pr-4">
            Текущие Задачи
          </h2>
          <button 
            onClick={handleCreateAIQuest}
            disabled={isGenerating || user.energy < 20}
            className="flex items-center gap-2 bg-[#4a148c] border border-[#7b1fa2] hover:bg-[#6a1b9a] text-white px-3 py-1.5 rounded shadow-lg text-xs font-bold transition-all disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={14}/> : <Sparkles size={14} />}
            Пророчество (-20 эн)
          </button>
        </div>
        
        {user.activeQuests.length === 0 ? (
          <div className="text-center p-8 bg-[#2d1b13] rounded border border-[#3e2723] text-[#a1887f]">
            <p className="mb-2">Ваш журнал пуст, герой.</p>
            <button onClick={() => setActiveTab('board')} className="text-[#ffb74d] underline font-bold">Найти задания на Доске</button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {user.activeQuests.map(quest => (
              <QuestCard 
                key={quest.id} 
                quest={quest} 
                onAction={(q) => setActiveQuest(q)}
                actionLabel="Сдать"
                disabled={false} // Completion shouldn't cost energy anymore
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderQuestBoard = () => {
    const filteredQuests = availableQuests.filter(q => boardFilter === 'ALL' || q.type === boardFilter);

    return (
      <div className="space-y-6">
        <div className="bg-[#2d1b13] p-4 rounded border-l-4 border-[#ffb74d] shadow-lg sticky top-0 z-10">
          <h2 className="text-xl font-serif font-bold text-[#ffb74d] mb-3">Доска Объявлений</h2>
          
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {['ALL', QuestType.DAILY, QuestType.WEEKLY, QuestType.ONE_TIME].map((filter) => (
              <button
                key={filter}
                onClick={() => setBoardFilter(filter as any)}
                className={`
                  px-3 py-1 rounded text-xs font-bold uppercase whitespace-nowrap border transition-colors
                  ${boardFilter === filter 
                    ? 'bg-[#ff6f00] text-white border-[#ff6f00]' 
                    : 'bg-[#1a120b] text-[#a1887f] border-[#3e2723] hover:border-[#8d6e63]'}
                `}
              >
                {filter === 'ALL' ? 'Все' : filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuests.length === 0 ? (
            <div className="text-[#a1887f] text-center italic py-8">В этой категории пусто...</div>
          ) : (
            filteredQuests.map(quest => (
              <QuestCard 
                key={quest.id} 
                quest={quest} 
                onAction={acceptQuest}
                actionLabel="Принять"
                disabled={false}
              />
            ))
          )}
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-serif font-bold text-[#efebe9] border-b border-[#3e2723] pb-2">Характеристики</h2>
      <StatRadar stats={user.stats} />
      
      <div className="grid grid-cols-2 gap-3 mt-6">
        {Object.entries(user.stats).map(([key, val]) => (
          <div key={key} className="bg-[#2d1b13] border border-[#3e2723] p-3 rounded flex justify-between items-center shadow-inner shadow-black/30">
             <span className="text-[#a1887f] text-xs font-bold uppercase tracking-wider">{key}</span>
             <span className="text-xl font-serif text-[#ffcc80] font-bold">{val}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-[#2d1b13] rounded border border-[#3e2723] shadow-lg">
        <h3 className="text-lg font-serif font-bold mb-3 text-[#d7ccc8]">Сумка</h3>
        <div className="grid grid-cols-5 gap-2">
          {[1,2,3,4,5,6,7,8,9,10].map((i) => (
             <div key={i} className="aspect-square bg-[#1a120b] rounded border border-[#3e2723] flex items-center justify-center text-[#5d4037] shadow-inner hover:border-[#8d6e63]">
               {i === 1 && <span className="text-2xl drop-shadow">🍎</span>}
               {i === 2 && <span className="text-2xl drop-shadow">📜</span>}
             </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSocial = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-serif font-bold text-[#efebe9] mb-4 flex items-center gap-2"><Trophy className="text-[#ffb74d]" /> Герои Королевства</h2>
        <div className="bg-[#2d1b13] border border-[#3e2723] rounded overflow-hidden shadow-lg">
          {MOCK_LEADERBOARD.map((entry, idx) => (
            <div key={entry.rank} className={`flex items-center p-3 gap-3 border-b border-[#3e2723] ${entry.rank === 1 ? 'bg-[#ff6f00]/10' : ''}`}>
               <div className="w-6 font-bold text-[#8d6e63] text-center font-mono">#{entry.rank}</div>
               <div className="w-10 h-10 flex items-center justify-center text-2xl bg-[#1a120b] rounded border border-[#5d4037]">
                  {entry.avatar}
               </div>
               <div className="flex-1">
                 <div className="font-bold text-[#d7ccc8]">{entry.name}</div>
                 <div className="text-xs text-[#8d6e63]">{entry.class}</div>
               </div>
               <div className="text-sm font-bold text-[#ffcc80]">Lvl {entry.level}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-serif font-bold text-[#efebe9] mb-4">Слухи в Таверне</h2>
        <div className="space-y-4">
          {MOCK_FEED.map((event) => (
            <div key={event.id} className="bg-[#2d1b13] border border-[#3e2723] p-4 rounded shadow-md flex gap-3 relative">
              <div className="absolute -left-1 top-4 w-1 h-8 bg-[#ffb74d]"></div>
              <div className="w-10 h-10 flex items-center justify-center text-2xl bg-[#1a120b] rounded border border-[#5d4037]">
                 {event.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#d7ccc8]">
                  <span className="font-bold text-[#ffcc80]">{event.user}</span>{' '}
                  <span className="text-[#a1887f]">{event.action}</span>
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-[#5d4037] font-bold">{event.timestamp}</span>
                  <button className="text-xs flex items-center gap-1 text-pink-500 font-bold hover:bg-pink-900/20 px-2 py-0.5 rounded transition-colors">
                    <Heart size={12} fill="currentColor" /> {event.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen font-sans selection:bg-[#ffb74d] selection:text-[#3e2723] overflow-hidden">
      {renderHeader()}
      
      {/* Scrollable Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24 max-w-5xl mx-auto w-full custom-scrollbar">
        {activeTab === 'quests' && renderActiveQuests()}
        {activeTab === 'board' && renderQuestBoard()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'social' && renderSocial()}
      </main>

      {renderNav()}

      {/* Verification Modal */}
      {activeQuest && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#2d1b13] border-4 border-[#5d4037] w-full max-w-md rounded-lg p-6 shadow-2xl relative">
            <button 
              onClick={() => { setActiveQuest(null); setVerificationText(''); }}
              className="absolute top-4 right-4 text-[#8d6e63] hover:text-[#ffcc80]"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-serif font-bold text-[#ffcc80] mb-2">{activeQuest.title}</h3>
            <p className="text-[#d7ccc8] mb-6 italic">{activeQuest.description}</p>
            
            {activeQuest.verificationRequired === 'text' && (
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase text-[#8d6e63] mb-2 tracking-widest">Летопись подвига</label>
                <textarea 
                  value={verificationText}
                  onChange={(e) => setVerificationText(e.target.value)}
                  placeholder="Поведай, как ты справился с этой задачей..."
                  className="w-full bg-[#1a120b] border border-[#3e2723] rounded p-3 text-sm text-[#d7ccc8] focus:ring-1 focus:ring-[#ffb74d] outline-none min-h-[100px] font-serif"
                />
              </div>
            )}

            <button 
              onClick={completeQuest}
              disabled={isVerifying || (activeQuest.verificationRequired === 'text' && verificationText.length < 5)}
              className="w-full bg-gradient-to-r from-green-800 to-green-700 hover:from-green-700 hover:to-green-600 disabled:opacity-50 disabled:grayscale text-[#e8f5e9] font-bold py-3 rounded border border-green-900 shadow-lg transition-all flex justify-center items-center gap-2 uppercase tracking-widest"
            >
              {isVerifying ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
              {isVerifying ? 'Совет Мудрецов проверяет...' : 'Завершить (+15 эн)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Render root
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export default App;