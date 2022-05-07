import { Router, Request, Response } from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
import prisma from '../db';

const router = Router();
const LocalStrategy = passportLocal.Strategy;

export class AuthenticationError extends Error {}

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (!user) {
        throw new AuthenticationError();
      }
      if (password !== user.password) {
        throw new AuthenticationError();
      }

      return done(null, true);
    } catch (error) {
      return done(new AuthenticationError('Invalid username or password'));
    }
  }),
);

router.post(
  '/login',
  passport.authenticate('local'),
  (req: Request, res: Response) => {},
);
