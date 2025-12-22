import React, { useState } from 'react';
import { User, Item, ItemType, StatType, DamageType } from '../types';
import { MATERIAL_STYLES } from '../constants';
import { Shield, Sword, Shirt, Footprints, HardHat, Trash2, Coins, Gem, Sparkles, Zap, Heart, Trophy, Snowflake, Activity } from 'lucide-react';

interface InventoryProps {
  user: User;
  onEquip: (item: Item) => void;
  onUse: (item: Item) => void;
  onSell: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ user, onEquip, onUse, onSell, onDelete }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const renderSlot = (label: string, item: Item | null, icon: React.ReactNode) => (
    <div className="flex flex-col items-center gap-1">
       <span className="text-[9px] font-bold uppercase text-[#8d6e63]">{label}</span>
       <div 
         className={`w-14 h-14 rounded border-2 border-dashed border-[#5d4037] flex items-center justify-center text-2xl relative cursor-pointer
         ${item ? `bg-black/40 border-solid ${MATERIAL_STYLES[item.rarity]?.border}` : 'bg-transparent'}`}
         onClick={() => item && setSelectedItem(item)}
       >
         {item ? item.icon : <div className="opacity-20 text-slate-600">{icon}</div>}
         {item && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-black"></div>}
       </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-[#2d1b13] p-4 rounded-lg border border-[#3e2723] shadow-inner">
         <h3 className="text-center font-serif font-bold text-[#ffb74d] mb-4 uppercase tracking-widest">Кукла Героя</h3>
         <div className="flex justify-center gap-4 flex-wrap">
            {renderSlot('Шлем', user.equipment.helmet, <HardHat />)}
            {renderSlot('Кираса', user.equipment.chest, <Shirt />)}
            {renderSlot('Оружие', user.equipment.weapon, <Sword />)}
            {renderSlot('Штаны', user.equipment.legs, <div className="text-2xl grayscale opacity-50">👖</div>)} 
            {renderSlot('Сапоги', user.equipment.boots, <Footprints />)}
            {renderSlot('Аксессуар', user.equipment.accessory || null, <Gem />)}
         </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-[#d7ccc8] uppercase text-sm flex justify-between">
          <span>Рюкзак</span>
          <span className="text-[#8d6e63]">{user.inventory.length} / 20</span>
        </h3>
        
        <div className="grid grid-cols-4 gap-2">
          {user.inventory.map((item, idx) => (
            <div 
              key={`${item.id}-${idx}`} 
              onClick={() => setSelectedItem(item)}
              className={`aspect-square bg-[#1a120b] border border-[#3e2723] rounded flex items-center justify-center text-2xl cursor-pointer hover:border-[#ffb74d] relative ${selectedItem?.id === item.id ? 'border-[#ffb74d] ring-1 ring-[#ffb74d]' : ''}`}
            >
               {item.icon}
               {item.type === ItemType.MATERIAL && <span className="absolute bottom-0 right-1 text-[8px] text-[#8d6e63] bg-black/50 px-1 rounded">MAT</span>}
               {item.specialEffects && <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>}
            </div>
          ))}
          {Array.from({ length: Math.max(0, 16 - user.inventory.length) }).map((_, i) => (
             <div key={i} className="aspect-square bg-[#1a120b]/50 border border-[#3e2723]/30 rounded"></div>
          ))}
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
          <div className="bg-[#2d1b13] border-4 border-[#5d4037] w-full max-w-sm rounded-lg p-5 shadow-2xl relative animate-in slide-in-from-bottom" onClick={e => e.stopPropagation()}>
            <div className="flex gap-4 mb-4">
              <div className={`w-20 h-20 flex items-center justify-center text-5xl bg-black/40 rounded border-2 ${MATERIAL_STYLES[selectedItem.rarity]?.border}`}>
                {selectedItem.icon}
              </div>
              <div>
                <h3 className={`font-bold text-lg leading-tight ${MATERIAL_STYLES[selectedItem.rarity]?.text}`}>{selectedItem.name}</h3>
                <div className="text-[10px] uppercase font-bold text-[#a1887f] mb-1">{selectedItem.rarity} • {selectedItem.type}</div>
                <div className="text-xs text-[#d7ccc8] italic leading-snug">{selectedItem.description}</div>
              </div>
            </div>

            <div className="bg-black/30 p-3 rounded mb-4 text-xs space-y-1.5 border border-white/5">
              {selectedItem.baseDamage && <div className="flex justify-between text-red-300 font-bold"><span>Урон:</span> <span>{selectedItem.baseDamage} ({selectedItem.damageType})</span></div>}
              {selectedItem.defense && <div className="flex justify-between text-blue-300 font-bold"><span>Защита:</span> <span>{selectedItem.defense}</span></div>}
              
              {selectedItem.statBonus && Object.entries(selectedItem.statBonus).map(([k,v]) => (
                <div key={k} className="flex justify-between text-[#ffb74d]"><span>{k}:</span> <span>+{v}</span></div>
              ))}
              
              {/* Special Effects Section */}
              {selectedItem.specialEffects && selectedItem.specialEffects.map((eff, i) => (
                <div key={i} className="flex items-start gap-2 text-yellow-400 bg-yellow-400/10 p-1.5 rounded border border-yellow-400/20">
                  {eff.type === 'LIFESTEAL' && <Heart size={14} className="shrink-0 mt-0.5" />}
                  {eff.type === 'REFLECT' && <Shield size={14} className="shrink-0 mt-0.5" />}
                  {eff.type === 'DODGE' && <Zap size={14} className="shrink-0 mt-0.5" />}
                  {eff.type === 'GOLD_BOOST' && <Trophy size={14} className="shrink-0 mt-0.5" />}
                  {eff.type === 'XP_BOOST' && <Sparkles size={14} className="shrink-0 mt-0.5" />}
                  {eff.type === 'FROST_STRIKE' && <Snowflake size={14} className="shrink-0 mt-0.5" />}
                  {eff.type === 'POISON_BITE' && <Activity size={14} className="shrink-0 mt-0.5" />}
                  <div className="leading-tight font-medium">{eff.description}</div>
                </div>
              ))}

              <div className="border-t border-white/10 mt-2 pt-1.5 flex justify-between text-[#ffca28] font-bold">
                <span>Продать за:</span> <span>{Math.floor(selectedItem.price / 2)} G</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[ItemType.WEAPON, ItemType.HELMET, ItemType.CHEST, ItemType.LEGS, ItemType.BOOTS, ItemType.ACCESSORY].includes(selectedItem.type) && (
                <button onClick={() => { onEquip(selectedItem); setSelectedItem(null); }} className="col-span-2 bg-[#4e342e] border-b-4 border-[#3e2723] hover:bg-[#5d4037] py-2 rounded font-bold text-[#ffcc80] uppercase tracking-wider active:border-b-0 active:translate-y-1 transition-all">
                  Надеть
                </button>
              )}
              {[ItemType.POTION, ItemType.FOOD].includes(selectedItem.type) && (
                <button onClick={() => { onUse(selectedItem); setSelectedItem(null); }} className="col-span-2 bg-green-800 border-b-4 border-green-950 hover:bg-green-700 py-2 rounded font-bold text-white uppercase tracking-wider active:border-b-0 active:translate-y-1 transition-all">
                  Использовать
                </button>
              )}
              
              <button onClick={() => { onSell(selectedItem); setSelectedItem(null); }} className="bg-yellow-900/40 border border-yellow-700 py-2 rounded flex items-center justify-center gap-1 text-yellow-500 font-bold hover:bg-yellow-900/60 transition-colors">
                 <Coins size={14} /> Продать
              </button>
              <button onClick={() => { onDelete(selectedItem); setSelectedItem(null); }} className="bg-red-900/40 border border-red-700 py-2 rounded flex items-center justify-center gap-1 text-red-500 font-bold hover:bg-red-900/60 transition-colors">
                 <Trash2 size={14} /> Выкинуть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};