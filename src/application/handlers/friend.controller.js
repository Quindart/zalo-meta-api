import { HTTP_STATUS } from "../../constants/index.js";
import User from "../../infrastructure/mongo/model/User.js"
import Friend from "../../infrastructure/mongo/model/Friend.js"
import Error from "../../utils/errors.js";

class FriendController {

    async inviteFriend(req, res) {
        const { friendId } = req.params
        const old_friends = await User.findOne({ id: req.user.id }).populate("friends").select({ friends: 1 }).lean()

        if (old_friends.some(fr => fr.id === friendId)) {
            return Error.sendConflict("This friend already exist!")
        }

        const friend = await Friend.create({
            user: friendId,
            status: "PENDING"
        })
        const updated_user = await User.findByIdAndUpdate({ id: req.user.id },
            { $push: { friends: friend } }
            ,{
                new: true
            })

        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: "Make friend success",
            user: updated_user
        })
    }
    
}

export default new FriendController();
