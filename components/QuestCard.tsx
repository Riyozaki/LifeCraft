import React, { useEffect, useState } from 'react';
import { Quest, Rarity, StatType, QuestType, QuestCategory } from '../types';
import { MATERIAL_STYLES } from '../constants';
import { Shield, Brain, Heart, Zap, Briefcase, Plus, Check, Clock, Dumbbell, Sparkles, Users, Brush, Coffee } from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
  onAction: (quest: Quest) => void;
  actionLabel: string; // "Принять" or "Сдать"
  disabled?: boolean;
}

const StatIcon = ({ type, size = 14 }: { type: StatType, size?: number }) => {
  switch (type) {
    case StatType.STRENGTH: return <Shield size={size} />;
    case StatType.INTELLECT: return <Brain size={size} />;
    case StatType.CHARISMA: return <Heart size={size} />;
    case StatType.ENDURANCE: return <Zap size={size} />;
    case StatType.CREATIVITY: return <Sparkles size={size} />;
    case StatType.ORGANIZATION: return <Briefcase size={size} />;
    default: return <Briefcase size={size} />;
  }
};

const CategoryIcon = ({ category }: { category: QuestCategory }) => {
  switch(category) {
    case QuestCategory.FITNESS: return <Dumbbell size={16} />;
    case QuestCategory.MIND: return <Brain size={16} />;
    case QuestCategory.SOCIAL: return <Users size={16} />;
    case QuestCategory.CREATION: return <Brush size={16} />;
    case QuestCategory.ROUTINE: return <Coffee size={16} />;
    default: return <Sparkles size={16} />;
  }
};

const Countdown: React.FC<{ expiresAt: number }> = ({ expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const update = () => {
      const diff = expiresAt - Date.now();
      if (diff <= 0) {
        setTimeLeft('00:00');
        return;
      }
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${m}:${s < 10 ? '0' : ''}${s}`);
    };
    
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return <span>{timeLeft}</span>;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onAction, actionLabel, disabled }) => {
  const style = MATERIAL_STYLES[quest.rarity] || MATERIAL_STYLES[Rarity.COMMON];
  const isLegendary = quest.rarity === Rarity.LEGENDARY;
  
  return (
    <div className={`
      relative p-4 rounded-lg border-[3px] transition-all duration-300 hover:-translate-y-1 hover:brightness-110 flex flex-col justify-between group overflow-hidden
      ${style.bg} ${style.border} ${style.texture} ${(style as any).glow || 'shadow-lg shadow-black/40'}
    `}>
      {/* Background Overlay for text contrast */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

      {/* Rarity & Type Header */}
      <div className="relative z-10 flex justify-between items-start mb-2">
        <div className="flex gap-2 items-center flex-wrap">
           <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm border border-white/10 shadow-sm ${style.text}`}>
            {quest.type === QuestType.AI_GENERATED ? '✨ Пророчество' : quest.type}
          </span>
          {quest.expiresAt ? (
             <span className="text-[10px] font-bold uppercase flex items-center gap-1 bg-red-900/80 px-2 py-0.5 rounded text-white border border-red-500 animate-pulse">
               <Clock size={10} /> <Countdown expiresAt={quest.expiresAt} />
            </span>
          ) : quest.deadline && (
            <span className="text-[10px] font-bold uppercase flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded text-white/70 border border-white/10">
               <Clock size={10} /> {quest.deadline}
            </span>
          )}
        </div>
        
        <div className={`p-1.5 rounded-full bg-black/40 text-white/80 border border-white/10`} title={quest.category}>
          <CategoryIcon category={quest.category} />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 mb-3">
        <h3 className={`font-serif font-bold text-lg mb-1 leading-tight drop-shadow-md ${style.text}`}>
          {quest.title}
        </h3>
        <p className={`text-sm line-clamp-3 drop-shadow-sm font-medium ${isLegendary ? 'text-amber-900' : 'text-slate-200'}`}>
          {quest.description}
        </p>
      </div>

      {/* Rewards & Action */}
      <div className="relative z-10 flex items-end justify-between mt-2 pt-3 border-t border-black/20">
        <div className="flex flex-col gap-1">
           <div className="text-[9px] uppercase font-bold text-white/50 tracking-wider">Награда</div>
           <div className="flex flex-wrap gap-2 text-xs font-mono">
            <div className={`flex items-center gap-1 bg-black/40 px-2 py-1.5 rounded font-bold text-yellow-400 border border-yellow-500/30 shadow-sm`}>
              <span>+{quest.xpReward} XP</span>
            </div>
            {Object.entries(quest.statRewards).map(([stat, val]) => (
              <div key={stat} className={`flex items-center gap-1 bg-black/40 px-2 py-1.5 rounded text-white border border-white/20 shadow-sm`}>
                <StatIcon type={stat as StatType} size={12} />
                <span>+{val}</span>
              </div>
            ))}
             <div className="flex items-center gap-1 bg-blue-900/40 px-2 py-1.5 rounded text-blue-200 border border-blue-500/30">
                <Zap size={12} />
                <span>+15 эн</span>
             </div>
          </div>
        </div>

        {!quest.isCompleted && (
          <button 
            onClick={() => onAction(quest)}
            disabled={disabled}
            className={`
              ml-2 px-4 py-3 font-bold rounded-lg shadow-lg transition-all active:scale-95 text-xs uppercase tracking-wider flex items-center gap-2
              ${isLegendary 
                ? 'bg-[#3e2723] text-[#ffca28] border-2 border-[#ff6f00] hover:bg-[#5d4037]' 
                : 'bg-gradient-to-b from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white border-2 border-indigo-400/30'}
              disabled:opacity-50 disabled:grayscale
            `}
          >
           {actionLabel === 'Принять' ? <Plus size={16}/> : <Check size={16}/>}
          </button>
        )}
        {quest.isCompleted && (
          <div className="px-3 py-1 text-green-400 font-bold text-sm flex items-center gap-1 bg-black/60 rounded border border-green-900">
             <Check size={16}/>
          </div>
        )}
      </div>
    </div>
  );
};