'use client'

import { useEffect, useState } from "react"
import { useSocket } from "../hooks/userContext/SocketProvider";
import { toast, ToastContainer } from "react-toastify";

const AddUserTogroup = ({ groupId }: { groupId: string }) => {
    const [user, setUser] = useState<{ username: string, id:string} | null>(null)
    const [searchTerm, setSearchTerm] = useState("");
    const {socket} = useSocket()
    const handleSearch = async () => {
        // search user by username api call
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/search?username=${searchTerm}`);
        const data = await res.json();
        console.log('searched user:', data);
        if(data && data.username){
            setUser({ username: data.username, id: data._id });
        }
    }
    useEffect(() => {
        if (searchTerm.length < 2) {
            setUser(null);
        } else if (searchTerm.length > 2) {
            handleSearch();
        }
    }, [searchTerm]);

    // add to group
    const addongroup = (groupId: string, userId: string, username:string) => async ()=>{
        socket?.emit("add-user-to-group", {groupId, userId,username}, (response:{status: 'succes' | 'error', message:string})=>{
            if (response.status=== 'error'){
                console.log(response.message)
                return toast.error(response.message)
            }
            toast.success(response.message)
            setUser(null);
            setSearchTerm("");
        });
    }
    return (
        <div className="relative">
            <ToastContainer/>
            <p className='w-full text-[12px] bg-primary p-0.5 text-background'>Add User in this group</p>
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder='Enter username' className='bg-white p-2 rounded shadow-xl w-full border border-primary/20 mt-1' />
            <div>
                {user && (
                    <div className="absolute flex justify-between rounded shadow  items-center  mt-1 bg-blue/20 text-white backdrop-blur-sm  font-medium p-2 w-full">
                        <p>{user.username || 'undefined'}</p>
                        <button onClick={addongroup(groupId, user.id, user.username)} className="bg-primary text-white px-2 py-1 text-sm rounded mt-1 shadow shadow-white">add</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddUserTogroup