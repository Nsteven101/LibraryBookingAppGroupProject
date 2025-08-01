import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
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
    reservedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: Date,
    status: {
        type: String,
        enum: ['pending', 'notified', 'expired', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

export default mongoose.model('Reservation', ReservationSchema);
