import { Container } from "inversify";
import TYPES from "./type.ts";
import { ILogger, WinstonLogger } from "../logger/WinstonLogger.ts";
import { MongooseChannelRepository } from "../mongo/repositories/MongooseChannelRepository.ts";
import { ChannelService } from "../../application/services/channel/Channel.service.ts";
import { IChannelRepository } from "../../domain/repositories/IChannel.repository.ts";
import { MessageService } from "../../application/services/message/Message.service.ts";
import { IMessageRepository } from "../../domain/repositories/IMessage.repository.ts";
import { MongooseMessageRepository } from "../mongo/repositories/MongooseMessageRepository.ts";
import { ChannelMapper } from "../mongo/mappers/ChannelMapper.ts";



const container = new Container()

container.bind<ILogger>(TYPES.Logger).to(WinstonLogger).inSingletonScope();

container.bind<ChannelService>(TYPES.ChannelService).to(ChannelService);
container.bind<IChannelRepository>(TYPES.ChannelRepository).to(MongooseChannelRepository)

container.bind<MessageService>(TYPES.MessageService).to(MessageService)
container.bind<IMessageRepository>(TYPES.MessageRepository).to(MongooseMessageRepository)


//TODO: Mapper

container.bind<ChannelMapper>(TYPES.ChannelMapper).to(ChannelMapper); 

//TODO: check register container
// console.log(container.isBound(TYPES.ChannelRepository));
// console.log(container.isBound(TYPES.MessageRepository));

export { container }