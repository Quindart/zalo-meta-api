
const SOCKET_EVENTS = Object.freeze({
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    MESSAGE: {
        SEND: "message:send",
        RECEIVED: "message:received",
        DELIVERED: "message:delivered",
        READ: "message:read",
        ERROR: "message:error",
    },
    USER: {
        ONLINE: "user:online",
        OFFLINE: "user:offline",
        JOINED: "user:joined",
        LEAVED: "user:leaved",
    },
    CHAT: {
        CREATE: "chat:create",
        JOIN: "chat:join",
        LEAVE: "chat:leave",
        DELETE: "chat:delete",
        GROUP_UPDATED: "chat:group_updated",
    },
    NOTIFICATION: {
        FRIEND_REQUEST: "notification:friend_request",
        MESSAGE_NEW: "notification:message_new",
    },
});

export default SOCKET_EVENTS;
