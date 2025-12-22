import { useSocket } from "../hooks/userContext/SocketProvider"

const LeaveFromGroup = ({ groupId }: { groupId: string }) => {
    const {socket} = useSocket()
    const handleleave = groupId =>{
        socket?.emit('leave', {groupId},(res)=>{
            alert(res.message)
        })
    }
    return (
        <button onClick={()=>handleleave(groupId)} className="absolute text-red-600 bg-black w-44 rounded-sm cursor-pointer bottom-2">Leave</button>
    )
}

export default LeaveFromGroup