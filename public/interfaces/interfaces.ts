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

// 
export interface TypingEvent {
  userId: string;
  username: string;
  isTyping: boolean;
}

// =====================================================

export interface MessageUser {
  _id: string;
  username: string;
  email?: string;
}

/* ================= Delivery ================= */

export type DeliveryStatus = "sent" | "read" | "delivered";

export interface MessageDelivery {
  user: MessageUser;
  status: DeliveryStatus;
  at: string; // ISO date string
}

/* ================= Message ================= */

export interface ChatMessageinterface {
  _id: string;
  content: string;
  type: "notification" | "message";
  sender: MessageUser;
  group: string;
  deliveries: MessageDelivery[];
  createdAt: string;
  updatedAt: string;
}


