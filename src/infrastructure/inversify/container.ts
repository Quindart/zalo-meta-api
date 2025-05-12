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
import UserService from "../../application/services/user/User.service.ts";
import { IUserRepository } from "../../domain/repositories/IUser.repository.ts";
import { MongooseUserRepository } from "../mongo/repositories/MongooseUserRepository.ts";
import { IUserService } from "../../application/interfaces/services/IUserService.ts";
import { IEmojiService } from "../../application/interfaces/services/IEmojiService.ts";
import { IEmojiRepository } from "../../domain/repositories/IEmoji.repository.ts";
import { MongooseEmojiRepository } from "../mongo/repositories/MongooseEmojiRepository.ts";
import { EmojiMapper } from "../mongo/mappers/EmojiMapper.ts";
import { EmojiService } from "../../application/services/emoji/Emoji.service.ts";
import { IFriendService } from "../../application/interfaces/services/IFriendService.ts";
import { FriendService } from "../../application/services/friend/Friend.service.ts";
import { IFriendRepository } from "../../domain/repositories/IFriend.repository.ts";
import { MongooseFriendRepository } from "../mongo/repositories/MongooseFriendRepository.ts";
import { FriendMapper } from "../mongo/mappers/FriendMapper.ts";



const container = new Container()

//TODO: system
container.bind<ILogger>(TYPES.Logger).to(WinstonLogger).inSingletonScope();

//TODO: Repository
container.bind<ChannelService>(TYPES.ChannelService).to(ChannelService);
container.bind<MessageService>(TYPES.MessageService).to(MessageService)
container.bind<IUserService>(TYPES.UserService).to(UserService)
container.bind<IEmojiService>(TYPES.EmojiService).to(EmojiService);
container.bind<IFriendService>(TYPES.FriendService).to(FriendService);

//TODO: Service
container.bind<IMessageRepository>(TYPES.MessageRepository).to(MongooseMessageRepository)
container.bind<IChannelRepository>(TYPES.ChannelRepository).to(MongooseChannelRepository)
container.bind<IUserRepository>(TYPES.UserRepository).to(MongooseUserRepository)
container.bind<IEmojiRepository>(TYPES.EmojiRepository).to(MongooseEmojiRepository);
container.bind<IFriendRepository>(TYPES.FriendRepository).to(MongooseFriendRepository);

//TODO: Mapper

container.bind<ChannelMapper>(TYPES.ChannelMapper).to(ChannelMapper);
container.bind<EmojiMapper>(TYPES.EmojiMapper).to(EmojiMapper);
container.bind<FriendMapper>(TYPES.FriendMapper).to(FriendMapper);

//TODO: check register container
// console.log(container.isBound(TYPES.ChannelRepository));
// console.log(container.isBound(TYPES.MessageRepository));

export { container }