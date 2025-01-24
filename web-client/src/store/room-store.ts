import { writable } from 'svelte/store';
import type { RoomMessage } from '../types/room-types';

export const roomMessages = writable<RoomMessage[]>([]);
