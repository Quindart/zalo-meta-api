import mongoose from 'mongoose';
import Friend from '../../infrastructure/mongo/model/Friend.js';

class FriendRepository {

  async getFriendByUserId(userId) {
    const friends = await Friend.find({
      $or: [{ user: userId }, { friend: userId }],
      status: 'ACCEPTED'
    })
      .populate('user', 'firstName lastName email avatar')
      .populate('friend', 'firstName lastName email avatar')
      .lean();


    const validFriends = friends.filter(item =>
      item.user && item.friend
    );

    return validFriends.map(friend => {
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
  async createFriend(userId, userFriendId) {
    const friend = new Friend({ user: userId, friend: userFriendId, status: 'PENDING' });
    return await friend.save()
  }
  async removeFriend(userId, userFriendId) {
    const friend = await Friend.findOneAndDelete({
      $or: [
        { user: userId, friend: userFriendId },
        { user: userFriendId, friend: userId }
      ]
    });
    return !!friend;
  }
  async isExistFriendRelationship(userId, userFriendId) {
    const friend = await Friend.findOne({
      $or: [
        { user: userId, friend: userFriendId },
        { user: userFriendId, friend: userId }
      ]
    }).select('status');
    return !!friend;
  }
  async getFriendByUserIdByType(userId, type) {
    const friends = await Friend.find({
      $or: [{ user: userId }, { friend: userId }],
      status: type
    })
      .populate('user', 'firstName lastName email avatar')
      .populate('friend', 'firstName lastName email avatar')
      .select('user friend status')
      .lean();

    console.log("💲💲💲 ~ FriendRepository ~ getFriendByUserIdByType ~ friends:", friends)

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
  async getById(userId) {
    const friend = await Friend.findOne({
      $or: [{ user: userId }, { friend: userId }],
      status: type
    }).populate('user', 'name email')
    return friend;
  }

  async updateFriendStatus(userId, userFriendId, type) {
    const friend = await Friend.findOne({
      $or: [
        { user: userId, friend: userFriendId },
        { user: userFriendId, friend: userId }
      ]
    })
    if (!friend) {
      throw new Error('Friend not found');
    }
    friend.status = type;
    console.log("💲💲💲 ~ FriendRepository ~ updateFriendStatus ~ friend:", friend)
    return await friend.save();
  }
}

export default new FriendRepository();