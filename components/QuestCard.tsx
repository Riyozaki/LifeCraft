import React from 'react';
import { Quest, Rarity, StatType, QuestType } from '../types';
import { MATERIAL_STYLES } from '../constants';
import { Shield, Book, Zap, Brain, Heart, Briefcase, Plus, Check } from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
  onAction: (quest: Quest) => void;
  actionLabel: string; // "Принять" or "Сдать"
  disabled?: boolean;
}

const StatIcon = ({ type, colorClass }: { type: StatType, colorClass: string }) => {
  // We overwrite specific colors for Legendary readability
  const iconProps = { size: 14, className: colorClass };
  switch (type) {
    case StatType.STRENGTH: return <Shield {...iconProps} />;
    case StatType.INTELLECT: return <Brain {...iconProps} />;
    case StatType.CHARISMA: return <Heart {...iconProps} />;
    case StatType.ENDURANCE: return <Zap {...iconProps} />;
    case StatType.CREATIVITY: return <Zap {...iconProps} />;
    case StatType.ORGANIZATION: return <Briefcase {...iconProps} />;
    default: return null;
  }
};

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onAction, actionLabel, disabled }) => {
  const style = MATERIAL_STYLES[quest.rarity] || MATERIAL_STYLES[Rarity.COMMON];
  
  return (
    <div className={`
      relative p-4 rounded-lg border-b-4 transition-all duration-300 hover:-translate-y-1 hover:brightness-110 flex flex-col justify-between group
      ${style.bg} ${style.border} ${style.texture} ${(style as any).glow || 'shadow-lg shadow-black/40'}
    `}>
      {/* Screw heads for wood/stone look */}
      {(quest.rarity === Rarity.COMMON || quest.rarity === Rarity.RARE) && (
        <>
          <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-black/30"></div>
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-black/30"></div>
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-black/30"></div>
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-black/30"></div>
        </>
      )}

      <div>
        <div className="flex justify-between items-start mb-2">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-black/20 ${style.text}`}>
            {quest.type === QuestType.AI_GENERATED ? '✨ Пророчество' : quest.type}
          </span>
          <span className={`text-xs font-bold uppercase ${style.accent}`}>
            {quest.rarity}
          </span>
        </div>
        
        <h3 className={`font-serif font-bold text-lg mb-1 leading-tight ${style.text}`}>{quest.title}</h3>
        <p className={`text-sm mb-4 line-clamp-3 opacity-90 ${style.text}`}>{quest.description}</p>
      </div>

      <div className="flex items-end justify-between mt-2 pt-3 border-t border-black/10">
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <div className={`flex items-center gap-1 bg-black/20 px-2 py-1 rounded font-bold ${style.iconColor}`}>
            <span>+{quest.xpReward} XP</span>
          </div>
          {Object.entries(quest.statRewards).map(([stat, val]) => (
            <div key={stat} className={`flex items-center gap-1 bg-black/20 px-2 py-1 rounded ${style.iconColor}`}>
              <StatIcon type={stat as StatType} colorClass={style.iconColor} />
              <span>+{val}</span>
            </div>
          ))}
        </div>

        {!quest.isCompleted && (
          <button 
            onClick={() => onAction(quest)}
            disabled={disabled}
            className={`
              px-4 py-2 font-bold rounded shadow-md transition-all active:scale-95 text-xs uppercase tracking-wider flex items-center gap-2
              ${quest.rarity === Rarity.LEGENDARY 
                ? 'bg-[#3e2723] text-[#ffca28] hover:bg-[#5d4037]' 
                : 'bg-gradient-to-b from-indigo-500 to-indigo-700 hover:from-indigo-400 hover:to-indigo-600 text-white border-b-2 border-indigo-900'}
              disabled:opacity-50 disabled:grayscale
            `}
          >
           {actionLabel === 'Принять' ? <Plus size={14}/> : <Check size={14}/>} {actionLabel}
          </button>
        )}
        {quest.isCompleted && (
          <div className="px-4 py-2 text-green-400 font-bold text-sm flex items-center gap-1 bg-black/40 rounded">
             <Check size={16}/> Выполнено
          </div>
        )}
      </div>
    </div>
  );
};