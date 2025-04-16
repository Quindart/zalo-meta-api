import SOCKET_EVENTS from "../../../constants/eventEnum.js";
import FriendRepository from "../../../domain/repository/Friend.repository.js";
import friendRepository from "../../../domain/repository/Friend.repository.js";

class FriendSocket {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.registerEvents();
    }

    registerEvents() {
        this.socket.on(SOCKET_EVENTS.FRIEND.ADD_FRIEND, this.addFriend.bind(this));
        this.socket.on(SOCKET_EVENTS.FRIEND.REMOVE_FRIEND, this.removeFriend.bind(this));
        this.socket.on(SOCKET_EVENTS.FRIEND.ACCEPT_FRIEND, this.acceptFriend.bind(this));
        this.socket.on(SOCKET_EVENTS.FRIEND.REJECT_FRIEND, this.rejectFriend.bind(this));
        this.socket.on(SOCKET_EVENTS.FRIEND.LIST_FRIEND, this.listFriend.bind(this));
        this.socket.on(SOCKET_EVENTS.FRIEND.LIST_SEND_INVITE, this.listSendInvite.bind(this));
        this.socket.on(SOCKET_EVENTS.FRIEND.LIST_RECEIVED_INVITE, this.listReceived.bind(this));
    }

    async addFriend(params) {
        const { userId, userFriendId } = params;
        const isExistFriendRelationship = FriendRepository.isExistFriendRelationship(userId, userFriendId);
        if (isExistFriendRelationship) {
            this.socket.emit(SOCKET_EVENTS.FRIEND.ADD_FRIEND_RESPONSE, {
                success: false,
                message: "Friend already exists",
            });
        }
        await friendRepository.createFriend(userId, userFriendId);
        this._getSendInvite(userId)
        this._getReceivedInvite(userId)
    }
    // Hủy kết bạn
    async removeFriend(params) {
        const { senderId, receiverId } = params;
        const isExistFriendRelationship = FriendRepository.isExistFriendRelationship(userId, userFriendId);
        if (!isExistFriendRelationship) {
            this.socket.emit(SOCKET_EVENTS.FRIEND.REMOVE_FRIEND_RESPONSE, {
                success: false,
                message: "Not found friend relationship",
            });
        }
        await friendRepository.removeFriend(senderId, receiverId);
        this._getSendInvite(userId)
        this._getReceivedInvite(userId)
        this._getMyFriends(userId)
    }
    //TODO: Chấp nhận lời mời kết bạn
    async acceptFriend(params) {
        const { userId, userFriendId } = params;
        const isExistRelationship = await FriendRepository.isExistFriendRelationship(userId, userFriendId)

        if (!isExistRelationship || isExistRelationship.status === 'BLOCKED' || isExistRelationship.status === 'ACCEPTED') {
            this.socket.emit(SOCKET_EVENTS.FRIEND.ACCEPT_FRIEND_RESPONSE, {
                success: false,
                message: "Friend relationship not found or already accepted",
            });
            return;
        }
        await FriendRepository.updateFriendStatus(userId, userFriendId, 'ACCEPTED')

        this._getSendInvite(userId)
        this._getMyFriends(userId)
    }

    //TODO: Từ chối lời mời kết bạn
    async rejectFriend(params) {
        const { senderId, receiverId } = params;
        if (isExistRelationship.status === 'ACCEPTED') {
            return Error.sendBadRequest(res, "Friend relationship already accepted")
        }
        await friendRepository.removeFriend(senderId, receiverId);
        this._getSendInvite(userId)
        this._getReceivedInvite(userId)
    }

    //TODO: Danh sách bạn bè
    async listFriend(params) {
        const { userId } = params;
        this._getMyFriends(userId)
    }
    async listSendInvite(params) {
        const { userId } = params;
        this._getSendInvite(userId)
    }
    async listReceived(params) {
        const { userId } = params;
        console.log("💲💲💲 ~ FriendSocket ~ listReceived ~ userId:", userId)
        this._getReceivedInvite(userId)
    }

    async _getMyFriends(userId) {
        const friends = await friendRepository.getFriendByUserIdByType(userId, 'ACCEPTED')
        this.socket.emit(SOCKET_EVENTS.FRIEND.LIST_FRIEND_RESPONSE, {
            success: true,
            data: friends,
            message: "Friend invite list successfully",
        });
    }

    async _getSendInvite(userId) {
        const friends = await friendRepository.getFriendByUserIdByType(userId, 'PENDING')
        this.socket.emit(SOCKET_EVENTS.FRIEND.LIST_SEND_INVITE_RESPONSE, {
            success: true,
            data: friends,
            message: "Sender invite list successfully",
        });
    }
    async _getReceivedInvite(userId) {
        const friends = await friendRepository.getInviteOfUserSending(userId)
        console.log("💲💲💲 ~ FriendSocket ~ _getReceivedInvite ~ friends:", friends)
        this.socket.emit(SOCKET_EVENTS.FRIEND.LIST_RECEIVED_INVITE_RESPONSE, {
            success: true,
            data: friends,
            message: "Received invite list successfully",
        });
    }

}

export default FriendSocket;