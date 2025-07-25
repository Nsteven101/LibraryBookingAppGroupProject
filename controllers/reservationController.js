// controllers/reservationController.js
import Reservation from '../models/Reservation.js';
import Book from '../models/Book.js';

// @desc    Get all reservations (admin only)
// @route   GET /api/reservations
// @access  Private/Admin
export const getReservations = async (req, res) => {
  try {
    // Return every active reservation, regardless of user
    const list = await Reservation.find()
      .populate('book', 'title')
      .populate('user', 'name')   // if you only need the user’s name
      .sort({ reservedAt: -1 });

    res.json(list);
  } catch (err) {
    console.error('❌ getReservations error:', err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete all reservations (admin only)
// @route   DELETE /api/reservations
// @access  Private/Admin
export const deleteAllReservations = async (req, res) => {
    try {
        await Reservation.deleteMany({});
        res.json({ message: 'All reservations deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get a single reservation by ID (admin only)
// @route   GET /api/reservations/:id
// @access  Private/Admin
export const getReservationById = async (req, res) => {
    try {
        const r = await Reservation.findById(req.params.id)
            .populate('book', 'title bookId')
            .populate('user', 'name email');
        if (!r) return res.status(404).json({ message: 'Reservation not found' });
        res.json(r);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Create a reservation for a single book
// @route   POST /api/reservations
// @access  Private
export const createReservation = async (req, res) => {
    console.log('🔔 createReservation called, req.body =', req.body);
    const { book: bookId, expiresAt } = req.body || {};

    if (!bookId) {
        return res.status(400).json({ message: 'Missing “book” field in JSON body' });
    }

    try {
        // 1) Book must exist
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        // 2) Can't reserve if it's borrowed
        if (book.borrowedBy) {
            return res.status(400).json({ message: 'Cannot reserve a borrowed book' });
        }

        // 3) Can't double-reserve
        const existing = await Reservation.findOne({ book: book._id, status: 'pending' });
        if (existing) {
            return res.status(400).json({ message: 'Book already reserved' });
        }

        // 4) Create it
        const reservation = new Reservation({ book: book._id, user: req.user._id, expiresAt });
        await reservation.save();
        res.status(201).json(reservation);

    } catch (err) {
        console.error('❌ createReservation error:', err);
        res.status(500).json({ message: err.message });
    }
};

// @desc    Update a reservation (admin only)
// @route   PUT /api/reservations/:id
// @access  Private/Admin
export const updateReservation = async (req, res) => {
    try {
        const r = await Reservation.findById(req.params.id);
        if (!r) return res.status(404).json({ message: 'Reservation not found' });
        Object.assign(r, req.body);
        const updated = await r.save();
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Delete a reservation (admin only)
// @route   DELETE /api/reservations/:id
// @access  Private/Admin
export const deleteReservation = async (req, res) => {
    try {
        const r = await Reservation.findById(req.params.id);
        if (!r) return res.status(404).json({ message: 'Reservation not found' });
        await r.deleteOne();
        res.json({ message: 'Reservation deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

