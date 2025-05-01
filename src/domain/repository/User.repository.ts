import User from "../../infrastructure/mongo/model/User.ts"
import mongoose from 'mongoose';

export class UserRepository {
    public selectedFields: any[]
    public query: any
    constructor() {
        this.query = User.find();
        this.selectedFields = [];
    }
    async findOne(userId) {
        return await User.findById(new mongoose.Types.ObjectId(userId))
    }
    async findUserSelect(userId: string, select: string[]): Promise<any> {
        return await User.findById(userId).select(select.join(' ')).lean()
    }
    // async searchUser(type, keywords) {
    //     const regex = {}
    //     regex[`${type}`] = keywords
    //     return await User.find(regex).select(selectedFields.join(' ')).lean()
    // }
}