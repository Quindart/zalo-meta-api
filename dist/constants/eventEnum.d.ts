declare const SOCKET_EVENTS: Readonly<{
    CONNECTION: "connection";
    DISCONNECT: "disconnect";
    QR: {
        VERIFY: string;
        ACCEPTED_LOGIN: string;
    };
    MESSAGE: {
        SEND: string;
        RECEIVED: string;
        DELIVERED: string;
        READ: string;
        ERROR: string;
        LOAD: string;
        LOAD_RESPONSE: string;
        RECALL: string;
        RECALL_RESPONSE: string;
        DELETE: string;
        DELETE_RESPONSE: string;
        FORWARD: string;
        DELETE_HISTORY: string;
        DELETE_HISTORY_RESPONSE: string;
    };
    USER: {
        ONLINE: string;
        OFFLINE: string;
        JOINED: string;
        LEAVED: string;
    };
    CHANNEL: {
        FIND_ORCREATE: string;
        FIND_ORCREATE_RESPONSE: string;
        FIND_BY_ID: string;
        FIND_BY_ID_RESPONSE: string;
        LOAD_CHANNEL: string;
        LOAD_CHANNEL_RESPONSE: string;
        CREATE: string;
        CREATE_RESPONSE: string;
        JOIN_ROOM: string;
        JOIN_ROOM_RESPONSE: string;
        LEAVE_ROOM: string;
        LEAVE_ROOM_RESPONSE: string;
        DISSOLVE_GROUP: string;
        DISSOLVE_GROUP_RESPONSE: string;
        DISSOLVE_GROUP_RESPONSE_MEMBER: string;
        ADD_MEMBER: string;
        ADD_MEMBER_RESPONSE: string;
        ASSIGN_ROLE: string;
        ROLE_UPDATED: string;
        REMOVE_MEMBER: string;
        REMOVE_MEMBER_RESPONSE: string;
    };
    NOTIFICATION: {
        FRIEND_REQUEST: string;
        MESSAGE_NEW: string;
    };
    FRIEND: {
        ADD_FRIEND: string;
        ADD_FRIEND_RESPONSE: string;
        REMOVE_FRIEND: string;
        REMOVE_FRIEND_RESPONSE: string;
        ACCEPT_FRIEND: string;
        ACCEPT_FRIEND_RESPONSE: string;
        REJECT_FRIEND: string;
        REJECT_FRIEND_RESPONSE: string;
        REVOKE_FRIEND: string;
        REVOKE_FRIEND_RESPONSE: string;
        LIST_FRIEND: string;
        LIST_FRIEND_RESPONSE: string;
        LIST_SEND_INVITE: string;
        LIST_SEND_INVITE_RESPONSE: string;
        LIST_RECEIVED_INVITE: string;
        LIST_RECEIVED_INVITE_RESPONSE: string;
    };
    EMOJI: {
        LOAD_EMOJIS_OF_MESSAGE: string;
        INTERACT_EMOJI: string;
        REMOVE_MY_EMOJI: string;
        LOAD_EMOJIS_OF_MESSAGE_RESPONSE: string;
        INTERACT_EMOJI_RESPONSE: string;
        REMOVE_MY_EMOJI_RESPONSE: string;
    };
    FILE: {
        UPLOAD: string;
        UPLOAD_RESPONSE: string;
        UPLOAD_GROUP: string;
        UPLOAD_GROUP_RESPONSE: string;
    };
    LANGCHAIN: {
        SEND: string;
        RECEIVED: string;
        UPLOAD: string;
        UPLOAD_RESPONSE: string;
    };
}>;
export default SOCKET_EVENTS;
