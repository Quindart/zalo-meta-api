import { MongooseUserRepository } from "../../../../infrastructure/mongo/repositories/MongooseUserRepository";
import UserService from "../User.service";

describe('Test_UserService', () => {
    let mongoDbRepo: MongooseUserRepository
    let userService: UserService
    beforeAll(() => {
        mongoDbRepo = new MongooseUserRepository()
        userService = new UserService(mongoDbRepo);
    })


    it('should find user by email', async () => {
        const user = await userService.findByEmail('quang82thcspb@gmail.com');
        expect(user).toBeTruthy();
    });

    it('should return null for wrong email', async () => {
        jest.setTimeout(10000);

        const user = await userService.findByEmail('wrong@example.com');
        expect(user).toBeNull();
    });

    it('should find user by phone', async () => {
        jest.setTimeout(10000);

        const user = await userService.findByPhone('0364835692', 'phone');
        console.log("💲💲💲 ~ it ~ user:", user)
        expect(user).toBeTruthy();
        expect(user.phone).toBe('0364835692');
    });

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
