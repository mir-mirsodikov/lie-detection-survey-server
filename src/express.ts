import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import passport from 'passport';
import ErrorHandler from './middleware/ErrorHandler';
import NotFoundMiddleware from './middleware/NotFound';
import CustomLogger from './middleware/CustomLogger';
import routes from './routes';

export default class App {
  public app: Application;

  constructor() {
    this.app = express();
  }

  public setup() {
    this.setupMiddleware();
    this.setupLogging();
    this.setupRoutes();
    this.setupErrorHandlers();
  }

  public setupMiddleware() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(passport.initialize());
  }

  public setupErrorHandlers() {
    const errorHandler = new ErrorHandler();
    this.app.use(errorHandler.handle);

    const notFound = new NotFoundMiddleware();
    this.app.use(notFound.handle);
  }

  public setupLogging() {
    const logger = new CustomLogger();
    this.app.use(logger.handle.bind(logger))
  }

  public setupRoutes() {
    this.app.use(routes);
  }
}