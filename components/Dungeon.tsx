import React, { useState, useEffect, useRef } from 'react';
import { User, Item, ItemType, StatType, Rarity, Monster, DamageType, SpecialEffectType } from '../types';
import { MONSTERS, MATERIAL_STYLES, ITEMS_POOL } from '../constants';
import { Sword, Shield, Heart, Skull, Gift, LogOut, Zap, Activity, Flame, Sparkles, Footprints, Info } from 'lucide-react';

interface DungeonProps {
  user: User;
  onUpdateUser: (u: User) => void;
  onExit: () => void;
}

const DUNGEON_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80&w=600', // Cave
  'https://images.unsplash.com/photo-1599576838618-840600323c34?auto=format&fit=crop&q=80&w=600', // Castle
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600'  // Lava
];

export const Dungeon: React.FC<DungeonProps> = ({ user, onUpdateUser, onExit }) => {
  const [floor, setFloor] = useState(user.dungeonState?.floor || 1);
  const [enemy, setEnemy] = useState<Monster & { maxHp: number; dmg: number; currentHp: number } | null>(user.dungeonState?.activeEnemy || null);
  const [userHp, setUserHp] = useState(user.hp > 0 ? user.hp : user.maxHp);
  
  const [logs, setLogs] = useState<string[]>(user.dungeonState ? ["Вы вернулись в подземелье..."] : ["Вы входите в подземелье..."]);
  const [gameState, setGameState] = useState<'COMBAT' | 'LOOT' | 'GAMEOVER' | 'VICTORY'>('COMBAT');
  const [loot, setLoot] = useState<{gold: number, item?: Item} | null>(null);
  const [animationClass, setAnimationClass] = useState('');
  const [bgImage, setBgImage] = useState(DUNGEON_BACKGROUNDS[0]);

  const logBoxRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);
  const isFleeingRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    isFleeingRef.current = false;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (logBoxRef.current) logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
  }, [logs]);

  useEffect(() => {
    setBgImage(DUNGEON_BACKGROUNDS[Math.floor((floor - 1) / 5) % DUNGEON_BACKGROUNDS.length]);
  }, [floor]);

  useEffect(() => {
    if (!enemy && gameState === 'COMBAT' && !isFleeingRef.current) {
      spawnEnemy();
    }
  }, [floor, enemy, gameState]);

  const spawnEnemy = () => {
    const isBossFloor = floor % 5 === 0;
    let availableMobs = MONSTERS.filter(m => isBossFloor ? m.isBoss : !m.isBoss);
    if (availableMobs.length === 0) availableMobs = MONSTERS;

    const mobTemplate = availableMobs[Math.floor(Math.random() * availableMobs.length)];
    const scale = Math.pow(1.05, floor - 1); 
    
    let rarityMult = 1;
    if (mobTemplate.rarity === Rarity.RARE) rarityMult = 1.3;
    if (mobTemplate.rarity === Rarity.EPIC) rarityMult = 1.8;
    if (mobTemplate.rarity === Rarity.LEGENDARY) rarityMult = 2.5;

    const maxHp = Math.floor(mobTemplate.baseHp * scale * rarityMult);
    const dmg = Math.floor(mobTemplate.baseDmg * scale * rarityMult);

    const newEnemy = {
      ...mobTemplate,
      maxHp,
      dmg,
      currentHp: maxHp
    };

    setEnemy(newEnemy);
    addLog(isBossFloor ? `⚠️ БОСС: ${newEnemy.name} преграждает путь!` : `Появился ${newEnemy.name} (${newEnemy.rarity})`);
    saveState(newEnemy, userHp, floor);
  };

  const saveState = (activeEnemy: any, hp: number, currentFloor: number) => {
    if (gameState === 'GAMEOVER' || !mountedRef.current || isFleeingRef.current) return;
    onUpdateUser({
      ...user,
      hp: hp,
      dungeonState: { floor: currentFloor, hp: hp, activeEnemy: activeEnemy }
    });
  };

  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-15), msg]);

  const getTotalStat = (stat: StatType) => {
    let val = user.stats[stat];
    (Object.values(user.equipment) as (Item | null)[]).forEach(item => {
      if (item?.statBonus?.[stat]) val += item.statBonus[stat]!;
    });
    return val;
  };

  const getSpecialEffectValue = (type: SpecialEffectType) => {
    let total = 0;
    (Object.values(user.equipment) as (Item | null)[]).forEach(item => {
      item?.specialEffects?.forEach(effect => {
        if (effect.type === type) total += effect.value;
      });
    });
    return total;
  };

  const handleAttack = () => {
    if (!enemy || gameState !== 'COMBAT' || isFleeingRef.current) return;

    setAnimationClass('animate-slash');
    setTimeout(() => { if(mountedRef.current) setAnimationClass(''); }, 300);

    const str = getTotalStat(StatType.STRENGTH);
    const weapon = user.equipment.weapon;
    const weaponDmg = weapon?.baseDamage || 2;
    const scalingStat = weapon?.scalingStat || StatType.STRENGTH;
    const scaler = getTotalStat(scalingStat);
    
    let dmg = Math.floor(weaponDmg * (1 + scaler / 20) + (str / 2));
    
    const critChanceEffect = getSpecialEffectValue('CRIT_CHANCE');
    const critChance = (getTotalStat(StatType.CHARISMA) * 0.01) + (critChanceEffect * 0.01);
    const isCrit = Math.random() < critChance;
    if (isCrit) dmg = Math.floor(dmg * 2);

    addLog(`Вы нанесли ${dmg} урона ${isCrit ? '(КРИТ!)' : ''}`);
    
    // --- LIFESTEAL ---
    const lifestealPct = getSpecialEffectValue('LIFESTEAL');
    if (lifestealPct > 0) {
      const heal = Math.floor(dmg * (lifestealPct / 100));
      if (heal > 0) {
        const newHp = Math.min(user.maxHp, userHp + heal);
        setUserHp(newHp);
        addLog(`✨ Вампиризм: +${heal} HP`);
      }
    }

    const newEnemyHp = enemy.currentHp - dmg;
    const updatedEnemy = { ...enemy, currentHp: newEnemyHp };
    setEnemy(updatedEnemy);
    
    if (newEnemyHp <= 0) {
      handleWinCombat();
      return; 
    }
    
    saveState(updatedEnemy, userHp, floor);
    setTimeout(() => { if (!isFleeingRef.current) enemyTurn(updatedEnemy); }, 600);
  };

  const enemyTurn = (currentEnemy: typeof enemy) => {
    if (!currentEnemy || gameState !== 'COMBAT' || !mountedRef.current || isFleeingRef.current) return;
    
    // --- DODGE ---
    const dodgeChance = getSpecialEffectValue('DODGE');
    if (Math.random() < (dodgeChance / 100)) {
      addLog(`💨 Вы уклонились от атаки ${currentEnemy.name}!`);
      return;
    }

    setAnimationClass('animate-shake');
    setTimeout(() => { if(mountedRef.current) setAnimationClass(''); }, 500);

    const def = (Object.values(user.equipment) as (Item | null)[]).reduce((sum, i) => sum + (i?.defense || 0), 0) + getTotalStat(StatType.ENDURANCE) * 0.5;
    const resist = (Object.values(user.equipment) as (Item | null)[]).reduce((sum, i) => sum + (i?.resistances?.[currentEnemy.damageType] || 0), 0);
    
    let rawDmg = currentEnemy.dmg + Math.floor(Math.random() * (floor * 0.5));
    let afterDef = Math.max(1, rawDmg - def);
    let finalDmg = Math.floor(afterDef * (1 - Math.min(75, resist) / 100));

    addLog(`${currentEnemy.name} бьет: ${finalDmg} урона.`);
    
    // --- REFLECT ---
    const reflectPct = getSpecialEffectValue('REFLECT');
    if (reflectPct > 0) {
      const reflectDmg = Math.floor(finalDmg * (reflectPct / 100));
      if (reflectDmg > 0) {
        addLog(`🛡️ Отражение: ${reflectDmg} урона обратно!`);
        const updatedEnemyWithReflect = { ...currentEnemy, currentHp: currentEnemy.currentHp - reflectDmg };
        setEnemy(updatedEnemyWithReflect);
        if (updatedEnemyWithReflect.currentHp <= 0) {
          handleWinCombat();
          return;
        }
      }
    }

    const newUserHp = Math.max(0, userHp - finalDmg);
    setUserHp(newUserHp);
    
    if (newUserHp <= 0) {
      setGameState('GAMEOVER');
      onUpdateUser({ ...user, hp: 0, dungeonState: { ...user.dungeonState!, hp: 0 } });
    } else {
      saveState(currentEnemy, newUserHp, floor);
    }
  };

  const handleUsePotion = () => {
    const potion = user.inventory.find(i => i.type === ItemType.POTION && i.effect?.type === 'HEAL');
    if (!potion) { addLog("Нет зелий лечения!"); return; }
    const heal = potion.effect?.value || 30;
    const newHp = Math.min(user.maxHp, userHp + heal);
    setUserHp(newHp);
    addLog(`Использовано: ${potion.name} (+${heal} HP)`);
    const newInv = [...user.inventory];
    newInv.splice(newInv.findIndex(i => i.id === potion.id), 1);
    onUpdateUser({ ...user, inventory: newInv, hp: newHp, dungeonState: { floor, hp: newHp, activeEnemy: enemy || undefined } });
  };

  const handleWinCombat = () => {
    const goldBoost = getSpecialEffectValue('GOLD_BOOST');
    const xpBoost = getSpecialEffectValue('XP_BOOST');

    let gold = Math.floor(20 * floor + Math.random() * 50); 
    if (goldBoost > 0) gold = Math.floor(gold * (1 + goldBoost / 100));

    let xp = Math.floor(40 * floor + Math.random() * 100);
    if (xpBoost > 0) xp = Math.floor(xp * (1 + xpBoost / 100));

    let droppedItem: Item | undefined = undefined;
    if (enemy?.lootTable) {
        let rarityTarget = Rarity.COMMON;
        if (enemy.rarity === Rarity.LEGENDARY) rarityTarget = Rarity.EPIC;
        else if (enemy.rarity === Rarity.EPIC) rarityTarget = Rarity.RARE;
        const candidates = ITEMS_POOL.filter(i => {
             if (i.isMaterial) return i.rarity === enemy.rarity;
             return i.rarity === rarityTarget && Math.random() < (i.dropChance || 0.1);
        });
        if (candidates.length > 0) {
            droppedItem = { ...candidates[Math.floor(Math.random() * candidates.length)], id: Math.random().toString() };
        }
    }

    setLoot({ gold, item: droppedItem });
    setGameState(floor % 5 === 0 ? 'VICTORY' : 'LOOT');
    addLog(`Победа! +${gold}G, +${xp}XP`);

    const newInv = [...user.inventory];
    if (droppedItem) newInv.push(droppedItem);
    
    onUpdateUser({
      ...user,
      coins: user.coins + gold,
      xp: user.xp + xp,
      inventory: newInv,
      hp: userHp,
      dungeonState: { floor: floor + 1, hp: userHp, activeEnemy: undefined }
    });
  };

  const nextFloor = () => { setFloor(f => f + 1); setEnemy(null); setGameState('COMBAT'); };
  const handleManualExit = () => { isFleeingRef.current = true; if (gameState === 'COMBAT') saveState(enemy, userHp, floor); onExit(); };
  const handleFlee = () => { isFleeingRef.current = true; if (window.confirm("Сбежать? Весь прогресс подземелья будет сброшен!")) { onUpdateUser({ ...user, hp: userHp, dungeonState: undefined }); onExit(); } else { isFleeingRef.current = false; } };
  const handleRevive = () => { onUpdateUser({ ...user, hp: user.maxHp, dungeonState: { floor: floor, hp: user.maxHp } }); setUserHp(user.maxHp); setEnemy(null); setGameState('COMBAT'); setLogs(["Вы воскресли!"]); };

  if (gameState === 'GAMEOVER') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-center p-6 animate-fadeIn pb-20">
        <Skull size={80} className="text-red-600 mb-4 animate-bounce" />
        <h2 className="text-3xl font-bold text-red-500 mb-2">ПОРАЖЕНИЕ</h2>
        <p className="text-slate-400 mb-6">Этаж {floor}</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
            <button onClick={handleRevive} className="bg-red-900 border border-red-600 px-6 py-3 rounded text-white font-bold hover:bg-red-800">Попробовать снова</button>
            <button onClick={onExit} className="text-slate-500 underline">В город</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="bg-[#2d1b13] p-3 flex justify-between items-center text-xs font-bold border-b border-[#3e2723] z-10 shadow-lg safe-area-top">
        <div className="flex items-center gap-2 bg-red-900/40 px-3 py-1 rounded border border-red-900 text-red-100">
           <Heart size={16} fill="currentColor"/> <span className="text-lg">{userHp}</span><span className="text-white/50">/{user.maxHp}</span>
        </div>
        <div className="flex flex-col items-center">
           <span className="text-[#a1887f] uppercase tracking-widest text-[10px]">Подземелье</span>
           <span className="text-[#ffb74d] text-lg">Этаж {floor}</span>
        </div>
        <div className="flex gap-2">
            <button onClick={handleFlee} className="text-red-400 border border-red-900 px-2 py-1 rounded bg-black/40 z-50 cursor-pointer active:bg-red-900 active:scale-95 transition-all"><Footprints size={16}/></button>
            <button onClick={handleManualExit} className="text-slate-400 border border-slate-700 px-2 py-1 rounded bg-black/40 z-50 cursor-pointer active:bg-slate-800"><LogOut size={16} /></button>
        </div>
      </div>
      <div className="flex-1 relative flex flex-col items-center justify-center p-4 transition-all duration-1000 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${bgImage})` }}>
        {animationClass === 'animate-slash' && <div className="absolute inset-0 bg-white/20 z-20 pointer-events-none"></div>}
        {enemy && gameState === 'COMBAT' && (
           <div className={`flex flex-col items-center w-full max-w-xs ${animationClass}`}>
             <div className="text-8xl mb-4 drop-shadow-[0_0_25px_rgba(255,0,0,0.6)] transform hover:scale-110 transition-transform cursor-crosshair relative" onClick={handleAttack}>
               {enemy.icon}<div className="absolute -top-4 right-0 flex gap-1">{enemy.damageType === DamageType.FIRE && <Flame size={20} className="text-orange-500" fill="currentColor"/>}{enemy.damageType === DamageType.MAGIC && <Sparkles size={20} className="text-purple-500" fill="currentColor"/>}</div>
             </div>
             <div className="w-full bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-white/10 shadow-2xl">
               <div className="flex justify-between text-white font-bold mb-1"><span className={enemy.isBoss ? "text-red-400 uppercase tracking-widest" : "text-slate-200"}>{enemy.name}</span><span className="text-[10px] text-[#ffcc80] border border-[#ffcc80] px-1 rounded">{enemy.rarity}</span></div>
               <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-600"><div className={`h-full transition-all duration-300 ${enemy.isBoss ? 'bg-red-600' : 'bg-orange-500'}`} style={{ width: `${(enemy.currentHp / enemy.maxHp) * 100}%` }}></div></div>
               <div className="text-right text-[10px] text-slate-400 mt-1">{enemy.currentHp} / {enemy.maxHp} HP</div>
             </div>
           </div>
        )}
        {(gameState === 'LOOT' || gameState === 'VICTORY') && (
           <div className="flex flex-col items-center animate-fadeIn bg-black/80 p-8 rounded-xl border-2 border-[#ffb74d] shadow-[0_0_50px_rgba(255,183,77,0.3)]">
             <Gift size={64} className="text-[#ffb74d] mb-4 animate-bounce" />
             <h3 className="text-2xl font-bold text-white mb-2">{gameState === 'VICTORY' ? 'БОСС ПОВЕРЖЕН!' : 'Комната зачищена'}</h3>
             <div className="text-center space-y-2 mb-6"><div className="text-yellow-400 font-mono text-lg">+ {loot?.gold} G</div>{loot?.item && (<div className={`flex items-center gap-2 p-2 rounded border bg-[#2d1b13] ${MATERIAL_STYLES[loot.item.rarity].border} ${MATERIAL_STYLES[loot.item.rarity].text}`}><span className="text-2xl">{loot.item.icon}</span><div className="text-left"><div className="font-bold text-sm">{loot.item.name}</div><div className="text-[10px] uppercase opacity-70">{loot.item.rarity}</div></div></div>)}</div>
             <div className="flex gap-3"><button onClick={handleManualExit} className="px-4 py-2 text-slate-300 hover:text-white underline text-sm">В город</button><button onClick={nextFloor} className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-6 rounded shadow-lg flex items-center gap-2">Дальше <Zap size={16}/></button></div>
           </div>
        )}
      </div>
      <div className="h-40 bg-[#1a120b] border-t-4 border-[#3e2723] flex flex-col safe-area-bottom">
         <div ref={logBoxRef} className="flex-1 p-3 overflow-y-auto text-xs font-mono space-y-1.5 text-[#d7ccc8] scroll-smooth">{logs.map((l, i) => (<div key={i} className="border-l-2 border-[#5d4037] pl-2 opacity-90">{l}</div>))}</div>
         {gameState === 'COMBAT' && (
           <div className="p-3 grid grid-cols-2 gap-3 bg-[#2d1b13]">
              <button onClick={handleAttack} className="bg-red-900 hover:bg-red-800 border-2 border-red-950 text-white rounded-lg p-3 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"><Sword size={24} /> <span className="font-bold uppercase tracking-wider">Удар</span></button>
              <button onClick={handleUsePotion} className="bg-green-900 hover:bg-green-800 border-2 border-green-950 text-white rounded-lg p-3 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"><Activity size={24} /> <span className="font-bold uppercase tracking-wider">Зелье</span></button>
           </div>
         )}
      </div>
    </div>
  );
};