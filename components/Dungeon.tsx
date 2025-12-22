import React, { useState, useEffect, useRef } from 'react';
import { User, Item, ItemType, StatType, Rarity, Monster, DamageType, SpecialEffectType, DungeonArea } from '../types';
import { MONSTERS, MATERIAL_STYLES, ITEMS_POOL } from '../constants';
import { Sword, Shield, Heart, Skull, Gift, LogOut, Zap, Activity, Flame, Sparkles, Footprints, Wind, Snowflake, Map as MapIcon, Waves, ChevronUp, AlertCircle } from 'lucide-react';

interface DungeonProps {
  user: User;
  onUpdateUser: (u: User) => void;
  onExit: () => void;
}

const DUNGEON_BACKGROUNDS = {
  [DungeonArea.RUINS]: [
    'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1599576838618-840600323c34?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600'
  ],
  [DungeonArea.SUNKEN_CITY]: [
    'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1459208327157-560027ee2392?auto=format&fit=crop&q=80&w=600'
  ]
};

export const Dungeon: React.FC<DungeonProps> = ({ user, onUpdateUser, onExit }) => {
  const [selectedArea, setSelectedArea] = useState<DungeonArea | null>(user.dungeonState?.area || null);
  const [floor, setFloor] = useState(user.dungeonState?.floor || 1);
  const [enemy, setEnemy] = useState<Monster & { maxHp: number; dmg: number; currentHp: number; isFrozen?: boolean; poisonStacks?: number } | null>(user.dungeonState?.activeEnemy || null);
  const [userHp, setUserHp] = useState(user.hp > 0 ? user.hp : user.maxHp);
  const [turnCount, setTurnCount] = useState(0);
  
  const [logs, setLogs] = useState<string[]>(user.dungeonState ? ["Вы вернулись в подземелье..."] : ["Вы входите в подземелье..."]);
  const [gameState, setGameState] = useState<'COMBAT' | 'LOOT' | 'GAMEOVER' | 'VICTORY'>('COMBAT');
  const [loot, setLoot] = useState<{gold: number, item?: Item} | null>(null);
  const [animationClass, setAnimationClass] = useState('');
  const [bgImage, setBgImage] = useState('');

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
    if (selectedArea) {
      const bgs = DUNGEON_BACKGROUNDS[selectedArea];
      setBgImage(bgs[Math.floor((floor - 1) / 5) % bgs.length]);
    }
  }, [floor, selectedArea]);

  useEffect(() => {
    if (selectedArea && !enemy && gameState === 'COMBAT' && !isFleeingRef.current) {
      spawnEnemy();
    }
  }, [floor, enemy, gameState, selectedArea]);

  const spawnEnemy = () => {
    if (!selectedArea) return;
    const isBossFloor = floor % 5 === 0;
    
    const getRarityWeight = () => {
      const roll = Math.random() * 100;
      if (isBossFloor) {
        if (floor >= 25) return Rarity.LEGENDARY;
        if (floor >= 15) return Rarity.EPIC;
        return Rarity.RARE;
      }
      
      if (floor > 20) {
        if (roll < 5) return Rarity.LEGENDARY;
        if (roll < 20) return Rarity.EPIC;
        if (roll < 50) return Rarity.RARE;
        return Rarity.COMMON;
      }
      if (floor > 10) {
        if (roll < 5) return Rarity.EPIC;
        if (roll < 20) return Rarity.RARE;
        return Rarity.COMMON;
      }
      if (floor > 3) {
        if (roll < 10) return Rarity.RARE;
        return Rarity.COMMON;
      }
      return Rarity.COMMON;
    };

    const targetRarity = getRarityWeight();
    let availableMobs = MONSTERS.filter(m => 
      m.area === selectedArea && 
      (isBossFloor ? m.isBoss : !m.isBoss) &&
      m.rarity === targetRarity
    );

    if (availableMobs.length === 0) {
      availableMobs = MONSTERS.filter(m => m.area === selectedArea && (isBossFloor ? m.isBoss : !m.isBoss));
    }
    
    const mobTemplate = availableMobs[Math.floor(Math.random() * availableMobs.length)];
    
    // NEW SCALING LOGIC: More lenient, tied slightly to player level
    const areaScale = selectedArea === DungeonArea.SUNKEN_CITY ? 1.1 : 1.0;
    const floorScaleHp = Math.pow(1.05, floor - 1); 
    const floorScaleDmg = Math.pow(1.015, floor - 1); // Very slow damage increase
    const levelModifier = 1 + (user.level * 0.05); // Monsters gain 5% stats per player level to keep pace
    
    let rarityHpMult = 1.0;
    let rarityDmgMult = 1.0;
    
    switch (mobTemplate.rarity) {
      case Rarity.RARE: 
        rarityHpMult = 1.25; 
        rarityDmgMult = 1.15; 
        break;
      case Rarity.EPIC: 
        rarityHpMult = 1.6; 
        rarityDmgMult = 1.35; 
        break;
      case Rarity.LEGENDARY: 
        rarityHpMult = 2.2; 
        rarityDmgMult = 1.6; // Significantly reduced boss damage
        break;
    }

    const maxHp = Math.floor(mobTemplate.baseHp * floorScaleHp * areaScale * rarityHpMult * levelModifier);
    const dmg = Math.floor(mobTemplate.baseDmg * floorScaleDmg * areaScale * rarityDmgMult * levelModifier);

    const newEnemy = {
      ...mobTemplate,
      maxHp,
      dmg,
      currentHp: maxHp,
      isFrozen: false,
      poisonStacks: 0
    };

    setEnemy(newEnemy);
    addLog(isBossFloor ? `⚠️ БОСС: ${newEnemy.name} преграждает путь!` : `Впереди ${newEnemy.name} (${newEnemy.rarity})`);
    saveState(newEnemy, userHp, floor, selectedArea);
    setTurnCount(0);
  };

  const saveState = (activeEnemy: any, hp: number, currentFloor: number, area: DungeonArea) => {
    if (gameState === 'GAMEOVER' || !mountedRef.current || isFleeingRef.current) return;
    onUpdateUser({
      ...user,
      hp: hp,
      dungeonState: { floor: currentFloor, hp: hp, activeEnemy: activeEnemy, area: area }
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

    const regenVal = getSpecialEffectValue('REGEN');
    if (regenVal > 0 && userHp < user.maxHp) {
      const actualHeal = Math.min(regenVal, user.maxHp - userHp);
      setUserHp(prev => prev + actualHeal);
      addLog(`🌿 Регенерация: +${actualHeal} HP`);
    }

    setAnimationClass('animate-slash');
    setTimeout(() => { if(mountedRef.current) setAnimationClass(''); }, 300);

    const str = getTotalStat(StatType.STRENGTH);
    const weapon = user.equipment.weapon;
    const weaponDmg = weapon?.baseDamage || 2;
    const scalingStat = weapon?.scalingStat || StatType.STRENGTH;
    const scaler = getTotalStat(scalingStat);
    
    // Improved player damage scaling
    let dmg = Math.floor(weaponDmg * (1 + scaler / 12) + (str / 1.2));
    
    const executeVal = getSpecialEffectValue('EXECUTE');
    if (executeVal > 0 && (enemy.currentHp / enemy.maxHp) <= 0.3) {
      const bonus = Math.floor(dmg * (executeVal / 100));
      dmg += bonus;
      addLog(`⚔️ КАЗНЬ! Дополнительный урон: +${bonus}`);
    }

    const critChanceEffect = getSpecialEffectValue('CRIT_CHANCE');
    const critChance = (getTotalStat(StatType.CHARISMA) * 0.015) + (critChanceEffect * 0.01);
    const isCrit = Math.random() < critChance;
    if (isCrit) dmg = Math.floor(dmg * 2);

    addLog(`Вы нанесли ${dmg} урона ${isCrit ? '(КРИТ!)' : ''}`);
    
    let nextFrozen = enemy.isFrozen;
    let nextPoison = enemy.poisonStacks || 0;

    const frostProb = getSpecialEffectValue('FROST_STRIKE');
    if (frostProb > 0 && Math.random() * 100 < frostProb) {
      nextFrozen = true;
      addLog(`❄️ Враг заморожен! Его следующий удар будет слабее.`);
    }

    const poisonVal = getSpecialEffectValue('POISON_BITE');
    if (poisonVal > 0) {
      nextPoison += poisonVal;
      addLog(`🧪 Враг отравлен (+${poisonVal} яда)`);
    }

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
    
    if (newEnemyHp <= 0) {
      handleWinCombat();
      return; 
    }

    const updatedEnemy = { ...enemy, currentHp: newEnemyHp, isFrozen: nextFrozen, poisonStacks: nextPoison };
    setEnemy(updatedEnemy);
    
    saveState(updatedEnemy, userHp, floor, selectedArea!);
    setTimeout(() => { if (!isFleeingRef.current) enemyTurn(updatedEnemy); }, 600);
  };

  const enemyTurn = (currentEnemy: typeof enemy) => {
    if (!currentEnemy || gameState !== 'COMBAT' || !mountedRef.current || isFleeingRef.current) return;
    
    setTurnCount(prev => prev + 1);

    if ((currentEnemy.poisonStacks || 0) > 0) {
      const poisonDmg = currentEnemy.poisonStacks!;
      addLog(`🧪 Яд разъедает врага: -${poisonDmg} HP`);
      const afterPoisonHp = currentEnemy.currentHp - poisonDmg;
      if (afterPoisonHp <= 0) {
        handleWinCombat();
        return;
      }
      currentEnemy.currentHp = afterPoisonHp;
      setEnemy({ ...currentEnemy });
    }

    if (selectedArea === DungeonArea.SUNKEN_CITY && (turnCount + 1) % 5 === 0) {
      const pressureDmg = Math.floor(user.maxHp * 0.03);
      addLog(`🌊 Глубинное давление сдавливает вас: -${pressureDmg} HP`);
      setUserHp(prev => {
        const afterPressure = Math.max(0, prev - pressureDmg);
        if (afterPressure <= 0) setGameState('GAMEOVER');
        return afterPressure;
      });
      if (userHp - pressureDmg <= 0) return;
    }

    const dodgeChance = getSpecialEffectValue('DODGE');
    if (Math.random() < (dodgeChance / 100)) {
      addLog(`💨 Вы уклонились от атаки ${currentEnemy.name}!`);
      return;
    }

    setAnimationClass('animate-shake');
    setTimeout(() => { if(mountedRef.current) setAnimationClass(''); }, 500);

    const def = (Object.values(user.equipment) as (Item | null)[]).reduce((sum, i) => sum + (i?.defense || 0), 0) + getTotalStat(StatType.ENDURANCE) * 0.6;
    const resist = (Object.values(user.equipment) as (Item | null)[]).reduce((sum, i) => sum + (i?.resistances?.[currentEnemy.damageType] || 0), 0);
    
    let rawDmg = currentEnemy.dmg + Math.floor(Math.random() * (floor * 0.2));
    
    if (currentEnemy.isFrozen) {
      rawDmg = Math.floor(rawDmg * 0.5);
      addLog(`❄️ Удар врага ослаблен заморозкой!`);
      currentEnemy.isFrozen = false; 
      setEnemy({ ...currentEnemy });
    }

    let afterDef = Math.max(1, rawDmg - def);
    let finalDmg = Math.floor(afterDef * (1 - Math.min(75, resist) / 100));

    addLog(`${currentEnemy.name} бьет: ${finalDmg} урона.`);
    
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
      saveState(currentEnemy, newUserHp, floor, selectedArea!);
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
    onUpdateUser({ ...user, inventory: newInv, hp: newHp, dungeonState: { ...user.dungeonState!, hp: newHp, area: selectedArea! } });
  };

  const handleWinCombat = () => {
    const goldBoost = getSpecialEffectValue('GOLD_BOOST');
    const xpBoost = getSpecialEffectValue('XP_BOOST');
    const areaBonus = selectedArea === DungeonArea.SUNKEN_CITY ? 1.2 : 1.0;

    let rarityBonus = 1.0;
    switch(enemy?.rarity) {
      case Rarity.RARE: rarityBonus = 1.8; break;
      case Rarity.EPIC: rarityBonus = 3.5; break;
      case Rarity.LEGENDARY: rarityBonus = 8.0; break;
    }

    let gold = Math.floor((12 * floor + Math.random() * 20) * areaBonus * rarityBonus); 
    if (goldBoost > 0) gold = Math.floor(gold * (1 + goldBoost / 100));

    let xp = Math.floor((25 * floor + Math.random() * 40) * areaBonus * rarityBonus);
    if (xpBoost > 0) xp = Math.floor(xp * (1 + xpBoost / 100));

    let droppedItem: Item | undefined = undefined;
    if (enemy) {
        let dropRoll = Math.random();
        let dropChance = 0.1; 
        
        if (enemy.rarity === Rarity.RARE) dropChance = 0.25;
        if (enemy.rarity === Rarity.EPIC) dropChance = 0.5;
        if (enemy.rarity === Rarity.LEGENDARY) dropChance = 0.9;

        if (dropRoll < dropChance) {
          const candidates = ITEMS_POOL.filter(i => {
            if (enemy.rarity === Rarity.COMMON) return i.rarity === Rarity.COMMON;
            if (enemy.rarity === Rarity.RARE) return i.rarity === Rarity.COMMON || i.rarity === Rarity.RARE;
            if (enemy.rarity === Rarity.EPIC) return i.rarity === Rarity.RARE || i.rarity === Rarity.EPIC;
            if (enemy.rarity === Rarity.LEGENDARY) return i.rarity === Rarity.EPIC || i.rarity === Rarity.LEGENDARY;
            return false;
          });

          if (candidates.length > 0) {
            droppedItem = { ...candidates[Math.floor(Math.random() * candidates.length)], id: Math.random().toString(36).substr(2, 9) };
          }
        }
    }

    setLoot({ gold, item: droppedItem });
    setGameState(floor % 5 === 0 ? 'VICTORY' : 'LOOT');
    addLog(`Победа над ${enemy?.name}! +${gold}G, +${xp}XP`);

    const newInv = [...user.inventory];
    if (droppedItem) newInv.push(droppedItem);
    
    onUpdateUser({
      ...user,
      coins: user.coins + gold,
      xp: user.xp + xp,
      inventory: newInv,
      hp: userHp,
      dungeonState: { floor: floor + 1, hp: userHp, activeEnemy: undefined, area: selectedArea! }
    });
  };

  const nextFloor = () => { setFloor(f => f + 1); setEnemy(null); setGameState('COMBAT'); };
  
  const handleManualExit = () => { 
    isFleeingRef.current = true; 
    if (gameState === 'COMBAT') saveState(enemy, userHp, floor, selectedArea!); 
    onExit(); 
  };

  const handleFlee = () => { 
    if (window.confirm("Сбежать? Вы потеряете прогресс этажа, но встретите нового врага!")) {
      isFleeingRef.current = true;
      setEnemy(null);
      setGameState('COMBAT');
      // Completely wipe activeEnemy from the state to force a new spawn
      onUpdateUser({ ...user, hp: userHp, dungeonState: { ...user.dungeonState!, activeEnemy: undefined } }); 
      onExit(); 
    }
  };

  const handleRevive = () => { 
    onUpdateUser({ ...user, hp: user.maxHp, dungeonState: { ...user.dungeonState!, floor, hp: user.maxHp, area: selectedArea! } }); 
    setUserHp(user.maxHp); 
    setEnemy(null); 
    setGameState('COMBAT'); 
    setLogs(["Вы воскресли!"]); 
  };

  const getDamageIcon = (type: DamageType) => {
    switch(type) {
      case DamageType.FIRE: return <Flame size={20} className="text-orange-500" fill="currentColor"/>;
      case DamageType.MAGIC: return <Sparkles size={20} className="text-purple-500" fill="currentColor"/>;
      case DamageType.POISON: return <Activity size={20} className="text-green-500" fill="currentColor"/>;
      case DamageType.FROST: return <Snowflake size={20} className="text-blue-400" fill="currentColor"/>;
      case DamageType.LIGHTNING: return <Zap size={20} className="text-yellow-400" fill="currentColor"/>;
      default: return <Sword size={20} className="text-slate-400" fill="currentColor"/>;
    }
  };

  if (!selectedArea) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a120b] p-6 text-center animate-fadeIn">
        <MapIcon size={64} className="text-[#ffb74d] mb-4" />
        <h2 className="text-3xl font-serif font-bold text-[#efebe9] mb-2 uppercase tracking-widest">Выберите Регион</h2>
        <p className="text-slate-400 mb-8 italic text-sm">Новая экспедиция сбросит предыдущий прогресс.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          <button 
            onClick={() => setSelectedArea(DungeonArea.RUINS)}
            className="flex flex-col items-center p-6 bg-[#2d1b13] border-4 border-[#5d4037] rounded-lg hover:border-[#ffb74d] transition-all group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80&w=600')] opacity-20 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-4xl mb-2">🏰</span>
              <h3 className="text-xl font-bold text-[#ffcc80] mb-1">{DungeonArea.RUINS}</h3>
              <p className="text-xs text-slate-300">Сбалансированные противники.</p>
            </div>
          </button>

          <button 
            onClick={() => setSelectedArea(DungeonArea.SUNKEN_CITY)}
            className="flex flex-col items-center p-6 bg-[#1a237e]/40 border-4 border-[#303f9f] rounded-lg hover:border-[#42a5f5] transition-all group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&q=80&w=600')] opacity-20 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 flex flex-col items-center">
              <Waves size={32} className="text-blue-400 mb-2" />
              <h3 className="text-xl font-bold text-blue-200 mb-1">{DungeonArea.SUNKEN_CITY}</h3>
              <p className="text-xs text-blue-100">Эффект Давления. +20% к наградам.</p>
            </div>
          </button>
        </div>

        <button onClick={onExit} className="mt-8 text-slate-500 hover:text-white underline text-sm">Назад в город</button>
      </div>
    );
  }

  if (gameState === 'GAMEOVER') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-center p-6 animate-fadeIn pb-20">
        <Skull size={80} className="text-red-600 mb-4 animate-bounce" />
        <h2 className="text-3xl font-bold text-red-500 mb-2">ПОРАЖЕНИЕ</h2>
        <p className="text-slate-400 mb-6">{selectedArea} - Этаж {floor}</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
            <button onClick={handleRevive} className="bg-red-900 border border-red-600 px-6 py-3 rounded text-white font-bold hover:bg-red-800 transition-colors">Попробовать снова</button>
            <button onClick={() => { isFleeingRef.current = true; onUpdateUser({ ...user, hp: 0, dungeonState: undefined }); onExit(); }} className="text-slate-500 underline">В город (Сброс)</button>
        </div>
      </div>
    );
  }

  const isSunken = selectedArea === DungeonArea.SUNKEN_CITY;
  const enemyStyle = enemy ? MATERIAL_STYLES[enemy.rarity] : MATERIAL_STYLES[Rarity.COMMON];

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${isSunken ? 'bg-[#001219]' : 'bg-black'}`}>
      {isSunken && Array.from({length: 15}).map((_, i) => (
        <div key={i} className="bubble" style={{
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 15 + 5}px`,
          height: `${Math.random() * 15 + 5}px`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${Math.random() * 5 + 5}s`
        }}></div>
      ))}

      <div className={`${isSunken ? 'bg-[#002b36]' : 'bg-[#2d1b13]'} p-3 flex justify-between items-center text-xs font-bold border-b border-[#3e2723] z-10 shadow-lg safe-area-top transition-colors`}>
        <div className="flex items-center gap-2 bg-red-900/40 px-3 py-1 rounded border border-red-900 text-red-100">
           <Heart size={16} fill="currentColor"/> <span className="text-lg">{userHp}</span><span className="text-white/50">/{user.maxHp}</span>
        </div>
        <div className="flex flex-col items-center">
           <span className={`${isSunken ? 'text-blue-300' : 'text-[#a1887f]'} uppercase tracking-widest text-[10px]`}>{selectedArea}</span>
           <div className="flex items-center gap-1">
             <span className={`${isSunken ? 'text-blue-100' : 'text-[#ffb74d]'} text-lg`}>Этаж {floor}</span>
             <ChevronUp size={12} className="text-red-500 animate-pulse" />
           </div>
        </div>
        <div className="flex gap-2">
            <button onClick={handleFlee} title="Сбежать" className="text-red-400 border border-red-900 px-2 py-1 rounded bg-black/40 z-50 cursor-pointer active:bg-red-900 active:scale-95 transition-all flex items-center gap-1">
               <Footprints size={16}/> <span className="hidden sm:inline">Побег</span>
            </button>
            <button onClick={handleManualExit} title="Выйти" className="text-slate-400 border border-slate-700 px-2 py-1 rounded bg-black/40 z-50 cursor-pointer active:bg-slate-800"><LogOut size={16} /></button>
        </div>
      </div>
      
      <div className="flex-1 relative flex flex-col items-center justify-center p-4 transition-all duration-1000 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${bgImage})` }}>
        {animationClass === 'animate-slash' && <div className="absolute inset-0 bg-white/20 z-20 pointer-events-none"></div>}
        
        {enemy && gameState === 'COMBAT' && (
           <div className={`flex flex-col items-center w-full max-w-xs ${animationClass}`}>
             <div className="text-8xl mb-4 drop-shadow-[0_0_25px_rgba(0,150,255,0.6)] transform hover:scale-110 transition-transform cursor-crosshair relative" onClick={handleAttack}>
               {enemy.icon}
               <div className="absolute -top-4 right-0 flex gap-1">
                 {getDamageIcon(enemy.damageType)}
               </div>
               
               {/* FIX: Simplified Boolean checks with Number() and strict comparison to avoid rendering 0 */}
               {Number(enemy.poisonStacks || 0) > 0 && (
                 <div className="absolute -bottom-2 right-0 bg-green-900 border border-green-500 text-green-100 text-[10px] px-1.5 rounded-full animate-pulse shadow-lg">🧪 x{enemy.poisonStacks}</div>
               )}
               {Boolean(enemy.isFrozen) === true && (
                 <div className="absolute -bottom-2 left-0 bg-blue-900 border border-blue-500 text-blue-100 text-[10px] px-1.5 rounded-full animate-pulse shadow-lg">❄️ FROZEN</div>
               )}
             </div>
             <div className={`w-full bg-black/70 backdrop-blur-md p-3 rounded-lg border-2 ${enemyStyle.border} shadow-2xl`}>
               <div className="flex justify-between items-center mb-1">
                  <span className={`font-bold tracking-tight ${enemyStyle.text}`}>{enemy.name}</span>
                  <span className={`text-[8px] font-bold border px-1.5 py-0.5 rounded uppercase ${enemyStyle.border} ${enemyStyle.text}`}>
                    {enemy.rarity}
                  </span>
               </div>
               <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-600">
                  <div className={`h-full transition-all duration-300 ${enemy.isBoss ? 'bg-red-600' : 'bg-orange-500'}`} style={{ width: `${(enemy.currentHp / enemy.maxHp) * 100}%` }}></div>
               </div>
               <div className="flex justify-between items-center mt-1">
                  <span className="text-[9px] text-slate-500 flex items-center gap-1"><AlertCircle size={10}/> {enemy.dmg} DMG</span>
                  <span className="text-right text-[10px] text-slate-400 font-mono font-bold">{enemy.currentHp} / {enemy.maxHp} HP</span>
               </div>
             </div>
           </div>
        )}
        
        {(gameState === 'LOOT' || gameState === 'VICTORY') && (
           <div className="flex flex-col items-center animate-fadeIn bg-black/80 p-8 rounded-xl border-2 border-[#ffb74d] shadow-[0_0_50px_rgba(255,183,77,0.3)]">
             <Gift size={64} className="text-[#ffb74d] mb-4 animate-bounce" />
             <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">{gameState === 'VICTORY' ? 'БОСС ПОВЕРЖЕН!' : 'ПОБЕДА!'}</h3>
             <div className="text-center space-y-2 mb-6">
                <div className="text-yellow-400 font-mono text-xl font-bold">+ {loot?.gold} G</div>
                {loot?.item && (
                  <div className={`flex items-center gap-2 p-2 rounded border-2 bg-[#2d1b13] ${MATERIAL_STYLES[loot.item.rarity].border} ${MATERIAL_STYLES[loot.item.rarity].text}`}>
                    <span className="text-2xl">{loot.item.icon}</span>
                    <div className="text-left">
                      <div className="font-bold text-sm">{loot.item.name}</div>
                      <div className="text-[10px] uppercase opacity-70">{loot.item.rarity}</div>
                    </div>
                  </div>
                )}
             </div>
             <div className="flex gap-3">
                <button onClick={handleManualExit} className="px-4 py-2 text-slate-300 hover:text-white underline text-sm">В город</button>
                <button onClick={nextFloor} className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-6 rounded shadow-lg flex items-center gap-2 transform active:scale-95 transition-transform">Дальше <Zap size={16}/></button>
             </div>
           </div>
        )}
      </div>

      <div className={`h-40 ${isSunken ? 'bg-[#001e26] border-[#002b36]' : 'bg-[#1a120b] border-[#3e2723]'} border-t-4 flex flex-col safe-area-bottom transition-colors`}>
         <div ref={logBoxRef} className={`flex-1 p-3 overflow-y-auto text-xs font-mono space-y-1.5 ${isSunken ? 'text-blue-100' : 'text-[#d7ccc8]'} scroll-smooth`}>
            {logs.map((l, i) => (
              <div key={i} className={`border-l-2 ${isSunken ? 'border-blue-900' : 'border-[#5d4037]'} pl-2 opacity-90 animate-fadeIn`}>
                {l}
              </div>
            ))}
         </div>
         {gameState === 'COMBAT' && (
           <div className={`p-3 grid grid-cols-2 gap-3 ${isSunken ? 'bg-[#002b36]' : 'bg-[#2d1b13]'} transition-colors`}>
              <button onClick={handleAttack} className="bg-red-900 hover:bg-red-800 border-2 border-red-950 text-white rounded-lg p-3 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md group">
                <Sword size={24} className="group-hover:rotate-12 transition-transform"/> <span className="font-bold uppercase tracking-wider">Удар</span>
              </button>
              <button onClick={handleUsePotion} className="bg-green-900 hover:bg-green-800 border-2 border-green-950 text-white rounded-lg p-3 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md">
                <Activity size={24} /> <span className="font-bold uppercase tracking-wider">Зелье</span>
              </button>
           </div>
         )}
      </div>
    </div>
  );
};