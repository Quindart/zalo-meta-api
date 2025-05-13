import { Container } from "inversify";
import TYPES from "./type";
import { ILogger, WinstonLogger } from "../logger/WinstonLogger";
import { MongooseChannelRepository } from "../mongo/repositories/MongooseChannelRepository";
import { ChannelService } from "../../application/services/channel/Channel.service";
import { IChannelRepository } from "../../domain/repositories/IChannel.repository";
import { MessageService } from "../../application/services/message/Message.service";
import { IMessageRepository } from "../../domain/repositories/IMessage.repository";
import { MongooseMessageRepository } from "../mongo/repositories/MongooseMessageRepository";
import { ChannelMapper } from "../mongo/mappers/ChannelMapper";
import UserService from "../../application/services/user/User.service";
import { IUserRepository } from "../../domain/repositories/IUser.repository";
import { MongooseUserRepository } from "../mongo/repositories/MongooseUserRepository";
import { IUserService } from "../../application/interfaces/services/IUserService";
import { IEmojiService } from "../../application/interfaces/services/IEmojiService";
import { IEmojiRepository } from "../../domain/repositories/IEmoji.repository";
import { MongooseEmojiRepository } from "../mongo/repositories/MongooseEmojiRepository";
import { EmojiMapper } from "../mongo/mappers/EmojiMapper";
import { EmojiService } from "../../application/services/emoji/Emoji.service";
import { IFriendService } from "../../application/interfaces/services/IFriendService";
import { FriendService } from "../../application/services/friend/Friend.service";
import { IFriendRepository } from "../../domain/repositories/IFriend.repository";
import { MongooseFriendRepository } from "../mongo/repositories/MongooseFriendRepository";
import { FriendMapper } from "../mongo/mappers/FriendMapper";



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