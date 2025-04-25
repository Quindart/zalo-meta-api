
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
        RECALL: "message:recall",
        RECALL_RESPONSE: "message:recallResponse",
        DELETE: "message:delete",
        DELETE_RESPONSE: "message:deleteResponse",
        FORWARD: "message:forward",
        DELETE_HISTORY: "message:deleteHistory",
        DELETE_HISTORY_RESPONSE: "message:deleteHistoryResponse",
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
        LEAVE_ROOM: "leaveRoom",
        LEAVE_ROOM_RESPONSE: "leaveRoomResponse",
        DISSOLVE_GROUP: "channel:dissolveGroup",
        DISSOLVE_GROUP_RESPONSE: "channel:dissolveGroupResponse",
        DISSOLVE_GROUP_RESPONSE_MEMBER: "channel:dissolveGroupResponseMember",
        ADD_MEMBER: "channel:addMember",
        ADD_MEMBER_RESPONSE: "channel:addMemberResponse",
        ASSIGN_ROLE: "channel:assignRole",
        ROLE_UPDATED: "channel:roleUpdated",
        REMOVE_MEMBER: 'channel:removeMember',
        REMOVE_MEMBER_RESPONSE: 'channel:removeMemberResponse',
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
        REVOKE_FRIEND: "friend:revoke",
        REVOKE_FRIEND_RESPONSE: "friend:revokeResponse",

        LIST_FRIEND: "friend:list",
        LIST_FRIEND_RESPONSE: "friend:listResponse",

        LIST_SEND_INVITE: "friend:listSendInvite",
        LIST_SEND_INVITE_RESPONSE: "friend:listSendInviteResponse",

        LIST_RECEIVED_INVITE: "friend:listReceviedInvite",
        LIST_RECEIVED_INVITE_RESPONSE: "friend:listReceviedInviteResponse",
    },
    EMOJI: {
        LOAD_EMOJIS_OF_MESSAGE: "emoji:loadEmojis",
        INTERACT_EMOJI: "emoji:interactEmoji",
        REMOVE_MY_EMOJI: "emoji:removeMyEmoji",
        LOAD_EMOJIS_OF_MESSAGE_RESPONSE: "emoji:loadEmojisResponse",
        INTERACT_EMOJI_RESPONSE: "emoji:interactEmojiResponse",
        REMOVE_MY_EMOJI_RESPONSE: "emoji:removeMyEmojiResponse"
    },
    FILE: {
        UPLOAD: "file:upload",
        UPLOAD_RESPONSE: "file:uploadResponse",
        UPLOAD_GROUP: "file:uploadGroup",        
        UPLOAD_GROUP_RESPONSE: "file:uploadGroupResponse"
    },
    LANGCHAIN: {
        SEND: 'langchain:sendMessage',
        RECEIVED: 'langchain:receivedMessage',
        UPLOAD: "langchain:fileUpload",
        UPLOAD_RESPONSE: "langchain:fileUploadResponse",
    }
});

export default SOCKET_EVENTS;
