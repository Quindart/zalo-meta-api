import User from "../../infrastructure/mongo/model/User.js"

export class UserRepository {
    constructor() {
        this.query = User.find();
        this.selectedFields = [];
    }
    async findOne(userId) {
        return await User.findById(userId)
    }
    async findUserSelect(userId, select) {
        return await User.findById(userId).select(select.join(' ')).lean()
    }
}