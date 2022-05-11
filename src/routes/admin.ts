import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import passportLocal from 'passport-local';
import prisma from '../db';
import { Parser, Transform, transforms } from 'json2csv';

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
    active: survey.active,
  });
});

router.get('/survey', validateToken, async (req: Request, res: Response) => {
  const surveys = await prisma.survey.findMany({
    orderBy: {
      id: 'asc',
    }
  });
  const response = surveys.map((survey) => {
    return {
      id: survey.id,
      value: survey.value,
      active: survey.active,
    };
  });
  res.json(response);
});

router.patch(
  '/survey/:id',
  validateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { value } = req.body;

    const updatedSurvey = await prisma.survey.update({
      where: {
        id: Number(id),
      },
      data: {
        value: value,
      },
    });

    res.json({
      id: updatedSurvey.id,
      value: updatedSurvey.value,
      active: updatedSurvey.active,
    });
  },
);

router.delete(
  '/survey/:id',
  validateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const currentSurvey = await prisma.survey.findUnique({
      where: {
        id: Number(id),
      },
    });

    const response = await prisma.survey.update({
      where: {
        id: Number(id),
      },
      data: {
        active: !currentSurvey?.active ?? false,
      },
    });

    res.json({
      id: response.id,
      value: response.value,
      active: response.active,
    });
  },
);

router.post('/settings', validateToken, async (req: Request, res: Response) => {
  const { instructions, wpm } = req.body;

  const currentSettings = await prisma.settings.findFirst({});

  if (!currentSettings) {
    const settings = await prisma.settings.create({
      data: {
        instructions,
        words_per_minute: Number(wpm),
      },
    });

    res.json(settings);
  } else {
    const updatedSettings = await prisma.settings.update({
      where: {
        id: currentSettings.id,
      },
      data: {
        instructions,
        words_per_minute: Number(wpm),
      },
    });
    res.json(updatedSettings);
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

router.get('/download/questions', validateToken, async (req: Request, res: Response, next: NextFunction) => {
  const questions = await prisma.survey.findMany({
    where: {
      active: true,
    },
    orderBy: {
      id: 'asc',
    },
    select: {
      id: true,
      value: true,
    }
  });

  try {
    const parser = new Parser();
    const csv = parser.parse(questions);
    res.setHeader('Content-Type', 'text/csv');
    res.attachment('questions.csv');
    res.send(csv);
  } catch (e) {
    return next(new Error('Error downloading questions'));
  }
});

router.get('/download/responses', validateToken, async (req: Request, res: Response, next: NextFunction) => {
  const responses = await prisma.survey_response.findMany({
    orderBy: {
      participant_id: 'asc',
    },
    select: {
      id: true,
      participant_id: true,
      participant: {
        select: {
          name: true,
          email: true,
          gender: true
        }
      },
      survey_id: true,
      survey: {
        select: {
          value: true
        }
      }
    }
  });

  try {
    const { flatten } = transforms;
    const parser = new Parser({transforms: [flatten()]});
    const csv = parser.parse(responses);
    res.setHeader('Content-Type', 'text/csv');
    res.attachment('responses.csv');
    res.send(csv);
  } catch (e) {
    return next(new Error('Error downloading responses'));
  }
});

export default router;
