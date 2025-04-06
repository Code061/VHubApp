export interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: string;
}

export interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  email?: string;
}

export interface Meeting {
  id: string;
  participants: Participant[];
  messages: Message[];
  documentContent: string;
  hostId: string;
}

export interface SidebarState {
  participants: boolean;
  chat: boolean;
}

export interface LoginState {
  view: 'landing' | 'join' | 'create';
}