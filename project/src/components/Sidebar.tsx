import React from 'react';
import { Users, MessageCircle } from 'lucide-react';
import { Chat } from './Chat';
import { ParticipantsList } from './ParticipantsList';
import type { Message, Participant, SidebarState } from '../types';

interface SidebarProps {
  messages: Message[];
  participants: Participant[];
  sidebarState: SidebarState;
  onSendMessage: (content: string) => void;
  onToggleSidebar: (panel: keyof SidebarState) => void;
}

export function Sidebar({ messages, participants, sidebarState, onSendMessage, onToggleSidebar }: SidebarProps) {
  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2">
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => onToggleSidebar('participants')}
          className={`p-2 rounded-lg ${
            sidebarState.participants ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
          }`}
        >
          <Users className="w-5 h-5" />
        </button>
        <button
          onClick={() => onToggleSidebar('chat')}
          className={`p-2 rounded-lg ${
            sidebarState.chat ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
          }`}
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>
      
      <div className={`w-80 transition-all duration-300 ${
        !sidebarState.participants && !sidebarState.chat ? 'opacity-0 invisible' : 'opacity-100 visible'
      }`}>
        {sidebarState.participants && <ParticipantsList participants={participants} />}
        {sidebarState.chat && <Chat messages={messages} onSendMessage={onSendMessage} />}
      </div>
    </div>
  );
}