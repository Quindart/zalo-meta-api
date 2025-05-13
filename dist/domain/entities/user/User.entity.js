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
exports.UserEntity = void 0;
const class_transformer_1 = require("class-transformer");
const BaseEntity_1 = require("../BaseEntity");
// "dev": "tsc --noEmit && node --no-warnings=ExperimentalWarning --loader ts-node/esm/transpile-only src/server.ts"
let UserEntity = class UserEntity extends BaseEntity_1.BaseEntity {
    constructor(data = {}) {
        var _a, _b, _c;
        super(data);
        this._id = data._id;
        this.email = data.email || '';
        this.password = data.password || '';
        this.avatar = data.avatar;
        this.phone = data.phone;
        this.gender = data.gender;
        this.dateOfBirth = data.dateOfBirth;
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.status = data.status || 'ACTIVE';
        this.twoFactorAuthenticationSecret = data.twoFactorAuthenticationSecret;
        this.isTwoFactorAuthenticationEnabled = (_a = data.isTwoFactorAuthenticationEnabled) !== null && _a !== void 0 ? _a : false;
        this.updatedAt = data.updatedAt;
        this.createdAt = data.createdAt;
        this.isVerifiedMail = (_b = data.isVerifiedMail) !== null && _b !== void 0 ? _b : false;
        this.isEmailNotificationEnabled = (_c = data.isEmailNotificationEnabled) !== null && _c !== void 0 ? _c : true;
        this.emailSentAt = data.emailSentAt;
        this.channels = data.channels || [];
    }
};
exports.UserEntity = UserEntity;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserEntity.prototype, "avatar", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserEntity.prototype, "phone", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserEntity.prototype, "gender", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "dateOfBirth", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserEntity.prototype, "firstName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserEntity.prototype, "lastName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserEntity.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserEntity.prototype, "twoFactorAuthenticationSecret", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isTwoFactorAuthenticationEnabled", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isVerifiedMail", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isEmailNotificationEnabled", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "emailSentAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], UserEntity.prototype, "channels", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], UserEntity);
