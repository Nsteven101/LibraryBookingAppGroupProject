// routes/categoryRoutes.js
import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
    getCategories, deleteAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';

const router = express.Router();

// Logged-in users can view categories
router.get('/', protect, getCategories);
router.get('/:id', protect, getCategoryById);

// Only admins can create, update, or delete categories
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);
router.delete('/', protect, admin, deleteAllCategories);

export default router;



