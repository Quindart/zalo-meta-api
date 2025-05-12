import { plainToInstance } from "class-transformer";
import { OTPEntity } from "../../../domain/entities/otp/OTP.entity";
import { OTPDocument } from "../model/OTP";
import { Types } from "mongoose";

export class OTPMapper {
    toDomain(doc: OTPDocument): OTPEntity {
        if (!doc) return null;
        const docConvert = {
            _id: doc._id.toString()
        }
        const otp = { ...doc.toObject() as Record<string, any>, ...docConvert }
        return plainToInstance(OTPEntity, otp, {
            excludeExtraneousValues: true
        })
    }

    toPersistence(otp: OTPEntity) {
        return {
            ...otp,
            _id: new Types.ObjectId(otp._id) ?? undefined
        }
    }
}