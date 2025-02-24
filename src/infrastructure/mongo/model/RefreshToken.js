import mongoose from 'mongoose';

const RefreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true }
}, { timestamps: true });

const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);

export default RefreshToken;