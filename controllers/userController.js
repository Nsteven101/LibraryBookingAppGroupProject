// controllers/userController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error("❌ getUsers error:", err);
        res.status(500).json({ message: err.message });
    }
};

// @desc    Delete ALL users
// @route   DELETE /api/users
// @access  Private/Admin
export const deleteAllUsers = async (req, res) => {
    try {
        await User.deleteMany({});
        res.json({ message: 'All users deleted' });
    } catch (err) {
        console.error("❌ deleteAllUsers error:", err);
        res.status(500).json({ message: err.message });
    }
};

// @desc    Register a new user (optionally with role)
// @route   POST /api/users/register
// @access  Public
export const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const user = new User({ name, email, password, role });
        await user.save();
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (err) {
        console.error("❌ Registration error:", err);
        res.status(500).json({ message: err.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({ token });
    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ message: err.message });
    }
};

// @desc    Log out user (stateless JWT)
// @route   POST /api/users/logout
// @access  Private
export const logout = (req, res) => {
    res.json({ message: 'Logout successful' });
};

// @desc    Get logged-in user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
    try {
        const u = await User.findById(req.user._id).select('-password');
        if (!u) return res.status(404).json({ message: 'User not found' });
        res.json(u);
    } catch (err) {
        console.error("❌ getProfile error:", err);
        res.status(500).json({ message: err.message });
    }
};

// @desc    Update own user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const { name, email, password } = req.body || {};
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;
        const updated = await user.save();
        res.json({
            _id: updated._id,
            name: updated.name,
            email: updated.email,
            role: updated.role
        });
    } catch (err) {
        console.error("❌ updateProfile error:", err);
        res.status(400).json({ message: err.message });
    }
};

// @desc    Get a user by ID (self or admin)
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user._id.toString() !== id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const user = await User.findById(id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error("❌ getUserById error:", err);
        res.status(500).json({ message: err.message });
    }
};

// @desc    Update any user by ID (or self via same endpoint)
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user._id.toString() !== id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const { name, email, password, role } = req.body || {};
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;
        if (req.user.role === 'admin' && role) {
            user.role = role;
        }
        const updated = await user.save();
        res.json({
            _id: updated._id,
            name: updated.name,
            email: updated.email,
            role: updated.role
        });
    } catch (err) {
        console.error("❌ updateUser error:", err);
        res.status(400).json({ message: err.message });
    }
};

// @desc    Delete a user by ID
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await user.deleteOne();
        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error("❌ deleteUser error:", err);
        res.status(500).json({ message: err.message });
    }
};





