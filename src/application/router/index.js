import userRouter from "./user.router.js";
import channelRouter from "./channel.route.js"
import swaggerRouter from "./swagger.router.js";
import ROUTING from "../../constants/Routes.js";
function routing(app) {
  app.use(ROUTING.USER, userRouter);
  app.use(ROUTING.CHANNEL, channelRouter)
  app.use(swaggerRouter);
}

export default routing;
