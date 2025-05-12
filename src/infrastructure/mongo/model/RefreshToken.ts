import mongoose, { Schema, Types } from 'mongoose';
import { IRefreshTokenType } from '../../../domain/entities/refreshToken/RefreshToken.type';

export interface RefreshTokenDocument extends Omit<IRefreshTokenType, '_id'>, Document {
    toObject(): unknown;
    _id: Types.ObjectId;
}
const RefreshTokenSchema: Schema<RefreshTokenDocument> = new Schema({
    token: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    expiresAt: { type: Date, required: true }
}, { timestamps: true });

const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);

export default RefreshToken;