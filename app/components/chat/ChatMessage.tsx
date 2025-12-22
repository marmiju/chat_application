

import { useUser } from '@/app/components/hooks/userContext/UserProvider';
import { ChatMessageinterface } from '@/public/interfaces/interfaces';
import { RiAccountCircleFill } from 'react-icons/ri';

const ChatMessage = ({ message }: { message: ChatMessageinterface }) => {
  const { user } = useUser();
  const isMe = message.sender._id === user?._id;
  return (
    <>
      {
        message.type === "notification" ? (
          <div className="text-center text-sm text-gray-500 my-2">
            {message.content}
          </div>
        ) : <ul className={`flex py-2 ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
          <li className={`flex justify-center items-start space-x-1
        ${isMe ? 'flex-row-reverse' : ' flex-row'}`}>
            <div className=' text-gray-400 text-2xl rounded-full' >
              <RiAccountCircleFill />
            </div>
            <div className='relative'>
              {!isMe && <p className='text-[10px] text-gray-600'>{message.sender.username}</p>}
              <p className={`
          p-1 px-2 rounded-[10px] max-w-xs 
            ${isMe ? 'bg-primary text-secondary' : 'bg-secondary text-black'}
            `
              }>{message.content}</p>
              {
                isMe && <>
                  <p className=' absolute bottom-[-20px] right-0'>
                    {message.deliveries.filter(mes=> mes.user._id !== user._id)
                      .map(del => (
                        <span className={`text-[12px] px-1 rounded-full border ${del.status === 'sent' ? 'border-black' : del.status === 'delivered' ? 'border-green-600' : 'border-red-600'}`} key={del.user._id}>{del.user.username}</span>
                      ))}
                  </p>

                </>
              }

            </div>
          </li>
        </ul>
      }
    </>
  );
};

export default ChatMessage;
