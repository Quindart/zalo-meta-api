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
exports.MongooseUserRepository = void 0;
const inversify_1 = require("inversify");
const query_1 = require("../../../utils/query");
const UserMapper_1 = require("../mappers/UserMapper");
const User_1 = __importDefault(require("../model/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
let MongooseUserRepository = class MongooseUserRepository {
    findByIdAndUpdateChannel(userId, channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.default.findByIdAndUpdate(userId, {
                $addToSet: { channels: channelId },
                updatedAt: Date.now()
            }, { new: true });
        });
    }
    searchUserWithFriends(userId, type, keywords) {
        throw new Error('Method not implemented.');
    }
    searchUsers(type, keywords) {
        throw new Error('Method not implemented.');
    }
    getMe(userRequest, queries) {
        throw new Error('Method not implemented.');
    }
    updateMe(userId, firstName, lastName, dateOfBirth, file) {
        throw new Error('Method not implemented.');
    }
    registerFcmToken(fcmToken, userId) {
        throw new Error('Method not implemented.');
    }
    login(phone, password) {
        throw new Error('Method not implemented.');
    }
    register(email, password, phone, firstName, lastName, dateOfBirth) {
        throw new Error('Method not implemented.');
    }
    refreshToken(refreshToken) {
        throw new Error('Method not implemented.');
    }
    logout(refreshToken) {
        throw new Error('Method not implemented.');
    }
    forgotPassword(email) {
        throw new Error('Method not implemented.');
    }
    verifyForgotPassword(email, otp) {
        throw new Error('Method not implemented.');
    }
    resetPassword(email, password, resetToken) {
        throw new Error('Method not implemented.');
    }
    findUserSelect(userId, queries) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findById(userId).select((0, query_1.responseEntity)(queries));
            return user;
        });
    }
    changePassword(userId, password, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findById(userId);
            if (!user)
                return false;
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch)
                return false;
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
            yield User_1.default.findByIdAndUpdate(userId, {
                password: hashedPassword
            }, {
                new: true,
            }).select(userId).lean();
            return true;
        });
    }
    searchByField(field, keyword, excludeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const regex = new RegExp(keyword, 'i');
            const users = yield User_1.default.find({
                _id: { $ne: excludeId },
                [field]: regex,
            });
            return users;
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findById(new mongoose_1.default.Types.ObjectId(id));
            return user;
        });
    }
    findAll(queries) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.default.find().select((0, query_1.responseEntity)(queries));
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedDoc = yield User_1.default.findByIdAndUpdate(id, UserMapper_1.UserMapper.toPersistence(data), { new: true });
            return updatedDoc;
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = new User_1.default(UserMapper_1.UserMapper.toPersistence(user));
            return yield created.save();
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield User_1.default.findByIdAndDelete(id).lean();
            return !!deleted;
        });
    }
    findByPhone(phone, queries) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield User_1.default.findOne({ phone }).select((0, query_1.responseEntity)(queries));
            return doc;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield User_1.default.findOne({ email });
            return doc;
        });
    }
};
exports.MongooseUserRepository = MongooseUserRepository;
exports.MongooseUserRepository = MongooseUserRepository = __decorate([
    (0, inversify_1.injectable)()
], MongooseUserRepository);
