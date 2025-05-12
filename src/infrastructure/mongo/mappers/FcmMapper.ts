import { plainToInstance } from "class-transformer";
import { FCMDocument } from "../model/FCM";
import { Types } from "mongoose";
import { FCMEntity } from "../../../domain/entities/fcm/FCM.entity";

export class FCMMapper {
    toDomain(doc: FCMDocument): FCMEntity {
        if (!doc) return null;
        const docConvert = {
            _id: doc._id.toString(),
            user: doc.user?.map(us => us.toString()),
        };
        const fcm = { ...doc.toObject() as Record<string, any>, ...docConvert };
        return plainToInstance(FCMEntity, fcm, {
            excludeExtraneousValues: true
        });
    }

    toPersistence(fcm: FCMEntity) {
        return {
            ...fcm,
            _id: new Types.ObjectId(fcm._id.toString()) ?? undefined,
            user: fcm.user.map((u: string) => new Types.ObjectId(u.toString()) ?? undefined)
        };
    }
}
