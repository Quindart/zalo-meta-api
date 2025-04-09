const ROUTING = {
  //*Basic
  INDEX: "/",
  API: "/api/v1/",
  BY_ID: "/:id",
  SWAGGER: "/api/v1/swagger",
  ME: '/api/v1/me',
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
  chat: "/api/v1/chats",
  SEARCH: "/search",

  //*Auth
  AUTHEN: "/api/v1/auth",
  LOGIN: "/login",
  QR: "/QR",
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
};
export default ROUTING;
