"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.MongooseFriendRepository = void 0;
const inversify_1 = require("inversify");
const Friend_1 = __importDefault(require("../model/Friend"));
let MongooseFriendRepository = class MongooseFriendRepository {
    getFriendByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const friends = yield Friend_1.default.find({
                    $or: [{ user: userId }, { friend: userId }],
                    status: 'ACCEPTED',
                })
                    .populate('user', 'firstName lastName email avatar')
                    .populate('friend', 'firstName lastName email avatar')
                    .lean();
                const validFriends = friends.filter(item => item.user && item.friend);
                return validFriends.map(friend => {
                    const isUser = friend.user._id.toString() === userId.toString();
                    const friendData = isUser ? friend.friend : friend.user;
                    return {
                        id: friendData._id,
                        name: `${friendData.lastName} ${friendData.firstName}`,
                        avatar: friendData.avatar,
                        email: friendData.email,
                    };
                });
            }
            catch (error) {
                console.error("Error in getFriendByUserId:", error);
                throw new Error(error.message || "Failed to retrieve friends.");
            }
        });
    }
    createFriend(userId, userFriendId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const friend = new Friend_1.default({ user: userId, friend: userFriendId, status: 'PENDING' });
                return yield friend.save();
            }
            catch (error) {
                console.error("Error in createFriend:", error);
                throw new Error(error.message || "Failed to create friend request.");
            }
        });
    }
    removeFriend(userId, userFriendId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const friend = yield Friend_1.default.findOneAndDelete({
                    $or: [
                        { user: userId, friend: userFriendId },
                        { user: userFriendId, friend: userId },
                    ],
                });
                return !!friend;
            }
            catch (error) {
                console.error("Error in removeFriend:", error);
                throw new Error(error.message || "Failed to remove friend.");
            }
        });
    }
    isExistFriendRelationship(userId, userFriendId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const friend = yield Friend_1.default.findOne({
                    $or: [
                        { user: userId, friend: userFriendId },
                        { user: userFriendId, friend: userId },
                    ],
                }).select('status');
                return !!friend;
            }
            catch (error) {
                console.error("Error in isExistFriendRelationship:", error);
                throw new Error(error.message || "Failed to check friend relationship.");
            }
        });
    }
    getFriendByUserIdByType(userId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const friends = yield Friend_1.default.find({
                    $or: [{ user: userId }, { friend: userId }],
                    status: type,
                })
                    .populate('user', 'firstName lastName email avatar phone')
                    .populate('friend', 'firstName lastName email avatar phone')
                    .select('user friend status')
                    .lean();
                return friends.map(friend => {
                    const isUser = friend.user._id.toString() === userId.toString();
                    const friendData = isUser ? friend.friend : friend.user;
                    return {
                        id: friendData._id,
                        name: `${friendData.lastName} ${friendData.firstName}`,
                        avatar: friendData.avatar,
                        email: friendData.email,
                        phone: friendData.phone,
                    };
                });
            }
            catch (error) {
                console.error("Error in getFriendByUserIdByType:", error);
                throw new Error(error.message || "Failed to retrieve friends by type.");
            }
        });
    }
    getInviteOfUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invites = yield Friend_1.default.find({
                    friend: userId,
                    status: 'PENDING',
                })
                    .populate('user', 'firstName lastName avatar phone')
                    .populate('friend', 'firstName lastName avatar phone')
                    .select('user friend status')
                    .lean();
                return invites.map((item) => ({
                    id: item.user._id,
                    name: `${item.user.lastName} ${item.user.firstName}`,
                    avatar: item.user.avatar,
                    phone: item.user.phone,
                }));
            }
            catch (error) {
                console.error("Error in getInviteOfUser:", error);
                throw new Error(error.message || "Failed to retrieve friend invites.");
            }
        });
    }
    getInviteOfUserSending(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invites = yield Friend_1.default.find({
                    user: userId,
                    status: 'PENDING',
                })
                    .populate('user', 'firstName lastName avatar phone')
                    .populate('friend', 'firstName lastName avatar phone')
                    .select('user friend status')
                    .lean();
                return invites.map((item) => ({
                    id: item.friend._id,
                    name: `${item.friend.lastName} ${item.friend.firstName}`,
                    avatar: item.friend.avatar,
                    phone: item.friend.phone,
                }));
            }
            catch (error) {
                console.error("Error in getInviteOfUserSending:", error);
                throw new Error(error.message || "Failed to retrieve sent friend invites.");
            }
        });
    }
    getById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const friend = yield Friend_1.default.findOne({
                    $or: [{ user: userId }, { friend: userId }],
                }).populate('user', 'name phone');
                return friend;
            }
            catch (error) {
                console.error("Error in getById:", error);
                throw new Error(error.message || "Failed to retrieve friend by ID.");
            }
        });
    }
    updateFriendStatus(userId, userFriendId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const friend = yield Friend_1.default.findOne({
                    $or: [
                        { user: userId, friend: userFriendId },
                        { user: userFriendId, friend: userId },
                    ],
                });
                if (!friend) {
                    throw new Error('Friend not found');
                }
                friend.status = type;
                return yield friend.save();
            }
            catch (error) {
                console.error("Error in updateFriendStatus:", error);
                throw new Error(error.message || "Failed to update friend status.");
            }
        });
    }
};
exports.MongooseFriendRepository = MongooseFriendRepository;
exports.MongooseFriendRepository = MongooseFriendRepository = __decorate([
    (0, inversify_1.injectable)()
], MongooseFriendRepository);
