import userRouter from "./user.router.js";
import swaggerRouter from "./swagger.router.js";
import ROUTING from "../../constants/Routes.js";
function routing(app) {
  app.use(ROUTING.USER, userRouter);
  app.use(swaggerRouter);
}

export default routing;
