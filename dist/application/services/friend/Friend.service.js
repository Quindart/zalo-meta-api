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
exports.FriendService = void 0;
const inversify_1 = require("inversify");
const type_1 = __importDefault(require("../../../infrastructure/inversify/type"));
let FriendService = class FriendService {
    constructor(repository, mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }
    getFriendByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const friends = yield this.repository.getFriendByUserId(userId);
            return friends;
        });
    }
    createFriend(userId, userFriendId) {
        return __awaiter(this, void 0, void 0, function* () {
            const friendDoc = yield this.repository.createFriend(userId, userFriendId);
            return friendDoc;
        });
    }
    removeFriend(userId, userFriendId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.removeFriend(userId, userFriendId);
        });
    }
    isExistFriendRelationship(userId, userFriendId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.isExistFriendRelationship(userId, userFriendId);
        });
    }
    getFriendByUserIdByType(userId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const friends = yield this.repository.getFriendByUserIdByType(userId, type);
            return friends;
        });
    }
    getInviteOfUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const invites = yield this.repository.getInviteOfUser(userId);
            return invites;
        });
    }
    getInviteOfUserSending(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const invites = yield this.repository.getInviteOfUserSending(userId);
            return invites;
        });
    }
    getById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const friendDoc = yield this.repository.getById(userId);
            return friendDoc;
        });
    }
    updateFriendStatus(userId, userFriendId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const friendDoc = yield this.repository.updateFriendStatus(userId, userFriendId, type);
            return friendDoc;
        });
    }
};
exports.FriendService = FriendService;
exports.FriendService = FriendService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(type_1.default.FriendRepository)),
    __param(1, (0, inversify_1.inject)(type_1.default.FriendMapper)),
    __metadata("design:paramtypes", [Object, Object])
], FriendService);
