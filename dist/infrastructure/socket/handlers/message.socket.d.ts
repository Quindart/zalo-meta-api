import { Server, Socket } from "socket.io";
import { IUserService } from "../../../application/interfaces/services/IUserService";
import { IMessageService } from "../../../application/interfaces/services/IMessageService";
import { IChannelService } from "../../../application/interfaces/services/IChannelService";
declare class MessageSocket {
    userRepo: any;
    io: Server;
    socket: Socket;
    userService: IUserService;
    messageService: IMessageService;
    channelService: IChannelService;
    constructor(io: Server, socket: Socket);
    registerEvents(): void;
    sendMessage(data: any): Promise<void>;
    readMessage(data: any): Promise<void>;
    loadMessage(params: {
        channelId: string;
        currentUserId: string;
        offset: number;
    }): Promise<void>;
    uploadFile(data: any): Promise<void>;
    recallMessage(data: any): Promise<void>;
    deleteMessage(data: any): Promise<void>;
    forwardMessage(data: any): Promise<void>;
    deleteHistoryMessage(data: any): Promise<void>;
    uploadGroupImages(data: any): Promise<void>;
}
export default MessageSocket;
