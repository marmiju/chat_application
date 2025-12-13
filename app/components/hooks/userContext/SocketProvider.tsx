'use client';

import { UserInterface } from '@/public/interfaces/interfaces';
import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

/* ================= TYPES ================= */

interface OnlineUser {
  username: string;
  userId: string;
}

interface OnlineUsersByGroup {
  [groupId: string]: OnlineUser[];
}

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: OnlineUsersByGroup;
}

/* ================= CONTEXT ================= */

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: {},
});

/* ================= PROVIDER ================= */

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsersByGroup>({});

  /* ---------- Load user ---------- */
  useEffect(() => {
    const str = localStorage.getItem('chat-user');
    if (str) {
      setUser(JSON.parse(str));
    }
  }, []);

  /* ---------- Socket connection ---------- */
  useEffect(() => {
    if (!user) return;

    const socketInstance = io(process.env.NEXT_PUBLIC_BASE_URL!, {
      auth: { user: JSON.stringify(user) },
    });

    socketInstance.on('connect', () => {
      console.log(' Socket connected:', socketInstance.id);
    });

    const initialOnlineHandler = (data: {
      groupId: string;
      users: OnlineUser[];
    }) => {
      console.log('socket data received:', data);

      setOnlineUsers(prev => ({
        ...prev,
        [data.groupId]: data.users,
      }));
    };

    socketInstance.on('initialonline', initialOnlineHandler);

    setSocket(socketInstance);

    /* ---------- Cleanup ---------- */
    return () => {
      socketInstance.off('initialonline', initialOnlineHandler);
      socketInstance.disconnect();
    };
  }, [user]);
  

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useSocket = () => useContext(SocketContext);
