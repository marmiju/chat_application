'use client'
import { useEffect, useState } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import { GroupInterface } from '@/public/interfaces/interfaces';
import ChatMessages from './components/chat/ChatMessages';
import { io } from 'socket.io-client';

const Page = () => {
  const [selectedGroup, setSelectedGroup] = useState<GroupInterface | null>(null);

  const handleSelectGroup = (group: GroupInterface) => {
    setSelectedGroup(group);
  };
  useEffect(() => {
    const str = localStorage.getItem("chat-user");
    const user = JSON.parse(str!)
    io(process.env.NEXT_PUBLIC_BASE_URL!, {
      auth: { user: JSON.stringify(user) }
    })
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar grp={selectedGroup!} onSelectGroup={handleSelectGroup} />
      <div className="flex-1 flex flex-col">
        {selectedGroup ? (
          <ChatMessages group={selectedGroup} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a group to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;