import { useSocket } from "../hooks/userContext/SocketProvider"


const MessageField = ({groupId}:{groupId:string}) => {
    const { socket } = useSocket()

    const handleMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        socket?.emit('typing', { groupId, isTyping: true });
    };

    return (
        <div className="p-4 flex justify-between gap-4">
            <input
                onChange={handleMessage}
                className="p-2 border bg-white shadow rounded-full border-gray-600 w-full"
                name="messageBox"
                placeholder="write something..."
            />
            <button className="bg-black text-white px-4 cursor-pointer rounded-full text-sm">
                Send
            </button>
        </div>
    )
}

export default MessageField