import React from 'react';
import { FileText } from 'lucide-react';

interface DocumentEditorProps {
  content: string;
  isHost: boolean;
  onContentChange: (content: string) => void;
}

export function DocumentEditor({ content, isHost, onContentChange }: DocumentEditorProps) {
  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-lg shadow-lg border-2 border-gray-200">
      <div className="p-4 border-b flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <h2 className="font-semibold">Document Editor</h2>
        </div>
        {!isHost && (
          <span className="text-sm text-gray-500">View Only</span>
        )}
      </div>
      
      {isHost ? (
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="w-full h-[calc(100%-4rem)] p-4 resize-none focus:outline-none border-0"
          placeholder="Start typing here..."
          style={{ 
            background: 'repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 31px, #e5e7eb 32px)',
            lineHeight: '32px',
            padding: '8px 16px'
          }}
        />
      ) : (
        <div 
          className="w-full h-[calc(100%-4rem)] p-4 overflow-y-auto whitespace-pre-wrap"
          style={{ 
            background: 'repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 31px, #e5e7eb 32px)',
            lineHeight: '32px',
            padding: '8px 16px'
          }}
        >
          {content || "No content yet..."}
        </div>
      )}
    </div>
  );
}