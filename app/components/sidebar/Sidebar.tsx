'use client'
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Home, MessageSquare, Users, Settings } from 'lucide-react';
import Modal from '../modal/Modal';
import { redirect, useRouter } from 'next/navigation';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [openModal, setOpenModal] = useState(false)
    const router = useRouter();

    useEffect(() => {
        const token = window.localStorage.getItem("chat-user");
        if (!token) {
            router.replace("/login");
        }
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

    const navItems = [
        { name: 'Home', icon: <Home className="mr-3" /> },
        { name: 'Messages', icon: <MessageSquare className="mr-3" /> },
        { name: 'Friends', icon: <Users className="mr-3" /> },
        { name: 'Settings', icon: <Settings className="mr-3" /> },
    ];

    return (
        <>
            <div className="md:hidden flex justify-between items-center p-4 bg-white shadow-md fixed  w-full top-0 z-30">
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
                className={`fixed top-0 left-0 bottom-0 h-screen  bg-white transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-64 z-50 shadow-lg`}
            >
                <div className="flex justify-between items-center p-4">
                    <span className="text-lg font-bold">Menu</span>
                    <button onClick={() => setIsOpen(false)} className="md:hidden">
                        <X />
                    </button>
                </div>
                <nav className="">

                    <p className='flex justify-between p-4 bg-slate-400 text-white'> groups
                        <button onClick={() => setOpenModal(true)} className='text-blue-600 rounded-full bg-slate-200 w-6 cursor-pointer '>+</button>

                    </p>


                </nav>
                <button className='absolute cursor-pointer bottom-2 left-1 right-1 text-center bg-black text-white p-2 rounded'
                    onClick={() => {
                        'use client'
                        localStorage.removeItem('chat-user')
                        redirect('/login')
                    }}
                >Logout</button>
            </aside>
            {
                openModal && <Modal onclose={() => setOpenModal(false)} >
                    <form onSubmit={(e) => { }} className='flex flex-col space-y-2 '>
                        <label className=' text-black'>Group name</label>
                        <input className='p-2 rounded-sm bg-blue-50' type=' text' placeholder='ex. group1' />
                        <button className='bg-black/90 text-white/90 p-2 hover:text-white hover:bg-black cursor-pointer rounded' type='submit'>submit</button>
                    </form>
                </Modal>
            }
        </>
    )
}

export default Sidebar;