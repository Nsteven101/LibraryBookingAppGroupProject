// routes/bookRoutes.js
import express from 'express';
import {
    getBooks, getBookById, deleteAllBooks,
    createBook, updateBook, deleteBook,
    borrowBook, returnBook
} from '../controllers/bookController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Everyone who¡¦s logged in can browse & borrow/return
router.get('/', protect, getBooks);
router.get('/:id', protect, getBookById);
router.post('/:id/borrow', protect, borrowBook);
router.post('/:id/return', protect, returnBook);

// Only admins can manage inventory
router.post('/', protect, admin, createBook);
router.put('/:id', protect, admin, updateBook);
router.delete('/:id', protect, admin, deleteBook);
router.delete('/', protect, admin, deleteAllBooks);

export default router;


