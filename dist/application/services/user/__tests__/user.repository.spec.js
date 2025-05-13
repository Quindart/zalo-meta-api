"use strict";
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
const MongooseUserRepository_1 = require("../../../../infrastructure/mongo/repositories/MongooseUserRepository");
const User_service_1 = __importDefault(require("../User.service"));
describe('Test_UserService', () => {
    let mongoDbRepo;
    let userService;
    beforeAll(() => {
        mongoDbRepo = new MongooseUserRepository_1.MongooseUserRepository();
        userService = new User_service_1.default(mongoDbRepo);
    });
    it('should find user by email', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield userService.findByEmail('quang82thcspb@gmail.com');
        expect(user).toBeTruthy();
    }));
    it('should return null for wrong email', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.setTimeout(10000);
        const user = yield userService.findByEmail('wrong@example.com');
        expect(user).toBeNull();
    }));
    it('should find user by phone', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.setTimeout(10000);
        const user = yield userService.findByPhone('0364835692', 'phone');
        console.log("💲💲💲 ~ it ~ user:", user);
        expect(user).toBeTruthy();
        expect(user.phone).toBe('0364835692');
    }));
    // it('should find user by ID with selected fields', async () => {
    // jest.setTimeout(10000);
    //     const user = await userService.findUserSelect('67f6486e0ea31acce03b3d13', 'name, email');
    //     expect(user).toBeTruthy();
    // });
    // it('should change password successfully', async () => {
    // jest.setTimeout(10000);
    //     const result = await userService.changePassword('67f6486e0ea31acce03b3d13', '123456', '654321');
    //     expect(result).toBe(true);
    // });
    // it('should fail password change with wrong password', async () => {
    //     const result = await userService.changePassword('67f6486e0ea31acce03b3d13', 'wrongpass', 'newpass');
    //     expect(result).toBe(false);
    // });
    // it('should return matched user with keyword', async () => {
    //     const result = await userService.searchUserWithFriends('67f6486e0ea31acce03b3d13', 'friend', 'Quang');
    //     expect(result.length).toBe(1);
    // });
    // it('should return empty list if no match', async () => {
    //     const result = await userService.searchUserWithFriends('67f6486e0ea31acce03b3d13', 'friend', 'abc');
    //     expect(result.length).toBe(0);
    // });
});
