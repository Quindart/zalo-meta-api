import { inject, injectable } from "inversify";
import { IMessageService } from "../../interfaces/services/IMessageService.ts";
import TYPES from "../../../infrastructure/inversify/type.ts";
import { IMessageRepository } from "../../../domain/repositories/IMessage.repository.ts";
import { GROUP_EVENT_TYPE } from "../../../types/enum/systemMessage.enum.ts";
import { IMessageType } from "../../../domain/entities/message/Message.type.ts";
import { MessageDocument } from "../../../infrastructure/mongo/model/Message.ts";
import { SystemMessageDocument } from "../../../infrastructure/mongo/model/SystemMessage.ts";

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
}