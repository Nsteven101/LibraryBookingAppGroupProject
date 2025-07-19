// routes/reservationRoutes.js
import express from 'express';
import {
    getReservations, getReservationById, deleteAllReservations,
    createReservation, updateReservation, deleteReservation
} from '../controllers/reservationController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Logged-in users can see their own reservations via a query; admins see all
router.get('/', protect, admin, getReservations);
router.get('/:id', protect, admin, getReservationById);

// Anyone logged-in can create or cancel their own reservation
router.post('/', protect, createReservation);
router.put('/:id', protect, admin, updateReservation);
router.delete('/:id', protect, admin, deleteReservation);
router.delete('/', protect, admin, deleteAllReservations);

export default router;

