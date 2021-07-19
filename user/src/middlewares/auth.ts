import { RequestHandler } from "express";
import { jwt } from "@user/utils";

export const auth: RequestHandler = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return next(new Error());
  }

  try {
    const userId = await jwt.verifyAccessToken(token);
    res.locals.id = userId;
  } catch {
    return next(new Error());
  }

  next();
};
