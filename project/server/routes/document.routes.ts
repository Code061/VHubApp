import express from 'express';
import jwt from 'jsonwebtoken';
import { Document } from '../models/Document';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get all documents for the authenticated user
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const documents = await Document.find({ owner: req.user.userId });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents', error });
  }
});

// Create a new document
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const { title, content } = req.body;
    const document = new Document({
      title,
      content,
      owner: req.user.userId
    });
    await document.save();
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ message: 'Error creating document', error });
  }
});

// Get a specific document
router.get('/:id', authenticateToken, async (req: any, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document', error });
  }
});

// Update a document
router.patch('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { title, content } = req.body;
    const document = await Document.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      { title, content, lastUpdated: Date.now() },
      { new: true }
    );
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error updating document', error });
  }
});

// Delete a document
router.delete('/:id', authenticateToken, async (req: any, res) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId
    });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document', error });
  }
});

export const documentRouter = router;