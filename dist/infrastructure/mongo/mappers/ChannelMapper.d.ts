import { ChannelEntity } from "../../../domain/entities/channel/Channel.entity";
import { ChannelDocument } from "../model/Channel";
export declare class ChannelMapper {
    toDomain(doc: ChannelDocument): ChannelEntity;
    toPersistence(channel: ChannelEntity): ChannelDocument;
}
