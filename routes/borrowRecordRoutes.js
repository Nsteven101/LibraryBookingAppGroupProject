// routes/borrowRecordRoutes.js
import express from 'express';
import {
    getBorrowRecords, getBorrowRecordById, deleteAllBorrowRecords,
    createBorrowRecord, updateBorrowRecord, deleteBorrowRecord
} from '../controllers/borrowRecordController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Admins can view all records; normal users could have their own endpoint if you like
router.get('/', protect, getBorrowRecords);
router.get('/:id', protect, getBorrowRecordById);

// Admins only to tweak records
router.post('/', protect, createBorrowRecord);
router.put('/:id', protect, updateBorrowRecord);
router.delete('/:id', protect, deleteBorrowRecord);
router.delete('/', protect, deleteAllBorrowRecords);

export default router;

