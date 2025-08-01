// controllers/borrowRecordController.js
import BorrowRecord from '../models/BorrowRecord.js';

// @desc    Get borrow records (all for admin, own only for user)
// @route   GET /api/borrow-records
// @access  Private
export const getBorrowRecords = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';

    // Admin sees everything; users see only their own active records
    const filter = isAdmin
      ? {}
      : { user: req.user._id, returnedAt: null };

    const records = await BorrowRecord.find(filter)
      .populate('book', 'title bookId')
      .populate('user', 'name email')
      .sort({ borrowedAt: -1 });

    res.json(records);
  } catch (err) {
    console.error('❌ getBorrowRecords error:', err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get borrow‐record by ID, or all records for a book
// @route   GET /api/borrow-records/:id
// @access  Private/Admin
export const getBorrowRecordById = async (req, res) => {
    const { id } = req.params;
    try {
        // 1) Try finding a single record by its own _id
        let record = await BorrowRecord.findById(id)
            .populate('book', 'title bookId')
            .populate('user', 'name email');

        if (record) {
            return res.json(record);
        }

        // 2) If not a record _id_, treat `id` as a book _id_ → get all records for that book
        const records = await BorrowRecord.find({ book: id })
            .populate('book', 'title bookId')
            .populate('user', 'name email')
            .sort({ borrowedAt: -1 });

        if (records.length === 0) {
            return res.status(404).json({ message: 'No borrow records found for that book' });
        }

        return res.json(records);

    } catch (err) {
        console.error('❌ getBorrowRecordById error:', err);
        res.status(500).json({ message: err.message });
    }
};

// @desc    Create a new borrow record
// @route   POST /api/borrow-records
// @access  Private
export const createBorrowRecord = async (req, res) => {
  try {
    const record = await BorrowRecord.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update a borrow record
// @route   PUT /api/borrow-records/:id
// @access  Private
export const updateBorrowRecord = async (req, res) => {
  try {
    const rec = await BorrowRecord.findById(req.params.id);
    if (!rec) return res.status(404).json({ message: 'Record not found' });

    // Only the borrower or an admin can extend
    if (rec.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to extend this borrow record' });
    }

    // Apply new due date if provided
    if (req.body.dueAt) {
      rec.dueAt = new Date(req.body.dueAt);
    }

    const updated = await rec.save();
    res.json(updated);
  } catch (err) {
    console.error('❌ updateBorrowRecord error:', err);
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a borrow record
// @route   DELETE /api/borrow-records/:id
// @access  Private
export const deleteBorrowRecord = async (req, res) => {
  try {
    const rec = await BorrowRecord.findById(req.params.id);
    if (!rec) return res.status(404).json({ message: 'Record not found' });
    await rec.remove();
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete all records
export const deleteAllBorrowRecords = async (req, res) => {
    try {
        await BorrowRecord.deleteMany({});
        res.json({ message: 'All borrow records deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};