'use client';

import React, { useState } from 'react';
import { X, Heart, ShieldAlert, Plus, Minus, Sparkles } from 'lucide-react';
import { Character } from '@/types/character';

interface HpActionModalProps {
  isOpen: boolean;
  character: Character | null;
  action: 'damage' | 'heal';
  onClose: () => void;
  onConfirm: (id: string, amount: number) => Promise<void>;
}

export const HpActionModal: React.FC<HpActionModalProps> = ({
  isOpen,
  character,
  action,
  onClose,
  onConfirm,
}) => {
  const [amount, setAmount] = useState<string>('5');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !character) return null;

  const isDamage = action === 'damage';

  const handleQuickAdd = (valueToAdd: number) => {
    const current = parseInt(amount, 10) || 0;
    setAmount(Math.max(1, current + valueToAdd).toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const val = parseInt(amount, 10);
    if (isNaN(val) || val <= 0) {
      setError('Insira um valor maior que zero.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirm(character.id, val);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Falha ao aplicar alteração de HP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDamage ? 'bg-rose-950/60 border-rose-900/40 text-rose-300' : 'bg-emerald-950/60 border-emerald-900/40 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2 font-bold">
            {isDamage ? <ShieldAlert className="w-5 h-5" /> : <Heart className="w-5 h-5 fill-emerald-400/20" />}
            <h2 className="font-cinzel text-lg">
              {isDamage ? 'Aplicar Dano em' : 'Aplicar Cura em'} {character.name}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-rose-950/80 border border-rose-600/50 rounded-xl text-rose-200 text-xs">
              {error}
            </div>
          )}

          {/* Current HP Summary */}
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">HP Atual:</span>
            <span className="font-mono text-sm font-bold text-slate-100">
              {character.current_hp} / {character.max_hp} HP
            </span>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              {isDamage ? 'Quantidade de Dano' : 'Quantidade de Cura'}
            </label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl text-slate-100 text-lg font-bold text-center focus:outline-none"
              autoFocus
              required
            />
          </div>

          {/* Quick Adjustment Pills */}
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 mb-1.5">Ajuste Rápido:</span>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {[-10, -5, -1, +1, +5, +10, +20].map((delta) => (
                <button
                  key={delta}
                  type="button"
                  onClick={() => handleQuickAdd(delta)}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-300 hover:text-amber-300 transition-colors"
                >
                  {delta > 0 ? `+${delta}` : delta}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white text-sm font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 font-bold text-sm rounded-xl text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
                isDamage
                  ? 'bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-600 hover:to-rose-500 shadow-rose-900/40'
                  : 'bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 shadow-emerald-900/40'
              }`}
            >
              {isSubmitting ? 'Processando...' : isDamage ? 'Confirmar Dano' : 'Confirmar Cura'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
