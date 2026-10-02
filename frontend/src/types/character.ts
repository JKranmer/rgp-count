export type CharacterType = 'player' | 'npc' | 'monster' | 'boss' | 'ally' | 'enemy';

export interface Character {
  id: string;
  name: string;
  character_type: CharacterType | string;
  max_hp: number;
  current_hp: number;
  order: number;
}

export interface AddCharacterPayload {
  name: string;
  character_type: string;
  max_hp: number;
  current_hp: number;
  order: number;
}

export interface CombatLogEntry {
  id: string;
  timestamp: string;
  text: string;
  type: 'damage' | 'heal' | 'turn' | 'system' | 'character';
}
