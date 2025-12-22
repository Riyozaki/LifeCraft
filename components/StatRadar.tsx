import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { StatType } from '../types';

interface StatRadarProps {
  stats: Record<StatType, number>;
}

export const StatRadar: React.FC<StatRadarProps> = ({ stats }) => {
  const data = Object.values(StatType).map(statKey => ({
    subject: statKey,
    A: stats[statKey],
    fullMark: 30 // Soft cap for visualization
  }));

  return (
    <div className="w-full h-64 bg-slate-900/50 rounded-2xl p-2 border border-slate-800">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#475569" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} 
          />
          <Radar
            name="Stats"
            dataKey="A"
            stroke="#6366f1"
            strokeWidth={3}
            fill="#818cf8"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};