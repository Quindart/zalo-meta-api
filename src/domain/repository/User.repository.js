import User from "../../infrastructure/mongo/model/User"

export class UserRepository {

   async findOne(userId){
        return await User.findById(userId)
    }
    async findOne(userId){
        return await User.findById(userId)
    }
}