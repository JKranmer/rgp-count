'use client';

import React from 'react';
import { ShieldAlert, Swords, Plus, Play, ChevronRight, RotateCcw, Activity, RefreshCw } from 'lucide-react';

interface HeaderProps {
  round: number;
  activeCharacterName: string | null;
  totalCombatants: number;
  isBackendConnected: boolean;
  isRefreshing: boolean;
  onNextTurn: () => void;
  onResetCombat: () => void;
  onRefresh: () => void;
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  round,
  activeCharacterName,
  totalCombatants,
  isBackendConnected,
  isRefreshing,
  onNextTurn,
  onResetCombat,
  onRefresh,
  onOpenAddModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0F172A]/90 backdrop-blur-md border-b border-amber-500/20 shadow-xl px-4 py-3 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title and Backend Status */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 shadow-gold-glow">
            <Swords className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-amber-100">
                RPG Character Tracker
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  isBackendConnected
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-950/80 text-rose-400 border-rose-500/30'
                }`}
                title={isBackendConnected ? 'Backend Flask Online' : 'Backend Desconectado'}
              >
                <Activity className={`w-3 h-3 ${isBackendConnected ? 'animate-pulse' : ''}`} />
                {isBackendConnected ? 'Online' : 'Offline'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {totalCombatants} combatente{totalCombatants === 1 ? '' : 's'} no campo de batalha
            </p>
          </div>
        </div>

        {/* Combat Tracker Controls */}
        <div className="flex items-center flex-wrap justify-center gap-2 sm:gap-3 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          
          {/* Round Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400">Rodada</span>
            <span className="font-cinzel text-lg font-bold text-amber-200">{round}</span>
          </div>

          {/* Active Turn Display */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-lg text-xs border border-slate-700/60 max-w-[200px] truncate">
            <span className="text-slate-400">Turno:</span>
            <span className="font-semibold text-amber-300 truncate">
              {activeCharacterName || 'Nenhum'}
            </span>
          </div>

          {/* Turn Buttons */}
          <button
            onClick={onNextTurn}
            disabled={totalCombatants === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-lg transition-all shadow-gold-glow active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            <span>Próximo Turno</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onResetCombat}
            title="Reiniciar Rodadas"
            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Atualizar Dados"
            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Add Character Button */}
        <div>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/40 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Novo Personagem</span>
          </button>
        </div>

      </div>
    </header>
  );
};
