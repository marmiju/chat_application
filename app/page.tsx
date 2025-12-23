'use client'
import {  useState } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import { GroupInterface } from '@/public/interfaces/interfaces';
import ChatMessages from './components/chat/ChatMessages';


const Page = () => {
  const [selectedGroup, setSelectedGroup] = useState<GroupInterface | null>(null);

  const handleSelectGroup = (group: GroupInterface) => {
    setSelectedGroup(group);
  };

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