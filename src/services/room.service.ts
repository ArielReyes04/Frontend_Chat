import { apiClient } from '../api/client';
import type { Room } from '../types/room';

export const roomService = {
  async getAll(): Promise<Room[]> {
    const res = await apiClient.get('/rooms');
    return res.data;
  },
};