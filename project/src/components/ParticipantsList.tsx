import React from 'react';
import { Users } from 'lucide-react';
import { Participant } from '../types';

interface ParticipantsListProps {
  participants: Participant[];
}

export function ParticipantsList({ participants }: ParticipantsListProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <h2 className="font-semibold">Participants ({participants.length})</h2>
        </div>
      </div>
      
      <div className="p-4">
        <ul className="space-y-2">
          {participants.map((participant) => (
            <li key={participant.id} className="flex items-center justify-between">
              <span className="text-sm">{participant.name}</span>
              {participant.isHost && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Host
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}