'use client'
import { useEffect, useState } from 'react';
import { useSocket } from '../hooks/userContext/SocketProvider';
import { GroupInterface, Message } from '@/public/interfaces/interfaces';
import ChatMessage from './ChatMessage';
import MessageField from './MessageField';
import ActiveUserInGroup from './ActiveUserInGroup';
import { User } from 'lucide-react';

const ChatMessages = ({ group }: { group: GroupInterface }) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);

  // groupId -> list of typing users
  const [typingUsers, setTypingUsers] = useState<{
    [groupId: string]: { username: string; isTyping: boolean }[];
  }>({});

  const activeGroupId = group._id;

  useEffect(() => {
    if (!socket) return;

    // keep track of timers to auto-remove after 2s
    const typingTimers: { [groupId: string]: { [username: string]: NodeJS.Timeout } } = {};

    const handleTyping = (data: { groupId: string; username: string; isTyping: boolean; }) => {
      const { groupId, username, isTyping } = data;

      setTypingUsers((prev) => {
        const groupList = prev[groupId] || [];
        const exists = groupList.find((u) => u.username === username);
        let updatedList;

        if (exists) {
          updatedList = groupList.map((u) =>
            u.username === username ? { ...u, isTyping } : u
          );
        } else {
          updatedList = [...groupList, { username, isTyping }];
        }

        return {
          ...prev,
          [groupId]: updatedList,
        };
      });

      // auto-remove after 2 seconds
      if (isTyping) {
        if (!typingTimers[groupId]) typingTimers[groupId] = {};
        if (typingTimers[groupId][username]) clearTimeout(typingTimers[groupId][username]);

        typingTimers[groupId][username] = setTimeout(() => {
          setTypingUsers((prev) => {
            const groupList = prev[groupId] || [];
            const updatedList = groupList.filter((u) => u.username !== username);
            return {
              ...prev,
              [groupId]: updatedList,
            };
          });
        }, 2000);
      }
    };

    socket.on('typing', handleTyping);

    return () => {
      socket.off('typing', handleTyping);
    };
  }, [socket]);

  // get current group typing users
  const currentTypingUsers = typingUsers[activeGroupId]?.filter((u) => u.isTyping) || [];

  return (
    <div className="flex">
      <div className="flex flex-col h-screen w-full">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">{group.name}</h2>
        </div>

        <div className="flex-1 flex flex-col-reverse p-4 overflow-y-auto">
          {messages.map((message) => (
            <ChatMessage key={message._id} message={message} />
          ))}
        </div>

        {/* real-time typing indicator */}
        {currentTypingUsers.length > 0 && (
          <p className="px-4 text-sm text-gray-800 animate-pulse flex items-center">
            <User />{currentTypingUsers.map((u) => u.username).join(', ')} is typing...
          </p>
        )}

        <MessageField groupId={group._id} />
      </div>

      <div className="w-96 shadow">
        <p className="p-2 bg-gray-200">group info</p>
        <div className="p-4">
          <p className=" bg-cyan-300 text-white p-2 text-[14px] text-center font-semibold">
            {group.description}
          </p>
          <p className="text-gray-600 bg-cyan-100 p-2">
            admin: <span className="text-black/90">{group.admin.username}</span>
          </p>
          <ActiveUserInGroup groupId={group._id} />
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
