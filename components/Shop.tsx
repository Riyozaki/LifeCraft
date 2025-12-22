import React, { useState, useEffect } from 'react';
import { Item, User, Rarity, ItemType } from '../types';
import { ITEMS_POOL, MATERIAL_STYLES } from '../constants';
import { Coins, Lock, RefreshCw, Clock } from 'lucide-react';

interface ShopProps {
  user: User;
  onBuy: (item: Item) => void;
}

const SHOP_REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

export const Shop: React.FC<ShopProps> = ({ user, onBuy }) => {
  const [stock, setStock] = useState<Item[]>([]);
  const [nextRefresh, setNextRefresh] = useState(0);

  // Load or Refresh Stock
  useEffect(() => {
    const loadStock = () => {
      const savedState = localStorage.getItem('shop_state');
      let state = savedState ? JSON.parse(savedState) : null;
      const now = Date.now();

      if (!state || now > state.nextRefresh) {
        // Generate new stock
        const newStock = [];
        // Always 6 items
        for (let i = 0; i < 6; i++) {
          const randomItem = ITEMS_POOL[Math.floor(Math.random() * ITEMS_POOL.length)];
          // Give it a temp ID for the shop slot
          newStock.push({ ...randomItem, id: `${randomItem.id}_shop_${now}_${i}` }); 
        }
        
        const nextTime = now + SHOP_REFRESH_INTERVAL;
        state = { items: newStock, nextRefresh: nextTime };
        localStorage.setItem('shop_state', JSON.stringify(state));
      }

      setStock(state.items);
      setNextRefresh(state.nextRefresh);
    };

    loadStock();
    const interval = setInterval(loadStock, 1000); // Check every second if needs refresh
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#2d1b13] p-4 rounded border-l-4 border-[#ffb74d] shadow-lg flex justify-between items-center sticky top-0 z-10">
        <div>
           <h2 className="text-xl font-serif font-bold text-[#ffb74d] mb-1">Торговая Лавка</h2>
           <p className="text-xs text-[#a1887f]">Ассортимент меняется каждые 15 мин.</p>
        </div>
        <div className="text-right text-xs font-mono text-[#ffcc80] bg-black/30 px-2 py-1 rounded border border-[#5d4037]">
           <div className="flex items-center gap-1 justify-end"><Clock size={12}/> Обновление:</div>
           <div className="text-lg">{formatTime(Math.max(0, nextRefresh - Date.now()))}</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {stock.map(item => {
           const style = MATERIAL_STYLES[item.rarity];
           const canAfford = user.coins >= item.price;
           const isClassCompatible = !item.classReq || item.classReq === user.path;
           
           return (
             <div key={item.id} className={`relative p-3 rounded-lg border-2 flex gap-3 transition-all ${style.bg} ${style.border} shadow-md`}>
               <div className="w-16 h-16 flex items-center justify-center text-3xl bg-black/30 rounded-md border border-white/10 shrink-0">
                 {item.icon}
               </div>
               
               <div className="flex-1 min-w-0 flex flex-col justify-between">
                 <div>
                   <div className="flex justify-between items-start">
                     <h3 className={`font-bold text-sm truncate ${style.text}`}>{item.name}</h3>
                     <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-black/40 ${style.text}`}>{item.type}</span>
                   </div>
                   <p className={`text-[10px] opacity-80 line-clamp-2 ${style.text} my-1 leading-tight`}>{item.description}</p>
                 </div>
                 
                 <div className="flex justify-between items-end mt-2">
                    <div className="text-[10px] font-mono text-white/70">
                      {item.statBonus && Object.entries(item.statBonus).map(([k, v]) => (
                        <div key={k} className="flex gap-1 items-center"><span>•</span> +{v} {k.slice(0, 3)}</div>
                      ))}
                      {item.effect && <div className="text-green-300">Эффект: +{item.effect.value}</div>}
                      {!isClassCompatible && <div className="text-red-300 font-bold">Только {item.classReq}</div>}
                    </div>

                    <button 
                      onClick={() => onBuy(item)}
                      disabled={!canAfford}
                      className={`
                        px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-all
                        ${canAfford 
                          ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-md border-b-2 border-yellow-800 active:border-b-0 active:translate-y-0.5' 
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border-b-2 border-slate-900'}
                      `}
                    >
                      {canAfford ? <Coins size={12}/> : <Lock size={12}/>}
                      {item.price} G
                    </button>
                 </div>
               </div>
             </div>
           );
        })}
      </div>
    </div>
  );
};