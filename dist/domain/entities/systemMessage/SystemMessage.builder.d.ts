import { SystemMessageEntity } from "./SystemMessage.entity";
import { ISystemMessageType } from "./SystemMessage.type";
export declare class SystemMessageBuilder {
    private readonly data;
    setActionType(type: ISystemMessageType["actionType"]): this;
    setMessageId(id: string): this;
    setCreatedAt(date: Date): this;
    setUpdatedAt(date: Date): this;
    build(): SystemMessageEntity;
}
