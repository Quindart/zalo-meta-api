import { da } from "@faker-js/faker";
import SOCKET_EVENTS from "../../../constants/eventEnum.js";
import channelRepository from "../../../domain/repository/Channel.repository.js";
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
        this.socket.on(SOCKET_EVENTS.CHANNEL.JOIN, this.joinChannel.bind(this));
        this.socket.on(SOCKET_EVENTS.CHANNEL.LEAVE, this.leaveChannel.bind(this));
        this.socket.on(SOCKET_EVENTS.CHANNEL.FIND_ORCREATE, this.findOrCreateChat.bind(this));
        this.socket.on(SOCKET_EVENTS.CHANNEL.FIND_BY_ID, this.findByIdChannel.bind(this));
        this.socket.on(SOCKET_EVENTS.CHANNEL.LOAD_CHANNEL, this.loadChannel.bind(this));
    }

    joinChannel(channelId) {
        console.log(`User joined channel: ${channelId}`);
        this.socket.join(channelId);
    }

    leaveChannel(channelId) {
        console.log(`User left channel: ${channelId}`);
        this.socket.leave(channelId);
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
        channelRepository.getChannel(channelId, currentUserId)
            .then((channel) => {
                console.log("FIND_BY_ID_RESPONSE:", channel);
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
        channelRepository.getChannels(currentUserId)
            .then((channels) => {
                console.log("LOAD_CHANNEL_RESPONSE:", channels);
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

}

export default ChannelSocket;