import userRouter from "./user.router.ts";
import authRouter from "./authen.router.ts";
import swaggerRouter from "./swagger.router.ts";
import mailRouter from "./mail.router.ts";
import channelRouter from "./channel.router.ts";
import friendRouter from "./friend.router.ts";
import ROUTING from "../../constants/Routes.ts";


import messageRouter from "./message.router.ts";
import meRouter from "./me.router.ts"
import { authenticateToken } from "../middleware/authentication.middleware.ts";

function routing(app) {
  // app.use(imageUpload);
  app.use(ROUTING.AUTHEN, authRouter);
  app.use(ROUTING.USER, userRouter);
  app.use(ROUTING.CHANNEL, authenticateToken, channelRouter)
  app.use(ROUTING.MAIL, mailRouter);
  app.use(swaggerRouter);

  app.use(ROUTING.MESSAGE, authenticateToken, messageRouter);
  app.use(ROUTING.ME, meRouter);
  app.use(ROUTING.FRIEND, authenticateToken, friendRouter);
}

export default routing;
