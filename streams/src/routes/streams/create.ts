import { auth, validator } from "@app/middlewares";
import { StreamService } from "@app/services";
import express, { RequestHandler } from "express";
import * as yup from "yup";

const createNewStreamSchema = yup.object().shape({
  hub: yup.string().required(),
  title: yup.string().required(),
});

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
const middlewares = [auth, validator("POST", createNewStreamSchema)];

router.post("/streams", middlewares, handler);

export default router;
