
const SOCKET_EVENTS = Object.freeze({
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    QR: {
        VERIFY: 'qr:verify',
        ACCEPTED_LOGIN: 'qr:accpeted-login',
    },
    MESSAGE: {
        SEND: "message:send",
        RECEIVED: "message:received",
        DELIVERED: "message:delivered",
        READ: "message:read",
        ERROR: "message:error",
        LOAD: "message:load",
        LOAD_RESPONSE: "message:loadResponse",
    },
    USER: {
        ONLINE: "user:online",
        OFFLINE: "user:offline",
        JOINED: "user:joined",
        LEAVED: "user:leaved",
    },
    CHANNEL: {
        CREATE: "chat:create",
        JOIN: "chat:join",
        LEAVE: "chat:leave",
        DELETE: "chat:delete",
        GROUP_UPDATED: "chat:group_updated",
        FIND_ORCREATE: "channel:findOrCreate",
        FIND_ORCREATE_RESPONSE: "channel:findOrCreateResponse",
        FIND_BY_ID: "channel:findById",
        FIND_BY_ID_RESPONSE: "channel:findByIdResponse",
        LOAD_CHANNEL: "channel:load",
        LOAD_CHANNEL_RESPONSE: "channel:loadResponse",
    },
    NOTIFICATION: {
        FRIEND_REQUEST: "notification:friend_request",
        MESSAGE_NEW: "notification:message_new",
    },
});

export default SOCKET_EVENTS;
