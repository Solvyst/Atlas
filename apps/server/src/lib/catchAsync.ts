import type { Request, Response, NextFunction, RequestHandler } from "express";

export const catchAsync =
  <TReq extends Request = Request, TRes extends Response = Response>(
    handler: (req: TReq, res: TRes, next: NextFunction) => unknown,
  ): RequestHandler =>
  (req, res, next) => {
    void Promise.resolve(handler(req as TReq, res as TRes, next)).catch(next);
  };
