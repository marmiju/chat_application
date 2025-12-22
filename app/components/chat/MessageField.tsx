'use client'
import React, { useState } from "react";
import { useSocket } from "../hooks/userContext/SocketProvider"



const MessageField = ({ groupId }: { groupId: string }) => {

    const { socket } = useSocket()
    const [message, setmessage] = useState("")

    const handleMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setmessage(e.target.value)
        socket?.emit('typing', { groupId, isTyping: true });
    };

    const handlesendMessage = () => {
        const contentToSend = message.trim() === "" ? "👍" : message;
        socket?.emit('send_message', { groupId, content: contentToSend }, (response:{}) => {
            console.log("Message sent ack", response);
        });
        setmessage("")
        socket?.emit('typing', { groupId, isTyping: false });
    }

    return (
        <div className="p-4 flex justify-between gap-4">
            <input
                onChange={handleMessage}
                className="p-2 border bg-white shadow rounded-full border-gray-600 w-full"
                name="messageBox"
                value={message}
                placeholder="write something..."
            />
            <button  onClick={handlesendMessage} className="bg-black text-white px-4 cursor-pointer rounded-full text-sm">
                {message.trim() === "" ? "👍" : "send"}
            </button>
        </div>
    )
}

export default MessageField