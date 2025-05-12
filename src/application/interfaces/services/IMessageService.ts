import { IMessageType } from "../../../domain/entities/message/Message.type";
import { MessageDocument } from "../../../infrastructure/mongo/model/Message";
import { SystemMessageDocument } from "../../../infrastructure/mongo/model/SystemMessage";
import { GROUP_EVENT_TYPE } from "../../../types/enum/systemMessage.enum";

export interface IMessageService {
    toSave(document: SystemMessageDocument | MessageDocument): Promise<SystemMessageDocument | MessageDocument>;

    createMessage(params: Partial<IMessageType>): Promise<MessageDocument>;

    createSystemMessage(actionType: GROUP_EVENT_TYPE): Promise<SystemMessageDocument>;

    recallMessage(senderId: string, messageId: string): Promise<void>;
   
    deleteMessage(senderId: string, messageId: string): Promise<void>;

    getMessages(channelId: string, currentUserId: string, offset?: number): Promise<MessageDocument[]>;
   
    getMessagesByMessageId(messageId: string): Promise<MessageDocument>;
   
    deleteHistoryMessage(senderId: string, channelId: string): Promise<void>;
}