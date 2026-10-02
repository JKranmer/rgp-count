'use client';

import React, { useState } from 'react';
import { X, ShieldPlus, User, Skull, Crown, Ghost, Dices } from 'lucide-react';
import { AddCharacterPayload } from '@/types/character';

interface AddCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (payload: AddCharacterPayload) => Promise<void>;
  suggestedOrder: number;
}

export const AddCharacterModal: React.FC<AddCharacterModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  suggestedOrder,
}) => {
  const [name, setName] = useState('');
  const [characterType, setCharacterType] = useState('player');
  const [maxHp, setMaxHp] = useState('20');
  const [currentHp, setCurrentHp] = useState('20');
  const [order, setOrder] = useState(suggestedOrder.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('O nome do personagem é obrigatório.');
      return;
    }

    const maxHpNum = parseInt(maxHp, 10);
    const currentHpNum = parseInt(currentHp, 10);
    const orderNum = parseInt(order, 10);

    if (isNaN(maxHpNum) || maxHpNum <= 0) {
      setError('O HP máximo deve ser um número maior que zero.');
      return;
    }

    if (isNaN(currentHpNum) || currentHpNum < 0) {
      setError('O HP atual deve ser um número válido (maior ou igual a 0).');
      return;
    }

    if (isNaN(orderNum)) {
      setError('A ordem de iniciativa deve ser um número.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAdd({
        name: name.trim(),
        character_type: characterType,
        max_hp: maxHpNum,
        current_hp: currentHpNum,
        order: orderNum,
      });

      // Reset form
      setName('');
      setMaxHp('20');
      setCurrentHp('20');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar personagem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const rollRandomInitiative = () => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    setOrder(d20.toString());
  };

  const handleMaxHpChange = (val: string) => {
    setMaxHp(val);
    // Auto sync current HP if it equals max HP
    if (currentHp === maxHp || currentHp === '' || parseInt(currentHp) > parseInt(val)) {
      setCurrentHp(val);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5 text-amber-400">
            <ShieldPlus className="w-5 h-5" />
            <h2 className="font-cinzel text-lg font-bold text-amber-100">Adicionar Novo Combatente</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-rose-950/80 border border-rose-600/50 rounded-xl text-rose-200 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Nome do Personagem / Monstro *
            </label>
            <input
              type="text"
              placeholder="Ex: Gandalf, Dragon, Goblin #1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
              autoFocus
              required
            />
          </div>

          {/* Character Type Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Tipo de Participante
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'player', label: 'Jogador', icon: <User className="w-3.5 h-3.5 text-blue-400" /> },
                { id: 'npc', label: 'NPC', icon: <Ghost className="w-3.5 h-3.5 text-purple-400" /> },
                { id: 'monster', label: 'Monstro', icon: <Skull className="w-3.5 h-3.5 text-rose-400" /> },
                { id: 'boss', label: 'Chefe', icon: <Crown className="w-3.5 h-3.5 text-amber-400" /> },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setCharacterType(type.id)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    characterType === type.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {type.icon}
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* HP Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                HP Máximo *
              </label>
              <input
                type="number"
                min="1"
                value={maxHp}
                onChange={(e) => handleMaxHpChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl text-slate-100 text-sm focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                HP Inicial *
              </label>
              <input
                type="number"
                min="0"
                value={currentHp}
                onChange={(e) => setCurrentHp(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl text-slate-100 text-sm focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Initiative / Order Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Ordem de Iniciativa *
              </label>
              <button
                type="button"
                onClick={rollRandomInitiative}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                <Dices className="w-3.5 h-3.5" />
                Rolar d20
              </button>
            </div>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl text-slate-100 text-sm focus:outline-none transition-colors"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Maior valor = age primeiro na lista de turnos (Iniciativa RPG).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white text-sm font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-gold-glow transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Adicionar ao Combate'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
