import { IMessageType } from "../../../domain/entities/message/Message.type";
import { MessageDocument } from "../../../infrastructure/mongo/model/Message";
import { SystemMessageDocument } from "../../../infrastructure/mongo/model/SystemMessage";
import { GROUP_EVENT_TYPE } from "../../../types/enum/systemMessage.enum";

export interface IMessageService {
    createMessage(params: Partial<IMessageType>): Promise<MessageDocument>
    createSystemMessage(actionType: GROUP_EVENT_TYPE): Promise<SystemMessageDocument>
    toSave(document: SystemMessageDocument | MessageDocument): Promise<SystemMessageDocument | MessageDocument>
}