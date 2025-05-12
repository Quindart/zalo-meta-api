const TYPES = {

    //TODO: UTILS
    Logger: Symbol.for('Logger'),

    //TODO: SERVICE
    ChannelService: Symbol.for("ChannelService"),
    MessageService: Symbol.for("MessageService"),
    UserService: Symbol.for("UserService"),
    EmojiService: Symbol.for("EmojiService"),
    FriendService: Symbol.for("FriendService"),

    //TODO: REPOSITORY
    ChannelRepository: Symbol.for('ChannelRepository'),
    MessageRepository: Symbol.for("MessageRepository"),
    UserRepository: Symbol.for("UserRepository"),
    EmojiRepository: Symbol.for("EmojiRepository"),
    FriendRepository: Symbol.for("FriendRepository"),


    //TODO: MAPPER
    ChannelMapper: Symbol.for("ChannelMapper"),
    EmojiMapper: Symbol.for("EmojiMapper"),
    FriendMapper: Symbol.for("FriendMapper"),
    UserMapper: Symbol.for("UserMapper"),
    FileMapper: Symbol.for("FileMapper")
};

export default TYPES;
