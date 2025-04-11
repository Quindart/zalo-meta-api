import mongoose from 'mongoose';
import Friend from '../../infrastructure/mongo/model/Friend.js';

class FriendRepository {
    async createFriend(userId, friendId) {
        const friend = new Friend({ user: userId, friend: friendId });
        return await friend.save();
    }

    async getFriendByUserId(userId) {
        return await Friend.find({ user: userId }).populate('friend', 'firstName lastName avatar email');
    }

    async getFriendByFriendId(friendId) {
        return await Friend.find({ friend: friendId }).populate('user', 'name email');
    }
}

export default new FriendRepository();