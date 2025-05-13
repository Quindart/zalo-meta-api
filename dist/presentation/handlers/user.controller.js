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
const User_1 = __importDefault(require("../../infrastructure/mongo/model/User"));
const errors_1 = __importDefault(require("../../utils/errors"));
const query_1 = require("../../utils/query");
const bcrypt_1 = __importDefault(require("bcrypt"));
const type_1 = __importDefault(require("../../infrastructure/inversify/type"));
const container_1 = require("../../infrastructure/inversify/container");
class UserController {
    constructor() {
        this.friendService = container_1.container.get(type_1.default.FriendService);
    }
    //TODO: [GET]
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { queries } = req.query;
                const user = yield User_1.default.findById(id)
                    .select((0, query_1.responseEntity)(queries))
                    .lean();
                if (!user) {
                    errors_1.default.sendNotFound(res, "No user found");
                }
                res.status(index_1.HTTP_STATUS.OK).json({
                    status: index_1.HTTP_STATUS.OK,
                    success: true,
                    message: "Get user by id success",
                    user: {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phone: user.phone,
                        email: user.email,
                        avatar: user.avatar,
                        dateOfBirth: user.dateOfBirth,
                    },
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    getUserByPhone(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const phone = req.params.phone;
                const { queries } = req.query;
                const user = yield User_1.default.findOne({ phone: phone })
                    .select((0, query_1.responseEntity)(queries))
                    .lean();
                if (!user) {
                    errors_1.default.sendNotFound(res, "No user found");
                }
                res.status(index_1.HTTP_STATUS.OK).json({
                    status: index_1.HTTP_STATUS.OK,
                    success: true,
                    message: "Get user by phone success",
                    user,
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { queries } = req.query;
                const users = yield User_1.default.find().select((0, query_1.responseEntity)(queries)).lean();
                res.status(index_1.HTTP_STATUS.OK).json({
                    status: index_1.HTTP_STATUS.OK,
                    success: true,
                    message: "Get all users success",
                    users,
                    params: {
                        totalItems: users.length,
                    },
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    getMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRequest = req.user;
                const { queries } = req.query;
                const user = yield User_1.default.findById(userRequest.id).select((0, query_1.responseEntity)(queries)).lean();
                res.status(index_1.HTTP_STATUS.OK).json({
                    status: index_1.HTTP_STATUS.OK,
                    success: true,
                    message: "Get all users success",
                    user: {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phone: user.phone,
                        email: user.email,
                        avatar: user.avatar,
                        dateOfBirth: user.dateOfBirth,
                    },
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    //TODO: [POST]
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const { email, password, phone, firstName, lastName, dateOfBirth, } = req.body;
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const avatar = (req === null || req === void 0 ? void 0 : req.uploadedImages) && ((_a = req === null || req === void 0 ? void 0 : req.uploadedImages) === null || _a === void 0 ? void 0 : _a.avatar) ? (_c = (_b = req.uploadedImages) === null || _b === void 0 ? void 0 : _b.avatar) === null || _c === void 0 ? void 0 : _c.url : null;
                const oldUser = yield User_1.default.findOne({ phone: phone }).lean();
                if (oldUser) {
                    errors_1.default.sendConflict(res, "Phone number already exist!");
                }
                const user = yield User_1.default.create({
                    email,
                    password: hashedPassword,
                    phone,
                    firstName,
                    lastName,
                    avatar,
                    dateOfBirth,
                    isTwoFactorAuthenticationEnabled: true,
                });
                res.status(index_1.HTTP_STATUS.CREATED).json({
                    status: index_1.HTTP_STATUS.CREATED,
                    success: true,
                    message: "Create user success",
                    user,
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    //TODO: [PUT]
    updateMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const file = req.uploadedImages ? req.uploadedImages : null;
                const id = req.user.id;
                const { firstName, lastName, dateOfBirth } = req.body;
                const oldUser = yield User_1.default.findById(id).select(id).lean();
                if (!oldUser) {
                    return errors_1.default.sendNotFound(res, "No user found");
                }
                const bodyRequest = file ? {
                    firstName,
                    lastName,
                    dateOfBirth,
                    avatar: (_a = file === null || file === void 0 ? void 0 : file.avatar) === null || _a === void 0 ? void 0 : _a.url
                } : {
                    firstName,
                    lastName,
                    dateOfBirth,
                };
                const user = yield User_1.default.findByIdAndUpdate(id, Object.assign({}, bodyRequest), {
                    new: true,
                }).lean();
                res.status(index_1.HTTP_STATUS.CREATED).json({
                    status: index_1.HTTP_STATUS.CREATED,
                    success: true,
                    message: "Update user success",
                    user,
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    //TODO: [PUT]
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const id = user.id;
                const { password, newPassword } = req.body;
                const oldUser = yield User_1.default.findById(user.id);
                const isPasswordValids = yield bcrypt_1.default.compare(password, oldUser.password);
                if (!isPasswordValids) {
                    errors_1.default.sendUnauthenticated(res);
                }
                const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
                yield User_1.default.findByIdAndUpdate(id, {
                    password: hashedPassword
                }, {
                    new: true,
                }).select(id).lean();
                res.status(index_1.HTTP_STATUS.CREATED).json({
                    status: index_1.HTTP_STATUS.CREATED,
                    success: true,
                    message: 'Change password success',
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    //TODO: [PUT]
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { email, phone, firstName, lastName } = req.body;
                const oldUser = yield User_1.default.findById(id).select({ '_id': 1 }).lean();
                if (!oldUser) {
                    return errors_1.default.sendNotFound(res, "No user found");
                }
                const user = yield User_1.default.findByIdAndUpdate(id, {
                    email,
                    phone,
                    firstName,
                    lastName,
                }, {
                    new: true,
                }).lean();
                res.status(index_1.HTTP_STATUS.CREATED).json({
                    status: index_1.HTTP_STATUS.CREATED,
                    success: true,
                    message: "Update user success",
                    user,
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    //TODO: [DELETE]
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const user = yield User_1.default.findById(id).select({ '_id': 1 });
                if (!user) {
                    errors_1.default.sendNotFound(res, "No user found");
                }
                user.deleteOne();
                res.status(index_1.HTTP_STATUS.CREATED).json({
                    status: index_1.HTTP_STATUS.CREATED,
                    success: true,
                    message: "Delete user success",
                    user,
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    searchUserWithFriends(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type, keywords } = req.query;
            const user = req.user;
            const userId = user.id;
            if (!type || !keywords) {
                return errors_1.default.sendConflict(res, "Type and keywords are required");
            }
            const searchQuery = {
                [`${type}`]: { $regex: keywords, $options: "i" }
            };
            const userFriendListIds = (yield this.friendService.getFriendByUserId(userId)).map(user => user.id.toString());
            const users = yield User_1.default.find(searchQuery).select({
                avatar: 1,
                id: 1,
                firstName: 1,
                lastName: 1,
                phone: 1,
                email: 1
            }).lean();
            const usersFilter = users.filter(user => user._id.toString() !== userId).map(user => {
                return Object.assign(Object.assign({}, user), { isFriend: userFriendListIds.includes(user._id.toString()) });
            });
            res.status(index_1.HTTP_STATUS.OK).json({
                success: true,
                message: `Search by type: ${type} and keywords ${keywords}`,
                users: usersFilter,
                totalItems: usersFilter.length
            });
        });
    }
    searchUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type, keywords } = req.query;
            const searchQuery = {
                [`${type}`]: { $regex: keywords, $options: "i" }
            };
            const users = yield User_1.default.find(searchQuery).select({
                avatar: 1,
                id: 1,
                firstName: 1,
                lastName: 1,
                phone: 1,
                email: 1
            }).lean();
            res.status(index_1.HTTP_STATUS.OK).json({
                success: true,
                message: `Search by type: ${type} and keywords ${keywords}`,
                users,
                totalItems: users.length
            });
        });
    }
}
exports.default = new UserController();
