
export interface IMessageRepository {
    createMessage(params: { channelId: string; userId: string; content: string }): Promise<any>;

    recallMessage(senderId: string, messageId: string): Promise<void>;

    deleteMessage(senderId: string, messageId: string): Promise<void>;

    getMessages(channelId: string, currentUserId: string, offset?: number): Promise<any[]>;

    getMessagesByMessageId(messageId: string): Promise<any | null>;

    deleteHistoryMessage(senderId: string, channelId: string): Promise<void>;
}

