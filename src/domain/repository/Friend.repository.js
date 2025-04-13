import mongoose from 'mongoose';
import Friend from '../../infrastructure/mongo/model/Friend.js';

class FriendRepository {
    async createFriend(userId, friendId) {
        const friend = new Friend({ user: userId, friend: friendId });
        return await friend.save();
    }

    async getFriendByUserId(userId) {
        const friends = await Friend.find({
          $or: [{ user: userId }, { friend: userId }],
          status: 'ACCEPTED'
        })
          .populate('user', 'firstName lastName email avatar') 
          .populate('friend', 'firstName lastName email avatar')
          .lean();
      
        return friends.map(friend => {
          const isUser = friend.user._id.toString() === userId.toString();
          const friendData = isUser ? friend.friend : friend.user;
      
          return {
            id: friendData._id,
            name: `${friendData.lastName} ${friendData.firstName}`, 
            avatar: friendData.avatar,
            email: friendData.email
          };
        });
      }

    async getFriendByFriendId(friendId) {
        return await Friend.find({ friend: friendId }).populate('user', 'name email');
    }
}

export default new FriendRepository();