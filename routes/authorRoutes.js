// routes/authorRoutes.js
import express from 'express';
import {
    getAuthors, getAuthorById, deleteAllAuthors,
    createAuthor, updateAuthor, deleteAuthor
} from '../controllers/authorController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Anyone logged-in can read
router.get('/', protect, getAuthors);
router.get('/:id', protect, getAuthorById);

// Admins only to modify
router.post('/', protect, admin, createAuthor);
router.put('/:id', protect, admin, updateAuthor);
router.delete('/:id', protect, admin, deleteAuthor);
router.delete('/', protect, admin, deleteAllAuthors);

export default router;

