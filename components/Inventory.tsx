import React from 'react';
import { User, Item, ItemType, StatType } from '../types';
import { MATERIAL_STYLES } from '../constants';
import { Shield, Sword } from 'lucide-react';

interface InventoryProps {
  user: User;
  onEquip: (item: Item) => void;
  onUse: (item: Item) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ user, onEquip, onUse }) => {
  return (
    <div className="space-y-6">
      {/* Equipment Slots */}
      <div className="flex gap-4 justify-center py-4 bg-[#2d1b13] rounded border border-[#3e2723] shadow-inner">
         <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-[#8d6e63]">Оружие</span>
            <div className={`w-20 h-20 rounded border-2 border-dashed border-[#5d4037] flex items-center justify-center text-3xl ${user.equipment.weapon ? 'bg-black/20 border-solid border-[#ffb74d]' : 'bg-transparent'}`}>
              {user.equipment.weapon ? user.equipment.weapon.icon : <Sword className="text-[#3e2723]" />}
            </div>
            {user.equipment.weapon && <span className="text-[10px] font-bold text-[#ffb74d] max-w-[80px] truncate">{user.equipment.weapon.name}</span>}
         </div>
         
         <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-[#8d6e63]">Броня</span>
            <div className={`w-20 h-20 rounded border-2 border-dashed border-[#5d4037] flex items-center justify-center text-3xl ${user.equipment.armor ? 'bg-black/20 border-solid border-[#ffb74d]' : 'bg-transparent'}`}>
              {user.equipment.armor ? user.equipment.armor.icon : <Shield className="text-[#3e2723]" />}
            </div>
            {user.equipment.armor && <span className="text-[10px] font-bold text-[#ffb74d] max-w-[80px] truncate">{user.equipment.armor.name}</span>}
         </div>
      </div>

      {/* Backpack */}
      <div className="space-y-2">
        <h3 className="font-bold text-[#d7ccc8] uppercase text-sm">Рюкзак ({user.inventory.length})</h3>
        <div className="grid gap-2">
          {user.inventory.length === 0 && <div className="text-center text-[#5d4037] italic py-4">Пусто... Посети магазин.</div>}
          {user.inventory.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="bg-[#1a120b] border border-[#3e2723] p-3 rounded flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <div className="text-2xl bg-black/30 p-1 rounded">{item.icon}</div>
                 <div>
                   <div className="font-bold text-[#efebe9] text-sm">{item.name}</div>
                   <div className="text-[10px] text-[#a1887f] uppercase">{item.type} • {item.rarity}</div>
                 </div>
               </div>
               
               {item.type === ItemType.POTION ? (
                 <button onClick={() => onUse(item)} className="bg-green-800 text-green-100 text-[10px] font-bold px-3 py-1.5 rounded border border-green-600 uppercase">
                   Использовать
                 </button>
               ) : (
                 <button onClick={() => onEquip(item)} className="bg-[#4e342e] text-[#ffcc80] text-[10px] font-bold px-3 py-1.5 rounded border border-[#8d6e63] uppercase">
                   Надеть
                 </button>
               )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};