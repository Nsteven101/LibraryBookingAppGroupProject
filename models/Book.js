import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const BookSchema = new mongoose.Schema({
    bookId: {
        type: String,
        required: true,
        unique: true,
        default: () => uuidv4()
    },
    title: { type: String, required: true },
    description: String,
    coverImageUrl: String,
    averageRating: { type: Number, default: 0 },

    // link only to Author documents
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true }],

    // link to Category documents
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],

    borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    borrowedAt: Date
}, {
    timestamps: true
});

BookSchema.pre('save', function (next) {
    if (!this.bookId) this.bookId = uuidv4();
    next();
});

export default mongoose.model('Book', BookSchema);


