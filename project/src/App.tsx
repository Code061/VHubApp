import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { X, Users, MessageSquare } from 'lucide-react';
import { DocumentEditor } from './components/DocumentEditor';
import { Sidebar } from './components/Sidebar';
import type { Message, Participant, Meeting, SidebarState, LoginState } from './types';

function App() {
  const [loginState, setLoginState] = useState<LoginState>({ view: 'landing' });
  const [meeting, setMeeting] = useState<Meeting>({
    id: '',
    participants: [],
    messages: [],
    documentContent: '',
    hostId: '',
  });

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [meetingId, setMeetingId] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    participants: false,
    chat: false,
  });

  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim() && meetingId.trim()) {
      const userId = uuidv4();
      const newParticipant: Participant = {
        id: userId,
        name: userName,
        isHost: false,
      };

      setMeeting(prev => ({
        ...prev,
        id: meetingId,
        participants: [...prev.participants, newParticipant],
      }));
      
      setIsJoined(true);
    }
  };

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim() && email.trim() && password.trim()) {
      const userId = uuidv4();
      const newMeetingId = uuidv4();
      
      const newParticipant: Participant = {
        id: userId,
        name: userName,
        email,
        isHost: true,
      };

      setMeeting({
        id: newMeetingId,
        participants: [newParticipant],
        messages: [],
        documentContent: '',
        hostId: userId,
      });
      
      setIsJoined(true);
    }
  };

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      user: userName,
      content,
      timestamp: new Date().toISOString(),
    };

    setMeeting(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
  };

  const handleDocumentChange = (content: string) => {
    setMeeting(prev => ({
      ...prev,
      documentContent: content,
    }));
  };

  const handleLeaveMeeting = () => {
    setMeeting(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.name !== userName),
    }));
    setIsJoined(false);
    setUserName('');
    setEmail('');
    setPassword('');
    setMeetingId('');
    setLoginState({ view: 'landing' });
  };

  const handleToggleSidebar = (panel: keyof SidebarState) => {
    setSidebarState(prev => ({
      ...prev,
      [panel]: !prev[panel],
    }));
  };

  const currentUser = meeting.participants.find(p => p.name === userName);
  const isHost = currentUser?.isHost || false;

  if (!isJoined) {
    if (loginState.view === 'landing') {
      return (
        <div className="min-h-screen bg-gray-100 flex">
          <div className="flex-1 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2784&q=80")' }}>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold">VHUB</h1>
            </div>
            <p className="text-gray-600 text-center mb-8 max-w-md">
              Collaborate seamlessly with your team in real-time. Share ideas, create documents, and make decisions together.
            </p>
            <button
              onClick={() => setLoginState({ view: 'join' })}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold"
            >
              Start
            </button>
          </div>
        </div>
      );
    }

    if (loginState.view === 'join') {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Join Meeting</h1>
            <form onSubmit={handleJoinMeeting} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="meetingId" className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting ID
                </label>
                <input
                  id="meetingId"
                  type="text"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                  placeholder="Enter meeting ID"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Join Meeting
                </button>
                <button
                  type="button"
                  onClick={() => setLoginState({ view: 'create' })}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Create New Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Create Meeting</h1>
          <form onSubmit={handleCreateMeeting} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Create Meeting
              </button>
              <button
                type="button"
                onClick={() => setLoginState({ view: 'join' })}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Join Existing Meeting
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 fixed inset-0 overflow-hidden">
      <div className="max-w-6xl mx-auto h-full">
        <div className="bg-white rounded-lg shadow-lg p-4 h-full">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold">Meeting Room</h1>
              <p className="text-sm text-gray-500">Meeting ID: {meeting.id}</p>
            </div>
            <button
              onClick={handleLeaveMeeting}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
              {isHost ? 'End Meeting' : 'Leave'}
            </button>
          </div>

          <DocumentEditor
            content={meeting.documentContent}
            isHost={isHost}
            onContentChange={handleDocumentChange}
          />

          <Sidebar
            messages={meeting.messages}
            participants={meeting.participants}
            sidebarState={sidebarState}
            onSendMessage={handleSendMessage}
            onToggleSidebar={handleToggleSidebar}
          />
        </div>
      </div>
    </div>
  );
}

export default App;