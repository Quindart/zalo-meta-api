import { HTTP_STATUS } from "../../constants/index.ts"
import Friend from "../../infrastructure/mongo/model/Friend.ts"
import Error from "../../utils/errors.ts"
import mongoose from 'mongoose';
import FriendRepository from "../../domain/repository/Friend.repository.ts"
import { Request, Response } from "express"

class FriendController {
    async accpetFriend(req: Request, res: Response): Promise<void> {
        try {
            const { userFriendId } = req.body;
            const { user } = req
            const userId = user.id
            const isExistRelationship = await FriendRepository.isExistFriendRelationship(userId, userFriendId)
            if (!isExistRelationship) {
                Error.sendNotFound(res, "No Friend relationship found")
            }
            await FriendRepository.updateFriendStatus(userId, userFriendId, 'ACCEPTED')


            res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Accept friend request success",
            })
        } catch (error) {
            Error.sendError(res, error)

        }
    }
    async rejectAcceptFriend(req: Request, res: Response): Promise<void> {
        try {
            const { userFriendId } = req.body;
            const { user } = req
            const userId = user.id
            const isExistRelationship = await FriendRepository.isExistFriendRelationship(userId, userFriendId)
            if (!isExistRelationship) {
                Error.sendNotFound(res, "No Friend relationship found")
            }
            await FriendRepository.removeFriend(userId, userFriendId)


            res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Reject friend request success",
            })
        } catch (error) {
            Error.sendError(res, error)

        }
    }
    async removeFriend(req: Request, res: Response): Promise<void> {
        try {
            const { userFriendId } = req.body;
            const { user } = req
            const userId = user.id
            const isExistRelationship = await FriendRepository.isExistFriendRelationship(userId, userFriendId)
            if (!isExistRelationship) {
                Error.sendNotFound(res, "No Friend relationship found")
            }
            await FriendRepository.removeFriend(userId, userFriendId)


            res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Remove friend success",
            })
        } catch (error) {
            Error.sendError(res, error)
        }
    }
    async inviteFriend(req: Request, res: Response): Promise<void> {
        try {
            const { userFriendId } = req.body;
            const { user } = req
            const userId = user.id
            const isExistRelationship = await FriendRepository.isExistFriendRelationship(userId, userFriendId)
            if (isExistRelationship) {
                Error.sendConflict(res, "Friend relationship already exists")
            }
            await FriendRepository.createFriend(userId, userFriendId)

            res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Invite friend success",
            })
        } catch (error) {
            Error.sendError(res, error)

        }

    }
    async removeIniviteFriend(req: Request, res: Response): Promise<void> {
        try {
            const { userFriendId } = req.query;
            const { user } = req
            const userId = user.id
            const isExistRelationship = await FriendRepository.isExistFriendRelationship(userId, userFriendId)

            if (!isExistRelationship) {
                Error.sendNotFound(res, "No Friend relationship found")
            }

            await FriendRepository.removeFriend(userId, userFriendId)

            res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Remove invite friend success",
            })
        } catch (error) {
            Error.sendError(res, error)
        }
    }

    async getMyFriends(req: Request, res: Response): Promise<void> {
        const { user } = req
        if (!user) {
            Error.sendNotFound(res, "User not found")
        }
        const friends = await FriendRepository.getFriendByUserIdByType(new mongoose.Types.ObjectId(user.id), 'ACCEPTED')

        res.status(HTTP_STATUS.OK).json({
            status: HTTP_STATUS.OK,
            success: true,
            message: "Get friends success",
            data: {
                friends: friends,
                totalItem: friends.length
            }
        })
    }

    async getMyInviteFriends(req: Request, res: Response): Promise<void> {
        const { user } = req
        if (!user) {
            Error.sendNotFound(res, "User not found")
        }
        const friends = await FriendRepository.getInviteOfUser(new mongoose.Types.ObjectId(user.id))
        res.status(HTTP_STATUS.OK).json({
            success: true,
            status: HTTP_STATUS.OK,
            message: "Get invite friends success",
            data: {
                friends: friends,
            }
        })
    }

    async getMyInvitedSending(req: Request, res: Response): Promise<void> {
        const { user } = req
        if (!user) {
            Error.sendNotFound(res, "User not found")
        }
        const friends = await FriendRepository.getInviteOfUserSending(new mongoose.Types.ObjectId(user.id))
        res.status(HTTP_STATUS.OK).json({
            success: true,
            status: HTTP_STATUS.OK,
            message: "Get invite friends success",
            data: {
                friends: friends,
            }
        })
    }

    async getFriendList(req: Request, res: Response): Promise<void> {
        const { userId } = req.body;
        if (!userId) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
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

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "Get friend list success",
            data: friendList
        })
    }

}

export default new FriendController();
