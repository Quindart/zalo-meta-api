"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelMapper = void 0;
const class_transformer_1 = require("class-transformer");
const Channel_entity_1 = require("../../../domain/entities/channel/Channel.entity");
const mongoose_1 = require("mongoose");
const inversify_1 = require("inversify");
let ChannelMapper = class ChannelMapper {
    toDomain(doc) {
        if (!doc)
            return null;
        const docConvert = {
            _id: doc._id ? doc._id.toString() : undefined,
            members: doc.members ? doc.members.map((mem) => ({ user: mem.user.toString(), role: mem.role })) : undefined,
            lastMessage: doc.lastMessage ? doc.lastMessage._id.toString() : undefined
        };
        const channel = Object.assign(Object.assign({}, doc.toObject()), docConvert);
        return (0, class_transformer_1.plainToInstance)(Channel_entity_1.ChannelEntity, channel, { excludeExtraneousValues: true });
    }
    toPersistence(channel) {
        const convertMembers = channel.members.length === 0 ? [] : channel.members.map((mem) => ({
            user: mem.user ? new mongoose_1.Types.ObjectId(mem.user) : undefined,
            role: mem.role
        }));
        const convertDeletedForUsers = channel.deletedForUsers.length === 0 ? [] : channel.deletedForUsers.map(mem => ({ user: new mongoose_1.Types.ObjectId(mem.user) }));
        const channelDoc = {
            _id: channel._id ? new mongoose_1.Types.ObjectId(channel._id) : undefined,
            lastMessage: channel.lastMessage ? new mongoose_1.Types.ObjectId(channel.lastMessage) : undefined,
            members: convertMembers,
            avatar: channel.avatar,
            name: channel.name,
            description: channel.description,
            type: channel.type,
            deletedForUsers: convertDeletedForUsers,
            createdAt: channel.createdAt,
            isDeleted: false,
            updatedAt: undefined,
            toObject: () => ({}),
            $assertPopulated: () => ({}),
            $clearModifiedPaths: () => ({}),
            $clone: () => ({}),
        };
        return channelDoc;
    }
};
exports.ChannelMapper = ChannelMapper;
exports.ChannelMapper = ChannelMapper = __decorate([
    (0, inversify_1.injectable)()
], ChannelMapper);
