import userRouter from "./user.router.js";
import authRouter from "./authen.router.js";
import swaggerRouter from "./swagger.router.js";
import mailRouter from "./mail.router.js";
import channelRouter from "./channel.route.js";
import ROUTING from "../../constants/Routes.js";

import { imageUpload } from "../middleware/cloudinary.middleware.js"

import messageRouter from "./message.router.js";
import meRouter from "./me.router.js"

function routing(app) {
  app.use(imageUpload);
  app.use(ROUTING.AUTHEN, authRouter);
  // app.use(ROUTING.USER, authenticateToken, userRouter);
  app.use(ROUTING.USER, userRouter);
  app.use(ROUTING.CHANNEL, channelRouter)
  app.use(ROUTING.MAIL, mailRouter);
  app.use(swaggerRouter);
  app.use(ROUTING.MESSAGE, messageRouter);
  app.use(ROUTING.ME, meRouter);

}

export default routing;
