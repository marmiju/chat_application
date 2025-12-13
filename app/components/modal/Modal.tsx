import React, { ReactNode } from 'react'
interface Props {
    onclose: () => void;
    children: ReactNode
}

const Modal = ({ children, onclose }: Props) => {
    return (
        <div className='absolute top-0 flex items-center justify-center left-0 z-99 h-screen w-full inset-0 p-2'>
            <div className=' absolute backdrop-blur-sm top-0 bottom-0 h-screen w-full left-0 right-0 '>
            </div>
            <div className='max-w-[90%]  z-100 shadow border border-black/20 p-2 backdrop-blur-sm rounded-2xl'>
                <button onClick={onclose} className=' cursor-pointer top-0 left-0 bg-red-600 w-6 rounded-xl text-white mb-4'>X</button>
                {children}
            </div>
        </div>
    )
}

export default Modal