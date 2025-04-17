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
        this.socket.on(SOCKET_EVENTS.FRIEND.REVOKE_FRIEND, this.revokeInvite.bind(this));


        this.socket.on(SOCKET_EVENTS.FRIEND.LIST_FRIEND, this.listFriend.bind(this));
        this.socket.on(SOCKET_EVENTS.FRIEND.LIST_SEND_INVITE, this.listSendInvite.bind(this));
        this.socket.on(SOCKET_EVENTS.FRIEND.LIST_RECEIVED_INVITE, this.listReceived.bind(this));
    }

    async addFriend(params) {
        const { userId, userFriendId } = params;
        const isExistFriendRelationship = await FriendRepository.isExistFriendRelationship(userId, userFriendId);
        if (isExistFriendRelationship) {
            this.io.to(userId).emit(SOCKET_EVENTS.FRIEND.ADD_FRIEND_RESPONSE, {
                success: false,
                message: "Friend already exists",
            });
        }
        await friendRepository.createFriend(userId, userFriendId);
        await this._getResultOfEventFriend(userId, userFriendId, SOCKET_EVENTS.FRIEND.ADD_FRIEND_RESPONSE)
    }
    // Hủy kết bạn
    async removeFriend(params) {
        const { userId, userFriendId } = params;
        const isExistFriendRelationship = await FriendRepository.isExistFriendRelationship(userId, userFriendId);
        if (!isExistFriendRelationship) {
            this.socket.emit(SOCKET_EVENTS.FRIEND.REMOVE_FRIEND_RESPONSE, {
                success: false,
                message: "Not found friend relationship",
            });
        }
        await friendRepository.removeFriend(userId, userFriendId);
        await this._getResultOfEventFriend(userId, userFriendId, SOCKET_EVENTS.FRIEND.REMOVE_FRIEND_RESPONSE)
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
        await this._getResultOfEventFriend(userFriendId, userId, SOCKET_EVENTS.FRIEND.ACCEPT_FRIEND_RESPONSE)
    }
    //TODO: Từ chối lời mời kết bạn
    async rejectFriend(params) {
        const { userId, userFriendId } = params;
        const isExistRelationship = await FriendRepository.isExistFriendRelationship(userId, userFriendId)
        if (isExistRelationship.status === 'ACCEPTED') {
            return Error.sendBadRequest(res, "Friend relationship already accepted")
        }
        await friendRepository.removeFriend(userId, userFriendId);
        await this._getResultOfEventFriend(userFriendId, userId, SOCKET_EVENTS.FRIEND.REJECT_FRIEND_RESPONSE)
    }
    async revokeInvite(params) {
        const { userId, userFriendId } = params;
        const isExistRelationship = await FriendRepository.isExistFriendRelationship(userId, userFriendId)
        if (isExistRelationship.status === 'ACCEPTED') {
            return Error.sendBadRequest(res, "Friend relationship already accepted")
        }
        await friendRepository.removeFriend(userId, userFriendId);
        await this._getResultOfEventFriend(userId, userFriendId, SOCKET_EVENTS.FRIEND.REVOKE_FRIEND_RESPONSE)
    }

    //TODO: Danh sách bạn bè
    async listFriend(params) {
        const { userId } = params;
        const friends = await friendRepository.getFriendByUserIdByType(userId, 'ACCEPTED')
        this.socket.emit(SOCKET_EVENTS.FRIEND.LIST_FRIEND_RESPONSE, {
            success: true,
            data: friends,
            message: "Friend invite list successfully",
        });
    }
    async listSendInvite(params) {
        const { userId } = params;
        const friends = await friendRepository.getInviteOfUserSending(userId)
        this.socket.emit(SOCKET_EVENTS.FRIEND.LIST_SEND_INVITE_RESPONSE, {
            success: true,
            data: friends,
            message: "Sender invite list successfully",
        });
    }
    async listReceived(params) {
        const { userId } = params;
        const friends = await friendRepository.getInviteOfUser(userId)
        this.socket.emit(SOCKET_EVENTS.FRIEND.LIST_RECEIVED_INVITE_RESPONSE, {
            success: true,
            data: friends,
            message: "Received invite list successfully",
        });
    }

    async _getResultOfEventFriend(userId, userFriendId, eventResponseType) {
        const [
            senderList,
            receiverList,
            senderFriends,
            receiverFriends
        ] = await Promise.all([
            FriendRepository.getInviteOfUserSending(userId),
            FriendRepository.getInviteOfUser(userFriendId),
            FriendRepository.getFriendByUserIdByType(userId, 'ACCEPTED'),
            FriendRepository.getFriendByUserIdByType(userFriendId, 'ACCEPTED')
        ]);
        //TODO: Người gửi cập nhật danh sách lời mời kb + danh sách bạn bè
        this.io.to(userId).emit(eventResponseType, {
            success: true,
            data: {
                senderList: senderList,
                friends: senderFriends
            }
        });
        //TODO: Người nhận cập nhật danh sách yêu cầu kb + danh sách bạn bè
        this.io.to(userFriendId).emit(eventResponseType, {
            success: true,
            data: {
                receiverList: receiverList,
                friends: receiverFriends
            }
        });

    }

}

export default FriendSocket;