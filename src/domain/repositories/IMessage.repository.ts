import { MessageDocument } from "../../infrastructure/mongo/model/Message";
import { SystemMessageDocument } from "../../infrastructure/mongo/model/SystemMessage";
import { IMessageType } from "../entities/message/Message.type";

export interface IMessageRepository {

    toSave(document: MessageDocument | SystemMessageDocument): Promise<MessageDocument | SystemMessageDocument>
    createMessage(params: Partial<IMessageType>): Promise<any>;

    //TODO: new code
    createSystemMessage(actionType: string): Promise<any>;


    recallMessage(senderId: string, messageId: string): Promise<void>;

    deleteMessage(senderId: string, messageId: string): Promise<void>;

    getMessages(channelId: string, currentUserId: string, offset?: number): Promise<any[]>;

    getMessagesByMessageId(messageId: string): Promise<any | null>;

    deleteHistoryMessage(senderId: string, channelId: string): Promise<void>;
}

