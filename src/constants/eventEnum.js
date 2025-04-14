
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
        FIND_ORCREATE: "channel:findOrCreate",
        FIND_ORCREATE_RESPONSE: "channel:findOrCreateResponse",
        FIND_BY_ID: "channel:findById",
        FIND_BY_ID_RESPONSE: "channel:findByIdResponse",
        LOAD_CHANNEL: "channel:load",
        LOAD_CHANNEL_RESPONSE: "channel:loadResponse",
        CREATE: "channel:create",
        CREATE_RESPONSE: "channel:createResponse",
        JOIN_ROOM: "joinRoom",
        JOIN_ROOM_RESPONSE: "joinRoomResponse",
    },
    NOTIFICATION: {
        FRIEND_REQUEST: "notification:friend_request",
        MESSAGE_NEW: "notification:message_new",
    },
    FRIEND: {
        ADD_FRIEND: "friend:add",
        ADD_FRIEND_RESPONSE: "friend:addResponse",
        REMOVE_FRIEND: "friend:remove",
        REMOVE_FRIEND_RESPONSE: "friend:removeResponse",
        ACCEPT_FRIEND: "friend:accept",
        ACCEPT_FRIEND_RESPONSE: "friend:acceptResponse",
        REJECT_FRIEND: "friend:reject",
        REJECT_FRIEND_RESPONSE: "friend:rejectResponse",
        LIST_FRIEND: "friend:list",
        LIST_FRIEND_RESPONSE: "friend:listResponse",
    },
});

export default SOCKET_EVENTS;
