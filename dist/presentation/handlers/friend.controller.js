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
const index_1 = require("../../constants/index");
const Friend_1 = __importDefault(require("../../infrastructure/mongo/model/Friend"));
const errors_1 = __importDefault(require("../../utils/errors"));
const mongoose_1 = __importDefault(require("mongoose"));
const type_1 = __importDefault(require("../../infrastructure/inversify/type"));
const container_1 = require("../../infrastructure/inversify/container");
class FriendController {
    contructor() {
        this.friendService = container_1.container.get(type_1.default.FriendService);
    }
    accpetFriend(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userFriendId } = req.body;
                const { user } = req;
                const userId = user.id;
                const isExistRelationship = yield this.friendService.isExistFriendRelationship(userId, userFriendId);
                if (!isExistRelationship) {
                    errors_1.default.sendNotFound(res, "No Friend relationship found");
                }
                yield this.friendService.updateFriendStatus(userId, userFriendId, 'ACCEPTED');
                res.status(index_1.HTTP_STATUS.CREATED).json({
                    status: index_1.HTTP_STATUS.CREATED,
                    success: true,
                    message: "Accept friend request success",
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    rejectAcceptFriend(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userFriendId } = req.body;
                const { user } = req;
                const userId = user.id;
                const isExistRelationship = yield this.friendService.isExistFriendRelationship(userId, userFriendId);
                if (!isExistRelationship) {
                    errors_1.default.sendNotFound(res, "No Friend relationship found");
                }
                yield this.friendService.removeFriend(userId, userFriendId);
                res.status(index_1.HTTP_STATUS.OK).json({
                    status: index_1.HTTP_STATUS.OK,
                    success: true,
                    message: "Reject friend request success",
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    removeFriend(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userFriendId } = req.body;
                const { user } = req;
                const userId = user.id;
                const isExistRelationship = yield this.friendService.isExistFriendRelationship(userId, userFriendId);
                if (!isExistRelationship) {
                    errors_1.default.sendNotFound(res, "No Friend relationship found");
                }
                yield this.friendService.removeFriend(userId, userFriendId);
                res.status(index_1.HTTP_STATUS.CREATED).json({
                    status: index_1.HTTP_STATUS.CREATED,
                    success: true,
                    message: "Remove friend success",
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    inviteFriend(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userFriendId } = req.body;
                const { user } = req;
                const userId = user.id;
                const isExistRelationship = yield this.friendService.isExistFriendRelationship(userId, userFriendId);
                if (isExistRelationship) {
                    errors_1.default.sendConflict(res, "Friend relationship already exists");
                }
                yield this.friendService.createFriend(userId, userFriendId);
                res.status(index_1.HTTP_STATUS.CREATED).json({
                    status: index_1.HTTP_STATUS.CREATED,
                    success: true,
                    message: "Invite friend success",
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    removeIniviteFriend(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userFriendId } = req.query;
                const { user } = req;
                const userId = user.id;
                const isExistRelationship = yield this.friendService.isExistFriendRelationship(userId, `${userFriendId}`);
                if (!isExistRelationship) {
                    errors_1.default.sendNotFound(res, "No Friend relationship found");
                }
                yield this.friendService.removeFriend(userId, `${userFriendId}`);
                res.status(index_1.HTTP_STATUS.OK).json({
                    status: index_1.HTTP_STATUS.OK,
                    success: true,
                    message: "Remove invite friend success",
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    getMyFriends(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            if (!user) {
                errors_1.default.sendNotFound(res, "User not found");
            }
            const friends = yield this.friendService.getFriendByUserIdByType(new mongoose_1.default.Types.ObjectId(`${user.id}`), 'ACCEPTED');
            res.status(index_1.HTTP_STATUS.OK).json({
                status: index_1.HTTP_STATUS.OK,
                success: true,
                message: "Get friends success",
                data: {
                    friends: friends,
                    totalItem: friends.length
                }
            });
        });
    }
    getMyInviteFriends(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            if (!user) {
                errors_1.default.sendNotFound(res, "User not found");
            }
            const friends = yield this.friendService.getInviteOfUser(new mongoose_1.default.Types.ObjectId(user.id));
            res.status(index_1.HTTP_STATUS.OK).json({
                success: true,
                status: index_1.HTTP_STATUS.OK,
                message: "Get invite friends success",
                data: {
                    friends: friends,
                }
            });
        });
    }
    getMyInvitedSending(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            if (!user) {
                errors_1.default.sendNotFound(res, "User not found");
            }
            const friends = yield this.friendService.getInviteOfUserSending(new mongoose_1.default.Types.ObjectId(user.id));
            res.status(index_1.HTTP_STATUS.OK).json({
                success: true,
                status: index_1.HTTP_STATUS.OK,
                message: "Get invite friends success",
                data: {
                    friends: friends,
                }
            });
        });
    }
    getFriendList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.body;
            if (!userId) {
                res.status(index_1.HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: "User ID is required"
                });
            }
            const friendList = yield Friend_1.default.find({ user: new mongoose_1.default.Types.ObjectId(userId) })
                .populate({
                path: "friend",
                select: "_id firstName lastName avatar",
            })
                .lean();
            res.status(index_1.HTTP_STATUS.OK).json({
                success: true,
                message: "Get friend list success",
                data: friendList
            });
        });
    }
}
exports.default = new FriendController();
