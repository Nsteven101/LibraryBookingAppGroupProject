// routes/reservationRoutes.js
import express from 'express';
import {
  getReservations,
  createReservation,
  deleteAllReservations,
  getReservationById,
  updateReservation,
  deleteReservation
} from '../controllers/reservationController.js';

const router = express.Router();

router.get('/', getReservations);
router.post('/', createReservation);
router.delete('/', deleteAllReservations);
router.get('/:id', getReservationById);
router.put('/:id', updateReservation);
router.delete('/:id', deleteReservation);

export default router;
