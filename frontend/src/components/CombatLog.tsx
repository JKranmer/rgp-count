'use client';

import React, { useState } from 'react';
import { ScrollText, ChevronDown, ChevronUp, Trash2, ShieldAlert, Heart, Swords, PlusCircle } from 'lucide-react';
import { CombatLogEntry } from '@/types/character';

interface CombatLogProps {
  logs: CombatLogEntry[];
  onClearLogs: () => void;
}

export const CombatLog: React.FC<CombatLogProps> = ({ logs, onClearLogs }) => {
  const [isOpen, setIsOpen] = useState(true);

  const getLogIcon = (type: CombatLogEntry['type']) => {
    switch (type) {
      case 'damage':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      case 'heal':
        return <Heart className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'turn':
        return <Swords className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'character':
        return <PlusCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
      default:
        return <ScrollText className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800/80">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-amber-300 font-cinzel font-bold text-sm hover:text-amber-200"
        >
          <ScrollText className="w-4 h-4 text-amber-400" />
          <span>Histórico de Combate ({logs.length})</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {logs.length > 0 && isOpen && (
          <button
            onClick={onClearLogs}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
            title="Limpar Histórico"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar</span>
          </button>
        )}
      </div>

      {/* Log Feed */}
      {isOpen && (
        <div className="p-4 max-h-60 overflow-y-auto space-y-2 font-sans text-xs scrollbar-thin scrollbar-thumb-slate-700">
          {logs.length === 0 ? (
            <p className="text-slate-500 italic text-center py-3">
              Nenhuma ação registrada nesta sessão ainda.
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-2.5 p-2 bg-slate-950/50 rounded-xl border border-slate-800/50 text-slate-200"
              >
                {getLogIcon(log.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 leading-relaxed break-words">{log.text}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">
                  {log.timestamp}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
