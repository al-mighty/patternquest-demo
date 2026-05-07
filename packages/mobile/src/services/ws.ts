import { io, Socket } from 'socket.io-client';
import type { LeaderboardEntry } from '../shared';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

let socket: Socket | null = null;

export function connectWs(onLeaderboard: (data: LeaderboardEntry[]) => void) {
  if (socket) return socket;
  socket = io(API_URL, { transports: ['websocket'] });
  socket.on('leaderboard:update', onLeaderboard);
  return socket;
}

export function disconnectWs() {
  socket?.disconnect();
  socket = null;
}