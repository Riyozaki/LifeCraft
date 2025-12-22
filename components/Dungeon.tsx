import React, { useState, useEffect, useRef } from 'react';
import { User, Item, ItemType, StatType, Rarity, Monster } from '../types';
import { MONSTERS, MATERIAL_STYLES, ITEMS_POOL } from '../constants';
import { Sword, Shield, Heart, Skull, Gift, LogOut, Zap, Activity, AlertTriangle } from 'lucide-react';

interface DungeonProps {
  user: User;
  onUpdateUser: (u: User) => void;
  onExit: () => void;
}

const DUNGEON_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80&w=600', // Cave
  'https://images.unsplash.com/photo-1599576838618-840600323c34?auto=format&fit=crop&q=80&w=600', // Castle
];

export const Dungeon: React.FC<DungeonProps> = ({ user, onUpdateUser, onExit }) => {
  const [floor, setFloor] = useState(user.dungeonState?.floor || 1);
  const [enemy, setEnemy] = useState<Monster & { maxHp: number; dmg: number } | null>(null);
  const [enemyHp, setEnemyHp] = useState(0);
  const [userHp, setUserHp] = useState(user.hp); // Use HP from props initially
  const [logs, setLogs] = useState<string[]>(["Вы входите в подземелье..."]);
  const [gameState, setGameState] = useState<'COMBAT' | 'LOOT' | 'GAMEOVER' | 'VICTORY'>('COMBAT');
  const [loot, setLoot] = useState<{gold: number, item?: Item} | null>(null);
  const [animationClass, setAnimationClass] = useState('');
  const [bgImage, setBgImage] = useState(DUNGEON_BACKGROUNDS[0]);

  const logBoxRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  }, [logs]);

  // Sync internal HP with User Prop if it changes externally (rare here but good practice)
  useEffect(() => {
    if (Math.abs(user.hp - userHp) > 1 && gameState === 'COMBAT') {
      setUserHp(user.hp);
    }
  }, [user.hp]);

  // Spawn Enemy Logic
  useEffect(() => {
    if (!enemy && gameState === 'COMBAT') {
      const isBossFloor = floor % 10 === 0;
      let availableMobs = MONSTERS.filter(m => isBossFloor ? m.isBoss : !m.isBoss);
      
      // If no boss found (fallback), use rare mobs
      if (availableMobs.length === 0) availableMobs = MONSTERS;

      // Select weighted by floor difficulty (simple random for now)
      const mobTemplate = availableMobs[Math.floor(Math.random() * availableMobs.length)];
      
      // Scaling: (1.15 ^ floor)
      const scale = Math.pow(1.15, floor - 1);
      
      const newEnemy = {
        ...mobTemplate,
        maxHp: Math.floor(mobTemplate.baseHp * scale),
        dmg: Math.floor(mobTemplate.baseDmg * scale)
      };

      setEnemy(newEnemy);
      setEnemyHp(newEnemy.maxHp);
      setBgImage(DUNGEON_BACKGROUNDS[Math.floor((floor - 1) / 5) % DUNGEON_BACKGROUNDS.length]); // Change BG every 5 floors

      addLog(isBossFloor ? `⚠️ БОСС: ${newEnemy.name} преграждает путь!` : `Появился ${newEnemy.name} (Ур. ${floor})`);
    }
  }, [floor, enemy, gameState]);

  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-10), msg]);

  // Total User Stats
  const getTotalStat = (stat: StatType) => {
    let val = user.stats[stat];
    if (user.equipment.weapon?.statBonus?.[stat]) val += user.equipment.weapon.statBonus[stat]!;
    if (user.equipment.armor?.statBonus?.[stat]) val += user.equipment.armor.statBonus[stat]!;
    return val;
  };

  const handleAttack = () => {
    if (!enemy) return;

    // Trigger visual
    setAnimationClass('animate-slash');
    setTimeout(() => setAnimationClass(''), 300);

    // Dmg Logic
    const str = getTotalStat(StatType.STRENGTH);
    const weaponDmg = user.equipment.weapon?.statBonus?.[StatType.STRENGTH] || 0;
    const baseDmg = Math.floor(str * 1.5 + weaponDmg + Math.random() * 5);
    
    // Crit
    const critChance = getTotalStat(StatType.CHARISMA) * 0.01;
    const isCrit = Math.random() < critChance;
    const finalDmg = isCrit ? baseDmg * 2 : baseDmg;

    addLog(`Вы нанесли ${finalDmg} урона ${isCrit ? '(КРИТ!)' : ''}`);
    
    const newEnemyHp = enemyHp - finalDmg;
    setEnemyHp(newEnemyHp);

    if (newEnemyHp <= 0) {
      handleWinCombat();
      return;
    }

    // Enemy Turn Delay
    setTimeout(enemyTurn, 600);
  };

  const enemyTurn = () => {
    if (!enemy) return;
    
    setAnimationClass('animate-shake');
    setTimeout(() => setAnimationClass(''), 500);

    const def = getTotalStat(StatType.ENDURANCE);
    const armorDef = user.equipment.armor?.statBonus?.[StatType.ENDURANCE] || 0;
    const totalDef = def + armorDef;
    
    const rawDmg = enemy.dmg + Math.floor(Math.random() * (floor * 2));
    const mitigated = Math.floor(totalDef * 0.4); // Defense reduces 40% of value directly
    const takenDmg = Math.max(1, rawDmg - mitigated);

    addLog(`${enemy.name} бьет на ${takenDmg} (защита: ${mitigated})`);
    
    const newUserHp = userHp - takenDmg;
    setUserHp(newUserHp);
    
    // Persist HP update immediately so if they exit, it's saved
    onUpdateUser({ ...user, hp: Math.max(0, newUserHp) });

    if (newUserHp <= 0) {
      setGameState('GAMEOVER');
      addLog("Тьма поглотила вас...");
      onUpdateUser({ ...user, hp: 0, dungeonState: undefined }); // Clear save on death
    }
  };

  const handleUsePotion = () => {
    const potion = user.inventory.find(i => i.type === ItemType.POTION && i.effect?.type === 'HEAL');
    if (!potion) {
      addLog("Нет зелий лечения!");
      return;
    }

    const heal = potion.effect?.value || 30;
    const newHp = Math.min(user.maxHp, userHp + heal);
    setUserHp(newHp);
    addLog(`Использовано: ${potion.name} (+${heal} HP)`);
    
    // Consume
    const newInv = [...user.inventory];
    newInv.splice(newInv.findIndex(i => i.id === potion.id), 1);
    onUpdateUser({ ...user, inventory: newInv, hp: newHp });
  };

  const handleWinCombat = () => {
    const isBoss = floor % 10 === 0;
    const gold = Math.floor(10 * floor + Math.random() * 20);
    const xp = Math.floor(20 * floor + Math.random() * 50);

    let droppedItem: Item | undefined = undefined;

    if (isBoss) {
      // Boss Loot Logic: High chance for rare items
      const roll = Math.random();
      // Filter loot pool based on rarity thresholds
      const candidates = ITEMS_POOL.filter(i => {
         if (roll > 0.95) return i.rarity === Rarity.LEGENDARY;
         if (roll > 0.8) return i.rarity === Rarity.EPIC;
         if (roll > 0.5) return i.rarity === Rarity.RARE;
         return i.rarity === Rarity.COMMON;
      });
      
      if (candidates.length > 0) {
        droppedItem = { ...candidates[Math.floor(Math.random() * candidates.length)], id: Math.random().toString() };
      }
      
      setLoot({ gold, item: droppedItem });
      setGameState('VICTORY'); // Boss finished
      addLog(`БОСС ПОВЕРЖЕН! Сундук открыт!`);
    } else {
       // Normal mob loot
       if (Math.random() > 0.85) {
         // Small chance for common item
         const commonItems = ITEMS_POOL.filter(i => i.rarity === Rarity.COMMON);
         droppedItem = { ...commonItems[Math.floor(Math.random() * commonItems.length)], id: Math.random().toString() };
       }
       setLoot({ gold, item: droppedItem });
       setGameState('LOOT');
       addLog(`Победа! +${gold}G, +${xp}XP`);
    }

    // Save progress
    const newInv = user.inventory;
    if (droppedItem) newInv.push(droppedItem);
    
    onUpdateUser({
      ...user,
      coins: user.coins + gold,
      xp: user.xp + xp,
      inventory: newInv,
      hp: userHp,
      dungeonState: { floor: floor + 1, hp: userHp }
    });
  };

  const nextFloor = () => {
    setFloor(f => f + 1);
    setEnemy(null);
    setGameState('COMBAT');
  };

  if (gameState === 'GAMEOVER') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black text-center p-6 animate-fadeIn">
        <Skull size={80} className="text-red-600 mb-4 animate-bounce" />
        <h2 className="text-3xl font-bold text-red-500 mb-2">ПОРАЖЕНИЕ</h2>
        <p className="text-slate-400 mb-6">Вы достигли {floor} этажа.</p>
        <button onClick={onExit} className="bg-slate-800 border border-slate-600 px-8 py-3 rounded text-white font-bold hover:bg-slate-700">
          В Город (Воскреснуть)
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] relative overflow-hidden bg-black">
      {/* Top HUD */}
      <div className="bg-[#2d1b13] p-3 flex justify-between items-center text-xs font-bold border-b border-[#3e2723] z-10 shadow-lg">
        <div className="flex items-center gap-2 bg-red-900/40 px-3 py-1 rounded border border-red-900 text-red-100">
           <Heart size={16} fill="currentColor"/> 
           <span className="text-lg">{userHp}</span>
           <span className="text-white/50">/{user.maxHp}</span>
        </div>
        <div className="flex flex-col items-center">
           <span className="text-[#a1887f] uppercase tracking-widest text-[10px]">Подземелье</span>
           <span className="text-[#ffb74d] text-lg">Этаж {floor}</span>
        </div>
        <button onClick={onExit} className="text-slate-500 hover:text-slate-300">
           <LogOut size={20} />
        </button>
      </div>

      {/* Main Viewport */}
      <div 
        className="flex-1 relative flex flex-col items-center justify-center p-4 transition-all duration-1000 bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${bgImage})` }}
      >
        {/* Flash Effect on Hit */}
        {animationClass === 'animate-slash' && <div className="absolute inset-0 bg-white/20 z-20 pointer-events-none"></div>}

        {/* Combat State */}
        {enemy && gameState === 'COMBAT' && (
           <div className={`flex flex-col items-center w-full max-w-xs ${animationClass}`}>
             <div className="text-8xl mb-4 drop-shadow-[0_0_25px_rgba(255,0,0,0.6)] transform hover:scale-110 transition-transform cursor-crosshair" onClick={handleAttack}>
               {enemy.icon}
             </div>
             
             <div className="w-full bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-white/10 shadow-2xl">
               <div className="flex justify-between text-white font-bold mb-1">
                 <span className={enemy.isBoss ? "text-red-400 uppercase tracking-widest" : "text-slate-200"}>
                   {enemy.name}
                 </span>
                 <span className="text-xs text-slate-400">Lvl {Math.floor(floor)}</span>
               </div>
               
               <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-600">
                  <div 
                    className={`h-full transition-all duration-300 ${enemy.isBoss ? 'bg-red-600' : 'bg-orange-500'}`} 
                    style={{ width: `${(enemyHp / enemy.maxHp) * 100}%` }}
                  ></div>
               </div>
               <div className="text-right text-[10px] text-slate-400 mt-1">{enemyHp} / {enemy.maxHp} HP</div>
             </div>
           </div>
        )}

        {/* Loot/Victory State */}
        {(gameState === 'LOOT' || gameState === 'VICTORY') && (
           <div className="flex flex-col items-center animate-fadeIn bg-black/80 p-8 rounded-xl border-2 border-[#ffb74d] shadow-[0_0_50px_rgba(255,183,77,0.3)]">
             <Gift size={64} className="text-[#ffb74d] mb-4 animate-bounce" />
             <h3 className="text-2xl font-bold text-white mb-2">
               {gameState === 'VICTORY' ? 'ЛЕГЕНДАРНАЯ ПОБЕДА!' : 'Комната зачищена'}
             </h3>
             <div className="text-center space-y-2 mb-6">
                <div className="text-yellow-400 font-mono text-lg">+ {loot?.gold} G</div>
                {loot?.item && (
                  <div className={`flex items-center gap-2 p-2 rounded border bg-[#2d1b13] ${MATERIAL_STYLES[loot.item.rarity].border} ${MATERIAL_STYLES[loot.item.rarity].text}`}>
                     <span className="text-2xl">{loot.item.icon}</span>
                     <div className="text-left">
                       <div className="font-bold text-sm">{loot.item.name}</div>
                       <div className="text-[10px] uppercase opacity-70">{loot.item.rarity}</div>
                     </div>
                  </div>
                )}
             </div>
             
             <div className="flex gap-3">
                <button onClick={onExit} className="px-4 py-2 text-slate-300 hover:text-white underline text-sm">В город</button>
                <button 
                  onClick={nextFloor}
                  className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-6 rounded shadow-lg flex items-center gap-2"
                >
                  Дальше <Zap size={16}/>
                </button>
             </div>
           </div>
        )}
      </div>

      {/* Combat Actions Log */}
      <div className="h-40 bg-[#1a120b] border-t-4 border-[#3e2723] flex flex-col z-20">
         <div ref={logBoxRef} className="flex-1 p-3 overflow-y-auto text-xs font-mono space-y-1.5 text-[#d7ccc8] scroll-smooth">
            {logs.map((l, i) => (
              <div key={i} className="border-l-2 border-[#5d4037] pl-2 opacity-90">{l}</div>
            ))}
         </div>

         {gameState === 'COMBAT' && (
           <div className="p-3 grid grid-cols-2 gap-3 bg-[#2d1b13]">
              <button 
                onClick={handleAttack} 
                className="bg-red-900 hover:bg-red-800 border-2 border-red-950 text-white rounded-lg p-3 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
              >
                <Sword size={24} />
                <span className="font-bold uppercase tracking-wider">Удар</span>
              </button>
              <button 
                onClick={handleUsePotion} 
                className="bg-green-900 hover:bg-green-800 border-2 border-green-950 text-white rounded-lg p-3 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
              >
                <Activity size={24} />
                <span className="font-bold uppercase tracking-wider">Зелье</span>
              </button>
           </div>
         )}
      </div>
    </div>
  );
};