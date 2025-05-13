"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventEnum_1 = __importDefault(require("../../../constants/eventEnum"));
const container_1 = require("../../inversify/container");
const type_1 = __importDefault(require("../../inversify/type"));
class FriendSocket {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.friendService = container_1.container.get(type_1.default.FriendService);
        this.registerEvents();
    }
    registerEvents() {
        this.socket.on(eventEnum_1.default.FRIEND.ADD_FRIEND, this.addFriend.bind(this));
        this.socket.on(eventEnum_1.default.FRIEND.REMOVE_FRIEND, this.removeFriend.bind(this));
        this.socket.on(eventEnum_1.default.FRIEND.ACCEPT_FRIEND, this.acceptFriend.bind(this));
        this.socket.on(eventEnum_1.default.FRIEND.REJECT_FRIEND, this.rejectFriend.bind(this));
        this.socket.on(eventEnum_1.default.FRIEND.REVOKE_FRIEND, this.revokeInvite.bind(this));
        this.socket.on(eventEnum_1.default.FRIEND.LIST_FRIEND, this.listFriend.bind(this));
        this.socket.on(eventEnum_1.default.FRIEND.LIST_SEND_INVITE, this.listSendInvite.bind(this));
        this.socket.on(eventEnum_1.default.FRIEND.LIST_RECEIVED_INVITE, this.listReceived.bind(this));
    }
    addFriend(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, userFriendId } = params;
            const isExistFriendRelationship = yield this.friendService.isExistFriendRelationship(userId, userFriendId);
            if (isExistFriendRelationship) {
                this.io.to(userId).emit(eventEnum_1.default.FRIEND.ADD_FRIEND_RESPONSE, {
                    success: false,
                    message: "Friend already exists",
                });
                return;
            }
            yield this.friendService.createFriend(userId, userFriendId);
            yield this._getResultOfEventFriend(userId, userFriendId, eventEnum_1.default.FRIEND.ADD_FRIEND_RESPONSE);
        });
    }
    removeFriend(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, userFriendId } = params;
            const isExistFriendRelationship = yield this.friendService.isExistFriendRelationship(userId, userFriendId);
            if (!isExistFriendRelationship) {
                this.socket.emit(eventEnum_1.default.FRIEND.REMOVE_FRIEND_RESPONSE, {
                    success: false,
                    message: "Not found friend relationship",
                });
                return;
            }
            yield this.friendService.removeFriend(userId, userFriendId);
            yield this._getResultOfEventFriend(userId, userFriendId, eventEnum_1.default.FRIEND.REMOVE_FRIEND_RESPONSE);
        });
    }
    acceptFriend(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, userFriendId } = params;
            const isExistRelationship = yield this.friendService.isExistFriendRelationship(userId, userFriendId);
            if (!isExistRelationship) {
                this.socket.emit(eventEnum_1.default.FRIEND.ACCEPT_FRIEND_RESPONSE, {
                    success: false,
                    message: "Friend relationship not found or already accepted",
                });
                return;
            }
            yield this.friendService.updateFriendStatus(userId, userFriendId, "ACCEPTED");
            yield this._getResultOfEventFriend(userFriendId, userId, eventEnum_1.default.FRIEND.ACCEPT_FRIEND_RESPONSE);
        });
    }
    rejectFriend(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, userFriendId } = params;
            const isExistRelationship = yield this.friendService.isExistFriendRelationship(userId, userFriendId);
            if (isExistRelationship)
                return;
            yield this.friendService.removeFriend(userId, userFriendId);
            yield this._getResultOfEventFriend(userFriendId, userId, eventEnum_1.default.FRIEND.REJECT_FRIEND_RESPONSE);
        });
    }
    revokeInvite(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, userFriendId } = params;
            const isExistRelationship = yield this.friendService.isExistFriendRelationship(userId, userFriendId);
            if (isExistRelationship)
                return;
            yield this.friendService.removeFriend(userId, userFriendId);
            yield this._getResultOfEventFriend(userId, userFriendId, eventEnum_1.default.FRIEND.REVOKE_FRIEND_RESPONSE);
        });
    }
    listFriend(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = params;
            const friends = yield this.friendService.getFriendByUserIdByType(userId, "ACCEPTED");
            this.socket.emit(eventEnum_1.default.FRIEND.LIST_FRIEND_RESPONSE, {
                success: true,
                data: friends,
                message: "Friend invite list successfully",
            });
        });
    }
    listSendInvite(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = params;
            const friends = yield this.friendService.getInviteOfUserSending(userId);
            this.socket.emit(eventEnum_1.default.FRIEND.LIST_SEND_INVITE_RESPONSE, {
                success: true,
                data: friends,
                message: "Sender invite list successfully",
            });
        });
    }
    listReceived(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = params;
            const friends = yield this.friendService.getInviteOfUser(userId);
            this.socket.emit(eventEnum_1.default.FRIEND.LIST_RECEIVED_INVITE_RESPONSE, {
                success: true,
                data: friends,
                message: "Received invite list successfully",
            });
        });
    }
    _getResultOfEventFriend(userId, userFriendId, eventResponseType) {
        return __awaiter(this, void 0, void 0, function* () {
            const [senderList, receiverList, senderFriends, receiverFriends] = yield Promise.all([
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
        });
    }
}
exports.default = FriendSocket;
