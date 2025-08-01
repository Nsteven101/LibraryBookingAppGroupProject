// controllers/authorController.js
import Author from '../models/Author.js';

// @desc    Get all authors
// @route   GET /api/authors
// @access  Private
export const getAuthors = async (req, res) => {
    const authors = await Author.find().populate('books', 'title bookId');
    res.json(authors);
};

// @desc    Get a single author by ID
// @route   GET /api/authors/:id
// @access  Private
export const getAuthorById = async (req, res) => {
    const a = await Author.findById(req.params.id).populate('books', 'title bookId');
    if (!a) return res.status(404).json({ message: 'Author not found' });
    res.json(a);
};

// @desc    Create an author
// @route   POST /api/authors
// @access  Private
export const createAuthor = async (req, res) => {
    const author = await Author.create(req.body);
    res.status(201).json(author);
};

// @desc    Update an author
// @route   PUT /api/authors/:id
// @access  Private
export const updateAuthor = async (req, res) => {
    const a = await Author.findById(req.params.id);
    if (!a) return res.status(404).json({ message: 'Author not found' });
    Object.assign(a, req.body);
    const updated = await a.save();
    res.json(updated);
};

// @desc    Delete an author
// @route   DELETE /api/authors/:id
// @access  Private
export const deleteAuthor = async (req, res) => {
    const a = await Author.findById(req.params.id);
    if (!a) return res.status(404).json({ message: 'Author not found' });
    await a.remove();
    res.json({ message: 'Author deleted' });
};

// Delete all authors
export const deleteAllAuthors = async (req, res) => {
    try {
        await Author.deleteMany({});
        res.json({ message: 'All authors deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
