import userRouter from "./user.router.js";
import swaggerRouter from "./swagger.router.js";
function routing(app) {
  app.use(userRouter);
  app.use(swaggerRouter);
}

export default routing;
