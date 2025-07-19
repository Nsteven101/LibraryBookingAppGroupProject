// controllers/bookController.js
import Book from '../models/Book.js';
import BorrowRecord from '../models/BorrowRecord.js';
import Reservation from '../models/Reservation.js';
import Category from '../models/Category.js';
import Author from '../models/Author.js';

// @desc    Get all books
// @route   GET /api/books
// @access  Private
export const getBooks = async (req, res) => {
    try {
        const books = await Book.find()
            .populate('authors', 'name')
            .populate('categories', 'name')
            .populate('borrowedBy', 'name email');
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Delete ALL books
// @route   DELETE /api/books
// @access  Private/Admin
export const deleteAllBooks = async (req, res) => {
    try {
        await Book.deleteMany({});
        res.json({ message: 'All books deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get a single book by _id or bookId
// @route   GET /api/books/:id
// @access  Private
export const getBookById = async (req, res) => {
    try {
        const book = await Book.findOne({
            $or: [{ _id: req.params.id }, { bookId: req.params.id }]
        })
            .populate('authors', 'name')
            .populate('categories', 'name')
            .populate('borrowedBy', 'name');

        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private/Admin
export const createBook = async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();

        // Sync categories
        if (book.categories?.length) {
            await Category.updateMany(
                { _id: { $in: book.categories } },
                { $addToSet: { books: book._id } }
            );
        }
        // Sync authors
        if (book.authors?.length) {
            await Author.updateMany(
                { _id: { $in: book.authors } },
                { $addToSet: { books: book._id } }
            );
        }

        res.status(201).json(book);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
export const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const oldCats = book.categories.map(c => c.toString());
        const oldAuths = book.authors.map(a => a.toString());

        Object.assign(book, req.body);
        const updated = await book.save();

        // Add to new categories
        if (updated.categories?.length) {
            await Category.updateMany(
                { _id: { $in: updated.categories } },
                { $addToSet: { books: updated._id } }
            );
        }
        // Remove from removed categories
        const removedCats = oldCats.filter(cId => !updated.categories.map(x => x.toString()).includes(cId));
        if (removedCats.length) {
            await Category.updateMany(
                { _id: { $in: removedCats } },
                { $pull: { books: updated._id } }
            );
        }

        // Add to new authors
        if (updated.authors?.length) {
            await Author.updateMany(
                { _id: { $in: updated.authors } },
                { $addToSet: { books: updated._id } }
            );
        }
        // Remove from removed authors
        const removedAuths = oldAuths.filter(aId => !updated.authors.map(x => x.toString()).includes(aId));
        if (removedAuths.length) {
            await Author.updateMany(
                { _id: { $in: removedAuths } },
                { $pull: { books: updated._id } }
            );
        }

        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
export const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        // Sync removal from categories and authors
        if (book.categories?.length) {
            await Category.updateMany(
                { _id: { $in: book.categories } },
                { $pull: { books: book._id } }
            );
        }
        if (book.authors?.length) {
            await Author.updateMany(
                { _id: { $in: book.authors } },
                { $pull: { books: book._id } }
            );
        }

        await book.deleteOne();
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Borrow a book
// @route   POST /api/books/:id/borrow
// @access  Private
export const borrowBook = async (req, res) => {
    const { dueAt } = req.body;
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        if (book.borrowedBy) return res.status(400).json({ message: 'Book already borrowed' });

        const reservation = await Reservation.findOne({ book: book._id, status: 'pending' });
        if (reservation && reservation.user.toString() !== req.user.id) {
            return res.status(400).json({ message: 'Book reserved by another user' });
        }
        if (reservation && reservation.user.toString() === req.user.id) {
            reservation.status = 'cancelled';
            await reservation.save();
        }

        const record = await BorrowRecord.create({ book: book._id, user: req.user.id, dueAt });
        book.borrowedBy = req.user.id;
        book.borrowedAt = new Date();
        await book.save();

        res.status(201).json({ book, record });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Return a book
// @route   POST /api/books/:id/return
// @access  Private
export const returnBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        if (!book.borrowedBy) return res.status(400).json({ message: 'Book is not currently borrowed' });

        // Find *active* borrow record
        const record = await BorrowRecord.findOne({
            book: book._id,
            user: req.user._id,
            status: 'borrowed'
        });
        if (!record) {
            return res.status(404).json({ message: 'No active borrow record found for this user/book' });
        }

        // Mark it returned
        record.returnedAt = new Date();
        record.status = 'returned';
        await record.save();

        // Clear book’s borrowed fields
        book.borrowedBy = null;
        book.borrowedAt = null;
        await book.save();

        res.json({
            message: 'Book returned successfully',
            book,
            record   // now includes returnedAt & status
        });
    } catch (err) {
        console.error('❌ returnBook error:', err);
        res.status(500).json({ message: err.message });
    }
};




