import { auth } from "@app/middlewares";
import express, { RequestHandler } from "express";
import { FeedService } from "@app/services";

const handler: RequestHandler = async (_, res) => {
  const user = res.locals.id;

  const streams = await FeedService.getFeed({ user });

  res.send({ streams });
};

const router = express.Router();
router.get("/feeds", auth, handler);

export default router;
