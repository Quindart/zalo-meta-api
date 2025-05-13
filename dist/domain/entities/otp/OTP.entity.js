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
exports.OTPEntity = void 0;
const class_transformer_1 = require("class-transformer");
const BaseEntity_1 = require("../BaseEntity");
class OTPEntity extends BaseEntity_1.BaseEntity {
    constructor(otpData = {}) {
        var _a, _b;
        super(otpData);
        this.email = otpData.email || "";
        this.otp = otpData.otp || "";
        this.createdAt = otpData.createdAt || new Date();
        this.isVerified = (_a = otpData.isVerified) !== null && _a !== void 0 ? _a : false;
        this.verificationAttempts = (_b = otpData.verificationAttempts) !== null && _b !== void 0 ? _b : 0;
        this.lastAttemptAt = otpData.lastAttemptAt;
    }
}
exports.OTPEntity = OTPEntity;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], OTPEntity.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], OTPEntity.prototype, "otp", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], OTPEntity.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], OTPEntity.prototype, "isVerified", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], OTPEntity.prototype, "verificationAttempts", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], OTPEntity.prototype, "lastAttemptAt", void 0);
