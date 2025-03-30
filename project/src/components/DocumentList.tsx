import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';

interface Document {
  _id: string;
  title: string;
  lastUpdated: string;
}

const DocumentList = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/documents', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      setError('Failed to load documents');
    }
  };

  const createNewDocument = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title: 'Untitled Document',
          content: '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create document');
      }

      const newDoc = await response.json();
      navigate(`/documents/${newDoc._id}`);
    } catch (err) {
      setError('Failed to create new document');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
        <button
          onClick={createNewDocument}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Document
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {documents.map((doc) => (
          <div
            key={doc._id}
            onClick={() => navigate(`/documents/${doc._id}`)}
            className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow"
          >
            <FileText className="h-6 w-6 text-indigo-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">{doc.title}</h3>
              <p className="text-sm text-gray-500">
                Last updated: {new Date(doc.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}

        {documents.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500">
            No documents yet. Create your first document!
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentList;