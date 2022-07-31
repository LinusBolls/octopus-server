import type { Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";

import * as env from "./env";

interface Props {
  req: Request;
  res: Response;
}
const validateJwt: RequestHandler = async (req, res) => {
  try {
    const token = req.cookies[env.AUTH_COOKIE_NAME];

    const user = jwt.verify(token, env.JWT_SECRET);

    return { req, res, user };
  } catch (err) {
    return { req, res, user: null };
  }
};
const expressAuthMiddleware: RequestHandler = (req, res, next) => {
  const { user } = validateJwt(req, res);

  req.user = user;

  next();
};
const apolloAuthMiddleware = ({ req, res }: Props) => {
  if (env.ALLOWED_ORIGINS.includes(req.headers?.origin))
    res.header("Access-Control-Allow-Origin", req.headers?.origin);

  const ctx = validateJwt(req, res);

  return ctx;
};
export default validateJwt;
