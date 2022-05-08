import { Request, Response } from 'express';

/**
 * Error handling for routes that were not found.
 * Should be the last middleware.
 */
class NotFoundMiddleware {
  handle(
    request: Request,
    response: Response,
  ): void {
    response.status(404).json({
      message: 'Not Found',
    });
  }
}

export default NotFoundMiddleware;
