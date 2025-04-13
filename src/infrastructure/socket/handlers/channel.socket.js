import { da } from "@faker-js/faker";
import SOCKET_EVENTS from "../../../constants/eventEnum.js";
import channelRepository from "../../../domain/repository/Channel.repository.js";
import messageRepository from "../../../domain/repository/Message.repository.js";
import { UserRepository } from "../../../domain/repository/User.repository.js";

class ChannelSocket {
    userRepo
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.registerEvents();
        this.userRepo = new UserRepository()
    }

    registerEvents() {
        this.socket.on(SOCKET_EVENTS.CHANNEL.FIND_ORCREATE, this.findOrCreateChat.bind(this));
        this.socket.on(SOCKET_EVENTS.CHANNEL.FIND_BY_ID, this.findByIdChannel.bind(this));
        this.socket.on(SOCKET_EVENTS.CHANNEL.LOAD_CHANNEL, this.loadChannel.bind(this));
        this.socket.on(SOCKET_EVENTS.CHANNEL.CREATE, this.createChannel.bind(this));
        this.socket.on(SOCKET_EVENTS.CHANNEL.JOIN_ROOM, this.joinRoom.bind(this));
    }

    async findOrCreateChat(params) {
        const { senderId, receiverId } = params;

        const receiver = await this.userRepo.findOne(receiverId);
        if (!receiver) {
            console.error("Receiver not found:", receiverId);
            return;
        }
        const nameChannel = receiver.lastName + receiver.firstName;
        const typeChannel = "personal";
        const avatarChannel = receiver.avatar || null;


        channelRepository.findOrCreateChannel(receiverId, senderId, nameChannel, typeChannel, avatarChannel)
            .then((channel) => {
                this.socket.emit(SOCKET_EVENTS.CHANNEL.FIND_ORCREATE_RESPONSE, {
                    success: true,
                    data: channel,
                    message: "Channel found or created successfully",
                });
            })
            .catch((error) => {
                console.error("Error finding or creating channel:", error);
            });
    }

    findByIdChannel(params) {
        const { channelId, currentUserId } = params;
        console.log("Finding channel by ID:", channelId, "for user:", currentUserId);
        channelRepository.getChannel(channelId, currentUserId)
            .then((channel) => {
                this.socket.emit(SOCKET_EVENTS.CHANNEL.FIND_BY_ID_RESPONSE, {
                    success: true,
                    data: channel,
                    message: "Channel found successfully",
                });
            })
            .catch((error) => {
                console.error("Error finding channel:", error);
            });
    }

    loadChannel(params) {
        const { currentUserId } = params;
        console.log("Loading channels for user:", currentUserId);
        channelRepository.getChannels(currentUserId)
            .then((channels) => {
                this.socket.emit(SOCKET_EVENTS.CHANNEL.LOAD_CHANNEL_RESPONSE, {
                    success: true,
                    data: channels,
                    message: "Channels found successfully",
                });
            })
            .catch((error) => {
                console.error("Error finding channels:", error);
            });
    }

    createChannel(params) {
        const { name, currentUserId, members } = params;
        channelRepository.createChannel(name, currentUserId, members)
            .then((channel) => {
                console.log("Channel created:", channel);
                this.socket.emit(SOCKET_EVENTS.CHANNEL.CREATE_RESPONSE, {
                    success: true,
                    data: channel,
                    message: "Channel created successfully",
                });
            })
            .catch((error) => {
                console.error("Error creating channel:", error);
            });
    }

    joinRoom(params) {
        const { channelId, currentUserId } = params;
        console.log("Joining room:", channelId, "for user:", currentUserId);
        Promise.all([
            messageRepository.getMessages(channelId),
            channelRepository.getChannel(channelId, currentUserId)
        ])
            .then(([messages, channel]) => {
                this.socket.emit(SOCKET_EVENTS.CHANNEL.JOIN_ROOM_RESPONSE, {
                    success: true,
                    data: {
                        channel: channel,
                        messages: messages
                    },
                    message: "Joined room successfully"
                });

                console.log(`Emitted JOIN_ROOM_RESPONSE to socket ${this.socket.id} with channel ID: ${channelId}`);
                this.socket.join(channelId);
                console.log(`Socket ${this.socket.id} joined room: ${channelId}`);
            })
            .catch((error) => {
                console.error("Error joining room:", error);
                this.socket.emit(SOCKET_EVENTS.CHANNEL.JOIN_ROOM_RESPONSE, {
                    success: false,
                    message: "Failed to join room",
                    error: error.message
                });
            });
    }

}

export default ChannelSocket;