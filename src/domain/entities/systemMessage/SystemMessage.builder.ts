import { SystemMessageEntity } from "./SystemMessage.entity";
import { ISystemMessageType } from "./SystemMessage.type";

export class SystemMessageBuilder {
    private readonly data: Partial<ISystemMessageType> = {};

    setActionType(type: ISystemMessageType["actionType"]) {
        this.data.actionType = type;
        return this;
    }

    setMessageId(id: string) {
        this.data.messageId = id;
        return this;
    }

    setCreatedAt(date: Date) {
        this.data.createdAt = date;
        return this;
    }

    setUpdatedAt(date: Date) {
        this.data.updatedAt = date;
        return this;
    }

    build(): SystemMessageEntity {
        return new SystemMessageEntity(this.data);
    }
}
