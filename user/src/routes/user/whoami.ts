import express, { RequestHandler } from "express";
import { UserService } from "@user/services";
import { auth } from "@user/middlewares";

const handler: RequestHandler = async (_, res) => {
  const id = res.locals.id;
  const user = await UserService.getUserById(id);

  res.send({ user });
};

const router = express.Router();
router.get("/whoami", auth, handler);

export default router;
