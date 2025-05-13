import { SystemMessageEntity } from "../../../domain/entities/systemMessage/SystemMessage.entity";
import { SystemMessageDocument } from "../model/SystemMessage";
import { Types } from "mongoose";
export declare class SystemMessageMapper {
    toDomain(doc: SystemMessageDocument): SystemMessageEntity;
    toPersistence(message: SystemMessageEntity): {
        _id: Types.ObjectId;
        messageId: Types.ObjectId;
        actionType: import("../../../domain/entities/systemMessage/SystemMessage.type").ISystemMessageType["actionType"];
        createdAt?: Date;
        updatedAt?: Date;
    };
}
