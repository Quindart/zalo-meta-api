import { Server, Socket } from "socket.io";
import SOCKET_EVENTS from "../../../constants/eventEnum";
import { IFriendService } from "../../../application/interfaces/services/IFriendService";
import { container } from "../../inversify/container";
import TYPES from "../../inversify/type";
interface FriendParams {
    userId: string;
    userFriendId: string;
}

interface UserOnlyParams {
    userId: string;
}
class FriendSocket {
    public io: Server;
    public socket: Socket;
    public friendService: IFriendService
    constructor(io: Server, socket: Socket) {
        this.io = io;
        this.socket = socket;
        this.friendService = container.get<IFriendService>(TYPES.FriendService)
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


    async addFriend(params: FriendParams): Promise<void> {
        const { userId, userFriendId } = params;
        const isExistFriendRelationship = await this.friendService.isExistFriendRelationship(userId, userFriendId);
        if (isExistFriendRelationship) {
            this.io.to(userId).emit(SOCKET_EVENTS.FRIEND.ADD_FRIEND_RESPONSE, {
                success: false,
                message: "Friend already exists",
            });
            return;
        }
        await this.friendService.createFriend(userId, userFriendId);
        await this._getResultOfEventFriend(userId, userFriendId, SOCKET_EVENTS.FRIEND.ADD_FRIEND_RESPONSE);
    }

    async removeFriend(params: FriendParams): Promise<void> {
        const { userId, userFriendId } = params;
        const isExistFriendRelationship = await this.friendService.isExistFriendRelationship(userId, userFriendId);
        if (!isExistFriendRelationship) {
            this.socket.emit(SOCKET_EVENTS.FRIEND.REMOVE_FRIEND_RESPONSE, {
                success: false,
                message: "Not found friend relationship",
            });
            return;
        }
        await this.friendService.removeFriend(userId, userFriendId);
        await this._getResultOfEventFriend(userId, userFriendId, SOCKET_EVENTS.FRIEND.REMOVE_FRIEND_RESPONSE);
    }

    async acceptFriend(params: FriendParams): Promise<void> {
        const { userId, userFriendId } = params;
        const isExistRelationship = await this.friendService.isExistFriendRelationship(userId, userFriendId);
        if (!isExistRelationship) {
            this.socket.emit(SOCKET_EVENTS.FRIEND.ACCEPT_FRIEND_RESPONSE, {
                success: false,
                message: "Friend relationship not found or already accepted",
            });
            return;
        }
        await this.friendService.updateFriendStatus(userId, userFriendId, "ACCEPTED");
        await this._getResultOfEventFriend(userFriendId, userId, SOCKET_EVENTS.FRIEND.ACCEPT_FRIEND_RESPONSE);
    }

    async rejectFriend(params: FriendParams): Promise<void> {
        const { userId, userFriendId } = params;
        const isExistRelationship = await this.friendService.isExistFriendRelationship(userId, userFriendId);
        if (isExistRelationship) return;

        await this.friendService.removeFriend(userId, userFriendId);
        await this._getResultOfEventFriend(userFriendId, userId, SOCKET_EVENTS.FRIEND.REJECT_FRIEND_RESPONSE);
    }

    async revokeInvite(params: FriendParams): Promise<void> {
        const { userId, userFriendId } = params;
        const isExistRelationship = await this.friendService.isExistFriendRelationship(userId, userFriendId);
        if (isExistRelationship) return;

        await this.friendService.removeFriend(userId, userFriendId);
        await this._getResultOfEventFriend(userId, userFriendId, SOCKET_EVENTS.FRIEND.REVOKE_FRIEND_RESPONSE);
    }

    async listFriend(params: UserOnlyParams): Promise<void> {
        const { userId } = params;
        const friends = await this.friendService.getFriendByUserIdByType(userId, "ACCEPTED");
        this.socket.emit(SOCKET_EVENTS.FRIEND.LIST_FRIEND_RESPONSE, {
            success: true,
            data: friends,
            message: "Friend invite list successfully",
        });
    }

    async listSendInvite(params: UserOnlyParams): Promise<void> {
        const { userId } = params;
        const friends = await this.friendService.getInviteOfUserSending(userId);
        this.socket.emit(SOCKET_EVENTS.FRIEND.LIST_SEND_INVITE_RESPONSE, {
            success: true,
            data: friends,
            message: "Sender invite list successfully",
        });
    }

    async listReceived(params: UserOnlyParams): Promise<void> {
        const { userId } = params;
        const friends = await this.friendService.getInviteOfUser(userId);
        this.socket.emit(SOCKET_EVENTS.FRIEND.LIST_RECEIVED_INVITE_RESPONSE, {
            success: true,
            data: friends,
            message: "Received invite list successfully",
        });
    }

    private async _getResultOfEventFriend(
        userId: string,
        userFriendId: string,
        eventResponseType: string
    ): Promise<void> {
        const [senderList, receiverList, senderFriends, receiverFriends] = await Promise.all([
            this.friendService.getInviteOfUserSending(userId),
            this.friendService.getInviteOfUser(userFriendId),
            this.friendService.getFriendByUserIdByType(userId, "ACCEPTED"),
            this.friendService.getFriendByUserIdByType(userFriendId, "ACCEPTED"),
        ]);

        this.io.to(userId).emit(eventResponseType, {
            success: true,
            data: {
                senderList,
                friends: senderFriends,
            },
        });

        this.io.to(userFriendId).emit(eventResponseType, {
            success: true,
            data: {
                receiverList,
                friends: receiverFriends,
            },
        });
    }
}

export default FriendSocket;