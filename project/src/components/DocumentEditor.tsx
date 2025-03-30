import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { MessageSquare, Send } from 'lucide-react';

interface Message {
  message: string;
  sender: string;
  timestamp: string;
}

const DocumentEditor = () => {
  const { id } = useParams<{ id: string }>();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.emit('join-document', id);

    newSocket.on('document-update', (data) => {
      if (data.documentId === id) {
        setContent(data.content);
      }
    });

    newSocket.on('new-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    fetchDocument();

    return () => {
      newSocket.disconnect();
    };
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/documents/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }

      const data = await response.json();
      setTitle(data.title);
      setContent(data.content);
    } catch (err) {
      setError('Failed to load document');
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    socket?.emit('document-change', {
      documentId: id,
      content: newContent,
    });
  };

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    try {
      await fetch(`http://localhost:3000/api/documents/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });
    } catch (err) {
      setError('Failed to update title');
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket?.emit('chat-message', {
      documentId: id,
      message: newMessage,
      sender: 'User', // Replace with actual username
    });

    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Document Editor */}
      <div className="flex-1 p-6">
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="w-full text-2xl font-bold mb-4 p-2 border-b-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
          placeholder="Document Title"
        />
        
        <textarea
          value={content}
          onChange={handleContentChange}
          className="w-full h-[calc(100%-6rem)] p-4 border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder="Start typing..."
        />
      </div>

      {/* Chat Section */}
      <div className="w-80 bg-gray-50 border-l flex flex-col">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            <h2 className="ml-2 font-semibold">Chat</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <span className="font-medium text-sm text-indigo-600">
                  {msg.sender}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-700">{msg.message}</p>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="p-4 border-t bg-white">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentEditor;