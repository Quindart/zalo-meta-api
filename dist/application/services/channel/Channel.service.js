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
exports.ChannelService = void 0;
const inversify_1 = require("inversify");
const type_1 = __importDefault(require("../../../infrastructure/inversify/type"));
const ChannelMapper_1 = require("../../../infrastructure/mongo/mappers/ChannelMapper");
const channel_enum_1 = require("../../../types/enum/channel.enum");
const systemMessage_enum_1 = require("../../../types/enum/systemMessage.enum");
let ChannelService = class ChannelService {
    constructor(repository, messageService, logger, mapper, userService) {
        this.repository = repository;
        this.messageService = messageService;
        this.logger = logger;
        this.mapper = mapper;
        this.userService = userService;
    }
    getChannel(channelId, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.getChannel(channelId, currentUserId);
        });
    }
    getChannels(currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.getChannels(currentUserId);
        });
    }
    findOne(id, queries) {
        return __awaiter(this, void 0, void 0, function* () {
            const channelDocument = yield this.repository.findOne(id, queries);
            return this.mapper.toDomain(channelDocument);
        });
    }
    createChannel(memberRequestId, userCreateId, nameChannel, typeChannel, avatarChannel) {
        return __awaiter(this, void 0, void 0, function* () {
            const channelDocument = yield this.repository.create({ memberRequestId, userCreateId, nameChannel, typeChannel, avatarChannel });
            return this.mapper.toDomain(channelDocument);
        });
    }
    createChannelSocket(name, userId, members) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.createChannelSocket(name, userId, members);
        });
    }
    findOrCreateChannelPersonal(memberRequestId, userCreateId, nameChannel, typeChannel, avatarChannel) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findOrCreateChannelPersonal(memberRequestId, userCreateId, nameChannel, typeChannel, avatarChannel);
        });
    }
    findChannelByIdAndByUserId(channelId, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findChannelByIdAndByUserId(channelId, currentUserId);
        });
    }
    createChannelGroup(name, userId, memberIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const creatorId = userId;
            const membersList = this._createMembersOfChannel(creatorId, memberIds);
            const channel = yield this.repository.createChannelGroup(name, membersList);
            const systemMessage = yield this.messageService.createSystemMessage(systemMessage_enum_1.GROUP_EVENT_TYPE.CHANNEL_CREATED);
            const lastMessage = yield this.messageService.createMessage({
                senderId: creatorId,
                content: "Welcome to the group!",
                status: "sent",
                channelId: channel._id.toString(),
                messageType: channel_enum_1.MESSAGE_TYPES.SYSTEM,
                systemMessageId: systemMessage._id.toString(),
            });
            systemMessage.messageId = lastMessage._id;
            channel.lastMessage = lastMessage._id;
            this.repository.toSave(channel);
            this.messageService.toSave(systemMessage);
            this.messageService.toSave(lastMessage);
        });
    }
    updateUserChannel(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!channel)
                return;
            const memberIds = channel.members.map((member) => member.user);
            const updatePromises = memberIds.map((member) => {
                this.userService.findByIdAndUpdateChannel(channel._id, member);
            });
            yield Promise.all(updatePromises);
        });
    }
    assignRoleChannelId(channelId, members) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.assignRoleChannelIdSocket(channelId, members);
        });
    }
    updateLastMessage(channelId, lastMessageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.updateLastMessageSocket(channelId, lastMessageId);
        });
    }
    //! TODO: tach service - mongo
    removeMember(channelId, senderId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.removeMemberSocket(channelId, senderId, userId);
        });
    }
    addMemberToChannel(channelId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.addMemberToChannelSocket(channelId, userId);
        });
    }
    dissolveGroup(channelId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.dissolveGroupSocket(channelId, userId);
        });
    }
    leaveChannel(channelId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.leaveChannelSocket(channelId, userId);
        });
    }
    findChannelsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findChannelsByUserId(userId);
        });
    }
    _createMembersOfChannel(creatorId, members) {
        if (members.length >= 2) {
            return [
                { user: creatorId, role: channel_enum_1.ROLE_TYPES.CAPTAIN },
                ...members.map(memberId => ({
                    user: memberId,
                    role: channel_enum_1.ROLE_TYPES.MEMBER
                }))
            ];
        }
        return members.map(memberId => ({
            user: memberId,
            role: channel_enum_1.ROLE_TYPES.MEMBER
        }));
    }
};
exports.ChannelService = ChannelService;
exports.ChannelService = ChannelService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(type_1.default.ChannelRepository)),
    __param(1, (0, inversify_1.inject)(type_1.default.MessageService)),
    __param(2, (0, inversify_1.inject)(type_1.default.Logger)),
    __param(3, (0, inversify_1.inject)(type_1.default.ChannelMapper)),
    __param(4, (0, inversify_1.inject)(type_1.default.UserService)),
    __metadata("design:paramtypes", [Object, Object, Object, ChannelMapper_1.ChannelMapper, Object])
], ChannelService);
