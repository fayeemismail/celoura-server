// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../application/constants/httpStatus";
import { extractErrorMessage } from "../../utils/errorHelpers";
import AppError from "../../utils/AppError";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("Error 💥:", err);

  // If it's our custom error
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Fallback for unexpected errors
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: extractErrorMessage(err) || "Something went wrong",
  });
};
