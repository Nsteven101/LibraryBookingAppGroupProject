import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type: String,enum: ['user', 'admin'],default: 'user'},
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }],
    borrowRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BorrowRecord' }]
}, {
    timestamps: true
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function (entered) {
    return bcrypt.compare(entered, this.password);
};

export default mongoose.model('User', UserSchema);
