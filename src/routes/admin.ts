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
    done,
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

function validateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (!token) {
    throw new AuthenticationError('No token provided');
  }
  jwt.verify(token, secret, (err, auth) => {
    if (err) {
      throw new AuthenticationError('Invalid token');
    }
  });
  next();
}

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

router.post('/survey', validateToken, async (req: Request, res: Response) => {
  const { value } = req.body;
  const survey = await prisma.survey.create({
    data: {
      value,
    },
  });
  res.json({
    id: survey.id,
    value: survey.value,
    active: survey.active
  });
});

router.get('/survey', validateToken, async (req: Request, res: Response) => {
  const surveys = await prisma.survey.findMany({});
  const response = surveys.map((survey) => {
    return {
      id: survey.id,
      value: survey.value,
      active: survey.active
    };
  });
  res.json(response);
});

router.patch(
  '/survey/:id',
  validateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { value, active } = req.body;

    const currentSurvey = await prisma.survey.findUnique({
      where: {
        id: Number(id),
      },
    });

    const updatedSurvey = await prisma.survey.update({
      where: {
        id: Number(id),
      },
      data: {
        value: value ?? currentSurvey!.value,
        active: active ?? currentSurvey!.active,
      },
    });

    res.json(updatedSurvey);
  },
);

router.post('/settings', validateToken, async (req: Request, res: Response) => {
  const { instructions, wpm } = req.body;

  const count = await prisma.settings.count();

  if (count === 0) {
    const settings = await prisma.settings.create({
      data: {
        instructions,
        words_per_minute: Number(wpm),
      },
    });

    res.json(settings);
  } else {
    res.json();
  }
});

router.get('/authorize', (req: Request, res: Response) => {
  const token = req.headers.authorization;
  let response = true;
  if (!token) {
    response = false;
  }
  jwt.verify(token as string, secret, (err, auth) => {
    if (err) {
      response = false;
    }
  });
  res.send(response);
});

export default router;
