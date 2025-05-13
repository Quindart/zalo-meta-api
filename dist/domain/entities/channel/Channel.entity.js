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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelEntity = void 0;
const class_transformer_1 = require("class-transformer");
const BaseEntity_1 = require("../BaseEntity");
class ChannelEntity extends BaseEntity_1.BaseEntity {
    constructor(channelData = {}) {
        var _a;
        super(channelData);
        this.type = channelData.type || 'personal';
        this.deletedAt = channelData.deletedAt;
        this.isDeleted = (_a = channelData.isDeleted) !== null && _a !== void 0 ? _a : false;
        this.name = channelData.name;
        this.avatar = channelData.avatar;
        this.description = channelData.description;
        this.lastMessage = channelData.lastMessage;
        this.deletedForUsers = channelData.deletedForUsers || [];
        this.members = channelData.members || [];
    }
}
exports.ChannelEntity = ChannelEntity;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ChannelEntity.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ChannelEntity.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ChannelEntity.prototype, "deletedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], ChannelEntity.prototype, "isDeleted", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ChannelEntity.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ChannelEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ChannelEntity.prototype, "avatar", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ChannelEntity.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ChannelEntity.prototype, "lastMessage", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], ChannelEntity.prototype, "deletedForUsers", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], ChannelEntity.prototype, "members", void 0);
