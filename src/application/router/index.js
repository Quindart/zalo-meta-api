import userRouter from "./user.router.js";
import authRouter from "./authen.router.js";
import swaggerRouter from "./swagger.router.js";
import mailRouter from "./mail.router.js";
import channelRouter from "./channel.route.js";
import ROUTING from "../../constants/Routes.js";


import messageRouter from "./message.router.js";
import meRouter from "./me.router.js"
import { authenticateToken } from "../middleware/authentication.middleware.js";

function routing(app) {
  // app.use(imageUpload);
  app.use(ROUTING.AUTHEN, authRouter);
  app.use(ROUTING.USER, userRouter);
  app.use(ROUTING.CHANNEL, authenticateToken, channelRouter)
  app.use(ROUTING.MAIL, mailRouter);
  app.use(swaggerRouter);

  app.use(ROUTING.MESSAGE, authenticateToken, messageRouter);
  app.use(ROUTING.ME, meRouter);
}

export default routing;
