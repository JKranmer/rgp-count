'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Character, AddCharacterPayload, CombatLogEntry } from '@/types/character';
import { api } from '@/lib/api';
import { Header } from '@/components/Header';
import { CharacterCard } from '@/components/CharacterCard';
import { AddCharacterModal } from '@/components/AddCharacterModal';
import { HpActionModal } from '@/components/HpActionModal';
import { CombatLog } from '@/components/CombatLog';
import { Search, ShieldAlert, Sparkles, UserPlus, Filter, Swords, RefreshCw } from 'lucide-react';

export default function Home() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [activeTurnIndex, setActiveTurnIndex] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [hpModalState, setHpModalState] = useState<{
    isOpen: boolean;
    character: Character | null;
    action: 'damage' | 'heal';
  }>({
    isOpen: false,
    character: null,
    action: 'damage',
  });

  // Session Combat Log
  const [logs, setLogs] = useState<CombatLogEntry[]>([]);

  const addLog = useCallback((text: string, type: CombatLogEntry['type']) => {
    const timeStr = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const newEntry: CombatLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: timeStr,
      text,
      type,
    };
    setLogs((prev) => [newEntry, ...prev]);
  }, []);

  // Fetch characters from backend API
  const loadCharacters = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setIsRefreshing(true);

    try {
      const isConnected = await api.checkHealth();
      setIsBackendConnected(isConnected);

      if (isConnected) {
        const data = await api.getCharacters();
        // Sort by order descending (highest initiative first)
        const sorted = [...data].sort((a, b) => b.order - a.order);
        setCharacters(sorted);
      }
    } catch (error: any) {
      console.error('Error fetching characters:', error);
      setIsBackendConnected(false);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    loadCharacters();
  }, [loadCharacters]);

  // Active turn character (highest initiative first)
  const sortedCharacters = [...characters].sort((a, b) => b.order - a.order);
  const activeCharacter = sortedCharacters.length > 0 ? sortedCharacters[activeTurnIndex % sortedCharacters.length] : null;

  // Turn Navigation
  const handleNextTurn = () => {
    if (sortedCharacters.length === 0) return;

    const nextIndex = (activeTurnIndex + 1) % sortedCharacters.length;
    setActiveTurnIndex(nextIndex);

    // Increment round if wrapped back to start
    if (nextIndex === 0) {
      setRound((r) => r + 1);
      addLog(`=== Nova Rodada ${round + 1} iniciada ===`, 'system');
    }

    const nextChar = sortedCharacters[nextIndex];
    if (nextChar) {
      addLog(`Turno de ${nextChar.name} (Iniciativa ${nextChar.order})`, 'turn');
    }
  };

  const handleResetCombat = () => {
    setActiveTurnIndex(0);
    setRound(1);
    addLog('O combate foi resetado para a Rodada 1.', 'system');
  };

  // Character Actions
  const handleAddCharacter = async (payload: AddCharacterPayload) => {
    const newChar = await api.addCharacter(payload);
    addLog(`${newChar.name} entrou no combate (Iniciativa ${newChar.order}, HP ${newChar.current_hp}/${newChar.max_hp})`, 'character');
    await loadCharacters(true);
  };

  const handleDeleteCharacter = async (id: string) => {
    const target = characters.find((c) => c.id === id);
    await api.deleteCharacter(id);
    if (target) {
      addLog(`${target.name} foi removido do combate.`, 'character');
    }
    await loadCharacters(true);
  };

  const handleDamage = async (id: string, amount: number) => {
    const updated = await api.damageCharacter(id, amount);
    addLog(`${updated.name} sofreu ${amount} de dano! HP: ${updated.current_hp}/${updated.max_hp}`, 'damage');
    await loadCharacters(true);
  };

  const handleHeal = async (id: string, amount: number) => {
    const updated = await api.healCharacter(id, amount);
    addLog(`${updated.name} recebeu ${amount} de cura. HP: ${updated.current_hp}/${updated.max_hp}`, 'heal');
    await loadCharacters(true);
  };

  const handleUpdateOrder = async (id: string, newOrder: number) => {
    const updated = await api.updateOrder(id, newOrder);
    addLog(`Iniciativa de ${updated.name} alterada para ${newOrder}.`, 'system');
    await loadCharacters(true);
  };

  // Filtered List
  const filteredCharacters = sortedCharacters.filter((char) => {
    const matchesSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || char.character_type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const suggestedNextOrder = characters.length > 0 ? Math.max(...characters.map((c) => c.order)) + 1 : 1;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation Header */}
      <Header
        round={round}
        activeCharacterName={activeCharacter ? activeCharacter.name : null}
        totalCombatants={characters.length}
        isBackendConnected={isBackendConnected}
        isRefreshing={isRefreshing}
        onNextTurn={handleNextTurn}
        onResetCombat={handleResetCombat}
        onRefresh={() => loadCharacters(false)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-8 space-y-6">
        
        {/* Backend Warning Banner if Offline */}
        {!isBackendConnected && (
          <div className="p-4 bg-rose-950/80 border border-rose-600/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <h4 className="font-bold text-rose-200 text-sm">Backend Flask Desconectado</h4>
                <p className="text-xs text-rose-300">
                  Certifique-se de que a API Flask esteja rodando em <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">http://127.0.0.1:5000</code>.
                </p>
              </div>
            </div>
            <button
              onClick={() => loadCharacters(false)}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-95 shrink-0"
            >
              Tentar Reconectar
            </button>
          </div>
        )}

        {/* Toolbar: Search, Filter Tabs & Add Button */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar combatente por nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500/80 rounded-xl text-slate-100 text-sm focus:outline-none transition-colors"
            />
          </div>

          {/* Type Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'player', label: 'Jogadores' },
              { id: 'npc', label: 'NPCs' },
              { id: 'monster', label: 'Monstros' },
              { id: 'boss', label: 'Chefes' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterType === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-gold-glow'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Grid of Characters */}
        {isLoading || !isMounted ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
            <p className="text-slate-400 text-sm font-cinzel">Carregando iniciativa dos combatentes...</p>
          </div>
        ) : filteredCharacters.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-8 space-y-4">
            <div className="p-4 bg-slate-800/60 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-slate-400">
              <Swords className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg font-bold text-slate-200">Nenhum combatente encontrado</h3>
              <p className="text-slate-400 text-xs mt-1">
                {characters.length === 0
                  ? 'Adicione personagens para iniciar o rastreamento de combate.'
                  : 'Nenhum participante corresponde aos filtros selecionados.'}
              </p>
            </div>
            {characters.length === 0 && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-gold-glow hover:bg-amber-400 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                Adicionar Primeiro Personagem
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCharacters.map((char) => (
              <CharacterCard
                key={char.id}
                character={char}
                isActiveTurn={activeCharacter?.id === char.id}
                onDamage={handleDamage}
                onHeal={handleHeal}
                onOpenHpModal={(c, act) =>
                  setHpModalState({ isOpen: true, character: c, action: act })
                }
                onUpdateOrder={handleUpdateOrder}
                onDelete={handleDeleteCharacter}
              />
            ))}
          </div>
        )}

        {/* Session Combat Log */}
        <div className="pt-4">
          <CombatLog logs={logs} onClearLogs={() => setLogs([])} />
        </div>

      </main>

      {/* Modals */}
      <AddCharacterModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCharacter}
        suggestedOrder={suggestedNextOrder}
      />

      <HpActionModal
        isOpen={hpModalState.isOpen}
        character={hpModalState.character}
        action={hpModalState.action}
        onClose={() => setHpModalState({ isOpen: false, character: null, action: 'damage' })}
        onConfirm={async (id, amount) => {
          if (hpModalState.action === 'damage') {
            await handleDamage(id, amount);
          } else {
            await handleHeal(id, amount);
          }
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500">
        RPG Character Tracker &bull; Clean Architecture & Next.js App Router
      </footer>
    </div>
  );
}
