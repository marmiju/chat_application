'use client'
import { useState, useEffect, useRef, FormEvent } from 'react';
import { Menu, Trash2Icon, X } from 'lucide-react';
import Modal from '../modal/Modal';
import { redirect, useRouter } from 'next/navigation';
import { useUser } from '../hooks/userContext/UserProvider';
import { GroupInterface, UserInterface } from '@/public/interfaces/interfaces';
import { toast, ToastContainer } from 'react-toastify';
import { useSocket } from '../hooks/userContext/SocketProvider';
import { group } from 'console';



const Sidebar = ({ onSelectGroup, grp }: { onSelectGroup: (group: GroupInterface) => void, grp: GroupInterface }) => {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [openModal, setOpenModal] = useState(false)
    const [groups, setGroups] = useState<GroupInterface[] | []>([])
    const [selectedGroup, setSelectedGroup] = useState<GroupInterface | null>(null);
    const router = useRouter();
    const { user, setUser } = useUser()
    const { socket } = useSocket()

    const handleGroupClick = (group: GroupInterface) => {
        setSelectedGroup(group);
        onSelectGroup(group);
    };

    const deleteGroup = async (groupId: string) => {
        alert("are you sure to delete this group?")
        console.log("deleting group:", groupId);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/groups/${groupId}/remove`, {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${user?.token}`
            }
        })
        console.log("response:", res);
        if (!res.ok) {
            toast.error("failed to delete group")
            return
        }
        const result = await res.json()
        console.log(result)
        setGroups(prev => prev.filter(g => g._id !== groupId))
        toast.success("group deleted successfully")
    }

    useEffect(() => {
        const str = window.localStorage.getItem("chat-user");
        const user: UserInterface = JSON.parse(str!)
        if (!user) {
            return router.replace("/login");
        }
        setUser(user)

        const getgroups = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/groups`, {
                headers: {
                    'authorization': `Bearer ${user.token}`
                }
            })
            const result = await res.json()
            setGroups(Array.isArray(result) ? result : result.data || []);
        }
        getgroups()
    }, []);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);
    // create new group
    const handleCreateGroup = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formdata = new FormData(e.currentTarget)
        const payload = Object.fromEntries(formdata.entries())
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/groups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${user?.token}`
            },
            body: JSON.stringify(payload)
        })
        if (!res.ok) {
            toast.error("failed to create group")
            return
        }
        const result = await res.json()
        console.log(result._id)
        setGroups(prev => [...prev, result])
        setOpenModal(false)
        socket?.emit('create_group', { groupId: result._id }, (res) => {
            console.log(res.message);
            toast.success(res.message)
        });

    }

    return (
        <>
            <ToastContainer />
            <div className="md:hidden p-4 flex justify-between items-center  bg-secondary shadow-md fixed  w-full top-0 z-30">
                <button onClick={() => setIsOpen(true)}>
                    <Menu />
                </button>
                <span className="text-lg font-bold">My App</span>
            </div>
            {isOpen && (
                <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            )}
            <aside
                ref={sidebarRef}
                className={`fixed  top-0 left-0 bottom-0 h-screen  bg-secondary transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 w-[80%] md:w-64 z-50 shadow-lg`}
            >
                <div className="flex justify-between items-center bg-primary p-4 text-white">
                    <span className="text-lg font-bold">Chat-X</span>
                    <button onClick={() => setIsOpen(false)} className="md:hidden">
                        <X />
                    </button>
                </div>
                <nav className="space-y-2 h-[calc(100vh-120px)]  overflow-hidden">
                    <p className='flex justify-between p-4 border-b border-cyan-800 bg-cyan-50 text-black '> groups
                        <button onClick={() => setOpenModal(true)} className='text-primary rounded-full bg-slate-200 w-6 cursor-pointer '>+</button>

                    </p>
                    {/* show group there you added */}
                    {
                        groups.length === 0 ? <p className='p-4 text-[12px] text-gray-400'>have no group please create new</p>
                            : <ul className='p-2 overflow-y-scroll h-[calc(100vh-180px)] '>
                                {
                                         groups.map(group => (
                                        <li key={group._id} onClick={() => handleGroupClick(group)} className={` relative overflow-hidden ${selectedGroup?.name === group.name ? 'bg-primary text-secondary' : 'bg-white text-black'} p-2 mb-1 rounded cursor-pointer ${selectedGroup?._id === group._id ? 'bg-blue-200' : ''}`}>
                                            <p className='text-sm'>{group.name}</p>
                                            <p className='text-[10px] line-clamp-1 '>{group.description}</p>
                                            <Trash2Icon onClick={() => { deleteGroup(group._id) }} className='size-6 text-red-600 bg-white p-0.5 rounded-b shadow border border-white  absolute top-[-2px] right-2' />
                                        </li>
                                    ))
                                }
                            </ul>
                    }



                </nav>
                <button className='absolute cursor-pointer bottom-2 left-1 right-1 text-center bg-black text-white p-2 rounded'
                    onClick={() => {
                        'use client'
                        localStorage.removeItem('chat-user')
                        redirect('/login')
                    }}
                >log out <span className='text-[12px] text-purple-600'>{user?.username}</span> </button>
            </aside>
            {
                openModal && <Modal onclose={() => setOpenModal(false)} >
                    <form onSubmit={handleCreateGroup} className='flex flex-col space-y-2 '>
                        <label className=' text-black'>Group name</label>
                        <input required className='p-2 rounded-xl  bg-blue-100' name='name' type=' text' placeholder='ex. group1' />
                        <textarea required className='p-2 rounded-xl  bg-secondary' name='description' placeholder='ex. group1' />
                        <button className='bg-primary text-white/90 p-2 hover:text-white hover:bg-black cursor-pointer rounded-2xl' type='submit'>create new group</button>
                    </form>
                </Modal>
            }
        </>
    )


}

export default Sidebar;