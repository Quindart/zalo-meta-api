import SOCKET_EVENTS from "../../../constants/eventEnum.js";
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
    }

    async addFriend(params) {
        const { senderId, receiverId } = params;
        this.socket.emit(SOCKET_EVENTS.FRIEND.ADD_FRIEND_RESPONSE, {
            success: true,
            data: { senderId, receiverId },
            message: "Friend request sent successfully",
        });
    }

    async removeFriend(params) {
        const { senderId, receiverId } = params;
        this.socket.emit(SOCKET_EVENTS.FRIEND.REMOVE_FRIEND_RESPONSE, {
            success: true,
            data: { senderId, receiverId },
            message: "Friend removed successfully",
        });
    }

    async acceptFriend(params) {
        const { senderId, receiverId } = params;
        this.socket.emit(SOCKET_EVENTS.FRIEND.ACCEPT_FRIEND_RESPONSE, {
            success: true,
            data: { senderId, receiverId },
            message: "Friend request accepted successfully",
        });
    }


    async rejectFriend(params) {
        const { senderId, receiverId } = params;
        this.socket.emit(SOCKET_EVENTS.FRIEND.REJECT_FRIEND_RESPONSE, {
            success: true,
            data: { senderId, receiverId },
            message: "Friend request rejected successfully",
        });
    }

    async listFriend(params) {
        const { userId } = params;
        friendRepository.getFriendByUserIdByType(userId, 'ACCEPTED')
            .then((friends) => {
                console.log("Friend list retrieved successfully:", friends);
                this.socket.emit(SOCKET_EVENTS.FRIEND.LIST_FRIEND_RESPONSE, {
                    success: true,
                    data: friends,
                    message: "Friend list retrieved successfully",
                });
            })
            .catch((error) => {
                console.error("Error retrieving friend list:", error);
                this.socket.emit(SOCKET_EVENTS.FRIEND.LIST_FRIEND_RESPONSE, {
                    success: false,
                    message: "Error retrieving friend list",
                });
            });

    }

}

export default FriendSocket;