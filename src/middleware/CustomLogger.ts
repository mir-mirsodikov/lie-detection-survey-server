import {
  LogStorageFactory,
  LogType,
} from '../model/logs';
import {NextFunction, Request, Response} from 'express';

class CustomLogger {
  handle(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    res.locals.timestamp = new Date().toISOString();

    res.on('finish', () => {
      const userId = req.body.userId ?? req.params.userId;
      const log = LogStorageFactory.createLogStorage(
        userId,
        res.locals.logType ?? LogType.ValidRequest,
        res.locals.timestamp,
        req.originalUrl,
        req.method,
        res.statusCode,
      );

      if (res.locals.logError) {
        log.requestBody = req.body;
        log.requestQuery = req.query;
        log.stackTrace = res.locals.logError.stack;
      }
      const logString = log.toString();

      console.log(logString);
    });

    next();
  }
}

export default CustomLogger;
