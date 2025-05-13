import { injectable } from "inversify";
import { IFriendRepository } from "../../../domain/repositories/IFriend.repository";
import Friend from "../model/Friend";

@injectable()
export class MongooseFriendRepository implements IFriendRepository {
    async getFriendByUserId(userId: string) {
        try {
            const friends = await Friend.find({
                $or: [{ user: userId }, { friend: userId }],
                status: 'ACCEPTED',
            })
                .populate('user', 'firstName lastName email avatar')
                .populate('friend', 'firstName lastName email avatar')
                .lean();

            const validFriends = friends.filter(item => item.user && item.friend);

            return validFriends.map(friend => {
                const isUser = friend.user._id.toString() === userId.toString();
                const friendData: any = isUser ? friend.friend : friend.user;

                return {
                    id: friendData._id,
                    name: `${friendData.lastName} ${friendData.firstName}`,
                    avatar: friendData.avatar,
                    email: friendData.email,
                };
            });
        } catch (error) {
            console.error("Error in getFriendByUserId:", error);
            throw new Error(error.message || "Failed to retrieve friends.");
        }
    }

    async createFriend(userId: string, userFriendId: string) {
        try {
            const friend = new Friend({ user: userId, friend: userFriendId, status: 'PENDING' });
            return await friend.save();
        } catch (error) {
            console.error("Error in createFriend:", error);
            throw new Error(error.message || "Failed to create friend request.");
        }
    }

    async removeFriend(userId: string, userFriendId: string) {
        try {
            const friend = await Friend.findOneAndDelete({
                $or: [
                    { user: userId, friend: userFriendId },
                    { user: userFriendId, friend: userId },
                ],
            });
            return !!friend;
        } catch (error) {
            console.error("Error in removeFriend:", error);
            throw new Error(error.message || "Failed to remove friend.");
        }
    }

    async isExistFriendRelationship(userId: string, userFriendId: string) {
        try {
            const friend = await Friend.findOne({
                $or: [
                    { user: userId, friend: userFriendId },
                    { user: userFriendId, friend: userId },
                ],
            }).select('status');
            return !!friend;
        } catch (error) {
            console.error("Error in isExistFriendRelationship:", error);
            throw new Error(error.message || "Failed to check friend relationship.");
        }
    }

    async getFriendByUserIdByType(userId: string, type: string) {
        try {
            const friends = await Friend.find({
                $or: [{ user: userId }, { friend: userId }],
                status: type,
            })
                .populate('user', 'firstName lastName email avatar phone')
                .populate('friend', 'firstName lastName email avatar phone')
                .select('user friend status')
                .lean();

            return friends.map(friend => {
                const isUser = friend.user._id.toString() === userId.toString();
                const friendData: any = isUser ? friend.friend : friend.user;

                return {
                    id: friendData._id,
                    name: `${friendData.lastName} ${friendData.firstName}`,
                    avatar: friendData.avatar,
                    email: friendData.email,
                    phone: friendData.phone,
                };
            });
        } catch (error) {
            console.error("Error in getFriendByUserIdByType:", error);
            throw new Error(error.message || "Failed to retrieve friends by type.");
        }
    }

    async getInviteOfUser(userId: string) {
        try {
            const invites = await Friend.find({
                friend: userId,
                status: 'PENDING',
            })
                .populate('user', 'firstName lastName avatar phone')
                .populate('friend', 'firstName lastName avatar phone')
                .select('user friend status')
                .lean();

            return invites.map((item: any) => ({
                id: item.user._id,
                name: `${item.user.lastName} ${item.user.firstName}`,
                avatar: item.user.avatar,
                phone: item.user.phone,
            }));
        } catch (error) {
            console.error("Error in getInviteOfUser:", error);
            throw new Error(error.message || "Failed to retrieve friend invites.");
        }
    }

    async getInviteOfUserSending(userId: string) {
        try {
            const invites = await Friend.find({
                user: userId,
                status: 'PENDING',
            })
                .populate('user', 'firstName lastName avatar phone')
                .populate('friend', 'firstName lastName avatar phone')
                .select('user friend status')
                .lean();

            return invites.map((item: any) => ({
                id: item.friend._id,
                name: `${item.friend.lastName} ${item.friend.firstName}`,
                avatar: item.friend.avatar,
                phone: item.friend.phone,
            }));
        } catch (error) {
            console.error("Error in getInviteOfUserSending:", error);
            throw new Error(error.message || "Failed to retrieve sent friend invites.");
        }
    }

    async getById(userId: string) {
        try {
            const friend = await Friend.findOne({
                $or: [{ user: userId }, { friend: userId }],
            }).populate('user', 'name phone');
            return friend;
        } catch (error) {
            console.error("Error in getById:", error);
            throw new Error(error.message || "Failed to retrieve friend by ID.");
        }
    }

    async updateFriendStatus(userId: string, userFriendId: string, type: string) {
        try {
            const friend: any = await Friend.findOne({
                $or: [
                    { user: userId, friend: userFriendId },
                    { user: userFriendId, friend: userId },
                ],
            });
            if (!friend) {
                throw new Error('Friend not found');
            }
            friend.status = type;
            return await friend.save();
        } catch (error) {
            console.error("Error in updateFriendStatus:", error);
            throw new Error(error.message || "Failed to update friend status.");
        }
    }
}