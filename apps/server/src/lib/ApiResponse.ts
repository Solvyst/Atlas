import type { Response } from "express";

export const ApiResponse = <T = unknown>(
  res: Response,
  data?: T,
  message = "Success",
  StatusCode = 200,
) => {
  return res.status(StatusCode).json({
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
  });
};
