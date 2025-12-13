'use client'
import { UserInterface } from "@/public/interfaces/interfaces";
import {  createContext, ReactNode, useContext, useState } from "react";

interface UserContextType {
    user: UserInterface | null
    setUser: (u: UserInterface | null) => void
}

const Usercontext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserInterface | null>(null)
    return <Usercontext.Provider value={{ user, setUser }}>
        {children}
    </Usercontext.Provider>
}

export const useUser = () => {
    const context = useContext(Usercontext)
    if (!context) throw new Error('use Usercontext inside the Userprovider')
    return context
}
