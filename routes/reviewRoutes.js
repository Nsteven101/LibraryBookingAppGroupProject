// routes/reviewRoutes.js
import express from 'express';
import {
    getReviews, getReviewById, deleteAllReviews,
    createReview, updateReview, deleteReview
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public reads
router.get('/', getReviews);
router.get('/:id', getReviewById);

// Only logged-in users can write reviews
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.delete('/', protect, admin, deleteAllReviews);

export default router;

