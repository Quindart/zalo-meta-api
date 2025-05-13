import { IMessageService } from "../../interfaces/services/IMessageService";
import { IMessageRepository } from "../../../domain/repositories/IMessage.repository";
import { GROUP_EVENT_TYPE } from "../../../types/enum/systemMessage.enum";
import { IMessageType } from "../../../domain/entities/message/Message.type";
type MessageServiceType = IMessageRepository;
export declare class MessageService implements IMessageService {
    private readonly repository;
    constructor(repository: MessageServiceType);
    toSave(document: any): Promise<any>;
    createMessage(params: Partial<IMessageType>): Promise<any>;
    createSystemMessage(actionType: GROUP_EVENT_TYPE): Promise<any>;
    recallMessage(senderId: string, messageId: string): Promise<void>;
    deleteMessage(senderId: string, messageId: string): Promise<void>;
    getMessages(channelId: string, currentUserId: string, offset?: number): Promise<any[]>;
    getMessagesByMessageId(messageId: string): Promise<any>;
    deleteHistoryMessage(senderId: string, channelId: string): Promise<void>;
}
export {};
