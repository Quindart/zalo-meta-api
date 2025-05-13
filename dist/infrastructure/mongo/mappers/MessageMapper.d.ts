import { MessageDocument } from "../model/Message";
import { MessageEntity } from "../../../domain/entities/message/Message.entity";
export declare class MessageMapper {
    static MessageMapper(doc: MessageDocument): MessageDocument | PromiseLike<MessageDocument>;
    toDomain(doc: MessageDocument): MessageEntity;
    toPersistence(message: MessageEntity): any;
}
