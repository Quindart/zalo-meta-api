import { Response } from "express";
import { RequestUser } from "../../types/request/RequestUser";
declare class UserController {
    private friendService;
    constructor();
    getUserById(req: RequestUser, res: Response): Promise<void>;
    getUserByPhone(req: RequestUser, res: Response): Promise<void>;
    getUsers(req: RequestUser, res: Response): Promise<void>;
    getMe(req: RequestUser, res: Response): Promise<void>;
    createUser(req: RequestUser, res: Response): Promise<void>;
    updateMe(req: RequestUser, res: Response): Promise<void>;
    changePassword(req: RequestUser, res: Response): Promise<void>;
    updateUser(req: RequestUser, res: Response): Promise<void>;
    deleteUser(req: RequestUser, res: Response): Promise<void>;
    searchUserWithFriends(req: RequestUser, res: Response): Promise<void>;
    searchUsers(req: RequestUser, res: Response): Promise<void>;
}
declare const _default: UserController;
export default _default;
