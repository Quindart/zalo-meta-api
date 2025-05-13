import { HTTP_STATUS } from "../../constants/index"
import Friend from "../../infrastructure/mongo/model/Friend"
import Error from "../../utils/errors"
import mongoose from 'mongoose';
import { Request, Response } from "express"
import { IFriendService } from "../../application/interfaces/services/IFriendService";
import TYPES from '../../infrastructure/inversify/type';
import { container } from "../../infrastructure/inversify/container";
import { RequestUser } from "../../types/request/RequestUser";

class FriendController {
    private friendService: IFriendService
    contructor() {
        this.friendService = container.get<IFriendService>(TYPES.FriendService)
    }
    async accpetFriend(req: RequestUser, res: Response): Promise<void> {
        try {
            const { userFriendId } = req.body;
            const { user } = req
            const userId = user.id
            const isExistRelationship = await this.friendService.isExistFriendRelationship(userId, userFriendId)
            if (!isExistRelationship) {
                Error.sendNotFound(res, "No Friend relationship found")
            }
            await this.friendService.updateFriendStatus(userId, userFriendId, 'ACCEPTED')


            res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Accept friend request success",
            })
        } catch (error) {
            Error.sendError(res, error)

        }
    }
    async rejectAcceptFriend(req: RequestUser, res: Response): Promise<void> {
        try {
            const { userFriendId } = req.body;
            const { user } = req
            const userId = user.id
            const isExistRelationship = await this.friendService.isExistFriendRelationship(userId, userFriendId)
            if (!isExistRelationship) {
                Error.sendNotFound(res, "No Friend relationship found")
            }
            await this.friendService.removeFriend(userId, userFriendId)


            res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Reject friend request success",
            })
        } catch (error) {
            Error.sendError(res, error)

        }
    }
    async removeFriend(req: RequestUser, res: Response): Promise<void> {
        try {
            const { userFriendId } = req.body;
            const { user } = req
            const userId = user.id
            const isExistRelationship = await this.friendService.isExistFriendRelationship(userId, userFriendId)
            if (!isExistRelationship) {
                Error.sendNotFound(res, "No Friend relationship found")
            }
            await this.friendService.removeFriend(userId, userFriendId)


            res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Remove friend success",
            })
        } catch (error) {
            Error.sendError(res, error)
        }
    }
    async inviteFriend(req: RequestUser, res: Response): Promise<void> {
        try {
            const { userFriendId } = req.body;
            const { user } = req
            const userId = user.id
            const isExistRelationship = await this.friendService.isExistFriendRelationship(userId, userFriendId)
            if (isExistRelationship) {
                Error.sendConflict(res, "Friend relationship already exists")
            }
            await this.friendService.createFriend(userId, userFriendId)

            res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Invite friend success",
            })
        } catch (error) {
            Error.sendError(res, error)

        }

    }
    async removeIniviteFriend(req: RequestUser, res: Response): Promise<void> {
        try {
            const { userFriendId } = req.query;
            const { user } = req
            const userId = user.id
            const isExistRelationship = await this.friendService.isExistFriendRelationship(userId, `${userFriendId}`)

            if (!isExistRelationship) {
                Error.sendNotFound(res, "No Friend relationship found")
            }

            await this.friendService.removeFriend(userId, `${userFriendId}`)

            res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Remove invite friend success",
            })
        } catch (error) {
            Error.sendError(res, error)
        }
    }

    async getMyFriends(req: RequestUser, res: Response): Promise<void> {
        const { user } = req
        if (!user) {
            Error.sendNotFound(res, "User not found")
        }
        const friends = await this.friendService.getFriendByUserIdByType(new mongoose.Types.ObjectId(`${user.id}`), 'ACCEPTED')

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

    async getMyInviteFriends(req: RequestUser, res: Response): Promise<void> {
        const { user } = req
        if (!user) {
            Error.sendNotFound(res, "User not found")
        }
        const friends = await this.friendService.getInviteOfUser(new mongoose.Types.ObjectId(user.id))
        res.status(HTTP_STATUS.OK).json({
            success: true,
            status: HTTP_STATUS.OK,
            message: "Get invite friends success",
            data: {
                friends: friends,
            }
        })
    }

    async getMyInvitedSending(req: RequestUser, res: Response): Promise<void> {
        const { user } = req
        if (!user) {
            Error.sendNotFound(res, "User not found")
        }
        const friends = await this.friendService.getInviteOfUserSending(new mongoose.Types.ObjectId(user.id))
        res.status(HTTP_STATUS.OK).json({
            success: true,
            status: HTTP_STATUS.OK,
            message: "Get invite friends success",
            data: {
                friends: friends,
            }
        })
    }

    async getFriendList(req: RequestUser, res: Response): Promise<void> {
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
