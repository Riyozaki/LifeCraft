import React, { useState } from 'react';
import { User, Item, ItemType, StatType, DamageType } from '../types';
import { MATERIAL_STYLES } from '../constants';
import { Shield, Sword, Shirt, Footprints, HardHat, Trash2, Coins } from 'lucide-react';

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
         className={`w-14 h-14 rounded border-2 border-dashed border-[#5d4037] flex items-center justify-center text-2xl relative
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
      {/* Equipment Slots Grid */}
      <div className="bg-[#2d1b13] p-4 rounded-lg border border-[#3e2723] shadow-inner">
         <h3 className="text-center font-serif font-bold text-[#ffb74d] mb-4">Экипировка</h3>
         <div className="flex justify-center gap-4 flex-wrap">
            {renderSlot('Шлем', user.equipment.helmet, <HardHat />)}
            {renderSlot('Кираса', user.equipment.chest, <Shirt />)}
            {renderSlot('Оружие', user.equipment.weapon, <Sword />)}
            {renderSlot('Штаны', user.equipment.legs, <div className="text-2xl grayscale opacity-50">👖</div>)} 
            {renderSlot('Сапоги', user.equipment.boots, <Footprints />)}
         </div>
      </div>

      {/* Backpack */}
      <div className="space-y-2">
        <h3 className="font-bold text-[#d7ccc8] uppercase text-sm flex justify-between">
          <span>Рюкзак</span>
          <span>{user.inventory.length} предм.</span>
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
            </div>
          ))}
          {/* Empty slots visual filler */}
          {Array.from({ length: Math.max(0, 16 - user.inventory.length) }).map((_, i) => (
             <div key={i} className="aspect-square bg-[#1a120b]/50 border border-[#3e2723]/30 rounded"></div>
          ))}
        </div>
      </div>

      {/* Item Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
          <div className="bg-[#2d1b13] border-4 border-[#5d4037] w-full max-w-sm rounded-lg p-5 shadow-2xl relative animate-in slide-in-from-bottom" onClick={e => e.stopPropagation()}>
            <div className="flex gap-4 mb-4">
              <div className={`w-20 h-20 flex items-center justify-center text-5xl bg-black/40 rounded border-2 ${MATERIAL_STYLES[selectedItem.rarity]?.border}`}>
                {selectedItem.icon}
              </div>
              <div>
                <h3 className={`font-bold text-lg ${MATERIAL_STYLES[selectedItem.rarity]?.text}`}>{selectedItem.name}</h3>
                <div className="text-xs uppercase font-bold text-[#a1887f] mb-1">{selectedItem.rarity} • {selectedItem.type}</div>
                <div className="text-sm text-[#d7ccc8] italic leading-tight">{selectedItem.description}</div>
              </div>
            </div>

            {/* Stats View */}
            <div className="bg-black/20 p-3 rounded mb-4 text-xs space-y-1">
              {selectedItem.baseDamage && <div className="flex justify-between text-red-300"><span>Урон:</span> <span>{selectedItem.baseDamage} ({selectedItem.damageType})</span></div>}
              {selectedItem.defense && <div className="flex justify-between text-blue-300"><span>Защита:</span> <span>{selectedItem.defense}</span></div>}
              {selectedItem.statBonus && Object.entries(selectedItem.statBonus).map(([k,v]) => (
                <div key={k} className="flex justify-between text-[#ffb74d]"><span>{k}:</span> <span>+{v}</span></div>
              ))}
              {selectedItem.resistances && Object.entries(selectedItem.resistances).map(([k,v]) => (
                 <div key={k} className="flex justify-between text-indigo-300"><span>Резист ({k}):</span> <span>+{v}%</span></div>
              ))}
              {selectedItem.effect && <div className="text-green-400 font-bold">Эффект: {selectedItem.effect.type} +{selectedItem.effect.value}</div>}
              
              <div className="border-t border-white/10 mt-2 pt-1 flex justify-between text-[#ffca28]">
                <span>Цена продажи:</span> <span>{Math.floor(selectedItem.price / 2)} G</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[ItemType.WEAPON, ItemType.HELMET, ItemType.CHEST, ItemType.LEGS, ItemType.BOOTS].includes(selectedItem.type) && (
                <button onClick={() => { onEquip(selectedItem); setSelectedItem(null); }} className="col-span-2 bg-[#4e342e] border border-[#8d6e63] py-2 rounded font-bold text-[#ffcc80] uppercase">
                  Надеть
                </button>
              )}
              {[ItemType.POTION, ItemType.FOOD].includes(selectedItem.type) && (
                <button onClick={() => { onUse(selectedItem); setSelectedItem(null); }} className="col-span-2 bg-green-800 border border-green-600 py-2 rounded font-bold text-white uppercase">
                  Использовать
                </button>
              )}
              
              <button onClick={() => { onSell(selectedItem); setSelectedItem(null); }} className="bg-yellow-900/40 border border-yellow-700 py-2 rounded flex items-center justify-center gap-1 text-yellow-500 font-bold">
                 <Coins size={14} /> Продать
              </button>
              <button onClick={() => { onDelete(selectedItem); setSelectedItem(null); }} className="bg-red-900/40 border border-red-700 py-2 rounded flex items-center justify-center gap-1 text-red-500 font-bold">
                 <Trash2 size={14} /> Выкинуть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};