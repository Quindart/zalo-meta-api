"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const inversify_1 = require("inversify");
const User_builder_1 = require("../../../domain/entities/user/User.builder");
const type_1 = __importDefault(require("../../../infrastructure/inversify/type"));
let UserService = class UserService {
    constructor(repository) {
        this.repository = repository;
    }
    findByIdAndUpdateChannel(userId, channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findByIdAndUpdateChannel(userId, channelId);
        });
    }
    toSave(data) {
        throw new Error("Method not implemented.");
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.create(data);
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findOne(id);
        });
    }
    findAll(queries) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findAll(queries);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.update(id, data);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.delete(id);
        });
    }
    createUser(input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!input.name || !input.email) {
                throw new Error("Invalid input");
            }
            const builder = new User_builder_1.UserBuilder();
            const user = builder
                .setEmail(input.email)
                .setLastName(input.lastName)
                .setFirstName(input.firstName)
                .build();
            return yield this.repository.create(user);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findByEmail(email);
        });
    }
    findByPhone(phone, queries) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findByPhone(phone, queries);
        });
    }
    findUserSelect(id, queries) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findUserSelect(id, queries);
        });
    }
    changePassword(userId, password, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.changePassword(userId, password, newPassword);
        });
    }
    searchUserWithFriends(id, type, keywords) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.searchUserWithFriends(id, type, keywords);
        });
    }
    searchUsers(type, keywords) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.searchUsers(type, keywords);
        });
    }
    // TODO: ME
    getMe(userRequest, queries) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.getMe(userRequest, queries);
        });
    }
    updateMe(userId, firstName, lastName, dateOfBirth, file) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.updateMe(userId, firstName, lastName, dateOfBirth, file);
        });
    }
    // TODO: AUTH
    registerFcmToken(fcmToken, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.registerFcmToken(fcmToken, userId);
        });
    }
    login(phone, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.login(phone, password);
        });
    }
    register(email, password, phone, firstName, lastName, dateOfBirth) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.register(email, password, phone, firstName, lastName, dateOfBirth);
        });
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.refreshToken(refreshToken);
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.logout(refreshToken);
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.forgotPassword(email);
        });
    }
    verifyForgotPassword(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.verifyForgotPassword(email, otp);
        });
    }
    resetPassword(email, password, resetToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.resetPassword(email, password, resetToken);
        });
    }
};
UserService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(type_1.default.UserRepository)),
    __metadata("design:paramtypes", [Object])
], UserService);
exports.default = UserService;
