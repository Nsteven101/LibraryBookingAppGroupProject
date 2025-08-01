import mongoose from 'mongoose';

const AuthorSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    bio: String,
    website: String,
    photoUrl: String,

    // back?reference: which books this author wrote
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }]
}, {
    timestamps: true
});

export default mongoose.model('Author', AuthorSchema);


