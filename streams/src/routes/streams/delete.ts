import express, { RequestHandler } from "express";
import { auth } from "@app/middlewares";
import { StreamService } from "@app/services";

const handler: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const owner = res.locals.id;

  await StreamService.stopStream(id, owner);

  res.send();
};

const router = express.Router();
router.delete("/streams/:id", auth, handler);

export default router;
