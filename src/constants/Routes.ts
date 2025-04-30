const ROUTING = {
  //*Basic
  INDEX: "/",
  API: "/api/v1/",
  BY_ID: "/:id",
  SWAGGER: "/api/v1/swagger",

  //TODO: Me 
  ME: '/api/v1/me',
  MY_ACCEPT_FRIENDS_REQUEST: "/accept-friends",
  MY_INVITE_FRIENDS_REQUEST: "/invite-friends",
  MY_INVITED_SENDING_REQUEST: "/my-invited-sending",
  ALL_INVITED_REQUEST: "/all-invite",
  MY_FRIENDS_REQUEST: '/friends',


  // Member of channel
  MEMBER: "/:id/members",
  OUT_CHANNEL: "/:id/out-channel",
  ASSIGN_ROLE: "/:id/assign-role",

  //User
  BY_PHONE: "/phone/:phone",

  //*Schema
  USER: "/api/v1/users",
  CHANNEL: "/api/v1/channels",
  EMOJI: "/api/v1/emojis",
  FILE: "/api/v1/files",
  MESSAGE: "/api/v1/messages",
  MESSAGE_BY_CHAT_ID: "/chat/:chatId",
  MESSAGE_BY_RECEIVERID_SENDERID: "/:receiverId/:senderId",
  THREAD: "/api/v1/threads",
  CHAT: "/api/v1/chats",
  SEARCH: "/search",
  SEARCH_FRIEND: "/search-friends",

  // Friend
  FRIEND: "/api/v1/friends",
  FRIEND_REQUEST: "/friend-request",
  FRIEND_REQUEST_ACCEPT: "/accept",
  FRIEND_REQUEST_REJECT: "/reject",
  FRIEND_REQUEST_CANCEL: "/cancel",
  FRIEND_REQUEST_BLOCK: "/block",
  FRIEND_REQUEST_UNBLOCK: "/unblock",
  FRIEND_REQUEST_UNFRIEND: "/unfriend",
  FRIEND_REQUEST_LIST: "/list",
  FRIEND_REQUEST_LIST_ACCEPTED: "/accepted",
  FRIEND_REQUEST_LIST_PENDING: "/pending",
  FRIEND_REQUEST_LIST_BLOCKED: "/blocked",
  FRIEND_REQUEST_LIST_UNFRIEND: "/unfriend",
  FRIEND_REQUEST_LIST_ALL: "/all",
  FRIEND_REQUEST_LIST_FRIEND: "/friend",
  FRIEND_REQUEST_LIST_SUGGEST: "/suggest",
  FRIEND_REQUEST_LIST_SUGGESTED: "/suggested",
  FRIEND_REQUEST_LIST_FRIENDS: "/friends",
  FRIEND_REQUEST_LIST_FRIENDS_ACCEPTED: "/friends/accepted",


  //*Auth
  AUTHEN: "/api/v1/auth",
  LOGIN: "/login",
  QR: "/QR",
  QR_LOGIN: "/QR/login",
  REGISTER: "/register",
  LOGOUT: "/logout",
  FORGOT_PASSWORD: "/forgot-password",
  CHANGE_PASSWORD: "/change-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/api/v1/auth/verify-email",
  VERIFY_FORGOT_PASSWORD: "/verify-forgot-password",
  REFRESH_TOKEN: "/refresh-token",

  //*Mail
  MAIL: "/api/v1/mail",
  MAIL_SEND: "/send",
  MAIL_VERIFY: "/verify-otp",

  //FCM
  FCM: "/fcm",
};
export default ROUTING;
