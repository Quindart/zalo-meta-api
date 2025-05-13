import { Server, Socket } from "socket.io";
declare class ChannelSocket {
    io: Server;
    socket: Socket;
    userRepo: any;
    private channelService;
    private userService;
    private messageService;
    constructor(io: Server, socket: Socket);
    registerEvents(): void;
    findOrCreateChat(params: {
        senderId: string;
        receiverId: string;
    }): Promise<void>;
    findByIdChannel(params: {
        channelId: string;
        currentUserId: string;
    }): void;
    loadChannel(params: {
        currentUserId: string;
    }): Promise<void>;
    createChannel(params: {
        name: string;
        currentUserId: string;
        members: any[];
    }): void;
    joinRoom(params: {
        channelId: string;
        currentUserId: string;
    }): void;
    leaveRoom(params: {
        channelId: string;
        userId: string;
    }): void;
    removeMember(params: {
        channelId: string;
        senderId: string;
        userId: string;
    }): void;
    dissolveGroup(params: {
        channelId: string;
        userId: string;
    }): Promise<void>;
    addMember(params: {
        channelId: string;
        userId: string;
    }): Promise<void>;
    assignRole({ channelId, userId, targetUserId, newRole }: any): Promise<boolean>;
}
export default ChannelSocket;
