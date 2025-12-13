'use client'
import { useState, useEffect, useRef, FormEvent } from 'react';
import { Menu, X } from 'lucide-react';
import Modal from '../modal/Modal';
import { redirect, useRouter } from 'next/navigation';
import { useUser } from '../hooks/userContext/UserProvider';
import { GroupInterface, UserInterface } from '@/public/interfaces/interfaces';
import { useSocket } from '../hooks/userContext/SocketProvider';



const Sidebar = ({ onSelectGroup, grp }: { onSelectGroup: (group: GroupInterface) => void, grp: GroupInterface }) => {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [openModal, setOpenModal] = useState(false)
    const [groups, setGroups] = useState<GroupInterface[] | []>([])
    const [selectedGroup, setSelectedGroup] = useState<GroupInterface | null>(null);
    const router = useRouter();
    const { user, setUser } = useUser()
    const { socket, } = useSocket();

    const handleGroupClick = (group: GroupInterface) => {
        setSelectedGroup(group);
        onSelectGroup(group);
    };

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
            setGroups(result)
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
        console.log(payload)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/groups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${user?.token}`
            },
            body: JSON.stringify(payload)
        })
        const result = await res.json()
        console.log(result)

    }

    return (
        <>
            <div className="md:hidden p-4 flex justify-between items-center  bg-white shadow-md fixed  w-full top-0 z-30">
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
                className={`fixed top-0 left-0 bottom-0 h-screen  bg-white transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 w-[80%] md:w-64 z-50 shadow-lg`}
            >
                <div className="flex justify-between items-center bg-cyan-900 p-4 text-white">
                    <span className="text-lg font-bold">Chat-X</span>
                    <button onClick={() => setIsOpen(false)} className="md:hidden">
                        <X />
                    </button>
                </div>
                <nav className="space-y-2">

                    <p className='flex justify-between p-4 border-b border-cyan-800 bg-cyan-50 text-black '> groups
                        <button onClick={() => setOpenModal(true)} className='text-blue-600 rounded-full bg-slate-200 w-6 cursor-pointer '>+</button>

                    </p>
                    {/* show group there you added */}
                    {
                        groups.length === 0 ? <p className='p-4 text-[12px] text-gray-400'>have no group please create new</p>
                            : <ul className='p-2'>
                                {
                                    groups.map(group => (
                                        <li key={group._id} onClick={() => handleGroupClick(group)} className={`${selectedGroup?.name === group.name ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black'} p-2 mb-1 rounded cursor-pointer ${selectedGroup?._id === group._id ? 'bg-blue-200' : ''}`}>
                                            <p className='text-sm'>{group.name}</p>
                                            <p className='text-[10px] line-clamp-1 '>{group.description}</p>
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
                        <input className='p-2 rounded-xl  bg-blue-100' name='name' type=' text' placeholder='ex. group1' />
                        <textarea className='p-2 rounded-xl  bg-blue-100' name='description' placeholder='ex. group1' />
                        <button className='bg-black/90 text-white/90 p-2 hover:text-white hover:bg-black cursor-pointer rounded-2xl' type='submit'>create new</button>
                    </form>
                </Modal>
            }
        </>
    )


}

export default Sidebar;