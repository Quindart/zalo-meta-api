const ROUTING = {
  //*Basic
  INDEX: "/",
  API: "/api/v1/",
  BY_ID: "/:id",
  SWAGGER: "/api/v1/swagger",

  // Member of channel
  MEMBER: "/members",
  OUT_GROUP: "/out-group",
  ASSIGN_ROLE: "/assign-role",


  //*Schema
  USER: "/api/v1/users",
  CHANNEL: "/api/v1/channels",
  EMOJI: "/api/v1/emojis",
  FILE: "/api/v1/files",
  MESSAGE: "/api/v1/messages",
  THREAD: "/api/v1/threads",
  chat: "/api/v1/chats",

  //*Auth
  LOGIN: "/api/v1/auth/login",
  REGISTER: "/api/v1/auth/register",
  LOGOUT: "/api/v1/auth/logout",
  FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
  RESET_PASSWORD: "/api/v1/auth/reset-password",
  VERIFY_EMAIL: "/api/v1/auth/verify-email",
  REFRESH_TOKEN: "/api/v1/auth/refresh-token",
};
export default ROUTING;
