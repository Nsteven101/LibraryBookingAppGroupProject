// controllers/reviewController.js
import Review from '../models/Review.js';

// @desc    Get all reviews (or by book via query ?bookId=¡K)
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res) => {
    const filter = req.query.bookId ? { book: req.query.bookId } : {};
    const list = await Review.find(filter)
        .populate('book', 'title bookId')
        .populate('user', 'name');
    res.json(list);
};

// @desc    Get a single review by ID
// @route   GET /api/reviews/:id
// @access  Public
export const getReviewById = async (req, res) => {
    const rev = await Review.findById(req.params.id)
        .populate('book', 'title bookId')
        .populate('user', 'name');
    if (!rev) return res.status(404).json({ message: 'Review not found' });
    res.json(rev);
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
    const rev = await Review.create({ ...req.body, user: req.user._id });
    res.status(201).json(rev);
};

// @desc    Update an existing review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
    const r = await Review.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Review not found' });
    Object.assign(r, req.body);
    const updated = await r.save();
    res.json(updated);
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
    const r = await Review.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Review not found' });
    await r.remove();
    res.json({ message: 'Review deleted' });
};

// Delete all reviews (admin)
export const deleteAllReviews = async (req, res) => {
    try {
        await Review.deleteMany({});
        res.json({ message: 'All reviews deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


