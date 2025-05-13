import userRouter from "./user.router";
import authRouter from "./authen.router";
import swaggerRouter from "./swagger.router";
import mailRouter from "./mail.router";
import channelRouter from "./channel.router";
import friendRouter from "./friend.router";
import ROUTING from "../../constants/Routes";


import messageRouter from "./message.router";
import meRouter from "./me.router"
import { authenticateToken } from "../middleware/authentication.middleware";

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
