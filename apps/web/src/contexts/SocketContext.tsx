import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { SocketEvents } from '../types';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinUserRoom: (userId: string) => void;
  leaveUserRoom: (userId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const newSocket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
      
      // Join user's personal room
      newSocket.emit('join-user', user.id);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const joinUserRoom = (userId: string) => {
    if (socket) {
      socket.emit('join-user', userId);
    }
  };

  const leaveUserRoom = (userId: string) => {
    if (socket) {
      socket.emit('leave-user', userId);
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    joinUserRoom,
    leaveUserRoom,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

// Hook for listening to specific socket events
export function useSocketEvent<T extends keyof SocketEvents>(
  event: T,
  callback: (data: SocketEvents[T]) => void
) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(event, callback as any);

    return () => {
      socket.off(event, callback as any);
    };
  }, [socket, event, callback]);
}

