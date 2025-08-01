// models/BorrowRecord.js
import mongoose from 'mongoose';

const BorrowRecordSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    borrowedAt: {
        type: Date,
        default: Date.now
    },
    dueAt: {
        type: Date
    },
    returnedAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['borrowed', 'returned'],
        default: 'borrowed'
    }
}, {
    timestamps: true
});

export default mongoose.model('BorrowRecord', BorrowRecordSchema);

