'use client';

import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../hooks/userContext/SocketProvider';
import { ChatMessageinterface, GroupInterface } from '@/public/interfaces/interfaces';
import MessageField from './MessageField';
import ActiveUserInGroup from './ActiveUserInGroup';
import ChatMessage from './ChatMessage';
import { User } from 'lucide-react';
import AddUserTogroup from './AddUserTogroup';
import LeaveFromGroup from './LeaveFromGroup';
import { useUser } from '../hooks/userContext/UserProvider';

/* ================= COMPONENT ================= */

const ChatMessages = ({ group }: { group: GroupInterface }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { socket } = useSocket();
  const { user } = useUser()


  /* ---------- STATE ---------- */
  const [messages, setMessages] = useState<ChatMessageinterface[]>([]);
  const [typingUsers, setTypingUsers] = useState<{
    [groupId: string]: { username: string; isTyping: boolean }[];
  }>({});



  const activeGroupId = group._id;
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chats/${activeGroupId}`);
        const data: ChatMessageinterface[] = await res.json();
        setMessages(data);

      } catch (err) {
        console.error('Failed to load messages', err);
      }
    };

    fetchMessages();
  }, [activeGroupId]);

  // active group track
  useEffect(() => {
    if (!socket) return;

    socket.emit('active_group', {
      groupId: activeGroupId
    });

    return () => {
      socket.emit('inactive_group', {
        groupId: activeGroupId
      });
    };
  }, [activeGroupId]);



  // marks as read
  useEffect(() => {
    if (!user) return;

    const unreadIds = messages
      .filter(msg => {
        const senderId =
          typeof msg.sender === 'string'
            ? msg.sender
            : msg.sender._id;

        if (senderId === user._id) return false;

        const myDelivery = msg.deliveries.find(del => {
          const deliveryUserId =
            typeof del.user === 'string'
              ? del.user
              : del.user._id;
          return deliveryUserId === user._id;
        });

        return myDelivery?.status === 'delivered';
      })
      .map(msg => msg._id);
    if (unreadIds.length === 0) return

    socket?.emit('mark_as_read', { groupId: activeGroupId, unreadIds })
  }, [messages, user, activeGroupId]);


  //  SOCKET: NEW MESSAGE 
  useEffect(() => {
    if (!socket) return;


    // handle every new message 
    const handleNewMessage = (newMessage: ChatMessageinterface) => {
      if (newMessage.group !== activeGroupId) return;

      setMessages(prev => {
        const exists = prev.some(m => m._id === newMessage._id);
        if (exists) return prev;

        return [newMessage, ...prev];
      });
    };

    // handle status of messages
    const handleStatusUpdate = (updatedMessages: ChatMessageinterface[]) => {
      setMessages(prev => {
        const updates = new Map(updatedMessages.map(m => [m._id, m]));
        console.log("updates", updates)
        // Apply updates to existing messages
        return prev.map(m => updates.has(m._id) ? updates.get(m._id)! : m);
      });
    };
    socket.on('new_message', handleNewMessage);
    socket.on('updateMessage', handleStatusUpdate)

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('updateMessage', handleStatusUpdate);
    };
  }, [socket, activeGroupId]);

  /* SOCKET: TYPING INDICATOR  */

  const typingTimers = useRef<
    Record<string, Record<string, NodeJS.Timeout>>
  >({});

  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({
      groupId,
      username,
      isTyping,
    }: {
      groupId: string;
      username: string;
      isTyping: boolean;
    }) => {
      setTypingUsers(prev => {
        const list = prev[groupId] || [];
        const filtered = list.filter(u => u.username !== username);

        return {
          ...prev,
          [groupId]: isTyping
            ? [...filtered, { username, isTyping }]
            : filtered,
        };
      });

      if (isTyping) {
        typingTimers.current[groupId] ??= {};

        clearTimeout(typingTimers.current[groupId][username]);

        typingTimers.current[groupId][username] = setTimeout(() => {
          setTypingUsers(prev => ({
            ...prev,
            [groupId]: (prev[groupId] || []).filter(
              u => u.username !== username
            ),
          }));
        }, 2000);
      }
    };

    socket.on('typing', handleTyping);

    return () => {
      socket.off('typing', handleTyping);

      // cleanup timers
      Object.values(typingTimers.current).forEach(group =>
        Object.values(group).forEach(clearTimeout)
      );
    };
  }, [socket]);

  const currentTypingUsers =
    typingUsers[activeGroupId]?.filter(u => u.isTyping) || [];


  return (
    <div className="flex relative">
      {/* ================= CHAT ================= */}
      <div className="flex flex-col h-[90vh] lg:h-[100vh] w-full mt-[68px] lg:mt-0">
        <div className="flex items-center justify-between p-2 shadow">
          <div className=''>
            <h2 className="text-xl font-bold">{group.name}</h2>
            <p className="max-w-lg text-sm text-gray-400">
              {group.description}
            </p>
          </div>

          {/* Toggle sidebar */}
          <button
            onClick={() => setIsSidebarOpen(prev => !prev)}
            className="md:hidden px-3 py-2 bg-gray-200 rounded"
          >
            !
          </button>
        </div>



        {/* messages */}
        <div className="flex-1 flex flex-col-reverse p-4 overflow-y-auto space-y-2">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">No messages yet</p>
          ) : (
            messages.map(message => (
              <ChatMessage key={message._id} message={message} />
            ))
          )}
        </div>

        {/* typing indicator */}
        {currentTypingUsers.length > 0 && (
          <p className="px-4 py-1 text-sm text-gray-700 flex items-center gap-1 animate-pulse">
            <User size={14} />
            {currentTypingUsers.map(u => u.username).join(', ')} typing...
          </p>
        )}

        <MessageField groupId={activeGroupId} />
      </div>



      {/* ================= SIDEBAR ================= */}
      <div
        className={`
    fixed md:static top-0 right-0 h-full w-72 bg-white shadow-lg z-50
    transform transition-transform duration-300
    ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
    md:translate-x-0
  `}
      >
        {/* close button (mobile) */}
        <div className="md:hidden flex justify-end p-2">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-2">
          <p className="bg-cyan-300 text-white p-2 text-sm text-center font-semibold">
            {group.description}
          </p>

          <p className="bg-primary text-white p-2">
            admin: <span>{group.admin.username}</span>
          </p>

          <AddUserTogroup groupId={activeGroupId} />
          <ActiveUserInGroup groupId={activeGroupId} />
          <LeaveFromGroup groupId={activeGroupId} />
        </div>
      </div>

    </div>
  );
};

export default ChatMessages;
