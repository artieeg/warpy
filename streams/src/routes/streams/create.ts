import { auth } from "backend-lib";

import { StreamService } from "@app/services";
import express, { RequestHandler } from "express";

const handler: RequestHandler = async (req, res) => {
  const owner = res.locals.id;
  const { title, hub } = req.body;

  const streamId = await StreamService.createNewStream({
    owner,
    title,
    hub,
  });

  res.send({
    stream_id: streamId,
  });
};

const router = express.Router();
router.post("/streams", auth, handler);

export default router;
