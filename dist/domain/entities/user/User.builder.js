"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBuilder = void 0;
const User_entity_1 = require("./User.entity");
class UserBuilder {
    constructor() {
        this.data = {};
    }
    setEmail(email) {
        this.data.email = email;
        return this;
    }
    setId(_id) {
        this.data._id = _id;
        return this;
    }
    setPassword(password) {
        this.data.password = password;
        return this;
    }
    setFirstName(name) {
        this.data.firstName = name;
        return this;
    }
    setLastName(name) {
        this.data.lastName = name;
        return this;
    }
    setAvatar(avatar) {
        this.data.avatar = avatar;
        return this;
    }
    setPhone(phone) {
        this.data.phone = phone;
        return this;
    }
    setGender(gender) {
        this.data.gender = gender;
        return this;
    }
    setDateOfBirth(dob) {
        this.data.dateOfBirth = dob;
        return this;
    }
    setStatus(status) {
        this.data.status = status;
        return this;
    }
    setChannels(channels) {
        this.data.channels = channels;
        return this;
    }
    setTwoFactorAuth(secret, enabled) {
        this.data.twoFactorAuthenticationSecret = secret;
        this.data.isTwoFactorAuthenticationEnabled = enabled;
        return this;
    }
    setEmailNotification(enabled) {
        this.data.isEmailNotificationEnabled = enabled;
        return this;
    }
    setIsVerifiedMail(verified) {
        this.data.isVerifiedMail = verified;
        return this;
    }
    setEmailSentAt(date) {
        this.data.emailSentAt = date;
        return this;
    }
    setCreatedAt(date) {
        this.data.createdAt = date;
        return this;
    }
    setUpdatedAt(date) {
        this.data.updatedAt = date;
        return this;
    }
    build() {
        return new User_entity_1.UserEntity(this.data);
    }
}
exports.UserBuilder = UserBuilder;
