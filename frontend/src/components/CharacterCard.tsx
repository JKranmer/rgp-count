'use client';

import React, { useState } from 'react';
import { Character } from '@/types/character';
import {
  Heart,
  Shield,
  Skull,
  User,
  Crown,
  Ghost,
  Plus,
  Minus,
  Trash2,
  Edit2,
  Sparkles,
  Check,
  X,
} from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  isActiveTurn: boolean;
  onDamage: (id: string, amount: number) => void;
  onHeal: (id: string, amount: number) => void;
  onOpenHpModal: (character: Character, action: 'damage' | 'heal') => void;
  onUpdateOrder: (id: string, newOrder: number) => void;
  onDelete: (id: string) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isActiveTurn,
  onDamage,
  onHeal,
  onOpenHpModal,
  onUpdateOrder,
  onDelete,
}) => {
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [tempOrder, setTempOrder] = useState(character.order.toString());
  const [isDeleting, setIsDeleting] = useState(false);

  const hpPercent = Math.max(0, Math.min(100, (character.current_hp / character.max_hp) * 100));
  const isDead = character.current_hp <= 0;

  // Type Badges & Colors
  const getTypeBadge = (typeStr: string) => {
    const type = typeStr.toLowerCase();
    switch (type) {
      case 'player':
      case 'jogador':
        return {
          label: 'Jogador',
          icon: <User className="w-3 h-3" />,
          classes: 'bg-blue-950/80 text-blue-300 border-blue-500/40',
        };
      case 'boss':
      case 'chefe':
        return {
          label: 'Chefe',
          icon: <Crown className="w-3 h-3 text-amber-400" />,
          classes: 'bg-amber-950/80 text-amber-300 border-amber-500/40 font-bold',
        };
      case 'monster':
      case 'monstro':
        return {
          label: 'Monstro',
          icon: <Skull className="w-3 h-3 text-rose-400" />,
          classes: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
        };
      case 'npc':
      default:
        return {
          label: 'NPC / Aliado',
          icon: <Ghost className="w-3 h-3 text-purple-400" />,
          classes: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
        };
    }
  };

  const badge = getTypeBadge(character.character_type);

  // Dynamic HP Bar Color
  const getHpBarColor = () => {
    if (hpPercent <= 0) return 'bg-slate-700';
    if (hpPercent <= 25) return 'bg-gradient-to-r from-rose-700 to-rose-500 animate-pulse';
    if (hpPercent <= 60) return 'bg-gradient-to-r from-amber-600 to-amber-400';
    return 'bg-gradient-to-r from-emerald-600 to-emerald-400';
  };

  const handleSaveOrder = () => {
    const val = parseInt(tempOrder, 10);
    if (!isNaN(val)) {
      onUpdateOrder(character.id, val);
    }
    setIsEditingOrder(false);
  };

  return (
    <div
      className={`relative group rounded-2xl transition-all duration-300 border overflow-hidden ${
        isActiveTurn
          ? 'bg-slate-900/95 border-amber-500 shadow-active-turn ring-1 ring-amber-500/50 scale-[1.01]'
          : isDead
          ? 'bg-slate-950/60 border-slate-800/80 opacity-70 grayscale-[30%]'
          : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700 shadow-lg'
      }`}
    >
      {/* Turn Indicator Overlay Ribbon */}
      {isActiveTurn && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 shadow-gold-glow animate-pulse" />
      )}

      <div className="p-4 sm:p-5">
        {/* Top Header Row: Initiative Badge, Name, Type Badge, Active Turn Glow */}
        <div className="flex items-start justify-between gap-3 mb-3">
          
          {/* Initiative Badge & Name */}
          <div className="flex items-center gap-3">
            {/* Initiative Order Badge */}
            <div className="relative group/order">
              {isEditingOrder ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={tempOrder}
                    onChange={(e) => setTempOrder(e.target.value)}
                    className="w-12 px-1.5 py-0.5 bg-slate-950 border border-amber-500 text-amber-200 text-sm rounded text-center focus:outline-none"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveOrder()}
                  />
                  <button onClick={handleSaveOrder} className="text-emerald-400 p-0.5 hover:text-emerald-300">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setIsEditingOrder(false)} className="text-rose-400 p-0.5 hover:text-rose-300">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setTempOrder(character.order.toString());
                    setIsEditingOrder(true);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-300 text-xs font-bold transition-colors"
                  title="Clique para editar iniciativa"
                >
                  <span className="text-[10px] text-amber-500 uppercase">Inic:</span>
                  <span>{character.order}</span>
                  <Edit2 className="w-2.5 h-2.5 text-amber-400/60 opacity-0 group-hover/order:opacity-100 transition-opacity" />
                </button>
              )}
            </div>

            {/* Character Name */}
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`font-cinzel text-lg sm:text-xl font-bold tracking-wide ${isDead ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                  {character.name}
                </h3>
                {isActiveTurn && (
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                    Turno Ativo
                  </span>
                )}
              </div>

              {/* Type Badge */}
              <div className="mt-1">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${badge.classes}`}>
                  {badge.icon}
                  {badge.label}
                </span>
              </div>
            </div>
          </div>

          {/* Delete Action */}
          <div>
            {isDeleting ? (
              <div className="flex items-center gap-1 bg-rose-950/90 border border-rose-600/50 rounded-lg p-1">
                <span className="text-[10px] text-rose-200 px-1 font-semibold">Excluir?</span>
                <button
                  onClick={() => onDelete(character.id)}
                  className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold"
                >
                  Sim
                </button>
                <button
                  onClick={() => setIsDeleting(false)}
                  className="px-1.5 py-0.5 text-slate-300 hover:text-white text-xs"
                >
                  Não
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsDeleting(true)}
                className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                title="Remover personagem"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* HP Progress Bar Section */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <Heart className={`w-4 h-4 ${isDead ? 'text-slate-500' : 'fill-rose-500/20 text-rose-500'}`} />
              <span>Pontos de Vida (HP)</span>
            </div>
            <div className="font-mono text-xs sm:text-sm font-bold">
              <span className={isDead ? 'text-rose-500 font-bold' : 'text-slate-100'}>
                {character.current_hp}
              </span>
              <span className="text-slate-500"> / {character.max_hp}</span>
              <span className="text-slate-400 text-[10px] ml-1.5">({Math.round(hpPercent)}%)</span>
            </div>
          </div>

          {/* Progress Track */}
          <div className="relative w-full h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
            <div
              className={`h-full transition-all duration-500 rounded-full ${getHpBarColor()}`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>

          {/* Fainted Status Badge if dead */}
          {isDead && (
            <div className="mt-2 flex items-center justify-center gap-1.5 py-1 px-3 bg-rose-950/60 border border-rose-800/40 rounded-lg text-rose-300 text-xs font-bold tracking-wider uppercase">
              <Skull className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
              Inconsciente / Derrotado
            </div>
          )}
        </div>

        {/* Quick Action Buttons Row */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
          
          {/* Quick Damage */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 mr-1">Dano:</span>
            <button
              onClick={() => onDamage(character.id, 1)}
              className="px-2 py-1 bg-rose-950/50 hover:bg-rose-900/80 text-rose-300 border border-rose-800/40 rounded-lg text-xs font-bold transition-all active:scale-95"
              title="Causar 1 de Dano"
            >
              -1
            </button>
            <button
              onClick={() => onDamage(character.id, 5)}
              className="px-2 py-1 bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-700/50 rounded-lg text-xs font-bold transition-all active:scale-95"
              title="Causar 5 de Dano"
            >
              -5
            </button>
            <button
              onClick={() => onOpenHpModal(character, 'damage')}
              className="p-1 bg-rose-900/30 hover:bg-rose-900/60 text-rose-300 border border-rose-800/30 rounded-lg text-xs transition-all"
              title="Dano Personalizado..."
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Heal */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 mr-1">Cura:</span>
            <button
              onClick={() => onHeal(character.id, 1)}
              className="px-2 py-1 bg-emerald-950/50 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/40 rounded-lg text-xs font-bold transition-all active:scale-95"
              title="Curar 1 de Vida"
            >
              +1
            </button>
            <button
              onClick={() => onHeal(character.id, 5)}
              className="px-2 py-1 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/50 rounded-lg text-xs font-bold transition-all active:scale-95"
              title="Curar 5 de Vida"
            >
              +5
            </button>
            <button
              onClick={() => onOpenHpModal(character, 'heal')}
              className="p-1 bg-emerald-900/30 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/30 rounded-lg text-xs transition-all"
              title="Cura Personalizada..."
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
