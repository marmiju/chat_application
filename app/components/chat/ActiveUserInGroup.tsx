"use client";
import { useEffect, useState } from "react"
import { useSocket } from "../hooks/userContext/SocketProvider";
import { User } from "lucide-react";

interface UserType {
    username: string;
    userId: string;
}

const ActiveUserInGroup = ({ groupId }: { groupId: string }) => {
    const { socket, onlineUsers } = useSocket();

    useEffect(() => {
        if (!socket) return;

        // 1) RECEIVE INITIAL LIST
        socket.on("initialonline", (data: { groupId: string, users: UserType[] }) => {
            console.log(data)
            if (data.groupId !== groupId) return;
            // setOnlineUser(data.users);
        });

        // 2) NEW USER CAME ONLINE
        socket.on("online_member", (data: UserType & { groupId: string }) => {
            if (data.groupId !== groupId) return;

            // setOnlineUser(prev => {
            //     if (prev.some(u => u.userId === data.userId)) return prev;
            //     return [...prev, { username: data.username, userId: data.userId }];
            // });
        });
        
        // 3) USER WENT OFFLINE

        console.log(onlineUsers)
    }, [socket, groupId]);

    return (
        <div className="space-y-1">
            <h3 className="w-full p-2 bg-cyan-200">Online Users</h3>
            <ul className="space-y-2">
                {onlineUsers[groupId].map((user) => (
                    <li className="flex items-center  rounded gap-2 bg-white shadow p-1" key={user.userId}>
                        <span className=" bg-cyan-100 rounded-full p-2 blue relative ">< User /></span> {user.username}</li>
                ))}
            </ul>
        </div>
    );
};

export default ActiveUserInGroup;
