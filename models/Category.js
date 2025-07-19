import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String,

    // ¡ö back?reference: list of Books in this genre
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
}, {
    timestamps: true
});

export default mongoose.model('Category', CategorySchema);
