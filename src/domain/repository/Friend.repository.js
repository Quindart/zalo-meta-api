import mongoose from 'mongoose';
import Friend from '../../infrastructure/mongo/model/Friend.js';

class FriendRepository {

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
      .populate('user', 'firstName lastName  avatar phone')
      .populate('friend', 'firstName lastName  avatar phone')
      .select('user friend status')
      .lean();

    return friends.map(friend => {
      const isUser = friend.user._id.toString() === userId.toString();
      const friendData = isUser ? friend.friend : friend.user;

      return {
        id: friendData._id,
        name: `${friendData.lastName} ${friendData.firstName}`,
        avatar: friendData.avatar,
        phone: friendData.phone
      };
    });
  }
  // lấy danh sách lời mời kết bạn của tôi
  async getInviteOfUser(userId) {
    const invites = await Friend.find({
      friend: userId,
      status: 'PENDING'
    })
      .populate('user', 'firstName lastName  avatar phone')
      .populate('friend', 'firstName lastName  avatar phone')
      .select('user friend status')
      .lean();

    //Xác định người gửi
    const users = this._defineSender(invites, userId);
    return users
  }

  // lấy danh sách lời mời kết bạn mà tôi đã gửi
  async getInviteOfUserSending(userId) {
    const invites = await Friend.find({
      user: userId,
      status: 'PENDING'
    })
      .populate('user', 'firstName lastName  avatar phone')
      .populate('friend', 'firstName lastName  avatar phone')
      .select('user friend status')
      .lean();
    const reciveders = this._defineReciveders(invites);
    return reciveders
  }

  async getById(userId) {
    const friend = await Friend.findOne({
      $or: [{ user: userId }, { friend: userId }],
      status: type
    }).populate('user', 'name phone')
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
    return await friend.save();
  }

  _defineSender(usersOfFriendData) {
    return usersOfFriendData.map(item => {
      return {
        id: item.user._id,
        name: `${item.user.lastName} ${item.user.firstName}`,
        avatar: item.user.avatar,
        phone: item.user.phone
      };
    });
  }
  
  _defineReciveders(usersOfFriendData) {
    return usersOfFriendData.map(item => {
      return {
        id: item.friend._id,
        name: `${item.friend.lastName} ${item.friend.firstName}`,
        avatar: item.friend.avatar,
        phone: item.friend.phone
      };
    });
  }
}

export default new FriendRepository();