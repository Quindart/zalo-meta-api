import User from "../../infrastructure/mongo/model/User.js"
import mongoose from 'mongoose';

export class UserRepository {
    constructor() {
        this.query = User.find();
        this.selectedFields = [];
    }
    async findOne(userId) {
        return await User.findById(new mongoose.Types.ObjectId(userId))
    }
    async findUserSelect(userId, select) {
        return await User.findById(userId).select(select.join(' ')).lean()
    }
    async searchUser(type, keywords) {
        const regex = {}
        regex[`${type}`] = keywords
        return await User.find(regex).select(select.join(' ')).lean()
    }
}