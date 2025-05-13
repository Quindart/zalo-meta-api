import { ISystemMessageType } from "../../domain/entities/systemMessage/SystemMessage.type";
export declare class SystemMessageDTO {
    actionType: ISystemMessageType["actionType"];
    messageId: string;
    createdAt?: Date;
    updatedAt?: Date;
}
