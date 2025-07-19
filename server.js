// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { protect } from './middleware/auth.js';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import borrowRecordRoutes from './routes/borrowRecordRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import authorRoutes from './routes/authorRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();

// fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow-records', borrowRecordRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check (public)
app.get('/', (req, res) => {
    res.send('Borrowing Book App is running!');
});

// Serve React client in production
if (process.env.NODE_ENV === 'production') {
    app.use(
        express.static(path.join(__dirname, 'borrowing-book-client', 'build'))
    );
    app.get('*', (req, res) => {
        res.sendFile(
            path.join(__dirname, 'borrowing-book-client', 'build', 'index.html')
        );
    });
}

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });


  
