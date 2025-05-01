import { Expose } from "class-transformer";
import { BaseEntity } from "../BaseEntity.ts";
import { IFCMType } from "./FCM.type.ts";

export class FCMEntity extends BaseEntity<IFCMType> {
    @Expose() deleteAt?: Date | string;
    @Expose() fcmToken: string;
    @Expose() user: string[];

    constructor(fcmData: Partial<IFCMType> = {}) {
        super(fcmData);
        this.deleteAt = fcmData.deleteAt;
        this.fcmToken = fcmData.fcmToken || '';
        this.user = fcmData.user || [];
    }

}
