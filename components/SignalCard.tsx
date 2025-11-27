import React from 'react';
import { SignalStatus } from '../types';

interface SignalCardProps {
  name: string;
  value: string | number;
  status: 'positive' | 'negative' | 'neutral';
  description: string;
}

const SignalCard: React.FC<SignalCardProps> = ({ name, value, status, description }) => {
  const getColor = () => {
    switch (status) {
      case 'positive': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'negative': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-700/30 text-gray-400 border-gray-600/30';
    }
  };

  return (
    <div className={`p-3 rounded-lg border ${getColor()} backdrop-blur-sm flex flex-col justify-between transition-all duration-300 hover:scale-105`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs uppercase font-bold tracking-wider opacity-80">{name}</span>
        {status === 'negative' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
        {status === 'positive' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      </div>
      <div className="text-xl font-mono font-bold">{value}</div>
      <div className="text-[10px] opacity-70 mt-1 leading-tight">{description}</div>
    </div>
  );
};

export default SignalCard;
