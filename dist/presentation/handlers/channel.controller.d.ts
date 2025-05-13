import { Request, Response } from "express";
import { RequestUser } from "../../types/request/RequestUser";
declare class ChannelController {
    private channelService;
    constructor();
    createGroup(req: RequestUser, res: Response): Promise<void>;
    getAllChannel(req: RequestUser, res: Response): Promise<void>;
    getChannelByID(req: Request, res: Response): Promise<void>;
    addMemberToChannel(req: Request, res: Response): Promise<void>;
    getAllMember(req: Request, res: Response): Promise<void>;
    outChannel(req: RequestUser, res: Response): Promise<void>;
    assignRoleMember(req: Request, res: Response): Promise<void>;
    private _createMembersOfChannel;
}
declare const _default: ChannelController;
export default _default;
