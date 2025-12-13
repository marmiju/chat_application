export interface UserInterface {
    _id: string
    username: string
    email: string
    token?: string
    isAdmin?: boolean
}

export interface GroupInterface {
    _id: string;
    name: string;
    description: string;
    admin: UserInterface;
    members: UserInterface[];
    createdAt: string;   
    updatedAt: string;  
    __v?: number;        
}

export interface MessageInterface {
    _id: string;
    sender: UserInterface;
    group: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface Sender {
  _id: string;
  username: string;
  email: string;
}

export interface Message {
  _id: string;
  sender: Sender;
  content: string;
  group: string;
  createdAt: string;   // or Date
  updatedAt: string;   // or Date
  __v: number;
  deliveries: any[];   // If you know structure, I can type it
}

// 
export interface TypingEvent {
  userId: string;
  username: string;
  isTyping: boolean;
}

