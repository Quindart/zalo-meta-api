import { Expose } from "class-transformer";
import { ISystemMessageType } from "../../domain/entities/systemMessage/SystemMessage.type.ts";

export class SystemMessageDTO {
    @Expose() actionType: ISystemMessageType["actionType"];
    @Expose() messageId: string;
    @Expose() createdAt?: Date;
    @Expose() updatedAt?: Date;
}