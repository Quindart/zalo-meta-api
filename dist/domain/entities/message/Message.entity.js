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
exports.MessageEntity = void 0;
const class_transformer_1 = require("class-transformer");
const BaseEntity_1 = require("../BaseEntity");
class MessageEntity extends BaseEntity_1.BaseEntity {
    constructor(data = {}) {
        super(data);
        this.senderId = data.senderId || '';
        this.content = data.content || '';
        this.status = data.status || '';
        this.messageType = data.messageType || 'text';
        this.channelId = data.channelId;
        this.emojis = data.emojis || [];
        this.imagesGroup = data.imagesGroup || [];
        this.fileId = data.fileId;
        this.systemMessageId = data.systemMessageId;
        this.createdAt = data.createdAt || new Date();
        this.timestamp = data.timestamp || new Date();
        this.isDeletedById = data.isDeletedById || [];
    }
}
exports.MessageEntity = MessageEntity;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MessageEntity.prototype, "senderId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MessageEntity.prototype, "content", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MessageEntity.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MessageEntity.prototype, "messageType", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MessageEntity.prototype, "channelId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], MessageEntity.prototype, "emojis", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], MessageEntity.prototype, "imagesGroup", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MessageEntity.prototype, "fileId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MessageEntity.prototype, "systemMessageId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], MessageEntity.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], MessageEntity.prototype, "timestamp", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], MessageEntity.prototype, "isDeletedById", void 0);
