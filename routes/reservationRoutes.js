import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createReservation,
  getReservations,
  deleteReservation,
  deleteAllReservations
} from '../controllers/reservationController.js';

const router = express.Router();

router.use(protect);

router.post('/', createReservation);
router.get ('/', getReservations);          // now returns ALL holds
router.delete('/:id', deleteReservation);
router.delete('/',    deleteAllReservations);

export default router;
