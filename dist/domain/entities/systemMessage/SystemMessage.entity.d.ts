import { BaseEntity, IBaseEntityType } from "../BaseEntity";
import { ISystemMessageType } from "./SystemMessage.type";
export declare class SystemMessageEntity extends BaseEntity<ISystemMessageType & IBaseEntityType> {
    actionType: ISystemMessageType["actionType"];
    messageId: string;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(data?: Partial<ISystemMessageType>);
}
