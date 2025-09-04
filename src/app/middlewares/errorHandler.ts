import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../interfaces/error.interface";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const response: ErrorResponse = {
    message: err.message || "An error occurred",
    success: false,
    error: err,
  };

  if (err.name === "ValidationError") {
    response.message = "Validation failed";
  }

  res.status(400).json(response);
}
