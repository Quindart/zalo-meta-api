import { HTTP_STATUS } from "../../constants/index.js";
import User from "../../infrastructure/mongo/model/User.js"
import Friend from "../../infrastructure/mongo/model/Friend.js"
import Error from "../../utils/errors.js";
import mongoose from 'mongoose';
import FriendRepository from "../../domain/repository/Friend.repository.js";

class FriendController {
    async accpetFriend(req, res) {
        try {
            const { userFriendId } = req.body;
            const { user } = req
            const userId = user.id
            const isExistRelationship = await FriendRepository.isExistFriendRelationship(userId, userFriendId)
            if (!isExistRelationship) {
                return Error.sendNotFound(res, "No Friend relationship found")
            }
            if (isExistRelationship.status === 'BLOCKED') {
                return Error.sendNotFound(res, "Friend relationship is blocked")
            }
            if (isExistRelationship.status === 'ACCEPTED') {
                return Error.sendBadRequest(res, "Friend relationship already accepted")
            }
            await FriendRepository.updateFriendStatus(userId, userFriendId, 'ACCEPTED')
            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Accept friend request success",
            })
        } catch (error) {
            return Error.sendError(res, error)

        }
    }
    async rejectAcceptFriend(req, res) {
        try {
            const { userFriendId } = req.body;
            const { user } = req
            const userId = user.id
            const isExistRelationship = await FriendRepository.isExistFriendRelationship(userId, userFriendId)
            if (!isExistRelationship) {
                return Error.sendNotFound(res, "No Friend relationship found")
            }
            if (isExistRelationship.status === 'BLOCKED') {
                return Error.sendNotFound(res, "Friend relationship is blocked")
            }
            if (isExistRelationship.status === 'ACCEPTED') {
                return Error.sendBadRequest(res, "Friend relationship already accepted")
            }
            await FriendRepository.removeFriend(userId, userFriendId)
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Reject friend request success",
            })
        } catch (error) {
            return Error.sendError(res, error)

        }
    }
    async removeFriend(req, res) {
        try {
            const { userFriendId } = req.body;
            const { user } = req
            const userId = user.id
            const isExistRelationship = await FriendRepository.isExistFriendRelationship(userId, userFriendId)
            if (!isExistRelationship) {
                return Error.sendNotFound(res, "No Friend relationship found")
            }
            if (isExistRelationship.status !== 'ACCEPTED') {
                return Error.sendBadRequest(res, "Friend not accepted")
            }
            await FriendRepository.removeFriend(userId, userFriendId)
            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Remove friend success",
            })
        } catch (error) {
            return Error.sendError(res, error)
        }
    }
    async inviteFriend(req, res) {
        try {
            const { userFriendId } = req.body;
            const { user } = req
            const userId = user.id
            const isExistRelationship = await FriendRepository.isExistFriendRelationship(userId, userFriendId)
            if (isExistRelationship) {
                return Error.sendConflict(res, "Friend relationship already exists")
            }
            await FriendRepository.createFriend(userId, userFriendId)

            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Invite friend success",
            })
        } catch (error) {
            return Error.sendError(res, error)

        }

    }
    async removeIniviteFriend(req, res) {
        try {
            const { userFriendId } = req.query;
            const { user } = req
            const userId = user.id
            const isExistRelationship = await FriendRepository.isExistFriendRelationship(userId, userFriendId)

            if (!isExistRelationship) {
                return Error.sendNotFound(res, "No Friend relationship found")
            }
            if (isExistRelationship.status === 'ACCEPTED') {
                return Error.sendBadRequest(res, "Friend relationship already accepted")
            }

            await FriendRepository.removeFriend(userId, userFriendId)

            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Remove invite friend success",
            })
        } catch (error) {
            return Error.sendError(res, error)
        }
    }

    async getMyFriends(req, res) {
        const { user } = req
        if (!user) {
          return Error.sendNotFound(res, "User not found")
        }
        const friends = await FriendRepository.getFriendByUserIdByType(user.id, 'ACCEPTED')

        return res.status(HTTP_STATUS.OK).json({
            status: HTTP_STATUS.OK,
            success: true,
            message: "Get friends success",
            data: {
                friends: friends,
                totalItem: friends.length
            }
        })
    }

    async getMyInviteFriends(req, res) {
        const { user } = req
        if (!user) {
            return Error.sendNotFound(res, "User not found")
        }
        const friends = await FriendRepository.getFriendByUserIdByType(user.id, 'PENDING')
        return res.status(HTTP_STATUS.OK).json({
            success: true,
            status: HTTP_STATUS.OK,
            message: "Get invite friends success",
            data: {
                friends: friends,
                totalItem: friends.length
            }
        })
    }

    async getFriendList(req, res) {
        const { userId } = req.body;
        if (!userId) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: "User ID is required"
            });
        }

        const friendList = await Friend.find({ user: new mongoose.Types.ObjectId(userId) })
            .populate({
                path: "friend",
                select: "_id firstName lastName avatar",
            })
            .lean();

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "Get friend list success",
            data: friendList
        })
    }

}

export default new FriendController();
