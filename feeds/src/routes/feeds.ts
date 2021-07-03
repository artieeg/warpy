import { auth } from "@app/middlewares";
import express, { RequestHandler } from "express";

const handler: RequestHandler = async (req, res) => {
  res.send();
};

const router = express.Router();
router.get("/feeds", auth, handler);

export default router;
