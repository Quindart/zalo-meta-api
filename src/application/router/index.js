import userRouter from "./user.router.js";

function routing(app) {
  app.use(userRouter);
}

export default routing;
