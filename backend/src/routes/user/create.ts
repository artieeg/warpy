import express, { RequestHandler } from "express";
import { createDevUserSchema } from "@backend/schemas";
import { validator } from "@backend/middlewares";
import { UserService } from "@backend/services";

const router = express.Router();

const handler: RequestHandler = async (req, res) => {
  const response = await UserService.createDevUser(req.body);
  res.send(response);
};

router.post("/user/dev", validator("POST", createDevUserSchema), handler);

export default router;
