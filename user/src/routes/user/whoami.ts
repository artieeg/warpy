import express, { RequestHandler } from "express";
import { UserService } from "@app/services";
import { auth } from "@app/middlewares";

const handler: RequestHandler = async (_, res) => {
  const id = res.locals.id;
  const userData = await UserService.getUserById(id);

  res.send(userData);
};

const router = express.Router();
router.get("/whoami", auth, handler);

export default router;
