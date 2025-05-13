import { inject, injectable } from "inversify";
import { IMessageService } from "../../interfaces/services/IMessageService";
import TYPES from "../../../infrastructure/inversify/type";
import { IMessageRepository } from "../../../domain/repositories/IMessage.repository";
import { GROUP_EVENT_TYPE } from "../../../types/enum/systemMessage.enum";
import { IMessageType } from "../../../domain/entities/message/Message.type";
import { MessageDocument } from "../../../infrastructure/mongo/model/Message";
import { SystemMessageDocument } from "../../../infrastructure/mongo/model/SystemMessage";

type MessageServiceType = IMessageRepository


@injectable()
export class MessageService implements IMessageService {
    constructor(
        @inject(TYPES.MessageRepository) private readonly repository: MessageServiceType) { }

    async toSave(document: any): Promise<any> {
        const message = await this.repository.toSave(document);
        return message;
    }

    async createMessage(params: Partial<IMessageType>) {
        const message = await this.repository.createMessage(params)
        return message
    }
    async createSystemMessage(actionType: GROUP_EVENT_TYPE) {
        const message = await this.repository.createSystemMessage(actionType)
        return message
    }
    //TODO: tach service
    async recallMessage(senderId: string, messageId: string) {
        await this.repository.recallMessage(senderId, messageId)
    }
    async deleteMessage(senderId: string, messageId: string) {
        await this.repository.deleteMessage(senderId, messageId)
    }
    async getMessages(channelId: string, currentUserId: string, offset: number = 0) {
        return await this.repository.getMessages(channelId, currentUserId)
    }
    async getMessagesByMessageId(messageId: string) {
        return await this.repository.getMessagesByMessageId(messageId)
    }
    async deleteHistoryMessage(senderId: string, channelId: string) {
        await this.repository.deleteHistoryMessage(senderId, channelId)
    }
}