// controllers/categoryController.js
import Category from '../models/Category.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req, res) => {
    const cats = await Category.find().populate('books', 'title bookId');
    res.json(cats);
};

// @desc    Get a single category by ID
// @route   GET /api/categories/:id
// @access  Private
export const getCategoryById = async (req, res) => {
    const c = await Category.findById(req.params.id).populate('books', 'title bookId');
    if (!c) return res.status(404).json({ message: 'Category not found' });
    res.json(c);
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (req, res) => {
    const cat = await Category.create(req.body);
    res.status(201).json(cat);
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = async (req, res) => {
    const c = await Category.findById(req.params.id);
    if (!c) return res.status(404).json({ message: 'Category not found' });
    Object.assign(c, req.body);
    const updated = await c.save();
    res.json(updated);
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req, res) => {
    const c = await Category.findById(req.params.id);
    if (!c) return res.status(404).json({ message: 'Category not found' });
    await c.remove();
    res.json({ message: 'Category deleted' });
};

// Delete all categories
export const deleteAllCategories = async (req, res) => {
    try {
        await Category.deleteMany({});
        res.json({ message: 'All categories deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
