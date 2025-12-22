import React from 'react';
import { X } from 'lucide-react';

interface TutorialProps {
  onClose: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-[#2d1b13] border-4 border-[#ffb74d] p-6 rounded-lg max-w-sm shadow-2xl relative">
        <h2 className="text-2xl font-serif font-bold text-[#ffb74d] mb-4">Добро пожаловать в LifeCraft!</h2>
        <div className="space-y-4 text-[#efebe9] text-sm leading-relaxed">
          <p>⚔️ <b className="text-[#ffcc80]">Герой:</b> Выполняй реальные задачи, чтобы прокачивать характеристики персонажа.</p>
          <p>🏰 <b className="text-[#ffcc80]">Магазин и Инвентарь:</b> Зарабатывай золото на квестах и покупай экипировку, чтобы стать сильнее.</p>
          <p>💀 <b className="text-[#ffcc80]">Подземелье:</b> Трать Энергию, чтобы сражаться с монстрами. Чем лучше твое снаряжение, тем глубже ты пройдешь.</p>
          <p>📜 <b className="text-[#ffcc80]">Гильдия:</b> Следи за успехами других героев.</p>
        </div>
        <button onClick={onClose} className="w-full mt-6 bg-[#ff6f00] hover:bg-[#e65100] text-white font-bold py-3 rounded shadow-lg uppercase tracking-widest transition-transform active:scale-95">
          Начать Приключение
        </button>
      </div>
    </div>
  );
};