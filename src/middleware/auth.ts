import passport from 'passport';
import passportLocal from 'passport-local';
import prisma from '../db';

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

      return done(null, true);
    } catch (error) {
      return done(new AuthenticationError('Invalid username or password'));
    }
  }),
);