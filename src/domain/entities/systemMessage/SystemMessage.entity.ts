import { Expose } from "class-transformer";
import { BaseEntity, IBaseEntityType } from "../BaseEntity";
import { ISystemMessageType } from "./SystemMessage.type";

export class SystemMessageEntity extends BaseEntity<ISystemMessageType & IBaseEntityType> {
    @Expose() actionType: ISystemMessageType["actionType"];
    @Expose() messageId: string;
    @Expose() createdAt?: Date;
    @Expose() updatedAt?: Date;

    constructor(data: Partial<ISystemMessageType> = {}) {
        super(data);
        this.actionType = data.actionType || 'announcement';
        this.messageId = data.messageId || '';
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}
