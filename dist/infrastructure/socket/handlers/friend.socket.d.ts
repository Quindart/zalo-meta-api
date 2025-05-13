import { Server, Socket } from "socket.io";
import { IFriendService } from "../../../application/interfaces/services/IFriendService";
interface FriendParams {
    userId: string;
    userFriendId: string;
}
interface UserOnlyParams {
    userId: string;
}
declare class FriendSocket {
    io: Server;
    socket: Socket;
    friendService: IFriendService;
    constructor(io: Server, socket: Socket);
    registerEvents(): void;
    addFriend(params: FriendParams): Promise<void>;
    removeFriend(params: FriendParams): Promise<void>;
    acceptFriend(params: FriendParams): Promise<void>;
    rejectFriend(params: FriendParams): Promise<void>;
    revokeInvite(params: FriendParams): Promise<void>;
    listFriend(params: UserOnlyParams): Promise<void>;
    listSendInvite(params: UserOnlyParams): Promise<void>;
    listReceived(params: UserOnlyParams): Promise<void>;
    private _getResultOfEventFriend;
}
export default FriendSocket;
