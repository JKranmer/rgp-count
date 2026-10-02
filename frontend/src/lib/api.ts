import { Character, AddCharacterPayload } from '@/types/character';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }

  return data as T;
}

export const api = {
  /**
   * Health check to test backend connection status
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/characters`, { method: 'GET', cache: 'no-store' });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * List characters sorted by initiative order
   */
  async getCharacters(): Promise<Character[]> {
    return fetchJson<Character[]>(`${BASE_URL}/characters`, {
      method: 'GET',
      cache: 'no-store',
    });
  },

  /**
   * Add a new character
   */
  async addCharacter(payload: AddCharacterPayload): Promise<Character> {
    return fetchJson<Character>(`${BASE_URL}/characters`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete a character by ID
   */
  async deleteCharacter(id: string): Promise<{ message: string }> {
    return fetchJson<{ message: string }>(`${BASE_URL}/characters/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Apply damage to a character
   */
  async damageCharacter(id: string, amount: number): Promise<Character> {
    return fetchJson<Character>(`${BASE_URL}/characters/${id}/damage`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },

  /**
   * Apply heal to a character
   */
  async healCharacter(id: string, amount: number): Promise<Character> {
    return fetchJson<Character>(`${BASE_URL}/characters/${id}/heal`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },

  /**
   * Update character initiative order
   */
  async updateOrder(id: string, order: number): Promise<Character> {
    return fetchJson<Character>(`${BASE_URL}/characters/${id}/order`, {
      method: 'PATCH',
      body: JSON.stringify({ order }),
    });
  },
};
