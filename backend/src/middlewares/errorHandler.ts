import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError.js';

export function notFoundHandler(request: Request, _response: Response, next: NextFunction) {
  next(new AppError(`Rota ${request.method} ${request.originalUrl} não encontrada.`, 404));
}

export function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message =
    statusCode === 500 ? 'Ocorreu um erro interno no servidor.' : error.message;

  if (statusCode === 500) {
    console.error(error);
  }

  return response.status(statusCode).json({
    success: false,
    message,
  });
}
