// routes/userRoutes.js
import express from 'express';
import {
  getUsers,
  deleteAllUsers,
  register,
  login,
  logout,
  getUserProfile,
  updateProfile,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Admin-only: list all users & delete all users
router.get('/', protect, admin, getUsers);
router.delete('/', protect, admin, deleteAllUsers);


// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected (any authenticated user)
router.post('/logout', protect, logout);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);

// Self or Admin for get/update by user ID
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);

// Admin only for delete by user ID
router.delete('/:id', protect, deleteUser);

export default router;







