"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const inversify_1 = require("inversify");
const type_1 = __importDefault(require("./type"));
const WinstonLogger_1 = require("../logger/WinstonLogger");
const MongooseChannelRepository_1 = require("../mongo/repositories/MongooseChannelRepository");
const Channel_service_1 = require("../../application/services/channel/Channel.service");
const Message_service_1 = require("../../application/services/message/Message.service");
const MongooseMessageRepository_1 = require("../mongo/repositories/MongooseMessageRepository");
const ChannelMapper_1 = require("../mongo/mappers/ChannelMapper");
const User_service_1 = __importDefault(require("../../application/services/user/User.service"));
const MongooseUserRepository_1 = require("../mongo/repositories/MongooseUserRepository");
const MongooseEmojiRepository_1 = require("../mongo/repositories/MongooseEmojiRepository");
const EmojiMapper_1 = require("../mongo/mappers/EmojiMapper");
const Emoji_service_1 = require("../../application/services/emoji/Emoji.service");
const Friend_service_1 = require("../../application/services/friend/Friend.service");
const MongooseFriendRepository_1 = require("../mongo/repositories/MongooseFriendRepository");
const FriendMapper_1 = require("../mongo/mappers/FriendMapper");
const container = new inversify_1.Container();
exports.container = container;
//TODO: system
container.bind(type_1.default.Logger).to(WinstonLogger_1.WinstonLogger).inSingletonScope();
//TODO: Repository
container.bind(type_1.default.ChannelService).to(Channel_service_1.ChannelService);
container.bind(type_1.default.MessageService).to(Message_service_1.MessageService);
container.bind(type_1.default.UserService).to(User_service_1.default);
container.bind(type_1.default.EmojiService).to(Emoji_service_1.EmojiService);
container.bind(type_1.default.FriendService).to(Friend_service_1.FriendService);
//TODO: Service
container.bind(type_1.default.MessageRepository).to(MongooseMessageRepository_1.MongooseMessageRepository);
container.bind(type_1.default.ChannelRepository).to(MongooseChannelRepository_1.MongooseChannelRepository);
container.bind(type_1.default.UserRepository).to(MongooseUserRepository_1.MongooseUserRepository);
container.bind(type_1.default.EmojiRepository).to(MongooseEmojiRepository_1.MongooseEmojiRepository);
container.bind(type_1.default.FriendRepository).to(MongooseFriendRepository_1.MongooseFriendRepository);
//TODO: Mapper
container.bind(type_1.default.ChannelMapper).to(ChannelMapper_1.ChannelMapper);
container.bind(type_1.default.EmojiMapper).to(EmojiMapper_1.EmojiMapper);
container.bind(type_1.default.FriendMapper).to(FriendMapper_1.FriendMapper);
