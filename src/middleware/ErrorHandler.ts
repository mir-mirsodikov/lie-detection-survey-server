import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import { AuthenticationError } from '../routes/admin';

/**
 * Error handling class
 * Any and all error thrown during runtime will be picked up here
 * Configure error code and message depending on the error type
 */
class ErrorHandler {
  handle(
    error: Error,
    request: Request,
    response: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction,
  ): void {
    let errorResponse;
    let statusCode;
    if (error instanceof HttpError) {
      errorResponse = {
        message: error.message,
        errors: error.errors,
        details: error.details,
      };
      statusCode = error.statusCode;
    } else if (error instanceof AuthenticationError) {
      errorResponse = {
        message: error.message,
      };
      statusCode = 401;
    } else {
      errorResponse = {
        message: 'Something went wrong',
      };
      statusCode = 500;
    }

    response.status(statusCode).json(errorResponse);
  }
}

export default ErrorHandler;
