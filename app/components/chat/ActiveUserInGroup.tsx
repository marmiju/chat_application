"use client";
import { useEffect, useState } from "react"
import { useSocket } from "../hooks/userContext/SocketProvider";
import { User } from "lucide-react";

interface UserType {
    username: string;
    userId: string;
}

const ActiveUserInGroup = ({ groupId }: { groupId: string }) => {
    const { socket, onlineUsers, setOnlineUsers } = useSocket();
    const onlineUser = onlineUsers[groupId] || [];

    // socket event

    useEffect(() => {
        if (!socket) return;

        //  NEW USER CAME ONLINE
        socket.on("online_member", (data) => {
            console.log('✅ New online member data received:', data);
            setOnlineUsers(prev => ({
                ...prev,
                [data.groupId]: data.users,
            }));
        });

        console.log("onlineUsers",onlineUser)
    }, [socket]);

    return (
        <div className="space-y-1">
            <h3 className="w-full p-0.5 bg-primary text-background">Online Users</h3>
            <ul className="space-y-2">
                {onlineUser.map((user) => (
                    <li className="flex items-center  rounded gap-2 bg-white shadow p-1" key={user.userId}>
                        <span className=" bg-cyan-100 rounded-full p-2 blue relative ">< User /></span> {user.username}</li>
                ))}
            </ul>
        </div>
    );
};

export default ActiveUserInGroup;
