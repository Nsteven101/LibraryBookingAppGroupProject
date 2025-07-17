import express from 'express';
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/bookController.js';
import auth from '../middleware/auth.js';
import { borrowBook, returnBook } from '../controllers/bookController.js';

const router = express.Router();

router.get('/', getBooks);          
router.post('/', auth, createBook); 
router.put('/:id', auth, updateBook); 
router.delete('/:id', auth, deleteBook); 
router.post('/:id/borrow', auth, borrowBook);
router.post('/:id/return', auth, returnBook);

export default router;
