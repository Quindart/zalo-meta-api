import mongoose, { Types } from 'mongoose';
import { IMessageRepository } from '../../../domain/repositories/IMessage.repository';
import { MessageDocument } from '../model/Message';
import { SystemMessageDocument } from '../model/SystemMessage';
import { GROUP_EVENT_TYPE } from '../../../types/enum/systemMessage.enum';
import { IMessageType } from '../../../domain/entities/message/Message.type';
export declare class MongooseMessageRepository implements IMessageRepository {
    private _baseRepository;
    constructor();
    toSave(document: MessageDocument | SystemMessageDocument): Promise<any>;
    createSystemMessage(actionType: GROUP_EVENT_TYPE): Promise<mongoose.Document<unknown, {}, SystemMessageDocument, {}> & SystemMessageDocument & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    createMessage(params: Partial<IMessageType>): Promise<mongoose.Document<unknown, {}, MessageDocument, {}> & MessageDocument & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    recallMessage(senderId: string, messageId: string): Promise<void>;
    deleteMessage(senderId: string, messageId: string): Promise<void>;
    getMessages(channelId: any, currentUserId: string, offset?: number): Promise<{
        id: any;
        sender: {
            id: any;
            name: string;
            avatar: any;
        };
        emojis: any;
        file: any;
        imagesGroup: any;
        channelId: any;
        status: string;
        timestamp: any;
        isMe: boolean;
        messageType: any;
        content: any;
    }[]>;
    getMessagesByMessageId(messageId: string): Promise<{
        id: any;
        sender: {
            id: any;
            name: string;
            avatar: any;
        };
        file: any;
        channelId: any;
        status: string;
        timestamp: any;
        isMe: boolean;
        messageType: any;
        content: any;
        isDeletedById: any;
    }>;
    deleteHistoryMessage(senderId: string, channelId: string): Promise<void>;
    private _checkIsNotYourMessage;
}
