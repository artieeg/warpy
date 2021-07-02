import { AnySchema } from "yup";
import { Request, Response, NextFunction } from "express";
type Methods = "POST" | "GET" | "PUT";

/**
 * Creates a validator middleware based on passed scheme and HTTP method
 */
export const validator = (method: Methods, schema: AnySchema) => (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const source = method === "GET" ? req.query : req.body;

  schema
    .validate(source)
    .then(() => next())
    .catch((e) => {
      next(e);
    });
};
