// routes/borrowRecordRoutes.js
import express from 'express';
import {
    getBorrowRecords, getBorrowRecordById, deleteAllBorrowRecords,
    createBorrowRecord, updateBorrowRecord, deleteBorrowRecord
} from '../controllers/borrowRecordController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Admins can view all records; normal users could have their own endpoint if you like
router.get('/', protect, admin, getBorrowRecords);
router.get('/:id', protect, admin, getBorrowRecordById);

// Admins only to tweak records
router.post('/', protect, admin, createBorrowRecord);
router.put('/:id', protect, admin, updateBorrowRecord);
router.delete('/:id', protect, admin, deleteBorrowRecord);
router.delete('/', protect, admin, deleteAllBorrowRecords);

export default router;

