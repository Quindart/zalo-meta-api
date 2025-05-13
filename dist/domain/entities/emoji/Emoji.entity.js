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
exports.EmojiEntity = void 0;
const class_transformer_1 = require("class-transformer");
const BaseEntity_1 = require("../BaseEntity");
class EmojiEntity extends BaseEntity_1.BaseEntity {
    constructor(data = {}) {
        super(data);
        this.emoji = data.emoji || '';
        this.quantity = data.quantity || 0;
        this.messageId = data.messageId || '';
        this.userId = data.userId || '';
        this.deleteAt = data.deleteAt;
        this.createAt = data.createAt;
        this.updateAt = data.updateAt;
    }
}
exports.EmojiEntity = EmojiEntity;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EmojiEntity.prototype, "emoji", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], EmojiEntity.prototype, "quantity", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EmojiEntity.prototype, "messageId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EmojiEntity.prototype, "userId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], EmojiEntity.prototype, "deleteAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], EmojiEntity.prototype, "createAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], EmojiEntity.prototype, "updateAt", void 0);
