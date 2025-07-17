import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import auth from './middleware/auth.js';
import bookRoutes from './routes/bookRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Borrowing Book App is running!');
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => {

 
    app.get('/api/secret', auth, (req, res) => {
      res.json({ message: 'Access granted to protected route', user: req.user });
    });


    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });

  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });

  
