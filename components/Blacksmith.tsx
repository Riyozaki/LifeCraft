import React from 'react';
import { User, Item, ItemType } from '../types';
import { RECIPES, ITEMS_POOL, MATERIAL_STYLES } from '../constants';
import { Hammer, Anvil, Lock } from 'lucide-react';

interface BlacksmithProps {
  user: User;
  onCraft: (item: Item, cost: number, materials: {itemId: string, count: number}[]) => void;
}

export const Blacksmith: React.FC<BlacksmithProps> = ({ user, onCraft }) => {
  // Helper to count user materials
  const getMatCount = (id: string) => user.inventory.filter(i => i.id.startsWith(id)).length; // Assuming IDs in inventory preserve prefix or we use name logic. 
  // Better: Inventory items come from ITEMS_POOL, so their base IDs match. 
  // However, handleBuyItem creates unique IDs. We need to check base ID logic.
  // Fix: We will check by name or type for simplicity, or assume we store 'baseId' on item.
  // For now, let's match by Name since unique IDs break direct ID match.
  
  const getUserMatCount = (templateId: string) => {
    const template = ITEMS_POOL.find(i => i.id === templateId);
    if (!template) return 0;
    return user.inventory.filter(i => i.name === template.name).length;
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="bg-[#2d1b13] p-4 rounded border-l-4 border-red-500 shadow-lg sticky top-0 z-10">
        <h2 className="text-xl font-serif font-bold text-red-400 flex items-center gap-2">
          <Anvil size={24} /> Кузница
        </h2>
        <p className="text-xs text-[#a1887f]">Создавай легендарное снаряжение из трофеев.</p>
      </div>

      <div className="grid gap-4">
        {RECIPES.map((recipe, idx) => {
          const resultItem = ITEMS_POOL.find(i => i.id === recipe.resultId);
          if (!resultItem) return null;

          const style = MATERIAL_STYLES[resultItem.rarity];
          const canAffordGold = user.coins >= recipe.cost;
          let hasMaterials = true;

          return (
            <div key={idx} className={`bg-[#1a120b] border border-[#3e2723] p-4 rounded-lg flex flex-col gap-3 relative overflow-hidden`}>
              {/* Header */}
              <div className="flex gap-3 items-center">
                 <div className={`w-12 h-12 flex items-center justify-center text-2xl rounded border ${style.bg} ${style.border}`}>
                   {resultItem.icon}
                 </div>
                 <div>
                   <h3 className={`font-bold ${style.text}`}>{resultItem.name}</h3>
                   <span className="text-[10px] text-[#a1887f] uppercase">{resultItem.type}</span>
                 </div>
              </div>

              {/* Requirements */}
              <div className="bg-black/30 p-2 rounded text-xs">
                <div className="font-bold text-[#8d6e63] mb-1 uppercase">Материалы:</div>
                <div className="flex flex-wrap gap-2">
                  {recipe.materials.map(mat => {
                    const matTemplate = ITEMS_POOL.find(i => i.id === mat.itemId);
                    const count = getUserMatCount(mat.itemId);
                    if (count < mat.count) hasMaterials = false;
                    
                    return (
                      <div key={mat.itemId} className={`px-2 py-1 rounded border ${count >= mat.count ? 'border-green-800 bg-green-900/20 text-green-400' : 'border-red-900 bg-red-900/20 text-red-400'}`}>
                        {matTemplate?.icon} {count}/{mat.count}
                      </div>
                    );
                  })}
                </div>
                <div className={`mt-2 font-bold ${canAffordGold ? 'text-yellow-500' : 'text-red-500'}`}>
                   Цена работы: {recipe.cost} G
                </div>
              </div>

              {/* Action */}
              <button 
                onClick={() => onCraft(resultItem, recipe.cost, recipe.materials)}
                disabled={!canAffordGold || !hasMaterials}
                className={`w-full py-3 font-bold uppercase tracking-widest rounded flex justify-center items-center gap-2 transition-all
                  ${canAffordGold && hasMaterials 
                    ? 'bg-red-700 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' 
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'}
                `}
              >
                {(!canAffordGold || !hasMaterials) ? <Lock size={16}/> : <Hammer size={16}/>}
                Создать
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};