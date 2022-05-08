import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import passportLocal from 'passport-local';
import prisma from '../db';

const router = Router();
const secret = 'secret';


const LocalStrategy = passportLocal.Strategy;

export class AuthenticationError extends Error {}

passport.use(
  new LocalStrategy({ session: false }, async function (
    username: string,
    password: string,
    done
  ) {
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

      return done(null, user);
    } catch (error) {
      return done(new AuthenticationError('Invalid username or password'));
    }
  }),
);

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  async (req: Request, res: Response) => {
    const { username } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      const token = jwt.sign(
        {
          iss: 'survey-api',
          sub: user.id,
        },
        secret,
        { expiresIn: '24h' },
      );
      res.json({
        token: token,
      });
    }
  },
);

export default router;
