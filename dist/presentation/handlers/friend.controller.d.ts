import { Response } from "express";
import { RequestUser } from "../../types/request/RequestUser";
declare class FriendController {
    private friendService;
    contructor(): void;
    accpetFriend(req: RequestUser, res: Response): Promise<void>;
    rejectAcceptFriend(req: RequestUser, res: Response): Promise<void>;
    removeFriend(req: RequestUser, res: Response): Promise<void>;
    inviteFriend(req: RequestUser, res: Response): Promise<void>;
    removeIniviteFriend(req: RequestUser, res: Response): Promise<void>;
    getMyFriends(req: RequestUser, res: Response): Promise<void>;
    getMyInviteFriends(req: RequestUser, res: Response): Promise<void>;
    getMyInvitedSending(req: RequestUser, res: Response): Promise<void>;
    getFriendList(req: RequestUser, res: Response): Promise<void>;
}
declare const _default: FriendController;
export default _default;
