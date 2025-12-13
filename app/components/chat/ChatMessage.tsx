
import { Message, MessageInterface } from '@/public/interfaces/interfaces';
import { useUser } from '@/app/components/hooks/userContext/UserProvider';

const ChatMessage = ({ message }: { message: Message }) => {
  const { user } = useUser();
  const isMe = message.sender._id === user?._id;

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`rounded-lg px-4 py-2 ${
          isMe ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        <p className="text-sm font-bold">{message.sender.username}</p>
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
